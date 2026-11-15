import pg from "pg";
import { type output, type ZodType } from "zod";
import type {
  LlmProvider,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from "../../src/modules/ai/llm-provider.js";
import { QueryAgentService } from "../../src/modules/ai/query-agent.service.js";
import { QueryAnswerService } from "../../src/modules/ai/query-answer.service.js";
import {
  SYNTHETIC_TENANTS,
  type SyntheticTenantCode,
} from "../../src/modules/ai/query-examples.js";
import { PgReadOnlyQueryExecutor } from "../../src/modules/ai/query-executor.js";
import { QueryGenerationService } from "../../src/modules/ai/query-generation.service.js";
import {
  ReportAgentService,
  type ReportPlan,
} from "../../src/modules/ai/report-agent.service.js";

const { Client, Pool } = pg;

class MappedStaticProvider implements LlmProvider {
  constructor(
    private readonly responsesByMatcher: ReadonlyArray<{
      readonly matches: (userPrompt: string) => boolean;
      readonly data: unknown;
    }>,
  ) {}

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    const matched = this.responsesByMatcher.find((entry) =>
      entry.matches(request.userPrompt),
    );
    if (!matched) {
      throw new Error(
        `Resposta estática não configurada para o prompt: ${request.userPrompt}`,
      );
    }

    return {
      data: request.schema.parse(matched.data),
      provider: "e2e-static",
      model: "e2e-static",
      latencyMs: 1,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    };
  }
}

let owner: pg.Client;
let aiPool: pg.Pool;
const tenantIds = new Map<SyntheticTenantCode, string>();

function createReportAgent(
  plan: ReportPlan,
  sqlByQuestion: Readonly<Record<string, string>>,
): ReportAgentService {
  const plannerProvider = new MappedStaticProvider([
    {
      matches: () => true,
      data: plan,
    },
  ]);

  const queryProvider = new MappedStaticProvider(
    Object.entries(sqlByQuestion).map(([question, sql]) => ({
      matches: (prompt) => prompt.includes(question),
      data: {
        type: "query",
        sql,
        explanation: "Consulta E2E na base sintética.",
        assumptions: [],
      },
    })),
  );

  const answerProvider = new MappedStaticProvider([
    {
      matches: () => true,
      data: {
        answer: "Análise consolidada a partir dos registros consultados.",
      },
    },
  ]);

  const queryAgent = new QueryAgentService(
    new QueryGenerationService(queryProvider),
    new PgReadOnlyQueryExecutor(aiPool),
    new QueryAnswerService(answerProvider),
  );

  return new ReportAgentService(plannerProvider, queryAgent);
}

const describeWithAiDatabase =
  process.env["DATABASE_URL"] && process.env["AI_READONLY_DATABASE_URL"]
    ? describe
    : describe.skip;

describeWithAiDatabase(
  "agente de relatórios integrado aos dados sintéticos",
  () => {
    beforeAll(async () => {
      const ownerUrl = process.env["DATABASE_URL"];
      const aiUrl = process.env["AI_READONLY_DATABASE_URL"];
      if (!ownerUrl) throw new Error("DATABASE_URL não definida.");
      if (!aiUrl) throw new Error("AI_READONLY_DATABASE_URL não definida.");

      owner = new Client({ connectionString: ownerUrl });
      aiPool = new Pool({ connectionString: aiUrl, max: 4 });
      await owner.connect();

      const companies = await owner.query<{
        id: string;
        codigo: SyntheticTenantCode;
      }>(
        `SELECT "id", "codigo"
         FROM public."Empresa"
         WHERE "codigo" = ANY($1::text[])
         ORDER BY "codigo"`,
        [SYNTHETIC_TENANTS.map((tenant) => tenant.code)],
      );
      for (const company of companies.rows) {
        tenantIds.set(company.codigo, company.id);
      }

      if (tenantIds.size !== SYNTHETIC_TENANTS.length) {
        throw new Error(
          "Base sintética não encontrada. Execute npm run db:reset-synthetic -- --force antes deste E2E.",
        );
      }
    });

    afterAll(async () => {
      if (owner) await owner.end();
      if (aiPool) await aiPool.end();
    });

    it.each(SYNTHETIC_TENANTS)(
      "gera relatório mensal de manutenção (monthly_maintenance) para $code",
      async (tenant) => {
        const empresaId = tenantIds.get(tenant.code);
        if (!empresaId) throw new Error(`Empresa ausente: ${tenant.code}`);

        const qStatus = "Quantidade de ordens de serviço por status";
        const qEmpty = "Ordens de serviço com código inexistente";

        const agent = createReportAgent(
          {
            reportType: "monthly_maintenance",
            title: "Relatório Mensal de Manutenção",
            sections: [
              {
                id: "ordens-por-status",
                title: "Ordens por Status",
                question: qStatus,
                visualization: {
                  type: "bar",
                  categoryKey: "status",
                  valueKey: "total",
                },
              },
              {
                id: "secao-vazia",
                title: "Ocorrências Especiais",
                question: qEmpty,
                visualization: {
                  type: "none",
                  categoryKey: null,
                  valueKey: null,
                },
              },
            ],
          },
          {
            [qStatus]: `SELECT "status", COUNT(*)::int AS "total"
              FROM ai."OrdemServico"
              GROUP BY "status"
              ORDER BY "total" DESC
              LIMIT 20`,
            [qEmpty]: `SELECT "numero"
              FROM ai."OrdemServico"
              WHERE "numero" = '__nao_existe__'
              LIMIT 10`,
          },
        );

        const report = await agent.generate({
          request: "Gere o relatório mensal de manutenção.",
          empresaId,
        });

        expect(report.status).toBe("generated");
        expect(report.reportType).toBe("monthly_maintenance");
        expect(report.summary).toMatchObject({
          totalSections: 2,
          readySections: 1,
          emptySections: 1,
          refusedSections: 0,
        });
        expect(report.sections[0]?.status).toBe("ready");
        expect(report.sections[0]?.table?.rows.length).toBeGreaterThan(0);
        expect(
          report.sections[0]?.chart?.series[0]?.data.length,
        ).toBeGreaterThan(0);
        expect(report.sections[0]?.ungroundedNumbers).toEqual([]);
        expect(report.sections[1]).toMatchObject({
          id: "secao-vazia",
          status: "empty",
          table: null,
          chart: null,
        });
      },
    );

    it("gera relatório de custo por ativo (asset_costs) na base sintética", async () => {
      const empresaId = tenantIds.get("alpha-brazilian");
      if (!empresaId) throw new Error("Empresa alpha-brazilian ausente.");

      const qCost = "Custo total de manutenção agrupado por ativo";

      const agent = createReportAgent(
        {
          reportType: "asset_costs",
          title: "Relatório de Custos por Ativo",
          sections: [
            {
              id: "custos-ativo",
              title: "Top Ativos por Custo",
              question: qCost,
              visualization: {
                type: "bar",
                categoryKey: "codigo",
                valueKey: "custoTotal",
              },
            },
          ],
        },
        {
          [qCost]: `SELECT a."codigo", COALESCE(SUM(os."custoTotal"), 0)::numeric(12,2) AS "custoTotal"
            FROM ai."Ativo" a
            LEFT JOIN ai."OrdemServico" os ON os."ativoId" = a."id"
            GROUP BY a."codigo"
            ORDER BY "custoTotal" DESC
            LIMIT 10`,
        },
      );

      const report = await agent.generate({
        request: "Gere o relatório de custo por ativo.",
        empresaId,
      });

      expect(report.reportType).toBe("asset_costs");
      expect(report.sections[0]?.status).toBe("ready");
      expect(report.sections[0]?.table?.columns).toEqual([
        "codigo",
        "custoTotal",
      ]);
      expect(report.sections[0]?.table?.rows.length).toBeGreaterThan(0);
      expect(report.sections[0]?.chart?.type).toBe("bar");
      expect(report.sections[0]?.ungroundedNumbers).toEqual([]);
    });

    it("gera relatório de disponibilidade da frota (availability) na base sintética", async () => {
      const empresaId = tenantIds.get("alpha-international");
      if (!empresaId) throw new Error("Empresa alpha-international ausente.");

      const qFleet = "Distribuição de ativos por status operacional";
      const qStops = "Paradas de ativos por motivo";

      const agent = createReportAgent(
        {
          reportType: "availability",
          title: "Relatório de Disponibilidade da Frota",
          sections: [
            {
              id: "status-frota",
              title: "Status Operacional da Frota",
              question: qFleet,
              visualization: {
                type: "bar",
                categoryKey: "status",
                valueKey: "total",
              },
            },
            {
              id: "paradas-frota",
              title: "Paradas Registradas",
              question: qStops,
              visualization: {
                type: "none",
                categoryKey: null,
                valueKey: null,
              },
            },
          ],
        },
        {
          [qFleet]: `SELECT "status", COUNT(*)::int AS "total"
            FROM ai."Ativo"
            GROUP BY "status"
            ORDER BY "total" DESC
            LIMIT 10`,
          [qStops]: `SELECT "programada", COUNT(*)::int AS "total"
            FROM ai."ParadaAtivo"
            GROUP BY "programada"
            LIMIT 10`,
        },
      );

      const report = await agent.generate({
        request: "Gere o relatório de disponibilidade da frota.",
        empresaId,
      });

      expect(report.reportType).toBe("availability");
      expect(report.summary.totalSections).toBe(2);
      expect(report.sections[0]?.status).toBe("ready");
      expect(report.sections[0]?.table?.rows.length).toBeGreaterThan(0);
      expect(report.sections[0]?.chart?.series[0]?.data.length).toBeGreaterThan(
        0,
      );
      expect(report.sections[1]?.status).toBe("ready");
      expect(report.sections[1]?.ungroundedNumbers).toEqual([]);
    });
  },
);

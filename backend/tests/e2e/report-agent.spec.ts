import pg from "pg";
import { z, type output, type ZodType } from "zod";
import { QueryAgentService } from "../../src/modules/ai/query-agent.service.js";
import { QueryAnswerService } from "../../src/modules/ai/query-answer.service.js";
import { PgReadOnlyQueryExecutor } from "../../src/modules/ai/query-executor.js";
import { QueryGenerationService } from "../../src/modules/ai/query-generation.service.js";
import { ReportAgentService } from "../../src/modules/ai/report-agent.service.js";
import type {
  LlmProvider,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from "../../src/modules/ai/llm-provider.js";
import {
  SYNTHETIC_TENANTS,
  type SyntheticTenantCode,
} from "../../src/modules/ai/query-examples.js";

const { Client, Pool } = pg;

class StaticProvider implements LlmProvider {
  private responseIndex = 0;

  constructor(private readonly responses: readonly unknown[]) {}

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    const data = this.responses[this.responseIndex];

    if (data === undefined) {
      throw new Error("Resposta estática não configurada para esta chamada.");
    }

    this.responseIndex += 1;

    return {
      data: request.schema.parse(data),
      provider: "e2e-static",
      model: "e2e-static",
      latencyMs: 0,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    };
  }
}

class GroundedAnswerProvider implements LlmProvider {
  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    const prompt = (
      request as unknown as { userPrompt: string }
    ).userPrompt;

    const input = JSON.parse(prompt) as {
      sources: Array<{ rows: Record<string, unknown>[] }>;
    };

    const rows = input.sources.flatMap((source) => source.rows);
    const answer = `A consulta retornou ${rows.length} registro(s). Dados encontrados: ${JSON.stringify(rows)}.`;

    return {
      data: request.schema.parse({ answer }),
      provider: "e2e-grounded",
      model: "e2e-grounded",
      latencyMs: 0,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    };
  }
}

type ReportCase = {
  reportType: "monthly_maintenance" | "asset_costs" | "availability";
  title: string;
  question: string;
  categoryKey: string;
  valueKey: string;
  sql: (empresaId: string, schema: "ai" | "public") => string;
};

const reportCases: ReportCase[] = [
  {
    reportType: "monthly_maintenance",
    title: "Relatório mensal de manutenção",
    question: "Apresente o total de ordens de serviço e seus custos por mês.",
    categoryKey: "mes",
    valueKey: "total_os",
    sql: (empresaId, schema) => `
      SELECT
        TO_CHAR(DATE_TRUNC('month', "abertaEm"), 'YYYY-MM') AS "mes",
        COUNT(*)::int AS "total_os",
        COALESCE(SUM("custoTotal"), 0)::float8 AS "custo_total"
      FROM ${schema}."OrdemServico"
      WHERE "empresaId" = '${empresaId}'
        AND "abertaEm" >= TIMESTAMP '2026-04-27 00:00:00'
      GROUP BY 1
      ORDER BY 1
      LIMIT 100
    `,
  },
  {
    reportType: "asset_costs",
    title: "Relatório de custos por ativo",
    question: "Apresente o custo total de ordens de serviço por ativo.",
    categoryKey: "ativo",
    valueKey: "custo_total",
    sql: (empresaId, schema) => `
      SELECT
        a."codigo" AS "ativo",
        COUNT(o."id")::int AS "total_os",
        COALESCE(SUM(o."custoTotal"), 0)::float8 AS "custo_total"
      FROM ${schema}."OrdemServico" o
      INNER JOIN ${schema}."Ativo" a
        ON a."id" = o."ativoId"
       AND a."empresaId" = o."empresaId"
      WHERE o."empresaId" = '${empresaId}'
      GROUP BY a."codigo"
      ORDER BY "custo_total" DESC
      LIMIT 100
    `,
  },
  {
    reportType: "availability",
    title: "Relatório de disponibilidade dos ativos",
    question: "Apresente o tempo de parada que impactou a disponibilidade por ativo.",
    categoryKey: "ativo",
    valueKey: "tempo_parado_minutos",
    sql: (empresaId, schema) => `
      SELECT
        a."codigo" AS "ativo",
        COALESCE(SUM(p."duracaoMinutos"), 0)::int AS "tempo_parado_minutos"
      FROM ${schema}."ParadaAtivo" p
      INNER JOIN ${schema}."Ativo" a
        ON a."id" = p."ativoId"
       AND a."empresaId" = p."empresaId"
      WHERE p."empresaId" = '${empresaId}'
        AND p."impactaDisponibilidade" = true
      GROUP BY a."codigo"
      ORDER BY "tempo_parado_minutos" DESC
      LIMIT 100
    `,
  },
];

let owner: pg.Client;
let aiPool: pg.Pool;

const tenantIds = new Map<SyntheticTenantCode, string>();

const describeWithAiDatabase =
  process.env["DATABASE_URL"] && process.env["AI_READONLY_DATABASE_URL"]
    ? describe
    : describe.skip;

function createReportAgent(reportCase: ReportCase, empresaId: string) {
  const plannerProvider = new StaticProvider([
    {
      reportType: reportCase.reportType,
      title: reportCase.title,
      sections: [
        {
          id: "dados_principais",
          title: reportCase.title,
          question: reportCase.question,
          visualization: {
            type: "bar",
            categoryKey: reportCase.categoryKey,
            valueKey: reportCase.valueKey,
            },
        },
      ],
    },
  ]);

  const queryProvider = new StaticProvider([
    {
      type: "query",
      sql: reportCase.sql(empresaId, "ai"),
      explanation: "Consulta estática para validar os dados do relatório.",
      assumptions: [],
    },
  ]);

  const queryAgent = new QueryAgentService(
    new QueryGenerationService(queryProvider),
    new PgReadOnlyQueryExecutor(aiPool),
    new QueryAnswerService(new GroundedAnswerProvider()),
  );

  return new ReportAgentService(plannerProvider, queryAgent);
}

describeWithAiDatabase("relatórios fundamentados com banco sintético", () => {
  beforeAll(async () => {
    const ownerUrl = process.env["DATABASE_URL"];
    const aiUrl = process.env["AI_READONLY_DATABASE_URL"];

    if (!ownerUrl) throw new Error("DATABASE_URL não definida.");
    if (!aiUrl) throw new Error("AI_READONLY_DATABASE_URL não definida.");

    owner = new Client({ connectionString: ownerUrl });
    aiPool = new Pool({ connectionString: aiUrl, max: 2 });

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
        "Base sintética não encontrada. Verifique os tenants antes de executar este E2E.",
      );
    }
  });

  afterAll(async () => {
    if (owner) await owner.end();
    if (aiPool) await aiPool.end();
  });

  it.each(reportCases)(
    "gera o relatório $reportType com dados reais do banco sintético",
    async (reportCase) => {
      const empresaId = tenantIds.get("alpha-brazilian");

      if (!empresaId) {
        throw new Error("Empresa alpha-brazilian ausente.");
      }

      const expected = await owner.query(
        reportCase.sql(empresaId, "public"),
      );

       const report = await createReportAgent(
        reportCase,
        empresaId,
        ).generate({
        request: reportCase.question,
        empresaId,
        });
      expect(report.title).toBe(reportCase.title);
      expect(report.sections).toHaveLength(1);

      const section = report.sections[0];

      expect(section).toBeDefined();
      if (!section) return;

      expect(section.status).toBe("ready");
      expect(section.table).not.toBeNull();
      expect(section.chart).not.toBeNull();

      if (!section.table || !section.chart) return;

      expect(expected.rows.length).toBeGreaterThan(0);
      expect(section.table.rows).toEqual(expected.rows);

      expect(section.table.columns).toEqual(
        Object.keys(expected.rows[0] ?? {}),
      );

      const chartContent = JSON.stringify(section.chart);

      for (const row of expected.rows) {
        expect(chartContent).toContain(String(row[reportCase.categoryKey]));
        expect(chartContent).toContain(String(row[reportCase.valueKey]));
      }

      expect(section.narrative).toContain(
        `A consulta retornou ${expected.rows.length} registro(s).`,
      );

      expect(section.narrative).toContain(
        JSON.stringify(expected.rows),
      );
    },
  );
});
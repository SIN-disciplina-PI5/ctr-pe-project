import pg from "pg";
import { z, type output, type ZodType } from "zod";
import { QueryAgentService } from "../../src/modules/ai/query-agent.service.js";
import { QueryAnswerService } from "../../src/modules/ai/query-answer.service.js";
import { PgReadOnlyQueryExecutor } from "../../src/modules/ai/query-executor.js";
import { QueryGenerationService } from "../../src/modules/ai/query-generation.service.js";
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

let owner: pg.Client;
let aiPool: pg.Pool;
const tenantIds = new Map<SyntheticTenantCode, string>();

function createAgentFromResponses(
  responses: readonly unknown[],
): QueryAgentService {
  const provider = new StaticProvider(responses);
  return new QueryAgentService(
    new QueryGenerationService(provider),
    new PgReadOnlyQueryExecutor(aiPool),
    new QueryAnswerService(
      new StaticProvider([{ answer: "Resposta fundamentada nas linhas." }]),
    ),
  );
}

function createAgent(sql: string): QueryAgentService {
  return createAgentFromResponses([
    {
      type: "query",
      sql,
      explanation: "SQL estático validado para o teste E2E.",
      assumptions: [],
    },
  ]);
}

const describeWithAiDatabase =
  process.env["DATABASE_URL"] && process.env["AI_READONLY_DATABASE_URL"]
    ? describe
    : describe.skip;

describeWithAiDatabase(
  "agente de consulta integrado à role somente leitura",
  () => {
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
      for (const company of companies.rows)
        tenantIds.set(company.codigo, company.id);

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
      "isola os ativos da empresa $code mesmo diante de OR true",
      async (tenant) => {
        const empresaId = tenantIds.get(tenant.code);
        if (!empresaId) throw new Error(`Empresa ausente: ${tenant.code}`);

        const result = await createAgent(
          `SELECT "empresaId", "codigo"
         FROM ai."Ativo"
         WHERE "empresaId" = 'empresa-inexistente' OR true
         ORDER BY "codigo"
         LIMIT 100`,
        ).query({
          question: "Quais ativos pertencem à empresa?",
          empresaId,
        });

        expect(result.status).toBe("answered");
        if (result.status !== "answered" || result.mode !== "single") return;
        expect(result.rowsUsed.length).toBeGreaterThan(0);
        expect(
          result.rowsUsed.every((row) => row["empresaId"] === empresaId),
        ).toBe(true);
      },
    );

    it("responde de forma segura quando a consulta não encontra linhas", async () => {
      const empresaId = tenantIds.get("alpha-brazilian");
      if (!empresaId) throw new Error("Empresa alpha-brazilian ausente.");

      const result = await createAgent(
        `SELECT "codigo"
       FROM ai."Ativo"
       WHERE "codigo" = '__nao_existe__'
       LIMIT 100`,
      ).query({
        question: "Quais ativos possuem o código informado?",
        empresaId,
      });

      expect(result).toMatchObject({
        status: "answered",
        mode: "single",
        answer: "Nenhum dado foi encontrado para a pergunta nesta empresa.",
        rowsUsed: [],
      });
    });

    it("não mantém a empresa na sessão depois do rollback", async () => {
      const empresaId = tenantIds.get("alpha-international");
      if (!empresaId) throw new Error("Empresa alpha-international ausente.");

      await createAgent(`SELECT "codigo" FROM ai."Empresa" LIMIT 10`).query({
        question: "Qual é a empresa selecionada?",
        empresaId,
      });

      const client = await aiPool.connect();
      try {
        const setting = await client.query<{ empresa_id: string | null }>(
          `SELECT NULLIF(current_setting('ctrpe.current_empresa_id', true), '') AS empresa_id`,
        );
        expect(setting.rows[0]?.empresa_id).toBeNull();
      } finally {
        client.release();
      }
    });

    it("corrige uma coluna inexistente uma única vez e executa o novo SQL", async () => {
      const empresaId = tenantIds.get("alpha-brazilian");
      if (!empresaId) throw new Error("Empresa alpha-brazilian ausente.");
      const correctedSql = `SELECT "codigo"
       FROM ai."Ativo"
       ORDER BY "codigo"
       LIMIT 3`;
      const agent = createAgentFromResponses([
        {
          type: "query",
          sql: `SELECT "coluna_inexistente" FROM ai."Ativo" LIMIT 3`,
          explanation: "Consulta inicial com coluna inválida.",
          assumptions: [],
        },
        {
          sql: correctedSql,
          explanation: "Consulta corrigida com coluna existente.",
        },
      ]);

      const result = await agent.query({
        question: "Quais são os códigos dos primeiros ativos?",
        empresaId,
      });

      expect(result).toMatchObject({
        status: "answered",
        mode: "single",
        sql: correctedSql,
        correctionApplied: true,
        correctionMetrics: { provider: "e2e-static" },
      });
      if (result.status !== "answered" || result.mode !== "single") return;
      expect(result.rowsUsed).toHaveLength(3);
    });

    it("executa e consolida um plano com duas consultas reais", async () => {
      const empresaId = tenantIds.get("alpha-international");
      if (!empresaId) throw new Error("Empresa alpha-international ausente.");
      const agent = createAgentFromResponses([
        {
          type: "query_plan",
          explanation: "Consulta ativos e materiais separadamente.",
          assumptions: [],
          steps: [
            {
              id: "total_ativos",
              purpose: "Contar ativos cadastrados como ativos.",
              sql: `SELECT COUNT(*)::int AS "total"
               FROM ai."Ativo"
               WHERE "ativo" = true
               LIMIT 1`,
            },
            {
              id: "materiais_baixos",
              purpose: "Contar materiais abaixo do estoque mínimo.",
              sql: `SELECT COUNT(*)::int AS "total"
               FROM ai."Material"
               WHERE "estoqueAtual" < "estoqueMinimo"
               LIMIT 1`,
            },
          ],
        },
      ]);

      const result = await agent.query({
        question:
          "Quantos ativos estão cadastrados como ativos e quantos materiais estão abaixo do estoque mínimo?",
        empresaId,
      });

      expect(result).toMatchObject({
        status: "answered",
        mode: "plan",
        answer: "Resposta fundamentada nas linhas.",
        steps: [
          { id: "total_ativos", rowsUsed: [expect.objectContaining({ total: expect.any(Number) })] },
          { id: "materiais_baixos", rowsUsed: [expect.objectContaining({ total: expect.any(Number) })] },
        ],
      });
    });
  },
);

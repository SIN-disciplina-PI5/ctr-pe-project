import { describe, expect, it } from "@jest/globals";
import type { QueryGenerationService } from "./query-generation.service.js";
import { QueryAgentService } from "./query-agent.service.js";
import type { QueryExecutor } from "./query-executor.js";

const input = {
  question: "Quais ativos estão parados?",
  empresaId: "empresa-1",
};

describe("QueryAgentService", () => {
  it("executa SQL validado e devolve somente a resposta fundamentada nas linhas", async () => {
    const sql = `SELECT "codigo" FROM ai."Ativo" WHERE "status" = 'PARADO' LIMIT 100`;
    const generationService = {
      generate: async () => ({
        status: "generated" as const,
        sql,
        explanation: "Ativos parados.",
        assumptions: [],
        relevantViews: ["Ativo" as const],
        validation: {
          valid: true,
          violations: [],
          views: ["Ativo"],
          limit: 100,
        },
        metrics: {
          provider: "fake",
          model: "fake-model",
          latencyMs: 12,
          inputTokens: 20,
          outputTokens: 10,
          totalTokens: 30,
        },
      }),
    } as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => ({
        rows: [{ codigo: "AT-001" }],
        rowCount: 1,
        latencyMs: 4,
      }),
    };

    await expect(
      new QueryAgentService(generationService, executor).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      answer: expect.stringContaining("1 registro"),
      sql,
      rowsUsed: [{ codigo: "AT-001" }],
      execution: { rowCount: 1, latencyMs: 4 },
    });
  });

  it("não consulta o banco quando a geração é recusada", async () => {
    const generationService = {
      generate: async () => ({
        status: "refused" as const,
        reason: "Pergunta fora do domínio.",
        relevantViews: [],
      }),
    } as unknown as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => {
        throw new Error("não deveria executar");
      },
    };

    await expect(
      new QueryAgentService(generationService, executor).query(input),
    ).resolves.toEqual({
      status: "refused",
      reason: "Pergunta fora do domínio.",
      relevantViews: [],
    });
  });

  it("produz resposta segura e explícita quando não há linhas", async () => {
    const generationService = {
      generate: async () => ({
        status: "generated" as const,
        sql: `SELECT "codigo" FROM ai."Ativo" LIMIT 100`,
        explanation: "Ativos.",
        assumptions: [],
        relevantViews: ["Ativo" as const],
        validation: {
          valid: true,
          violations: [],
          views: ["Ativo"],
          limit: 100,
        },
        metrics: {
          provider: "fake",
          model: "fake-model",
          latencyMs: 1,
          inputTokens: null,
          outputTokens: null,
          totalTokens: null,
        },
      }),
    } as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => ({ rows: [], rowCount: 0, latencyMs: 2 }),
    };

    await expect(
      new QueryAgentService(generationService, executor).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      answer: "Nenhum dado foi encontrado para a pergunta nesta empresa.",
      rowsUsed: [],
    });
  });
});

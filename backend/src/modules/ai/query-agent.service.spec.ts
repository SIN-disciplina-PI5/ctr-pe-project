import { describe, expect, it, jest } from "@jest/globals";
import type { QueryGenerationService } from "./query-generation.service.js";
import { QueryAgentService } from "./query-agent.service.js";
import type {
  QueryAnswerInput,
  QueryAnswerer,
} from "./query-answer.service.js";
import { QueryExecutionError, type QueryExecutor } from "./query-executor.js";

const input = {
  question: "Quais ativos estão parados?",
  empresaId: "empresa-1",
};

function setupAnswerer(): {
  answerer: QueryAnswerer;
  calls: QueryAnswerInput[];
} {
  const calls: QueryAnswerInput[] = [];
  return {
    calls,
    answerer: {
      async answer(answerInput) {
        calls.push(answerInput);
        const hasRows = answerInput.sources.some(
          (source) => source.rows.length > 0,
        );
        return {
          answer: hasRows
            ? "O ativo AT-001 está parado."
            : "Nenhum dado foi encontrado para a pergunta nesta empresa.",
          metrics: null,
        };
      },
    },
  };
}

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
    } as unknown as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => ({
        rows: [{ codigo: "AT-001" }],
        rowCount: 1,
        latencyMs: 4,
      }),
    };
    const { answerer, calls } = setupAnswerer();

    await expect(
      new QueryAgentService(generationService, executor, answerer).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      answer: "O ativo AT-001 está parado.",
      answerMetrics: null,
      sql,
      rowsUsed: [{ codigo: "AT-001" }],
      execution: { rowCount: 1, latencyMs: 4 },
    });
    expect(calls).toEqual([
      {
        question: input.question,
        sources: [
          {
            purpose: "Ativos parados.",
            rows: [{ codigo: "AT-001" }],
          },
        ],
      },
    ]);
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
      new QueryAgentService(
        generationService,
        executor,
        setupAnswerer().answerer,
      ).query(input),
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
    } as unknown as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => ({ rows: [], rowCount: 0, latencyMs: 2 }),
    };

    await expect(
      new QueryAgentService(
        generationService,
        executor,
        setupAnswerer().answerer,
      ).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      answer: "Nenhum dado foi encontrado para a pergunta nesta empresa.",
      rowsUsed: [],
    });
  });

  it("faz uma única correção após falha técnica corrigível", async () => {
    const initialSql = `SELECT "inexistente" FROM ai."Ativo" LIMIT 100`;
    const correctedSql = `SELECT "codigo" FROM ai."Ativo" LIMIT 100`;
    const correct = jest.fn(async () => ({
      sql: correctedSql,
      explanation: "Coluna corrigida.",
      validation: { valid: true, violations: [], views: ["Ativo"], limit: 100 },
      metrics: {
        provider: "fake",
        model: "fake-model",
        latencyMs: 2,
        inputTokens: 3,
        outputTokens: 4,
        totalTokens: 7,
      },
    }));
    const generationService = {
      generate: async () => ({
        status: "generated" as const,
        sql: initialSql,
        explanation: "Consulta inicial.",
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
          inputTokens: 1,
          outputTokens: 1,
          totalTokens: 2,
        },
      }),
      correct,
    } as unknown as QueryGenerationService;
    let attempts = 0;
    const executor: QueryExecutor = {
      execute: async (sql) => {
        attempts += 1;
        if (attempts === 1) {
          throw new QueryExecutionError(
            "INVALID_COLUMN",
            "A consulta referencia uma coluna inexistente.",
            true,
            422,
          );
        }
        expect(sql).toBe(correctedSql);
        return { rows: [{ codigo: "AT-001" }], rowCount: 1, latencyMs: 3 };
      },
    };

    await expect(
      new QueryAgentService(
        generationService,
        executor,
        setupAnswerer().answerer,
      ).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      mode: "single",
      sql: correctedSql,
      correctionApplied: true,
    });
    expect(attempts).toBe(2);
    expect(correct).toHaveBeenCalledTimes(1);
  });

  it("encerra com erro seguro quando a consulta corrigida também falha", async () => {
    const generationService = {
      generate: async () => ({
        status: "generated" as const,
        sql: `SELECT "x" FROM ai."Ativo" LIMIT 100`,
        explanation: "Inicial.",
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
      correct: async () => ({
        sql: `SELECT "y" FROM ai."Ativo" LIMIT 100`,
        explanation: "Corrigida.",
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
    } as unknown as QueryGenerationService;
    const executor: QueryExecutor = {
      execute: async () => {
        throw new QueryExecutionError(
          "INVALID_COLUMN",
          "A consulta referencia uma coluna inexistente.",
          true,
          422,
        );
      },
    };

    await expect(
      new QueryAgentService(
        generationService,
        executor,
        setupAnswerer().answerer,
      ).query(input),
    ).rejects.toMatchObject({
      statusCode: 422,
      message: "A consulta continuou inválida após uma única correção.",
    });
  });

  it("executa de duas a três consultas apenas quando recebe um plano", async () => {
    const generationService = {
      generate: async () => ({
        status: "planned" as const,
        steps: [
          {
            id: "ativos",
            purpose: "Consultar ativos.",
            sql: `SELECT "codigo" FROM ai."Ativo" LIMIT 100`,
            validation: {
              valid: true,
              violations: [],
              views: ["Ativo"],
              limit: 100,
            },
          },
          {
            id: "materiais",
            purpose: "Consultar materiais.",
            sql: `SELECT "codigo" FROM ai."Material" LIMIT 100`,
            validation: {
              valid: true,
              violations: [],
              views: ["Material"],
              limit: 100,
            },
          },
        ],
        explanation: "Duas consultas necessárias.",
        assumptions: [],
        relevantViews: ["Ativo" as const, "Material" as const],
        metrics: {
          provider: "fake",
          model: "fake-model",
          latencyMs: 1,
          inputTokens: null,
          outputTokens: null,
          totalTokens: null,
        },
      }),
    } as unknown as QueryGenerationService;
    const executed: string[] = [];
    const executor: QueryExecutor = {
      execute: async (sql) => {
        executed.push(sql);
        return { rows: [{ codigo: "X" }], rowCount: 1, latencyMs: 1 };
      },
    };
    const { answerer, calls } = setupAnswerer();

    await expect(
      new QueryAgentService(generationService, executor, answerer).query(input),
    ).resolves.toMatchObject({
      status: "answered",
      mode: "plan",
      steps: [{ id: "ativos" }, { id: "materiais" }],
    });
    expect(executed).toHaveLength(2);
    expect(calls).toEqual([
      {
        question: input.question,
        sources: [
          { purpose: "Consultar ativos.", rows: [{ codigo: "X" }] },
          { purpose: "Consultar materiais.", rows: [{ codigo: "X" }] },
        ],
      },
    ]);
  });
});

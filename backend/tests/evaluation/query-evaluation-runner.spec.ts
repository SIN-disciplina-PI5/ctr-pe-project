import { describe, expect, it } from "@jest/globals";
import type { QueryAgentService } from "../../src/modules/ai/query-agent.service.js";
import { QueryAgentEvaluationAdapter } from "../../evaluation/query-agent-evaluation-adapter.js";
import { QUERY_EVALUATION_DATASET } from "../../evaluation/query-evaluation-dataset.js";
import {
  QueryEvaluationRunner,
  serializeEvaluationCsv,
  type EvaluationAdapter,
  type EvaluationAgentOutput,
} from "../../evaluation/query-evaluation-runner.js";

const executedAt = "2026-11-04T12:00:00.000Z";
const usage = {
  provider: "fake-provider",
  model: "fake-model",
  latencyMs: 15,
  inputTokens: 10,
  outputTokens: 5,
  totalTokens: 15,
};

describe("QueryEvaluationRunner", () => {
  it("avalia casos em ordem, calcula métricas por categoria e é determinístico", async () => {
    const selected = [
      QUERY_EVALUATION_DATASET.find((item) => item.id === "direct-total-ativos")!,
      QUERY_EVALUATION_DATASET.find((item) => item.id === "refused-apagar-ordens")!,
      QUERY_EVALUATION_DATASET.find((item) => item.id === "ambiguous-gasto-periodo")!,
    ];
    const answers = new Map<string, EvaluationAgentOutput>([
      [selected[0]!.question, { status: "answered", rowGroups: [[{ total: 18 }]], usage }],
      [selected[1]!.question, { status: "refused", reason: "Operação de escrita não permitida.", usage }],
      [selected[2]!.question, { status: "answered", rowGroups: [[{ total: 1 }]], usage }],
    ]);
    const adapter: EvaluationAdapter = {
      run: async (question) => answers.get(question)!,
    };
    const options = {
      adapter,
      empresaId: "empresa-1",
      tenantCode: "alpha-international" as const,
      executedAt,
      fallbackProvider: "fake-provider",
      fallbackModel: "fake-model",
      now: () => 100,
    };

    const first = await new QueryEvaluationRunner(options).run(selected);
    const second = await new QueryEvaluationRunner(options).run(selected);

    expect(second).toEqual(first);
    expect(first).toMatchObject({ totalCases: 3, correctCases: 2, precision: 0.6667 });
    expect(first.results.map((result) => result.caseId)).toEqual(selected.map((item) => item.id));
    expect(first.categories).toEqual([
      { category: "direct", cases: 1, correct: 1, precision: 1, averageLatencyMs: 15, totalTokens: 15 },
      { category: "refused", cases: 1, correct: 1, precision: 1, averageLatencyMs: 15, totalTokens: 15 },
      { category: "ambiguous", cases: 1, correct: 0, precision: 0, averageLatencyMs: 15, totalTokens: 15 },
    ]);
  });

  it("isola erro de um caso e continua os demais", async () => {
    const selected = QUERY_EVALUATION_DATASET.slice(0, 2);
    let call = 0;
    const adapter: EvaluationAdapter = {
      run: async () => {
        call += 1;
        if (call === 1) throw new Error("falha controlada");
        return { status: "refused", reason: "sem resposta", usage };
      },
    };
    const times = [10, 25];
    const report = await new QueryEvaluationRunner({
      adapter,
      empresaId: "empresa-1",
      tenantCode: "alpha-international",
      executedAt,
      fallbackProvider: "fake-provider",
      fallbackModel: "fake-model",
      now: () => times.shift() ?? 25,
    }).run(selected);

    expect(report.results).toHaveLength(2);
    expect(report.results[0]).toMatchObject({ actualStatus: "error", latencyMs: 15, details: ["falha controlada"] });
    expect(report.results[1]?.actualStatus).toBe("refused");
  });

  it("exporta CSV estável com escape de texto", async () => {
    const selected = [QUERY_EVALUATION_DATASET.find((item) => item.id === "direct-total-ativos")!];
    const adapter: EvaluationAdapter = {
      run: async () => ({ status: "answered", rowGroups: [[{ total: 18 }]], usage }),
    };
    const report = await new QueryEvaluationRunner({
      adapter,
      empresaId: "empresa-1",
      tenantCode: "alpha-international",
      executedAt,
      fallbackProvider: "fake-provider",
      fallbackModel: "fake-model",
    }).run(selected);

    const csv = serializeEvaluationCsv(report);
    expect(csv.split("\n")).toHaveLength(3);
    expect(csv).toContain("executedAt,tenantCode,caseId,category");
    expect(csv).toContain("direct-total-ativos,direct");
  });
});

describe("QueryAgentEvaluationAdapter", () => {
  it("agrega métricas reais de geração, correção e execução", async () => {
    const agent = {
      query: async () => ({
        status: "answered" as const,
        mode: "single" as const,
        answer: "ok",
        sql: 'SELECT "codigo" FROM ai."Ativo" LIMIT 100',
        rowsUsed: [{ codigo: "CT-07" }],
        execution: { rowCount: 1, latencyMs: 4 },
        correctionApplied: true,
        correctionMetrics: {
          provider: "groq",
          model: "modelo",
          latencyMs: 3,
          inputTokens: 2,
          outputTokens: 1,
          totalTokens: 3,
        },
        relevantViews: ["Ativo" as const],
        generation: {
          provider: "groq",
          model: "modelo",
          latencyMs: 8,
          inputTokens: 10,
          outputTokens: 5,
          totalTokens: 15,
        },
      }),
    } as Pick<QueryAgentService, "query">;

    await expect(new QueryAgentEvaluationAdapter(agent, { provider: "groq", model: "fallback" }).run("ativos", "e1"))
      .resolves.toEqual({
        status: "answered",
        rowGroups: [[{ codigo: "CT-07" }]],
        usage: {
          provider: "groq",
          model: "modelo",
          latencyMs: 15,
          inputTokens: 12,
          outputTokens: 6,
          totalTokens: 18,
        },
      });
  });
});

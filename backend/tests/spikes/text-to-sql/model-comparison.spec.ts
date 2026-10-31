import { describe, expect, it } from "@jest/globals";
import {
  type ModelComparisonReport,
  summarizeModelComparison,
} from "../../../spikes/text-to-sql/model-comparison.js";

function makeReport(
  overrides: Partial<ModelComparisonReport> = {},
): ModelComparisonReport {
  return {
    id: "caso-1",
    model: "openai/gpt-oss-20b",
    contextVariant: "full",
    contextCharacters: 1_000,
    generationMetrics: {
      model: "openai/gpt-oss-20b",
      latencyMs: 1_000,
      inputTokens: 1_000,
      outputTokens: 500,
      totalTokens: 1_500,
    },
    generationSucceeded: true,
    staticValidationPassed: true,
    executionSucceeded: true,
    exactMatch: false,
    referenceProjectionMatch: true,
    semanticEvaluation: {
      status: "match",
      reason: "Resultado semanticamente correto.",
    },
    ...overrides,
  };
}

describe("summarizeModelComparison", () => {
  it("agrega precisão, latência, tokens e custo por configuração", () => {
    const summaries = summarizeModelComparison([
      makeReport({ id: "caso-1" }),
      makeReport({
        id: "caso-2",
        generationMetrics: null,
        generationSucceeded: false,
        staticValidationPassed: false,
        executionSucceeded: false,
        referenceProjectionMatch: false,
        semanticEvaluation: {
          status: "mismatch",
          reason: "SQL não gerado.",
        },
      }),
    ]);

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toMatchObject({
      totalCases: 2,
      generatedCases: 1,
      generationSuccessPct: 50,
      matchingCases: 1,
      answerAccuracyPct: 50,
      semanticEvaluatedCases: 2,
      semanticMatchingCases: 1,
      semanticAccuracyPct: 50,
      averageLatencyMs: 1_000,
      inputTokens: 1_000,
      outputTokens: 500,
      estimatedCostUsd: 0.000225,
    });
  });

  it("exclui casos inconclusivos da precisão semântica", () => {
    const summaries = summarizeModelComparison([
      makeReport(),
      makeReport({
        id: "caso-2",
        semanticEvaluation: {
          status: "inconclusive",
          reason: "Referência vazia.",
        },
      }),
    ]);

    expect(summaries[0]).toMatchObject({
      semanticEvaluatedCases: 1,
      semanticMatchingCases: 1,
      semanticInconclusiveCases: 1,
      semanticAccuracyPct: 100,
    });
  });

  it("separa modelos e variantes de contexto", () => {
    const summaries = summarizeModelComparison([
      makeReport(),
      makeReport({
        model: "openai/gpt-oss-120b",
        contextVariant: "relevant",
        generationMetrics: {
          model: "openai/gpt-oss-120b",
          latencyMs: 800,
          inputTokens: 2_000,
          outputTokens: 1_000,
          totalTokens: 3_000,
        },
      }),
    ]);

    expect(summaries).toHaveLength(2);
  });

  it("rejeita relatório sem metadados da configuração", () => {
    expect(() =>
      summarizeModelComparison([makeReport({ model: null })]),
    ).toThrow("não informa modelo e variante de contexto");
  });

  it("rejeita o mesmo caso repetido na mesma configuração", () => {
    expect(() =>
      summarizeModelComparison([makeReport(), makeReport()]),
    ).toThrow("Caso duplicado na comparação");
  });
});

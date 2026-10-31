import { describe, expect, it } from "@jest/globals";
import {
  summarizeRetryComparison,
  type RetryAttemptNumber,
  type RetryComparisonCase,
} from "../../../spikes/text-to-sql/retry-comparison.js";

function makeReport(
  id: string,
  semanticStatus: "match" | "mismatch" | "inconclusive",
): RetryComparisonCase {
  return {
    id,
    model: "openai/gpt-oss-120b",
    generationMetrics: {
      model: "openai/gpt-oss-120b",
      latencyMs: 1_000,
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    },
    generationSucceeded: true,
    staticValidationPassed: true,
    executionSucceeded: true,
    semanticEvaluation: {
      status: semanticStatus,
      reason: "Resultado do teste.",
    },
  };
}

function attempt(
  attemptNumber: RetryAttemptNumber,
  statuses: readonly ("match" | "mismatch" | "inconclusive")[],
) {
  return {
    attempt: attemptNumber,
    reports: statuses.map((status, index) =>
      makeReport(`caso-${index + 1}`, status),
    ),
  };
}

describe("summarizeRetryComparison", () => {
  it("calcula precisão, regressões e custo acumulado", () => {
    const result = summarizeRetryComparison([
      attempt(0, ["match", "mismatch"]),
      attempt(1, ["match", "match"]),
      attempt(2, ["mismatch", "match"]),
    ]);

    expect(result.summaries[0]).toMatchObject({
      attempt: 0,
      semanticAccuracyPct: 50,
      cumulativeTotalTokens: 300,
      cumulativeEstimatedCostUsd: 0.00009,
    });
    expect(result.summaries[1]).toMatchObject({
      attempt: 1,
      semanticAccuracyPct: 100,
      improvedCases: 1,
      regressedCases: 0,
      cumulativeTotalTokens: 600,
      cumulativeEstimatedCostUsd: 0.00018,
    });
    expect(result.summaries[2]).toMatchObject({
      attempt: 2,
      semanticAccuracyPct: 50,
      improvedCases: 0,
      regressedCases: 1,
      cumulativeTotalTokens: 900,
      cumulativeEstimatedCostUsd: 0.00027,
    });
    expect(result.recommendedAttempt).toBe(1);
  });

  it("exclui casos inconclusivos do denominador sem classificá-los como regressão", () => {
    const result = summarizeRetryComparison([
      attempt(0, ["match", "inconclusive"]),
      attempt(1, ["match", "inconclusive"]),
      attempt(2, ["match", "inconclusive"]),
    ]);

    expect(result.summaries[2]).toMatchObject({
      semanticEvaluatedCases: 1,
      semanticInconclusiveCases: 1,
      semanticAccuracyPct: 100,
      improvedCases: 0,
      regressedCases: 0,
    });
    expect(result.recommendedAttempt).toBe(0);
  });

  it("rejeita conjuntos de casos divergentes", () => {
    expect(() =>
      summarizeRetryComparison([
        attempt(0, ["match", "match"]),
        attempt(1, ["match"]),
        attempt(2, ["match", "match"]),
      ]),
    ).toThrow("Conjunto de casos divergente na tentativa 1");
  });
});

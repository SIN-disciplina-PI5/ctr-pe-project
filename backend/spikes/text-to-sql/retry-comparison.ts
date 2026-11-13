import {
  MODEL_PRICING,
  type GenerationMetrics,
} from "./model-comparison.js";
import type { SemanticEvaluation } from "./result-semantic-comparison.js";

export type RetryAttemptNumber = 0 | 1 | 2;

export interface RetryComparisonCase {
  id: string;
  model: string;
  generationMetrics: GenerationMetrics | null;
  generationSucceeded: boolean;
  staticValidationPassed: boolean;
  executionSucceeded: boolean;
  semanticEvaluation: SemanticEvaluation;
}

export interface RetryAttemptReports {
  attempt: RetryAttemptNumber;
  reports: readonly RetryComparisonCase[];
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function percentage(value: number, total: number): number {
  return total === 0 ? 0 : round((value / total) * 100);
}

function compareCaseIds(
  expectedIds: readonly string[],
  reports: readonly RetryComparisonCase[],
  attempt: RetryAttemptNumber,
): void {
  const receivedIds = reports.map((report) => report.id).sort();

  if (new Set(receivedIds).size !== receivedIds.length) {
    throw new Error(`Casos duplicados na tentativa ${attempt}.`);
  }

  if (JSON.stringify(receivedIds) !== JSON.stringify(expectedIds)) {
    throw new Error(`Conjunto de casos divergente na tentativa ${attempt}.`);
  }
}

export function summarizeRetryComparison(
  attempts: readonly RetryAttemptReports[],
) {
  const orderedAttempts = [...attempts].sort(
    (left, right) => left.attempt - right.attempt,
  );

  if (
    orderedAttempts.length !== 3 ||
    orderedAttempts.some((attempt, index) => attempt.attempt !== index)
  ) {
    throw new Error("A comparação exige exatamente as tentativas 0, 1 e 2.");
  }

  const expectedIds = orderedAttempts[0]!.reports
    .map((report) => report.id)
    .sort();

  for (const attempt of orderedAttempts) {
    compareCaseIds(expectedIds, attempt.reports, attempt.attempt);
  }

  let cumulativeInputTokens = 0;
  let cumulativeOutputTokens = 0;
  let cumulativeTotalTokens = 0;
  let cumulativeCostUsd = 0;
  let previousById: Map<string, RetryComparisonCase> | null = null;

  const summaries = orderedAttempts.map(({ attempt, reports }) => {
    let inputTokens = 0;
    let outputTokens = 0;
    let totalTokens = 0;
    let costUsd = 0;
    let latencyTotalMs = 0;
    let latencyCases = 0;

    for (const report of reports) {
      const metrics = report.generationMetrics;
      if (!metrics) continue;

      latencyTotalMs += metrics.latencyMs;
      latencyCases += 1;

      if (
        metrics.inputTokens === null ||
        metrics.outputTokens === null ||
        metrics.totalTokens === null
      ) {
        continue;
      }

      inputTokens += metrics.inputTokens;
      outputTokens += metrics.outputTokens;
      totalTokens += metrics.totalTokens;

      const pricing = MODEL_PRICING[report.model];
      if (pricing) {
        costUsd +=
          (metrics.inputTokens * pricing.inputUsdPerMillionTokens +
            metrics.outputTokens * pricing.outputUsdPerMillionTokens) /
          1_000_000;
      }
    }

    cumulativeInputTokens += inputTokens;
    cumulativeOutputTokens += outputTokens;
    cumulativeTotalTokens += totalTokens;
    cumulativeCostUsd += costUsd;

    const semanticMatchingCases = reports.filter(
      (report) => report.semanticEvaluation.status === "match",
    ).length;
    const semanticInconclusiveCases = reports.filter(
      (report) => report.semanticEvaluation.status === "inconclusive",
    ).length;
    const semanticEvaluatedCases =
      reports.length - semanticInconclusiveCases;
    let improvedCases = 0;
    let regressedCases = 0;

    if (previousById) {
      for (const report of reports) {
        const previous = previousById.get(report.id);
        if (!previous) continue;

        if (
          previous.semanticEvaluation.status !== "match" &&
          report.semanticEvaluation.status === "match"
        ) {
          improvedCases += 1;
        } else if (
          previous.semanticEvaluation.status === "match" &&
          report.semanticEvaluation.status !== "match"
        ) {
          regressedCases += 1;
        }
      }
    }

    previousById = new Map(reports.map((report) => [report.id, report]));

    return {
      attempt,
      totalCases: reports.length,
      generatedCases: reports.filter((report) => report.generationSucceeded)
        .length,
      staticValidCases: reports.filter(
        (report) => report.staticValidationPassed,
      ).length,
      executedCases: reports.filter((report) => report.executionSucceeded)
        .length,
      semanticEvaluatedCases,
      semanticMatchingCases,
      semanticInconclusiveCases,
      semanticAccuracyPct: percentage(
        semanticMatchingCases,
        semanticEvaluatedCases,
      ),
      improvedCases,
      regressedCases,
      averageLatencyMs:
        latencyCases === 0 ? null : round(latencyTotalMs / latencyCases),
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd: round(costUsd, 6),
      cumulativeInputTokens,
      cumulativeOutputTokens,
      cumulativeTotalTokens,
      cumulativeEstimatedCostUsd: round(cumulativeCostUsd, 6),
    };
  });

  const recommended = [...summaries].sort(
    (left, right) =>
      right.semanticAccuracyPct - left.semanticAccuracyPct ||
      left.cumulativeEstimatedCostUsd - right.cumulativeEstimatedCostUsd ||
      left.attempt - right.attempt,
  )[0]!;

  return {
    summaries,
    recommendedAttempt: recommended.attempt,
  };
}

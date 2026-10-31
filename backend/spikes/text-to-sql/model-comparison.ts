import type { SemanticEvaluation } from "./result-semantic-comparison.js";

export type ContextVariant = "full" | "relevant";

export interface GenerationMetrics {
  model: string;
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}

export interface ModelComparisonReport {
  id: string;
  model: string | null;
  contextVariant: ContextVariant | null;
  contextCharacters: number | null;
  generationMetrics: GenerationMetrics | null;
  generationSucceeded: boolean;
  staticValidationPassed: boolean;
  executionSucceeded: boolean;
  exactMatch: boolean;
  referenceProjectionMatch: boolean;
  semanticEvaluation: SemanticEvaluation;
}

interface ModelPricing {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
}

export const MODEL_PRICING: Readonly<Record<string, ModelPricing>> = {
  "openai/gpt-oss-20b": {
    inputUsdPerMillionTokens: 0.075,
    outputUsdPerMillionTokens: 0.3,
  },
  "openai/gpt-oss-120b": {
    inputUsdPerMillionTokens: 0.15,
    outputUsdPerMillionTokens: 0.6,
  },
};

export const PRICING_SNAPSHOT_DATE = "2026-10-30";
export const PRICING_SOURCE = "https://console.groq.com/docs/models";

interface ComparisonAccumulator {
  model: string;
  contextVariant: ContextVariant;
  totalCases: number;
  generatedCases: number;
  staticValidCases: number;
  executedCases: number;
  matchingCases: number;
  exactMatchCases: number;
  semanticEvaluatedCases: number;
  semanticMatchingCases: number;
  semanticInconclusiveCases: number;
  latencyTotalMs: number;
  latencyCases: number;
  contextCharactersTotal: number;
  contextCharactersCases: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  tokenMetricsCases: number;
  estimatedCostUsd: number;
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function percentage(value: number, total: number): number {
  return total === 0 ? 0 : round((value / total) * 100);
}

export function summarizeModelComparison(
  reports: readonly ModelComparisonReport[],
) {
  const groups = new Map<string, ComparisonAccumulator>();
  const seenCases = new Set<string>();

  for (const report of reports) {
    if (!report.model || !report.contextVariant) {
      throw new Error(
        `Relatório ${report.id} não informa modelo e variante de contexto.`,
      );
    }

    const caseKey = `${report.model}:${report.contextVariant}:${report.id}`;
    if (seenCases.has(caseKey)) {
      throw new Error(`Caso duplicado na comparação: ${caseKey}`);
    }
    seenCases.add(caseKey);

    const groupKey = `${report.model}:${report.contextVariant}`;
    const accumulator = groups.get(groupKey) ?? {
      model: report.model,
      contextVariant: report.contextVariant,
      totalCases: 0,
      generatedCases: 0,
      staticValidCases: 0,
      executedCases: 0,
      matchingCases: 0,
      exactMatchCases: 0,
      semanticEvaluatedCases: 0,
      semanticMatchingCases: 0,
      semanticInconclusiveCases: 0,
      latencyTotalMs: 0,
      latencyCases: 0,
      contextCharactersTotal: 0,
      contextCharactersCases: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      tokenMetricsCases: 0,
      estimatedCostUsd: 0,
    };

    accumulator.totalCases += 1;
    accumulator.generatedCases += Number(report.generationSucceeded);
    accumulator.staticValidCases += Number(report.staticValidationPassed);
    accumulator.executedCases += Number(report.executionSucceeded);
    accumulator.matchingCases += Number(report.referenceProjectionMatch);
    accumulator.exactMatchCases += Number(report.exactMatch);
    accumulator.semanticMatchingCases += Number(
      report.semanticEvaluation.status === "match",
    );
    accumulator.semanticInconclusiveCases += Number(
      report.semanticEvaluation.status === "inconclusive",
    );
    accumulator.semanticEvaluatedCases += Number(
      report.semanticEvaluation.status !== "inconclusive",
    );

    if (report.contextCharacters !== null) {
      accumulator.contextCharactersTotal += report.contextCharacters;
      accumulator.contextCharactersCases += 1;
    }

    const metrics = report.generationMetrics;
    if (metrics) {
      accumulator.latencyTotalMs += metrics.latencyMs;
      accumulator.latencyCases += 1;

      if (
        metrics.inputTokens !== null &&
        metrics.outputTokens !== null &&
        metrics.totalTokens !== null
      ) {
        accumulator.inputTokens += metrics.inputTokens;
        accumulator.outputTokens += metrics.outputTokens;
        accumulator.totalTokens += metrics.totalTokens;
        accumulator.tokenMetricsCases += 1;

        const pricing = MODEL_PRICING[report.model];
        if (pricing) {
          accumulator.estimatedCostUsd +=
            (metrics.inputTokens * pricing.inputUsdPerMillionTokens +
              metrics.outputTokens * pricing.outputUsdPerMillionTokens) /
            1_000_000;
        }
      }
    }

    groups.set(groupKey, accumulator);
  }

  return [...groups.values()]
    .map((group) => ({
      model: group.model,
      contextVariant: group.contextVariant,
      totalCases: group.totalCases,
      generatedCases: group.generatedCases,
      generationSuccessPct: percentage(
        group.generatedCases,
        group.totalCases,
      ),
      staticValidCases: group.staticValidCases,
      staticValidationPct: percentage(
        group.staticValidCases,
        group.totalCases,
      ),
      executedCases: group.executedCases,
      executionSuccessPct: percentage(
        group.executedCases,
        group.totalCases,
      ),
      matchingCases: group.matchingCases,
      answerAccuracyPct: percentage(group.matchingCases, group.totalCases),
      exactMatchCases: group.exactMatchCases,
      semanticEvaluatedCases: group.semanticEvaluatedCases,
      semanticMatchingCases: group.semanticMatchingCases,
      semanticInconclusiveCases: group.semanticInconclusiveCases,
      semanticAccuracyPct: percentage(
        group.semanticMatchingCases,
        group.semanticEvaluatedCases,
      ),
      averageLatencyMs:
        group.latencyCases === 0
          ? null
          : round(group.latencyTotalMs / group.latencyCases),
      averageContextCharacters:
        group.contextCharactersCases === 0
          ? null
          : round(
              group.contextCharactersTotal / group.contextCharactersCases,
            ),
      inputTokens: group.inputTokens,
      outputTokens: group.outputTokens,
      totalTokens: group.totalTokens,
      tokenMetricsCases: group.tokenMetricsCases,
      estimatedCostUsd: MODEL_PRICING[group.model]
        ? round(group.estimatedCostUsd, 6)
        : null,
    }))
    .sort((left, right) =>
      `${left.model}:${left.contextVariant}`.localeCompare(
        `${right.model}:${right.contextVariant}`,
      ),
    );
}

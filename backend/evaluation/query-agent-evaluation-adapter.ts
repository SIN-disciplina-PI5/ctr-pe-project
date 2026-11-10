import type { GenerationMetrics } from "../src/modules/ai/query-generation.service.js";
import type {
  QueryAgentResult,
  QueryAgentService,
} from "../src/modules/ai/query-agent.service.js";
import type {
  EvaluationAdapter,
  EvaluationAgentOutput,
  EvaluationUsage,
} from "./query-evaluation-runner.js";

type Agent = Pick<QueryAgentService, "query">;

function sumMetric(
  metrics: readonly GenerationMetrics[],
  key: "inputTokens" | "outputTokens" | "totalTokens",
): number | null {
  const values = metrics
    .map((metric) => metric[key])
    .filter((value): value is number => value !== null);
  return values.length === 0
    ? null
    : values.reduce((total, value) => total + value, 0);
}

export function queryUsageOf(
  result: QueryAgentResult,
  fallback: { readonly provider: string; readonly model: string },
): EvaluationUsage {
  const generation =
    result.status === "answered" ? result.generation : result.metrics;
  const corrections =
    result.status !== "answered"
      ? []
      : result.mode === "single"
        ? [result.correctionMetrics].filter(
            (metric): metric is GenerationMetrics => metric !== null,
          )
        : result.steps
            .map((step) => step.correctionMetrics)
            .filter((metric): metric is GenerationMetrics => metric !== null);
  const answer =
    result.status === "answered" && result.answerMetrics
      ? [result.answerMetrics]
      : [];
  const metrics = generation
    ? [generation, ...corrections, ...answer]
    : [...corrections, ...answer];
  const executionLatency =
    result.status !== "answered"
      ? 0
      : result.mode === "single"
        ? result.execution.latencyMs
        : result.steps.reduce(
            (total, step) => total + step.execution.latencyMs,
            0,
          );

  return {
    provider: generation?.provider ?? fallback.provider,
    model: generation?.model ?? fallback.model,
    latencyMs: metrics.reduce(
      (total, metric) => total + metric.latencyMs,
      executionLatency,
    ),
    inputTokens: sumMetric(metrics, "inputTokens"),
    outputTokens: sumMetric(metrics, "outputTokens"),
    totalTokens: sumMetric(metrics, "totalTokens"),
  };
}

export class QueryAgentEvaluationAdapter implements EvaluationAdapter {
  constructor(
    private readonly agent: Agent,
    private readonly fallback: {
      readonly provider: string;
      readonly model: string;
    },
  ) {}

  async run(
    question: string,
    empresaId: string,
  ): Promise<EvaluationAgentOutput> {
    const result = await this.agent.query({ question, empresaId });
    const usage = queryUsageOf(result, this.fallback);

    if (result.status === "refused") {
      return { status: "refused", reason: result.reason, usage };
    }
    if (result.mode === "single") {
      return { status: "answered", rowGroups: [result.rowsUsed], usage };
    }
    return {
      status: "answered",
      rowGroups: result.steps.map((step) => step.rowsUsed),
      usage,
    };
  }
}

import type { GenerationMetrics } from "../src/modules/ai/query-generation.service.js";
import type {
  OrchestratorResult,
  OrchestratorService,
} from "../src/modules/ai/orchestrator.service.js";
import { queryUsageOf } from "./query-agent-evaluation-adapter.js";
import type {
  EvaluationAdapter,
  EvaluationAgentOutput,
  EvaluationUsage,
} from "./query-evaluation-runner.js";

type Orchestrator = Pick<OrchestratorService, "handle">;

function valueSum(values: readonly (number | null)[]): number | null {
  const available = values.filter((value): value is number => value !== null);
  return available.length === 0
    ? null
    : available.reduce((total, value) => total + value, 0);
}

function uniqueLabel(values: readonly string[]): string {
  return [...new Set(values)].join(" + ");
}

function usageFromMetrics(
  metrics: GenerationMetrics | null,
  fallback: { readonly provider: string; readonly model: string },
): EvaluationUsage {
  return {
    provider: metrics?.provider ?? fallback.provider,
    model: metrics?.model ?? fallback.model,
    latencyMs: metrics?.latencyMs ?? 0,
    inputTokens: metrics?.inputTokens ?? null,
    outputTokens: metrics?.outputTokens ?? null,
    totalTokens: metrics?.totalTokens ?? null,
  };
}

function combineUsage(
  classification: EvaluationUsage,
  query?: EvaluationUsage,
): EvaluationUsage {
  if (!query) return classification;

  return {
    provider: uniqueLabel([classification.provider, query.provider]),
    model: uniqueLabel([classification.model, query.model]),
    latencyMs: classification.latencyMs + query.latencyMs,
    inputTokens: valueSum([classification.inputTokens, query.inputTokens]),
    outputTokens: valueSum([classification.outputTokens, query.outputTokens]),
    totalTokens: valueSum([classification.totalTokens, query.totalTokens]),
  };
}

function queryRows(
  result: Extract<OrchestratorResult, { status: "answered" }>,
) {
  return result.result.mode === "single"
    ? [result.result.rowsUsed]
    : result.result.steps.map((step) => step.rowsUsed);
}

export class OrchestratorEvaluationAdapter implements EvaluationAdapter {
  constructor(
    private readonly orchestrator: Orchestrator,
    private readonly fallback: {
      readonly provider: string;
      readonly model: string;
    },
  ) {}

  async run(
    question: string,
    empresaId: string,
  ): Promise<EvaluationAgentOutput> {
    const result = await this.orchestrator.handle({
      message: question,
      empresaId,
    });
    const classificationUsage = usageFromMetrics(
      result.classificationMetrics,
      this.fallback,
    );

    if (result.intent === "data_question") {
      const queryUsage = queryUsageOf(result.result, this.fallback);
      const usage = combineUsage(classificationUsage, queryUsage);
      if (result.status === "refused") {
        return { status: "refused", reason: result.result.reason, usage };
      }
      return { status: "answered", rowGroups: queryRows(result), usage };
    }

    if (result.status === "clarification") {
      return {
        status: "clarification",
        message: result.message,
        usage: classificationUsage,
      };
    }
    if (result.status === "report_pending") {
      return {
        status: "report_pending",
        message: result.message,
        usage: classificationUsage,
      };
    }
    return {
      status: "refused",
      reason: result.message,
      usage: classificationUsage,
    };
  }
}

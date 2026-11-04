import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type {
  GenerateQueryInput,
  GenerationMetrics,
  QueryGenerationResult,
  QueryGenerationService,
} from "./query-generation.service.js";
import {
  isRetryableQueryExecutionError,
  type QueryExecutionResult,
  type QueryExecutor,
  type QueryRow,
} from "./query-executor.js";

type GeneratedQuery = Extract<QueryGenerationResult, { status: "generated" }>;
type PlannedQuery = Extract<QueryGenerationResult, { status: "planned" }>;
type RelevantViews = GeneratedQuery["relevantViews"];

interface ExecutedQuery {
  readonly sql: string;
  readonly rowsUsed: readonly QueryRow[];
  readonly execution: Pick<QueryExecutionResult, "rowCount" | "latencyMs">;
  readonly correctionApplied: boolean;
  readonly correctionMetrics: GenerationMetrics | null;
}

interface AnsweredSingleQueryResult extends ExecutedQuery {
  readonly status: "answered";
  readonly mode: "single";
  readonly answer: string;
  readonly relevantViews: RelevantViews;
  readonly generation: GenerationMetrics;
}

interface ExecutedPlanStep extends ExecutedQuery {
  readonly id: string;
  readonly purpose: string;
}

interface AnsweredQueryPlanResult {
  readonly status: "answered";
  readonly mode: "plan";
  readonly answer: string;
  readonly steps: readonly ExecutedPlanStep[];
  readonly relevantViews: PlannedQuery["relevantViews"];
  readonly generation: GenerationMetrics;
}

export type QueryAgentResult =
  | Extract<QueryGenerationResult, { status: "refused" }>
  | AnsweredSingleQueryResult
  | AnsweredQueryPlanResult;

function buildGroundedAnswer(rowCount: number, queryCount = 1): string {
  if (rowCount === 0) {
    return "Nenhum dado foi encontrado para a pergunta nesta empresa.";
  }

  const records = rowCount === 1 ? "1 registro" : `${rowCount} registros`;
  if (queryCount === 1) {
    return `A consulta encontrou ${records}. A resposta está integralmente apresentada em rowsUsed.`;
  }
  return `O plano executou ${queryCount} consultas e encontrou ${records}. A resposta está integralmente apresentada nas linhas de cada etapa.`;
}

export class QueryAgentService {
  constructor(
    private readonly generationService: QueryGenerationService,
    private readonly executor: QueryExecutor,
  ) {}

  async query(input: GenerateQueryInput): Promise<QueryAgentResult> {
    const generation = await this.generationService.generate(input);
    if (generation.status === "refused") return generation;

    if (generation.status === "planned") {
      return this.executePlan(input, generation);
    }

    const executed = await this.executeWithCorrection(
      input,
      generation.sql,
      generation.relevantViews,
    );

    return {
      status: "answered",
      mode: "single",
      answer: buildGroundedAnswer(executed.execution.rowCount),
      ...executed,
      relevantViews: generation.relevantViews,
      generation: generation.metrics,
    };
  }

  private async executePlan(
    input: GenerateQueryInput,
    generation: PlannedQuery,
  ): Promise<AnsweredQueryPlanResult> {
    const steps: ExecutedPlanStep[] = [];

    for (const step of generation.steps) {
      const executed = await this.executeWithCorrection(
        input,
        step.sql,
        generation.relevantViews,
      );
      steps.push({ id: step.id, purpose: step.purpose, ...executed });
    }

    const totalRows = steps.reduce(
      (total, step) => total + step.execution.rowCount,
      0,
    );
    return {
      status: "answered",
      mode: "plan",
      answer: buildGroundedAnswer(totalRows, steps.length),
      steps,
      relevantViews: generation.relevantViews,
      generation: generation.metrics,
    };
  }

  private async executeWithCorrection(
    input: GenerateQueryInput,
    sql: string,
    relevantViews: RelevantViews,
  ): Promise<ExecutedQuery> {
    const empresaId = input.empresaId ?? "";

    try {
      const execution = await this.executor.execute(sql, empresaId);
      return {
        sql,
        rowsUsed: execution.rows,
        execution: {
          rowCount: execution.rowCount,
          latencyMs: execution.latencyMs,
        },
        correctionApplied: false,
        correctionMetrics: null,
      };
    } catch (error) {
      if (!isRetryableQueryExecutionError(error)) throw error;

      const correction = await this.generationService.correct({
        question: input.question,
        empresaId,
        failedSql: sql,
        safeFeedback: error.safeFeedback,
        relevantViews,
      });

      try {
        const execution = await this.executor.execute(
          correction.sql,
          empresaId,
        );
        return {
          sql: correction.sql,
          rowsUsed: execution.rows,
          execution: {
            rowCount: execution.rowCount,
            latencyMs: execution.latencyMs,
          },
          correctionApplied: true,
          correctionMetrics: correction.metrics,
        };
      } catch {
        throw new AppError({
          message: "A consulta continuou inválida após uma única correção.",
          statusCode: 422,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }
    }
  }
}

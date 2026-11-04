import type {
  GenerateQueryInput,
  QueryGenerationResult,
  QueryGenerationService,
} from "./query-generation.service.js";
import type {
  QueryExecutionResult,
  QueryExecutor,
  QueryRow,
} from "./query-executor.js";

interface AnsweredQueryResult {
  readonly status: "answered";
  readonly answer: string;
  readonly sql: string;
  readonly rowsUsed: readonly QueryRow[];
  readonly relevantViews: Extract<
    QueryGenerationResult,
    { status: "generated" }
  >["relevantViews"];
  readonly generation: Extract<
    QueryGenerationResult,
    { status: "generated" }
  >["metrics"];
  readonly execution: Pick<QueryExecutionResult, "rowCount" | "latencyMs">;
}

export type QueryAgentResult =
  | Extract<QueryGenerationResult, { status: "refused" }>
  | AnsweredQueryResult;

function buildGroundedAnswer(rowCount: number): string {
  if (rowCount === 0) {
    return "Nenhum dado foi encontrado para a pergunta nesta empresa.";
  }
  if (rowCount === 1) {
    return "A consulta encontrou 1 registro. A resposta está integralmente apresentada em rowsUsed.";
  }
  return `A consulta encontrou ${rowCount} registros. A resposta está integralmente apresentada em rowsUsed.`;
}

export class QueryAgentService {
  constructor(
    private readonly generationService: QueryGenerationService,
    private readonly executor: QueryExecutor,
  ) {}

  async query(input: GenerateQueryInput): Promise<QueryAgentResult> {
    const generation = await this.generationService.generate(input);
    if (generation.status === "refused") return generation;

    const execution = await this.executor.execute(
      generation.sql,
      input.empresaId ?? "",
    );

    return {
      status: "answered",
      answer: buildGroundedAnswer(execution.rowCount),
      sql: generation.sql,
      rowsUsed: execution.rows,
      relevantViews: generation.relevantViews,
      generation: generation.metrics,
      execution: {
        rowCount: execution.rowCount,
        latencyMs: execution.latencyMs,
      },
    };
  }
}

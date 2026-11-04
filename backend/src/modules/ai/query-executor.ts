import pg, { type QueryResult, type QueryResultRow } from "pg";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

const { Pool } = pg;

const MAX_RESULT_ROWS = 100;
const QUERY_TIMEOUT = "3s";
const LOCK_TIMEOUT = "1s";
const IDLE_TRANSACTION_TIMEOUT = "5s";

export type QueryRow = Record<string, unknown>;

export interface QueryExecutionResult {
  readonly rows: readonly QueryRow[];
  readonly rowCount: number;
  readonly latencyMs: number;
}

export interface QueryExecutor {
  execute(sql: string, empresaId: string): Promise<QueryExecutionResult>;
}

export interface QueryClient {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<Pick<QueryResult<T>, "rows">>;
  release(): void;
}

export interface QueryPool {
  connect(): Promise<QueryClient>;
}

interface DatabaseFailure {
  readonly code?: string;
}

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const failure = error as DatabaseFailure;
  if (failure.code === "57014") {
    return new AppError({
      message: "A consulta excedeu o tempo limite.",
      statusCode: 504,
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }

  return new AppError({
    message: "Não foi possível consultar os dados com segurança.",
    statusCode: 502,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
  });
}

export class PgReadOnlyQueryExecutor implements QueryExecutor {
  constructor(
    private readonly pool: QueryPool,
    private readonly now: () => number = performance.now.bind(performance),
  ) {}

  async execute(sql: string, empresaId: string): Promise<QueryExecutionResult> {
    if (!sql.trim()) {
      throw new AppError({
        message: "SQL vazio não pode ser executado.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }
    if (!empresaId.trim()) {
      throw new AppError({
        message: "É necessário selecionar uma empresa para consultar a IA.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const startedAt = this.now();
    let client: QueryClient;
    try {
      client = await this.pool.connect();
    } catch (error) {
      throw toAppError(error);
    }

    let transactionStarted = false;
    let rows: readonly QueryRow[] | undefined;
    let failure: unknown;

    try {
      await client.query("BEGIN TRANSACTION READ ONLY");
      transactionStarted = true;
      await client.query(`SET LOCAL statement_timeout = '${QUERY_TIMEOUT}'`);
      await client.query(`SET LOCAL lock_timeout = '${LOCK_TIMEOUT}'`);
      await client.query(
        `SET LOCAL idle_in_transaction_session_timeout = '${IDLE_TRANSACTION_TIMEOUT}'`,
      );
      await client.query(
        "SELECT set_config('ctrpe.current_empresa_id', $1, true)",
        [empresaId],
      );

      const result = await client.query<QueryRow>(sql);
      if (result.rows.length > MAX_RESULT_ROWS) {
        throw new AppError({
          message: "A consulta excedeu o limite máximo de linhas.",
          statusCode: 422,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }
      rows = result.rows;
    } catch (error) {
      failure = error;
    } finally {
      if (transactionStarted) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          failure ??= rollbackError;
        }
      }
      client.release();
    }

    if (failure) throw toAppError(failure);

    const safeRows = rows ?? [];
    return {
      rows: safeRows,
      rowCount: safeRows.length,
      latencyMs: Math.max(0, Math.round(this.now() - startedAt)),
    };
  }
}

export function createQueryExecutor(
  env: NodeJS.ProcessEnv = process.env,
): QueryExecutor {
  const connectionString = env["AI_READONLY_DATABASE_URL"]?.trim();
  if (!connectionString) {
    throw new Error("AI_READONLY_DATABASE_URL não definida.");
  }

  return new PgReadOnlyQueryExecutor(new Pool({ connectionString }));
}

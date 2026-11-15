import { AppError } from "../../common/errors/AppError.js";

/**
 * Estados persistidos do job. Os valores coincidem com o enum
 * StatusJobRelatorioIA do Prisma.
 *
 * Transições permitidas:
 *   QUEUED  -> RUNNING  (claim atômico, incrementa tentativas)
 *   RUNNING -> DONE     (somente com o leaseToken vigente)
 *   RUNNING -> QUEUED   (erro transitório com tentativas restantes)
 *   RUNNING -> FAILED   (erro permanente ou tentativas esgotadas)
 *   RUNNING -> QUEUED | FAILED  (recuperação de lease vencido)
 * DONE e FAILED são terminais.
 */
export type ReportJobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";

export interface ReportJobScope {
  readonly empresaId: string;
  readonly usuarioId: string;
}

export interface ReportJobRecord extends ReportJobScope {
  readonly id: string;
  readonly chaveIdempotencia: string;
  readonly solicitacao: string;
  readonly status: ReportJobStatus;
  readonly tentativas: number;
  readonly maxTentativas: number;
  readonly disponivelEm: Date;
  readonly leaseToken: string | null;
  readonly leaseAte: Date | null;
  readonly iniciadoEm: Date | null;
  readonly concluidoEm: Date | null;
  readonly erroCodigo: string | null;
  readonly erroMensagem: string | null;
  readonly arquivoId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ReportJobError {
  readonly code: string;
  readonly message: string;
}

export interface CreateReportJobInput extends ReportJobScope {
  readonly chaveIdempotencia: string;
  readonly solicitacao: string;
  readonly maxTentativas: number;
  readonly disponivelEm: Date;
}

export interface ClaimReportJobInput {
  readonly now: Date;
  readonly leaseToken: string;
  readonly leaseAte: Date;
}

export interface RecoverExpiredSummary {
  readonly requeued: number;
  readonly failed: number;
}

/**
 * Porta de persistência. Toda transição a partir de RUNNING exige o
 * leaseToken vigente; isso impede que um worker antigo, cujo lease venceu e
 * foi reassumido por outro, sobrescreva o resultado do job.
 */
export interface ReportJobRepositoryPort {
  /** Cria o job ou devolve o existente para a mesma chave de idempotência. */
  createOrGetExisting(
    input: CreateReportJobInput,
  ): Promise<{ readonly job: ReportJobRecord; readonly created: boolean }>;
  findOwned(id: string, scope: ReportJobScope): Promise<ReportJobRecord | null>;
  /** Assume o job se estiver disponível; devolve null se outro worker já o tiver. */
  claim(id: string, input: ClaimReportJobInput): Promise<ReportJobRecord | null>;
  /** IDs de jobs prontos para execução, do mais antigo para o mais novo. */
  findRunnableIds(now: Date, limit: number): Promise<string[]>;
  markDone(
    id: string,
    leaseToken: string,
    arquivoId: string,
    now: Date,
  ): Promise<boolean>;
  scheduleRetry(
    id: string,
    leaseToken: string,
    disponivelEm: Date,
    error: ReportJobError,
  ): Promise<boolean>;
  markFailed(
    id: string,
    leaseToken: string,
    error: ReportJobError,
    now: Date,
  ): Promise<boolean>;
  recoverExpired(now: Date): Promise<RecoverExpiredSummary>;
  findCompanyName(empresaId: string): Promise<string | null>;
}

export type ReportJobViewStatus = "queued" | "running" | "done" | "failed";

/** Representação pública do job, base do contrato da Task 06. */
export interface ReportJobView {
  readonly id: string;
  readonly status: ReportJobViewStatus;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly createdAt: string;
  readonly startedAt: string | null;
  readonly finishedAt: string | null;
  readonly nextAttemptAt: string | null;
  readonly error: ReportJobError | null;
  readonly reportFileId: string | null;
}

export function toReportJobView(job: ReportJobRecord): ReportJobView {
  const isRetryPending = job.status === "QUEUED" && job.tentativas > 0;
  const hasError =
    (job.status === "FAILED" || isRetryPending) &&
    job.erroCodigo !== null &&
    job.erroMensagem !== null;

  return {
    id: job.id,
    status: job.status.toLowerCase() as ReportJobViewStatus,
    attempts: job.tentativas,
    maxAttempts: job.maxTentativas,
    createdAt: job.createdAt.toISOString(),
    startedAt: job.iniciadoEm?.toISOString() ?? null,
    finishedAt: job.concluidoEm?.toISOString() ?? null,
    nextAttemptAt: isRetryPending ? job.disponivelEm.toISOString() : null,
    error: hasError
      ? { code: job.erroCodigo!, message: job.erroMensagem! }
      : null,
    reportFileId: job.status === "DONE" ? job.arquivoId : null,
  };
}

export const GENERIC_JOB_ERROR_MESSAGE =
  "Não foi possível gerar o relatório. Tente novamente mais tarde.";

export interface ClassifiedJobError extends ReportJobError {
  readonly retryable: boolean;
}

/**
 * Erros 4xx da aplicação são permanentes (exceto 429): repetir não muda o
 * resultado. Erros 5xx e erros desconhecidos são tratados como transitórios.
 * Mensagens de erros desconhecidos nunca são persistidas, pois podem conter
 * SQL, dados internos ou detalhes do provedor.
 */
export function classifyJobError(error: unknown): ClassifiedJobError {
  if (error instanceof AppError) {
    const retryable = error.statusCode >= 500 || error.statusCode === 429;
    return {
      code: error.errorCode,
      message: error.message.slice(0, 500),
      retryable,
    };
  }

  return {
    code: "UNEXPECTED_ERROR",
    message: GENERIC_JOB_ERROR_MESSAGE,
    retryable: true,
  };
}

export interface RetryPolicy {
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  baseDelayMs: 30_000,
  maxDelayMs: 10 * 60_000,
};

/** Backoff exponencial: 30 s, 60 s, 120 s... limitado a maxDelayMs. */
export function retryDelayMs(attempt: number, policy: RetryPolicy): number {
  const exponent = Math.max(0, attempt - 1);
  return Math.min(policy.baseDelayMs * 2 ** exponent, policy.maxDelayMs);
}

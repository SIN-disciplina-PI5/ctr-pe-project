import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { ReportJobDispatcher } from "./report-job.dispatcher.js";
import {
  toReportJobView,
  type ReportJobRepositoryPort,
  type ReportJobScope,
  type ReportJobView,
} from "./report-job.types.js";

const DEFAULT_MAX_ATTEMPTS = 3;
const MAX_ATTEMPTS_LIMIT = 10;
const MAX_REQUEST_LENGTH = 2000;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

export interface EnqueueReportJobInput extends ReportJobScope {
  readonly request: string;
  readonly idempotencyKey: string;
}

export interface EnqueueReportJobResult {
  readonly job: ReportJobView;
  /** false quando a chave de idempotência já existia (requisição repetida). */
  readonly created: boolean;
}

export interface ReportJobServiceOptions {
  readonly maxAttempts?: number;
  readonly now?: () => Date;
  readonly logger?: Pick<Console, "error">;
}

export class ReportJobService {
  private readonly maxAttempts: number;
  private readonly now: () => Date;
  private readonly logger: Pick<Console, "error">;

  constructor(
    private readonly repository: ReportJobRepositoryPort,
    private readonly dispatcher: ReportJobDispatcher,
    options: ReportJobServiceOptions = {},
  ) {
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    this.now = options.now ?? (() => new Date());
    this.logger = options.logger ?? console;

    if (
      !Number.isInteger(this.maxAttempts) ||
      this.maxAttempts < 1 ||
      this.maxAttempts > MAX_ATTEMPTS_LIMIT
    ) {
      throw new Error(
        `maxAttempts deve ser um inteiro entre 1 e ${MAX_ATTEMPTS_LIMIT}.`,
      );
    }
  }

  async enqueue(input: EnqueueReportJobInput): Promise<EnqueueReportJobResult> {
    this.validateScope(input);
    const request = input.request.trim();
    const idempotencyKey = input.idempotencyKey.trim();

    if (!request || request.length > MAX_REQUEST_LENGTH) {
      throw new AppError({
        message: `A solicitação do relatório deve ter entre 1 e ${MAX_REQUEST_LENGTH} caracteres.`,
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }
    if (!IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
      throw new AppError({
        message: "A chave de idempotência é inválida.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const { job, created } = await this.repository.createOrGetExisting({
      empresaId: input.empresaId,
      usuarioId: input.usuarioId,
      chaveIdempotencia: idempotencyKey,
      solicitacao: request,
      maxTentativas: this.maxAttempts,
      disponivelEm: this.now(),
    });

    if (!created && job.solicitacao !== request) {
      throw new AppError({
        message:
          "A chave de idempotência já foi usada para outra solicitação de relatório.",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    if (created) {
      try {
        await this.dispatcher.dispatch({ jobId: job.id });
      } catch (error) {
        // O job já está persistido como QUEUED; a varredura o executará.
        this.logger.error(
          JSON.stringify({
            component: "ai.report-jobs",
            event: "dispatch_failed",
            jobId: job.id,
            message: error instanceof Error ? error.message : "Erro desconhecido.",
          }),
        );
      }
    }

    return { job: toReportJobView(job), created };
  }

  async getOwned(id: string, scope: ReportJobScope): Promise<ReportJobView> {
    this.validateScope(scope);
    const job = id.trim() ? await this.repository.findOwned(id, scope) : null;
    if (!job) {
      throw new AppError({
        message: "Relatório não encontrado.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
    return toReportJobView(job);
  }

  private validateScope(scope: ReportJobScope): void {
    if (!scope.empresaId.trim() || !scope.usuarioId.trim()) {
      throw new AppError({
        message: "Empresa e usuário são obrigatórios para acessar relatórios.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }
  }
}

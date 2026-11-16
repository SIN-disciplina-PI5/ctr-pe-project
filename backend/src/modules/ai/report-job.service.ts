import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { ReportFileDownload, ReportFileService } from "./report-file.service.js";
import type { ReportJobDispatcher } from "./report-job.dispatcher.js";
import {
  toReportJobView,
  type ReportJobRepositoryPort,
  type ReportJobScope,
  type ReportJobStatus,
  type ReportJobView,
  type ReportJobViewType,
} from "./report-job.types.js";

const DEFAULT_MAX_ATTEMPTS = 3;
const MAX_ATTEMPTS_LIMIT = 10;
const MAX_REQUEST_LENGTH = 2000;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

const REPORT_TYPE_LABEL: Record<ReportJobViewType, string> = {
  monthly_maintenance: "Relatório mensal de manutenção",
  asset_costs: "Relatório de custos por ativo",
  availability: "Relatório de disponibilidade de ativos",
};

export interface ReportPeriod {
  /** Datas no formato AAAA-MM-DD. */
  readonly start: string;
  readonly end: string;
}

export interface EnqueueReportJobInput extends ReportJobScope {
  /** Texto livre do usuário; opcional quando o tipo é informado. */
  readonly request?: string;
  readonly reportType?: ReportJobViewType;
  readonly period?: ReportPeriod;
  readonly idempotencyKey: string;
}

export interface EnqueueReportJobResult {
  readonly job: ReportJobView;
  /** false quando a chave de idempotência já existia (requisição repetida). */
  readonly created: boolean;
}

export interface ListReportJobsInput {
  readonly status?: Lowercase<ReportJobStatus>;
  readonly page: number;
  readonly pageSize: number;
}

export interface ListReportJobsResult {
  readonly items: ReportJobView[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Há job queued ou running na página: o cliente deve continuar o polling. */
  readonly hasActiveJobs: boolean;
}

export interface ReportJobServiceOptions {
  readonly maxAttempts?: number;
  readonly now?: () => Date;
  readonly logger?: Pick<Console, "error">;
}

/**
 * Monta o pedido enviado ao agente a partir do formulário. O agente planeja
 * o relatório a partir desse texto; tipo e período entram como instruções
 * explícitas para reduzir ambiguidade.
 */
export function composeReportRequest(input: {
  readonly request?: string;
  readonly reportType?: ReportJobViewType;
  readonly period?: ReportPeriod;
}): string {
  const parts: string[] = [];
  if (input.reportType) {
    parts.push(`Tipo de relatório: ${REPORT_TYPE_LABEL[input.reportType]}.`);
  }
  if (input.period) {
    parts.push(`Período: de ${input.period.start} a ${input.period.end}.`);
  }
  const text = input.request?.trim();
  if (text) parts.push(parts.length > 0 ? `Pedido: ${text}` : text);
  return parts.join("\n");
}

export class ReportJobService {
  private readonly maxAttempts: number;
  private readonly now: () => Date;
  private readonly logger: Pick<Console, "error">;

  constructor(
    private readonly repository: ReportJobRepositoryPort,
    private readonly dispatcher: ReportJobDispatcher,
    private readonly files: Pick<ReportFileService, "getDownload">,
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
    const request = composeReportRequest(input);
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

    return { job: toReportJobView(job, this.now()), created };
  }

  async getOwned(id: string, scope: ReportJobScope): Promise<ReportJobView> {
    this.validateScope(scope);
    const job = id.trim() ? await this.repository.findOwned(id, scope) : null;
    if (!job) throw this.notFound();
    return toReportJobView(job, this.now());
  }

  async listOwned(
    scope: ReportJobScope,
    input: ListReportJobsInput,
  ): Promise<ListReportJobsResult> {
    this.validateScope(scope);
    const { items, total } = await this.repository.listOwned(scope, {
      ...(input.status === undefined
        ? {}
        : { status: input.status.toUpperCase() as ReportJobStatus }),
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize,
    });
    const now = this.now();
    const views = items.map((item) => toReportJobView(item, now));

    return {
      items: views,
      total,
      page: input.page,
      pageSize: input.pageSize,
      hasActiveJobs: views.some(
        (view) => view.status === "queued" || view.status === "running",
      ),
    };
  }

  /** Libera o PDF somente para job concluído, do próprio usuário e empresa. */
  async getDownload(
    id: string,
    scope: ReportJobScope,
  ): Promise<ReportFileDownload> {
    const view = await this.getOwned(id, scope);

    if (view.status !== "done") {
      throw new AppError({
        message: "O relatório ainda não está disponível para download.",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
        details: { status: view.status },
      });
    }
    if (view.expired || view.reportFileId === null) {
      throw new AppError({
        message: "O relatório expirou e não está mais disponível.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return this.files.getDownload(view.reportFileId, scope);
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

  private notFound(): AppError {
    return new AppError({
      message: "Relatório não encontrado.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    });
  }
}

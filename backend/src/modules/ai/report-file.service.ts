import { randomUUID } from "node:crypto";
import type { TipoRelatorioIA } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { GeneratedReport } from "./report-agent.service.js";
import type {
  RenderedReportFile,
} from "./report-renderer.service.js";
import type {
  ReportFileRecord,
  ReportFileRepositoryPort,
  ReportFileScope,
} from "./report-file.repository.js";
import type { ReportStorage, StoredReportContent } from "./report-storage.js";

const DEFAULT_RETENTION_DAYS = 30;
const DEFAULT_MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface StoreReportFileInput extends ReportFileScope {
  readonly reportType: GeneratedReport["reportType"];
  readonly title: string;
  readonly file: RenderedReportFile;
}

export interface ReportFileDownload {
  readonly metadata: ReportFileRecord;
  readonly content: StoredReportContent;
}

export interface ReportFileServiceOptions {
  readonly retentionDays?: number;
  readonly maxFileBytes?: number;
  readonly now?: () => Date;
  readonly createId?: () => string;
}

function databaseReportType(
  reportType: GeneratedReport["reportType"],
): TipoRelatorioIA {
  switch (reportType) {
    case "monthly_maintenance":
      return "MANUTENCAO_MENSAL";
    case "asset_costs":
      return "CUSTOS_POR_ATIVO";
    case "availability":
      return "DISPONIBILIDADE";
  }
}

function safePathSegment(value: string, fallback: string): string {
  const sanitized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return sanitized || fallback;
}

function validatePositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} deve ser um inteiro positivo.`);
  }
}

export class ReportFileService {
  private readonly retentionDays: number;
  private readonly maxFileBytes: number;
  private readonly now: () => Date;
  private readonly createId: () => string;

  constructor(
    private readonly storage: ReportStorage,
    private readonly repository: ReportFileRepositoryPort,
    options: ReportFileServiceOptions = {},
  ) {
    this.retentionDays = options.retentionDays ?? DEFAULT_RETENTION_DAYS;
    this.maxFileBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
    this.now = options.now ?? (() => new Date());
    this.createId = options.createId ?? randomUUID;
    validatePositiveInteger(this.retentionDays, "retentionDays");
    validatePositiveInteger(this.maxFileBytes, "maxFileBytes");
  }

  async store(input: StoreReportFileInput): Promise<ReportFileRecord> {
    this.validateScope(input);
    this.validateFile(input.file);

    const now = this.now();
    const expiresAt = new Date(now);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + this.retentionDays);
    const filename = safePathSegment(input.file.filename, "relatorio.pdf");
    const pathname = [
      "reports",
      safePathSegment(input.empresaId, "empresa"),
      safePathSegment(input.usuarioId, "usuario"),
      safePathSegment(this.createId(), "arquivo"),
      filename.endsWith(".pdf") ? filename : `${filename}.pdf`,
    ].join("/");

    const uploaded = await this.storage.upload({
      pathname,
      bytes: input.file.bytes,
      contentType: "application/pdf",
    });

    try {
      return await this.repository.create({
        empresaId: input.empresaId,
        usuarioId: input.usuarioId,
        tipo: databaseReportType(input.reportType),
        titulo: input.title.trim(),
        nomeArquivo: filename,
        storagePathname: uploaded.pathname,
        contentType: uploaded.contentType,
        tamanhoBytes: input.file.bytes.byteLength,
        expiresAt,
      });
    } catch (error) {
      try {
        await this.storage.delete(uploaded.pathname);
      } catch {
        // A falha original do banco deve ser preservada para o tratamento global.
      }
      throw error;
    }
  }

  async getDownload(
    id: string,
    scope: ReportFileScope,
  ): Promise<ReportFileDownload> {
    this.validateScope(scope);
    if (!id.trim()) throw this.notFound();

    const metadata = await this.repository.findOwned(id, scope);
    if (!metadata || metadata.expiresAt.getTime() <= this.now().getTime()) {
      throw this.notFound();
    }

    const content = await this.storage.get(metadata.storagePathname);
    if (!content) throw this.notFound();
    return { metadata, content };
  }

  private validateScope(scope: ReportFileScope): void {
    if (!scope.empresaId.trim() || !scope.usuarioId.trim()) {
      throw new AppError({
        message: "Empresa e usuário são obrigatórios para acessar relatórios.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }
  }

  private validateFile(file: RenderedReportFile): void {
    if (file.contentType !== "application/pdf" || file.bytes.byteLength === 0) {
      throw new AppError({
        message: "O arquivo do relatório é inválido.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }
    if (file.bytes.byteLength > this.maxFileBytes) {
      throw new AppError({
        message: "O arquivo do relatório excede o tamanho permitido.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
        details: { maxFileBytes: this.maxFileBytes },
      });
    }
    if (!file.filename.trim() || !file.filename.toLowerCase().endsWith(".pdf")) {
      throw new AppError({
        message: "O nome do arquivo do relatório é inválido.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
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


import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type {
  CreateReportJobInput,
  ReportJobRecord,
  ReportJobRepositoryPort,
  ReportJobScope,
} from "./report-job.repository.js";

export interface CreateOrGetReportJobResult {
  readonly job: ReportJobRecord;
  readonly created: boolean;
}

export class ReportJobService {
  constructor(
    private readonly repository: ReportJobRepositoryPort,
  ) {}

  async createOrGet(
    input: CreateReportJobInput,
  ): Promise<CreateOrGetReportJobResult> {
    this.validateScope(input);

    const solicitacao = input.solicitacao.trim();
    const idempotencyKey = input.idempotencyKey.trim();

    if (!solicitacao || !idempotencyKey) {
      throw new AppError({
        message: "Solicitação e chave de idempotência são obrigatórias.",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const normalizedInput = {
      ...input,
      solicitacao,
      idempotencyKey,
    };

    const existing = await this.repository.findByIdempotencyKey(
      input,
      idempotencyKey,
    );

    if (existing) {
      return this.resolveExisting(existing, solicitacao);
    }

    try {
      const job = await this.repository.create(normalizedInput);
      return { job, created: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const duplicated = await this.repository.findByIdempotencyKey(
          input,
          idempotencyKey,
        );

        if (duplicated) {
          return this.resolveExisting(duplicated, solicitacao);
        }
      }

      throw error;
    }
  }

  async getOwned(
    id: string,
    scope: ReportJobScope,
  ): Promise<ReportJobRecord> {
    this.validateScope(scope);

    const job = await this.repository.findOwned(id, scope);

    if (!job) {
      throw this.notFound();
    }

    return job;
  }

  private resolveExisting(
    job: ReportJobRecord,
    solicitacao: string,
  ): CreateOrGetReportJobResult {
    if (job.solicitacao !== solicitacao) {
      throw new AppError({
        message:
          "Esta chave de idempotência já foi utilizada com outra solicitação.",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    return { job, created: false };
  }

  private validateScope(scope: ReportJobScope): void {
    if (!scope.empresaId.trim() || !scope.usuarioId.trim()) {
      throw new AppError({
        message: "Empresa e usuário são obrigatórios.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }
  }

  private notFound(): AppError {
    return new AppError({
      message: "Job de relatório não encontrado.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    });
  }
}

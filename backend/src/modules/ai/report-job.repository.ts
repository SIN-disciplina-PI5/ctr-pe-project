import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";
import type {
  ClaimReportJobInput,
  CreateReportJobInput,
  ListOwnedReportJobsInput,
  RecoverExpiredSummary,
  ReportJobDetails,
  ReportJobError,
  ReportJobRecord,
  ReportJobRepositoryPort,
  ReportJobScope,
} from "./report-job.types.js";

const LEASE_EXPIRED_CODE = "LEASE_EXPIRED";
const LEASE_EXPIRED_MESSAGE =
  "A geração do relatório excedeu o tempo de execução.";

const reportJobSelect = {
  id: true,
  empresaId: true,
  usuarioId: true,
  chaveIdempotencia: true,
  solicitacao: true,
  status: true,
  tentativas: true,
  maxTentativas: true,
  disponivelEm: true,
  leaseToken: true,
  leaseAte: true,
  iniciadoEm: true,
  concluidoEm: true,
  erroCodigo: true,
  erroMensagem: true,
  arquivoId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.JobRelatorioIASelect;

const reportJobDetailsSelect = {
  ...reportJobSelect,
  arquivo: {
    select: {
      titulo: true,
      tipo: true,
      tamanhoBytes: true,
      expiresAt: true,
    },
  },
} satisfies Prisma.JobRelatorioIASelect;

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * Todas as transições usam updateMany com o estado esperado no WHERE. No
 * PostgreSQL (READ COMMITTED) o WHERE é reavaliado após o lock da linha, então
 * dois workers concorrentes nunca assumem o mesmo job.
 */
export class ReportJobRepository implements ReportJobRepositoryPort {
  async createOrGetExisting(
    input: CreateReportJobInput,
  ): Promise<{ job: ReportJobRecord; created: boolean }> {
    try {
      const job = await prisma.jobRelatorioIA.create({
        data: {
          empresaId: input.empresaId,
          usuarioId: input.usuarioId,
          chaveIdempotencia: input.chaveIdempotencia,
          solicitacao: input.solicitacao,
          maxTentativas: input.maxTentativas,
          disponivelEm: input.disponivelEm,
        },
        select: reportJobSelect,
      });
      return { job, created: true };
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;

      const existing = await prisma.jobRelatorioIA.findUnique({
        where: {
          empresaId_usuarioId_chaveIdempotencia: {
            empresaId: input.empresaId,
            usuarioId: input.usuarioId,
            chaveIdempotencia: input.chaveIdempotencia,
          },
        },
        select: reportJobSelect,
      });
      if (!existing) throw error;
      return { job: existing, created: false };
    }
  }

  async findOwned(
    id: string,
    scope: ReportJobScope,
  ): Promise<ReportJobDetails | null> {
    return prisma.jobRelatorioIA.findFirst({
      where: { id, empresaId: scope.empresaId, usuarioId: scope.usuarioId },
      select: reportJobDetailsSelect,
    });
  }

  async listOwned(
    scope: ReportJobScope,
    input: ListOwnedReportJobsInput,
  ): Promise<{ items: ReportJobDetails[]; total: number }> {
    const where = {
      empresaId: scope.empresaId,
      usuarioId: scope.usuarioId,
      ...(input.status === undefined ? {} : { status: input.status }),
    } satisfies Prisma.JobRelatorioIAWhereInput;

    const [items, total] = await prisma.$transaction([
      prisma.jobRelatorioIA.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: input.skip,
        take: input.take,
        select: reportJobDetailsSelect,
      }),
      prisma.jobRelatorioIA.count({ where }),
    ]);
    return { items, total };
  }

  async claim(
    id: string,
    input: ClaimReportJobInput,
  ): Promise<ReportJobRecord | null> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: {
        id,
        status: "QUEUED",
        disponivelEm: { lte: input.now },
        tentativas: { lt: prisma.jobRelatorioIA.fields.maxTentativas },
      },
      data: {
        status: "RUNNING",
        tentativas: { increment: 1 },
        leaseToken: input.leaseToken,
        leaseAte: input.leaseAte,
        iniciadoEm: input.now,
      },
    });
    if (result.count !== 1) return null;

    return prisma.jobRelatorioIA.findFirst({
      where: { id, leaseToken: input.leaseToken },
      select: reportJobSelect,
    });
  }

  async findRunnableIds(now: Date, limit: number): Promise<string[]> {
    const jobs = await prisma.jobRelatorioIA.findMany({
      where: {
        status: "QUEUED",
        disponivelEm: { lte: now },
        tentativas: { lt: prisma.jobRelatorioIA.fields.maxTentativas },
      },
      orderBy: [{ disponivelEm: "asc" }, { id: "asc" }],
      take: limit,
      select: { id: true },
    });
    return jobs.map((job) => job.id);
  }

  async markDone(
    id: string,
    leaseToken: string,
    arquivoId: string,
    now: Date,
  ): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: { id, status: "RUNNING", leaseToken },
      data: {
        status: "DONE",
        arquivoId,
        concluidoEm: now,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: null,
        erroMensagem: null,
      },
    });
    return result.count === 1;
  }

  async scheduleRetry(
    id: string,
    leaseToken: string,
    disponivelEm: Date,
    error: ReportJobError,
  ): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: { id, status: "RUNNING", leaseToken },
      data: {
        status: "QUEUED",
        disponivelEm,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: error.code,
        erroMensagem: error.message,
      },
    });
    return result.count === 1;
  }

  async markFailed(
    id: string,
    leaseToken: string,
    error: ReportJobError,
    now: Date,
  ): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: { id, status: "RUNNING", leaseToken },
      data: {
        status: "FAILED",
        concluidoEm: now,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: error.code,
        erroMensagem: error.message,
      },
    });
    return result.count === 1;
  }

  async recoverExpired(now: Date): Promise<RecoverExpiredSummary> {
    const maxTentativas = prisma.jobRelatorioIA.fields.maxTentativas;

    const failed = await prisma.jobRelatorioIA.updateMany({
      where: {
        status: "RUNNING",
        leaseAte: { lt: now },
        tentativas: { gte: maxTentativas },
      },
      data: {
        status: "FAILED",
        concluidoEm: now,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: LEASE_EXPIRED_CODE,
        erroMensagem: LEASE_EXPIRED_MESSAGE,
      },
    });

    const requeued = await prisma.jobRelatorioIA.updateMany({
      where: {
        status: "RUNNING",
        leaseAte: { lt: now },
        tentativas: { lt: maxTentativas },
      },
      data: {
        status: "QUEUED",
        disponivelEm: now,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: LEASE_EXPIRED_CODE,
        erroMensagem: LEASE_EXPIRED_MESSAGE,
      },
    });

    return { requeued: requeued.count, failed: failed.count };
  }

  async findCompanyName(empresaId: string): Promise<string | null> {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { nome: true },
    });
    return empresa?.nome ?? null;
  }
}

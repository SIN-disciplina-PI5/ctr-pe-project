
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";

export interface ReportJobScope {
  readonly empresaId: string;
  readonly usuarioId: string;
}

export interface CreateReportJobInput extends ReportJobScope {
  readonly solicitacao: string;
  readonly idempotencyKey: string;
}

const reportJobSelect = {
  id: true,
  empresaId: true,
  usuarioId: true,
  solicitacao: true,
  idempotencyKey: true,
  status: true,
  tentativas: true,
  triggerRunId: true,
  erro: true,
  arquivoRelatorioIAId: true,
  createdAt: true,
  updatedAt: true,
  startedAt: true,
  finishedAt: true,
} satisfies Prisma.JobRelatorioIASelect;

export type ReportJobRecord = Prisma.JobRelatorioIAGetPayload<{
  select: typeof reportJobSelect;
}>;

export interface ReportJobRepositoryPort {
  create(input: CreateReportJobInput): Promise<ReportJobRecord>;

  findById(id: string): Promise<ReportJobRecord | null>;

  findByIdempotencyKey(
    scope: ReportJobScope,
    idempotencyKey: string,
  ): Promise<ReportJobRecord | null>;

  findOwned(
    id: string,
    scope: ReportJobScope,
  ): Promise<ReportJobRecord | null>;

  markRunning(id: string, triggerRunId: string): Promise<boolean>;

  markDone(id: string, arquivoRelatorioIAId: string): Promise<boolean>;

  markFailed(id: string, error: string): Promise<boolean>;
}

export class ReportJobRepository implements ReportJobRepositoryPort {
  async create(input: CreateReportJobInput): Promise<ReportJobRecord> {
    return prisma.jobRelatorioIA.create({
      data: {
        ...input,
        status: "QUEUED",
      },
      select: reportJobSelect,
    });
  }

  async findById(id: string): Promise<ReportJobRecord | null> {
    return prisma.jobRelatorioIA.findUnique({
      where: { id },
      select: reportJobSelect,
    });
  }

  async findByIdempotencyKey(
    scope: ReportJobScope,
    idempotencyKey: string,
  ): Promise<ReportJobRecord | null> {
    return prisma.jobRelatorioIA.findFirst({
      where: {
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
        idempotencyKey,
      },
      select: reportJobSelect,
    });
  }

  async findOwned(
    id: string,
    scope: ReportJobScope,
  ): Promise<ReportJobRecord | null> {
    return prisma.jobRelatorioIA.findFirst({
      where: {
        id,
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
      },
      select: reportJobSelect,
    });
  }

  async markRunning(id: string, triggerRunId: string): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: {
        id,
        status: { in: ["QUEUED", "RUNNING"] },
      },
      data: {
        status: "RUNNING",
        tentativas: { increment: 1 },
        triggerRunId,
        startedAt: new Date(),
        finishedAt: null,
        erro: null,
      },
    });

    return result.count === 1;
  }

  async markDone(
    id: string,
    arquivoRelatorioIAId: string,
  ): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: {
        id,
        status: "RUNNING",
      },
      data: {
        status: "DONE",
        arquivoRelatorioIAId,
        finishedAt: new Date(),
        erro: null,
      },
    });

    return result.count === 1;
  }

  async markFailed(id: string, error: string): Promise<boolean> {
    const result = await prisma.jobRelatorioIA.updateMany({
      where: {
        id,
        status: "RUNNING",
      },
      data: {
        status: "FAILED",
        erro: error.slice(0, 5000),
        finishedAt: new Date(),
      },
    });

    return result.count === 1;
  }
}

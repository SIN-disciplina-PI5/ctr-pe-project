import { Prisma, type TipoRelatorioIA } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";

export interface ReportFileScope {
  readonly empresaId: string;
  readonly usuarioId: string;
}

export interface CreateReportFileInput extends ReportFileScope {
  readonly tipo: TipoRelatorioIA;
  readonly titulo: string;
  readonly nomeArquivo: string;
  readonly storagePathname: string;
  readonly contentType: string;
  readonly tamanhoBytes: number;
  readonly expiresAt: Date;
}

const reportFileSelect = {
  id: true,
  empresaId: true,
  usuarioId: true,
  tipo: true,
  titulo: true,
  nomeArquivo: true,
  storagePathname: true,
  contentType: true,
  tamanhoBytes: true,
  createdAt: true,
  expiresAt: true,
} satisfies Prisma.ArquivoRelatorioIASelect;

export type ReportFileRecord = Prisma.ArquivoRelatorioIAGetPayload<{
  select: typeof reportFileSelect;
}>;

export interface ReportFileRepositoryPort {
  create(input: CreateReportFileInput): Promise<ReportFileRecord>;
  findOwned(id: string, scope: ReportFileScope): Promise<ReportFileRecord | null>;
  findExpired(expiresBefore: Date, limit: number): Promise<ReportFileRecord[]>;
  deleteExpired(id: string, expiresBefore: Date): Promise<boolean>;
}

export class ReportFileRepository implements ReportFileRepositoryPort {
  async create(input: CreateReportFileInput): Promise<ReportFileRecord> {
    return prisma.arquivoRelatorioIA.create({
      data: input,
      select: reportFileSelect,
    });
  }

  async findOwned(
    id: string,
    scope: ReportFileScope,
  ): Promise<ReportFileRecord | null> {
    return prisma.arquivoRelatorioIA.findFirst({
      where: {
        id,
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
      },
      select: reportFileSelect,
    });
  }

  async findExpired(
    expiresBefore: Date,
    limit: number,
  ): Promise<ReportFileRecord[]> {
    return prisma.arquivoRelatorioIA.findMany({
      where: { expiresAt: { lte: expiresBefore } },
      orderBy: [{ expiresAt: "asc" }, { id: "asc" }],
      take: limit,
      select: reportFileSelect,
    });
  }

  async deleteExpired(id: string, expiresBefore: Date): Promise<boolean> {
    const result = await prisma.arquivoRelatorioIA.deleteMany({
      where: { id, expiresAt: { lte: expiresBefore } },
    });
    return result.count === 1;
  }
}

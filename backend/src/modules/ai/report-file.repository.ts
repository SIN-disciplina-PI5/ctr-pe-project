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
}

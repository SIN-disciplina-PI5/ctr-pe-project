import { prisma } from "../../prisma/prisma.client.js";
import { Prisma } from "@prisma/client";

interface CreateApontamentoData {
  ordemServicoId: string;
  usuarioId: string;
  inicioEm: Date;
  descricao?: string;
  custoHora?: number;
}

interface UpdateApontamentoData {
  inicioEm?: Date;
  fimEm?: Date;
  descricao?: string;
  custoHora?: Prisma.Decimal;
  duracaoMinutos?: number;
  custoTotal?: Prisma.Decimal;
}

const apontamentoSelect = {
  id: true,
  ordemServicoId: true,
  usuarioId: true,
  inicioEm: true,
  fimEm: true,
  duracaoMinutos: true,
  descricao: true,
  custoHora: true,
  custoTotal: true,
  createdAt: true,
  updatedAt: true,
};

export class ApontamentosOSRepository {
  async findByOrdemServico(ordemServicoId: string) {
    return prisma.apontamentoOS.findMany({
      where: { ordemServicoId },
      select: apontamentoSelect,
      orderBy: { inicioEm: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.apontamentoOS.findUnique({
      where: { id },
      select: apontamentoSelect,
    });
  }

  async findAbertoPorUsuario(usuarioId: string) {
    return prisma.apontamentoOS.findFirst({
      where: { usuarioId, fimEm: null },
      select: { id: true },
    });
  }

  async create(data: CreateApontamentoData) {
    return prisma.apontamentoOS.create({
      data: {
        ordemServicoId: data.ordemServicoId,
        usuarioId: data.usuarioId,
        inicioEm: data.inicioEm,
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.custoHora !== undefined && {
          custoHora: new Prisma.Decimal(data.custoHora),
        }),
      },
      select: apontamentoSelect,
    });
  }

  async update(id: string, data: UpdateApontamentoData) {
    return prisma.apontamentoOS.update({
      where: { id },
      data,
      select: apontamentoSelect,
    });
  }

  async encerrar(id: string, fimEm: Date, duracaoMinutos: number, custoTotal: Prisma.Decimal | null) {
    return prisma.$transaction(async (tx) => {
      const apontamento = await tx.apontamentoOS.findUniqueOrThrow({
        where: { id },
        select: { ordemServicoId: true },
      });

      const updated = await tx.apontamentoOS.update({
        where: { id },
        data: {
          fimEm,
          duracaoMinutos,
          ...(custoTotal !== null && { custoTotal }),
        },
        select: apontamentoSelect,
      });

      await this.recalcularCustoMaoObra(tx, apontamento.ordemServicoId);

      return updated;
    });
  }

  async delete(id: string, ordemServicoId: string) {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.apontamentoOS.delete({
        where: { id },
        select: { id: true },
      });

      await this.recalcularCustoMaoObra(tx, ordemServicoId);

      return deleted;
    });
  }

  private async recalcularCustoMaoObra(
    tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    ordemServicoId: string
  ) {
    const apontamentos = await tx.apontamentoOS.findMany({
      where: { ordemServicoId, fimEm: { not: null } },
      select: { custoTotal: true },
    });

    const custoMaoObra = apontamentos.reduce(
      (acc, a) => acc.plus(a.custoTotal ?? new Prisma.Decimal(0)),
      new Prisma.Decimal(0)
    );

    const os = await tx.ordemServico.findUniqueOrThrow({
      where: { id: ordemServicoId },
      select: { custoMateriais: true },
    });

    const custoTotal = custoMaoObra.plus(os.custoMateriais);

    await tx.ordemServico.update({
      where: { id: ordemServicoId },
      data: { custoMaoObra, custoTotal },
    });
  }
}
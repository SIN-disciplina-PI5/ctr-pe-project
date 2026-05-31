import { prisma } from "../../prisma/prisma.client.js";

export class DashboardRepository {
  async countOsAbertas(empresaId: string) {
    return prisma.ordemServico.count({
      where: { empresaId, status: "ABERTA" },
    });
  }

  async countOsAguardandoPeca(empresaId: string) {
    return prisma.ordemServico.count({
      where: { empresaId, status: "AGUARDANDO_PECA" },
    });
  }

  async countOsAtrasadas(empresaId: string, agora: Date) {
    return prisma.ordemServico.count({
      where: {
        empresaId,
        status: { notIn: ["ENCERRADA", "CANCELADA"] },
        prazoEm: { lt: agora },
      },
    });
  }

  async countMaquinasParadas(empresaId: string) {
    return prisma.ativo.count({
      where: { empresaId, status: "PARADO" },
    });
  }

  async aggregateCustos(empresaId: string) {
    const result = await prisma.ordemServico.aggregate({
      _sum: {
        custoMateriais: true,
        custoMaoObra: true,
        custoTotal: true,
      },
      where: { empresaId },
    });

    return {
      custoMateriais: Number(result._sum.custoMateriais || 0),
      custoMaoObra: Number(result._sum.custoMaoObra || 0),
      custoTotal: Number(result._sum.custoTotal || 0),
    };
  }

  async aggregateTempoParado(empresaId: string) {
    const result = await prisma.paradaAtivo.aggregate({
      _avg: {
        duracaoMinutos: true,
      },
      where: { empresaId, status: "ENCERRADA" },
    });

    return Math.round(result._avg.duracaoMinutos || 0);
  }

  async getAtivosAgrupados(empresaId: string) {
    const porStatus = await prisma.ativo.groupBy({
      by: ["status"],
      where: { empresaId },
      _count: true,
    });

    const porCriticidade = await prisma.ativo.groupBy({
      by: ["criticidade"],
      where: { empresaId },
      _count: true,
    });

    return { porStatus, porCriticidade };
  }

  async getOsAgrupadas(empresaId: string) {
    const porTipo = await prisma.ordemServico.groupBy({
      by: ["tipo"],
      where: { empresaId },
      _count: true,
    });

    const porPrioridade = await prisma.ordemServico.groupBy({
      by: ["prioridade"],
      where: { empresaId },
      _count: true,
    });

    return { porTipo, porPrioridade };
  }

  async getMateriaisCriticos(empresaId: string) {
    return prisma.material.findMany({
      where: {
        empresaId,
        ativo: true,
        AND: [
          {
            estoqueAtual: {
              lt: prisma.material.fields.estoqueMinimo,
            },
          },
        ],
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
      take: 5,
    });
  }
}
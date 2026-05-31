import { prisma } from "../../prisma/prisma.client.js";

interface CreateEstoqueBaixoAlertaData {
  empresaId: string;
  materialId: string;
  materialCodigo: string;
  materialNome: string;
  estoqueAtual: string;
  estoqueMinimo: string;
}

interface FindAllAlertasFilters {
  empresaId?: string;
  status?: string;
  tipo?: string;
}

export class AlertasRepository {
  async findAll(filters: FindAllAlertasFilters) {
    return prisma.alerta.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.status !== undefined && { status: filters.status as any }),
        ...(filters.tipo !== undefined && { tipo: filters.tipo as any }),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        empresaId: true,
        tipo: true,
        severidade: true,
        status: true,
        titulo: true,
        mensagem: true,
        createdAt: true,
      },
    });
  }

  async findEstoqueBaixoAbertoPorMaterial(materialId: string) {
    return prisma.alerta.findFirst({
      where: {
        tipo: "ESTOQUE_BAIXO",
        status: {
          in: ["ABERTO", "LIDO"],
        },
        mensagem: {
          contains: materialId,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async createEstoqueBaixo(data: CreateEstoqueBaixoAlertaData) {
    const alertaExistente = await this.findEstoqueBaixoAbertoPorMaterial(
      data.materialId
    );

    if (alertaExistente) {
      return alertaExistente;
    }

    return prisma.alerta.create({
      data: {
        empresaId: data.empresaId,
        tipo: "ESTOQUE_BAIXO",
        severidade: "ALTA",
        status: "ABERTO",
        titulo: `Estoque baixo: ${data.materialNome}`,
        mensagem:
          `Material ${data.materialNome} (${data.materialCodigo}) ` +
          `está com estoque baixo. ` +
          `Estoque atual: ${data.estoqueAtual}. ` +
          `Estoque mínimo: ${data.estoqueMinimo}. ` +
          `materialId=${data.materialId}`,
      },
      select: {
        id: true,
        tipo: true,
        status: true,
        titulo: true,
        mensagem: true,
        createdAt: true,
      },
    });
  }
}
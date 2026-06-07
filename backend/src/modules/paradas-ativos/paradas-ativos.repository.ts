import { prisma } from "../../prisma/prisma.client.js";

interface CreateParadaAtivoData {
  empresaId: string;
  ativoId: string;
  ordemServicoId?: string;
  inicioEm?: Date;
  motivo?: string;
  programada?: boolean;
  impactaDisponibilidade?: boolean;
}

interface UpdateParadaAtivoData {
  motivo?: string;
  programada?: boolean;
  impactaDisponibilidade?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  ativoId?: string;
  status?: "ABERTA" | "ENCERRADA" | "CANCELADA";
  from?: Date;
  to?: Date;
}

const paradaSelect = {
  id: true,
  empresaId: true,
  ativoId: true,
  ordemServicoId: true,
  status: true,
  inicioEm: true,
  fimEm: true,
  duracaoMinutos: true,
  motivo: true,
  programada: true,
  impactaDisponibilidade: true,
  createdAt: true,
  ativo: {
    select: {
      id: true,
      codigo: true,
      nome: true,
      status: true,
    },
  },
};

export class ParadasAtivosRepository {
  async findAll(filters: FindAllFilters) {
    return prisma.paradaAtivo.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.ativoId !== undefined && { ativoId: filters.ativoId }),
        ...(filters.status !== undefined && { status: filters.status }),
        ...(filters.from !== undefined || filters.to !== undefined
          ? {
              inicioEm: {
                ...(filters.from !== undefined && { gte: filters.from }),
                ...(filters.to !== undefined && { lte: filters.to }),
              },
            }
          : {}),
      },
      orderBy: { inicioEm: "desc" },
      select: paradaSelect,
    });
  }

  async findById(id: string) {
    return prisma.paradaAtivo.findUnique({
      where: { id },
      select: paradaSelect,
    });
  }

  async findParadaAbertaByAtivo(ativoId: string) {
    return prisma.paradaAtivo.findFirst({
      where: { ativoId, status: "ABERTA" },
      select: { id: true },
    });
  }

  async create(data: CreateParadaAtivoData) {
    return prisma.paradaAtivo.create({
      data: {
        empresaId: data.empresaId,
        ativoId: data.ativoId,
        ...(data.ordemServicoId !== undefined && { ordemServicoId: data.ordemServicoId }),
        ...(data.inicioEm !== undefined && { inicioEm: data.inicioEm }),
        ...(data.motivo !== undefined && { motivo: data.motivo }),
        ...(data.programada !== undefined && { programada: data.programada }),
        ...(data.impactaDisponibilidade !== undefined && { impactaDisponibilidade: data.impactaDisponibilidade }),
      },
      select: paradaSelect,
    });
  }

  async update(id: string, data: UpdateParadaAtivoData) {
    return prisma.paradaAtivo.update({
      where: { id },
      data,
      select: paradaSelect,
    });
  }

  async encerrar(id: string, fimEm: Date) {
    const parada = await prisma.paradaAtivo.findUniqueOrThrow({
      where: { id },
      select: { inicioEm: true },
    });

    const duracaoMinutos = Math.round((fimEm.getTime() - parada.inicioEm.getTime()) / 60000);

    return prisma.paradaAtivo.update({
      where: { id },
      data: { status: "ENCERRADA", fimEm, duracaoMinutos },
      select: paradaSelect,
    });
  }

  async cancelar(id: string, motivo?: string) {
    return prisma.paradaAtivo.update({
      where: { id },
      data: {
        status: "CANCELADA",
        ...(motivo !== undefined && { motivo }),
      },
      select: paradaSelect,
    });
  }

  async findAtivoById(id: string) {
  return prisma.ativo.findUnique({
    where: { id },
    select: {
      id: true,
      empresaId: true,
      ativo: true,
    },
  });
}

async findOrdemServicoById(id: string) {
  return prisma.ordemServico.findUnique({
    where: { id },
    select: {
      id: true,
      empresaId: true,
      ativoId: true,
    },
  });
}
}
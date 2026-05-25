import { prisma } from "../../prisma/prisma.client.js";
import { aplicarImpactoDisponibilidade } from "./ordens-servico.workflow.js";

interface CreateOrdemServicoData {
  empresaId: string;
  localizacaoId?: string;
  ativoId: string;

  solicitanteId?: string;
  responsavelId?: string;

  numero: string;
  titulo: string;
  descricao: string;

  tipo?: "CORRETIVA" | "PREVENTIVA" | "INSPECAO" | "OUTRA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

  impactaDisponibilidade: boolean;

  prazoEm?: Date;

  diagnostico?: string;
  solucao?: string;
  observacao?: string;
}

interface UpdateOrdemServicoData {
  localizacaoId?: string | null;
  solicitanteId?: string | null;
  responsavelId?: string | null;

  titulo?: string;
  descricao?: string;

  tipo?: "CORRETIVA" | "PREVENTIVA" | "INSPECAO" | "OUTRA";
  status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

  impactaDisponibilidade?: boolean;

  prazoEm?: Date | null;

  diagnostico?: string | null;
  solucao?: string | null;
  observacao?: string | null;
}

interface FindAllFilters {
  empresaId?: string;
  ativoId?: string;
  responsavelId?: string;
  status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  search?: string;
}

const ordemServicoSelect = {
  id: true,
  empresaId: true,
  localizacaoId: true,
  ativoId: true,
  solicitanteId: true,
  responsavelId: true,
  numero: true,
  titulo: true,
  descricao: true,
  tipo: true,
  status: true,
  prioridade: true,
  impactaDisponibilidade: true,
  abertaEm: true,
  iniciadaEm: true,
  encerradaEm: true,
  canceladaEm: true,
  prazoEm: true,
  diagnostico: true,
  solucao: true,
  observacao: true,
  createdAt: true,
  updatedAt: true,
  ativo: {
    select: {
      id: true,
      codigo: true,
      nome: true,
      status: true,
    },
  },
  solicitante: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
  responsavel: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
};

export class OrdensServicoRepository {
  async findAll(filters: FindAllFilters) {
    return prisma.ordemServico.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.ativoId !== undefined && { ativoId: filters.ativoId }),
        ...(filters.responsavelId !== undefined && {
          responsavelId: filters.responsavelId,
        }),
        ...(filters.status !== undefined && { status: filters.status }),
        ...(filters.prioridade !== undefined && { prioridade: filters.prioridade }),
        ...(filters.search && {
          OR: [
            { numero: { contains: filters.search, mode: "insensitive" } },
            { titulo: { contains: filters.search, mode: "insensitive" } },
            { descricao: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        abertaEm: "desc",
      },
      select: ordemServicoSelect,
    });
  }

  async findById(id: string) {
    return prisma.ordemServico.findUnique({
      where: { id },
      select: {
        ...ordemServicoSelect,
        paradas: {
          select: {
            id: true,
            status: true,
            inicioEm: true,
            fimEm: true,
            duracaoMinutos: true,
            motivo: true,
            impactaDisponibilidade: true,
          },
          orderBy: {
            inicioEm: "desc",
          },
        },
      },
    });
  }

  async findByNumero(empresaId: string, numero: string) {
    return prisma.ordemServico.findUnique({
      where: {
        empresaId_numero: {
          empresaId,
          numero,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findAtivoById(id: string) {
    return prisma.ativo.findUnique({
      where: { id },
      select: {
        id: true,
        empresaId: true,
        status: true,
        ativo: true,
      },
    });
  }

  async create(data: CreateOrdemServicoData) {
    return prisma.$transaction(async (tx) => {
      const ordemServico = await tx.ordemServico.create({
        data: {
          empresaId: data.empresaId,
          ativoId: data.ativoId,
          numero: data.numero,
          titulo: data.titulo,
          descricao: data.descricao,
          impactaDisponibilidade: data.impactaDisponibilidade,

          ...(data.localizacaoId !== undefined && {
            localizacaoId: data.localizacaoId,
          }),
          ...(data.solicitanteId !== undefined && {
            solicitanteId: data.solicitanteId,
          }),
          ...(data.responsavelId !== undefined && {
            responsavelId: data.responsavelId,
          }),
          ...(data.tipo !== undefined && { tipo: data.tipo }),
          ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
          ...(data.prazoEm !== undefined && { prazoEm: data.prazoEm }),
          ...(data.diagnostico !== undefined && { diagnostico: data.diagnostico }),
          ...(data.solucao !== undefined && { solucao: data.solucao }),
          ...(data.observacao !== undefined && { observacao: data.observacao }),
        },
        select: {
          id: true,
          empresaId: true,
          ativoId: true,
          numero: true,
          titulo: true,
          tipo: true,
        },
      });

      if (data.impactaDisponibilidade) {
        await aplicarImpactoDisponibilidade(tx, ordemServico);
      }

      return tx.ordemServico.findUniqueOrThrow({
        where: {
          id: ordemServico.id,
        },
        select: ordemServicoSelect,
      });
    });
  }

  async update(id: string, data: UpdateOrdemServicoData) {
    return prisma.ordemServico.update({
      where: { id },
      data,
      select: ordemServicoSelect,
    });
  }
}
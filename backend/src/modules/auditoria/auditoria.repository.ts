import { Prisma } from "@prisma/client";
import type { TipoAcaoAuditoria } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";

interface CreateLogAuditoriaData {
  entidade: string;
  entidadeId: string;
  acao: TipoAcaoAuditoria;
  empresaId?: string | null;
  usuarioId?: string | null;
  antes?: unknown;
  depois?: unknown;
}

interface FindAllFilters {
  empresaId?: string;
  usuarioId?: string;
  entidade?: string;
  entidadeId?: string;
  acao?: TipoAcaoAuditoria;
  limit?: number;
}

const auditoriaSelect = {
  id: true,
  empresaId: true,
  usuarioId: true,
  entidade: true,
  entidadeId: true,
  acao: true,
  antes: true,
  depois: true,
  createdAt: true,
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
    },
  },
} satisfies Prisma.LogAuditoriaSelect;

export class AuditoriaRepository {
  async create(data: CreateLogAuditoriaData) {
    return prisma.logAuditoria.create({
      data: {
        entidade: data.entidade,
        entidadeId: data.entidadeId,
        acao: data.acao,
        ...(data.empresaId != null && { empresaId: data.empresaId }),
        ...(data.usuarioId != null && { usuarioId: data.usuarioId }),
        ...(data.antes !== undefined && {
          antes: data.antes as Prisma.InputJsonValue,
        }),
        ...(data.depois !== undefined && {
          depois: data.depois as Prisma.InputJsonValue,
        }),
      },
      select: { id: true },
    });
  }

  async findAll(filters: FindAllFilters) {
    return prisma.logAuditoria.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.usuarioId !== undefined && { usuarioId: filters.usuarioId }),
        ...(filters.entidade !== undefined && { entidade: filters.entidade }),
        ...(filters.entidadeId !== undefined && { entidadeId: filters.entidadeId }),
        ...(filters.acao !== undefined && { acao: filters.acao }),
      },
      orderBy: { createdAt: "desc" },
      take: filters.limit ?? 100,
      select: auditoriaSelect,
    });
  }

  async findById(id: string) {
    return prisma.logAuditoria.findUnique({
      where: { id },
      select: auditoriaSelect,
    });
  }
}

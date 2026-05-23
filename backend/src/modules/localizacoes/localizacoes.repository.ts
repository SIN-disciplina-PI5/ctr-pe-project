import { prisma } from "../../prisma/prisma.client.js";

interface CreateLocalizacaoData {
  empresaId: string;
  codigo?: string;
  nome: string;
  tipo?: string;
  ativa?: boolean;
}

interface UpdateLocalizacaoData {
  codigo?: string;
  nome?: string;
  tipo?: string;
  ativa?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativa?: boolean;
}

export class LocalizacoesRepository {
  async findAll(filters: FindAllFilters) {
    return prisma.localizacao.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.ativa !== undefined && { ativa: filters.ativa }),
        ...(filters.search && {
          nome: { contains: filters.search, mode: "insensitive" },
        }),
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        tipo: true,
        ativa: true,
        createdAt: true,
        empresa: { select: { id: true, nome: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.localizacao.findUnique({
      where: { id },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        tipo: true,
        ativa: true,
        createdAt: true,
        empresa: { select: { id: true, nome: true } },
      },
    });
  }

  async findByCodigo(empresaId: string, codigo: string) {
    return prisma.localizacao.findFirst({
      where: { empresaId, codigo },
      select: { id: true },
    });
  }

  async create(data: CreateLocalizacaoData) {
    return prisma.localizacao.create({
      data,
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        tipo: true,
        ativa: true,
        createdAt: true,
        empresa: { select: { id: true, nome: true } },
      },
    });
  }

  async update(id: string, data: UpdateLocalizacaoData) {
    return prisma.localizacao.update({
      where: { id },
      data,
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        tipo: true,
        ativa: true,
        createdAt: true,
        empresa: { select: { id: true, nome: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.localizacao.update({
      where: { id },
      data: { ativa: false },
    });
  }
}

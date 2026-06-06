import { prisma } from "../../prisma/prisma.client.js";

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativa?: boolean;
}

interface CreateLocalizacaoData {
  empresaId: string;
  codigo: string;
  nome: string;
  tipo: string;
  ativa?: boolean;
}

interface UpdateLocalizacaoData {
  codigo?: string;
  nome?: string;
  tipo?: string;
  ativa?: boolean;
}

export class LocalizacoesRepository {
  async findAll(filters: FindAllFilters) {
    return prisma.localizacao.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.ativa !== undefined && { ativa: filters.ativa }),
        ...(filters.search && {
          OR: [
            { nome: { contains: filters.search, mode: "insensitive" } },
            { codigo: { contains: filters.search, mode: "insensitive" } },
            { tipo: { contains: filters.search, mode: "insensitive" } },
          ],
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
        updatedAt: true,
      },
      orderBy: [{ nome: "asc" }],
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
        updatedAt: true,
      },
    });
  }

  async findByCodigo(empresaId: string, codigo: string) {
    return prisma.localizacao.findUnique({
      where: {
        empresaId_codigo: {
          empresaId,
          codigo,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findEmpresaById(id: string) {
    return prisma.empresa.findUnique({
      where: { id },
      select: {
        id: true,
        ativa: true,
      },
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
        updatedAt: true,
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
        updatedAt: true,
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
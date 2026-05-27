import { prisma } from "../../prisma/prisma.client.js";

interface CreateEmpresaData {
  codigo?: string;
  nome: string;
  ativa?: boolean;
}

interface UpdateEmpresaData {
  codigo?: string;
  nome?: string;
  ativa?: boolean;
}

interface FindAllFilters {
  search?: string;
  ativa?: boolean;
}

export class EmpresasRepository {
  async findAll(filters: FindAllFilters) {
    return prisma.empresa.findMany({
      where: {
        ...(filters.ativa !== undefined && { ativa: filters.ativa }),
        ...(filters.search && {
          nome: { contains: filters.search, mode: "insensitive" },
        }),
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
        ativa: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.empresa.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        nome: true,
        ativa: true,
        createdAt: true,
      },
    });
  }

  async findByCodigo(codigo: string) {
    return prisma.empresa.findUnique({
      where: { codigo },
      select: { id: true },
    });
  }

  async create(data: CreateEmpresaData) {
    return prisma.empresa.create({
      data,
      select: {
        id: true,
        codigo: true,
        nome: true,
        ativa: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: UpdateEmpresaData) {
    return prisma.empresa.update({
      where: { id },
      data,
      select: {
        id: true,
        codigo: true,
        nome: true,
        ativa: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.empresa.update({
      where: { id },
      data: { ativa: false },
    });
  }
}
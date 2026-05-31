import { prisma } from "../../prisma/prisma.client.js";
import { Prisma } from "@prisma/client";

interface CreateMaterialData {
  empresaId: string;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade?: string;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  custoMedio?: number;
  ativo?: boolean;
}

interface UpdateMaterialData {
  codigo?: string;
  nome?: string;
  descricao?: string;
  unidade?: string;
  estoqueMinimo?: number;
  custoMedio?: number;
  ativo?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
}

export class MateriaisRepository {
  async findAll(filters: FindAllFilters) {
    const materiais = await prisma.material.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.ativo !== undefined && { ativo: filters.ativo }),
        ...(filters.search && {
          OR: [
            { nome: { contains: filters.search, mode: "insensitive" } },
            { codigo: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });

    // ✅ resolve estoqueBaixo sem usar "fields"
    if (filters.estoqueBaixo) {
      return materiais.filter(
        (m) =>
          new Prisma.Decimal(m.estoqueAtual).lte(
            new Prisma.Decimal(m.estoqueMinimo)
          )
      );
    }

    return materiais;
  }

  async findById(id: string) {
    return prisma.material.findUnique({
      where: { id },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async findByCodigo(empresaId: string, codigo: string) {
    return prisma.material.findUnique({
      where: { empresaId_codigo: { empresaId, codigo } },
      select: { id: true },
    });
  }

  async create(data: CreateMaterialData) {
    return prisma.material.create({
      data: {
        empresaId: data.empresaId,
        codigo: data.codigo,
        nome: data.nome,
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.unidade !== undefined && { unidade: data.unidade }),
        ...(data.estoqueAtual !== undefined && { estoqueAtual: data.estoqueAtual }),
        ...(data.estoqueMinimo !== undefined && { estoqueMinimo: data.estoqueMinimo }),
        ...(data.custoMedio !== undefined && { custoMedio: data.custoMedio }),
        ...(data.ativo !== undefined && { ativo: data.ativo }),
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: UpdateMaterialData) {
    return prisma.material.update({
      where: { id },
      data,
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async updateEstoque(id: string, estoqueAtual: Prisma.Decimal) {
    return prisma.material.update({
      where: { id },
      data: { estoqueAtual },
      select: {
        id: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.material.update({
      where: { id },
      data: { ativo: false },
      select: { id: true },
    });
  }
}
import { prisma } from "../../prisma/prisma.client.js";
import type { TipoAtivo, StatusAtivo, Criticidade } from "@prisma/client";

interface CreateAtivoData {
  empresaId: string;
  localizacaoId?: string;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: TipoAtivo;
  status?: StatusAtivo;
  criticidade?: Criticidade;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  placa?: string;
  horimetroAtual?: number;
  odometroAtual?: number;
  ativo?: boolean;
}

interface UpdateAtivoData {
  localizacaoId?: string;
  codigo?: string;
  nome?: string;
  descricao?: string;
  tipo?: TipoAtivo;
  criticidade?: Criticidade;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  placa?: string;
  horimetroAtual?: number;
  odometroAtual?: number;
  ativo?: boolean;
}

interface FindAllFilters {
  empresaId: string;
  localizacaoId?: string;
  status?: StatusAtivo;
  tipo?: TipoAtivo;
  criticidade?: Criticidade;
  search?: string;
}

export class AtivosRepository {
  async findAll(filters: FindAllFilters) {
    if (!filters.empresaId) return [];

    return prisma.ativo.findMany({
      where: {
        empresaId: filters.empresaId,
        ...(filters.localizacaoId !== undefined && { localizacaoId: filters.localizacaoId }),
        ...(filters.status !== undefined && { status: filters.status }),
        ...(filters.tipo !== undefined && { tipo: filters.tipo }),
        ...(filters.criticidade !== undefined && { criticidade: filters.criticidade }),
        ...(filters.search !== undefined && {
          OR: [
            { nome: { contains: filters.search, mode: "insensitive" } },
            { codigo: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string, empresaId: string) {
    if (!id || !empresaId) return null;

    return prisma.ativo.findFirst({
      where: { id, empresaId },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async findByCodigo(empresaId: string, codigo: string) {
    if (!empresaId || !codigo) return null;

    return prisma.ativo.findUnique({
      where: { empresaId_codigo: { empresaId, codigo } },
      select: { id: true },
    });
  }

  async create(data: CreateAtivoData) {
    if (!data.empresaId) {
      throw new Error("empresaId é obrigatório para criar um ativo.");
    }

    return prisma.ativo.create({
      data: {
        empresaId: data.empresaId,
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo,
        ...(data.localizacaoId !== undefined && { localizacaoId: data.localizacaoId }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.criticidade !== undefined && { criticidade: data.criticidade }),
        ...(data.marca !== undefined && { marca: data.marca }),
        ...(data.modelo !== undefined && { modelo: data.modelo }),
        ...(data.numeroSerie !== undefined && { numeroSerie: data.numeroSerie }),
        ...(data.placa !== undefined && { placa: data.placa }),
        ...(data.horimetroAtual !== undefined && { horimetroAtual: data.horimetroAtual }),
        ...(data.odometroAtual !== undefined && { odometroAtual: data.odometroAtual }),
        ...(data.ativo !== undefined && { ativo: data.ativo }),
      },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, empresaId: string, data: UpdateAtivoData) {
    if (!id || !empresaId) return null;

    return prisma.ativo.update({
      where: { id },
      data,
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async updateStatus(id: string, empresaId: string, status: StatusAtivo) {
    if (!id || !empresaId) return null;

    return prisma.ativo.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });
  }

  async delete(id: string, empresaId: string) {
    if (!id || !empresaId) return null;

    return prisma.ativo.update({
      where: { id },
      data: { ativo: false },
      select: { id: true },
    });
  }
}
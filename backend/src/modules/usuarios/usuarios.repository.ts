import { prisma } from "../../prisma/prisma.client.js";
import type { PerfilUsuario } from "@prisma/client";

interface CreateUsuarioData {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: PerfilUsuario;
  empresaId?: string | undefined;
}

interface UpdateUsuarioData {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  empresaId?: string;
}

interface FindAllFilters {
  empresaId?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  search?: string;
}

export class UsuariosRepository {

  async findAll(filters: FindAllFilters) {
    return prisma.usuario.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.perfil !== undefined && { perfil: filters.perfil }),
        ...(filters.ativo !== undefined && { ativo: filters.ativo }),
        ...(filters.search !== undefined && {
          OR: [
            { nome: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        senhaHash: true,
        perfil: true,
        empresaId: true,
        ativo: true,
      },
    });
  }

  async create(data: CreateUsuarioData) {
  return prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash: data.senhaHash,
      perfil: data.perfil,
      ...(data.empresaId !== undefined && { empresaId: data.empresaId }),
    },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      empresaId: true,
      ativo: true,
      createdAt: true,
    },
  });
}

  async update(id: string, data: UpdateUsuarioData) {
    return prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
  }

  async updatePassword(id: string, senhaHash: string) {
    return prisma.usuario.update({
      where: { id },
      data: { senhaHash },
      select: { id: true },
    });
  }

  async delete(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: { id: true },
    });
  }
}
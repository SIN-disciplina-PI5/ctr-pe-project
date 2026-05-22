import { prisma } from "../../prisma/prisma.client.js";
import type { PerfilUsuario } from "@prisma/client";

interface CreateUsuarioData {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: PerfilUsuario;
  empresaId?: string;
}

interface UpdateUsuarioData {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  search?: string;
}

export class UsuariosRepository {

  // queries
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

  async findById(id: string, empresaId: string) {
    return prisma.usuario.findFirst({
      where: { id, empresaId },
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

  // commands
  async create(data: CreateUsuarioData) {
    return prisma.usuario.create({
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

  async update(id: string, empresaId: string, data: UpdateUsuarioData) {
    return prisma.usuario.update({
      where: {
        id,
        empresaId,
      },
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

  async updatePassword(id: string, empresaId: string, senhaHash: string) {
    return prisma.usuario.update({
      where: {
        id,
        empresaId,
      },
      data: { senhaHash },
      select: {
        id: true,
      },
    });
  }

  async delete(id: string, empresaId: string) {
    return prisma.usuario.update({
      where: {
        id,
        empresaId,
      },
      data: { ativo: false },
      select: {
        id: true,
      },
    });
  }
}
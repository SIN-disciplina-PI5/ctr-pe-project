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

export class UsuariosRepository {
  async findAll(empresaId: string) {
    return prisma.usuario.findMany({
      where: { empresaId },
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
      select: { id: true },
    });
  }

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

  async delete(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
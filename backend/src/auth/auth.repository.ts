import { prisma } from "../prisma/prisma.client.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
        perfil: true,
        empresaId: true,
        ativo: true,
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
      },
    });
  }
  async findByIdWithPassword(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        senhaHash: true,
      },
  });
}

  async updatePassword(id: string, senhaHash: string) {
    return prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });
  }
}
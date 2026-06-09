import { prisma } from "../prisma/prisma.client.js";

interface CreateSignupUserData {
  nome: string;
  email: string;
  senhaHash: string;
  empresaId: string;
}

interface CreateSignupTestingUserData {
  nome: string;
  email: string;
  senhaHash: string;
  empresaId: string;
  perfil: "ADMIN" | "GESTOR" | "SUPERVISOR" | "TECNICO" | "CONSULTA";
}

interface CreateRefreshTokenData {
  usuarioId: string;
  tokenHash: string;
  expiresAt: Date;
}

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

  async findEmpresaById(id: string) {
    return prisma.empresa.findUnique({
      where: { id },
      select: {
        id: true,
        ativa: true,
      },
    });
  }

  async findActiveEmpresasForSignup() {
    return prisma.empresa.findMany({
      where: { ativa: true },
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
      },
    });
  }

  async createInactiveSignupUser(data: CreateSignupUserData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        empresaId: data.empresaId,
        perfil: "CONSULTA",
        ativo: false,
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

  async createActiveSignupTestingUser(data: CreateSignupTestingUserData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        empresaId: data.empresaId,
        perfil: data.perfil,
        ativo: true,
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

  async updatePassword(id: string, senhaHash: string) {
    return prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });
  }

  async updateLastLogin(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { ultimoLoginEm: new Date() },
    });
  }

  async createRefreshToken(data: CreateRefreshTokenData) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
            empresaId: true,
            ativo: true,
          },
        },
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async deleteExpiredOrRevokedRefreshTokens() {
    return prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    });
  }
}
import bcrypt from "bcrypt";

import { AppError } from "../common/errors/AppError.js";
import { ErrorCode } from "../common/errors/error-code.js";
import { AuthRepository } from "./auth.repository.js";
import { TokenService } from "./token.service.js";
import type { SignUpInput } from "./dto/sign-up.dto.js";
import type { SignUpTestingInput } from "./dto/sign-up-testing.dto.js";

export class AuthService {
  private authRepository = new AuthRepository();
  private tokenService = new TokenService();

  async listSignupEmpresas() {
    return this.authRepository.findActiveEmpresasForSignup();
  }

  async signUp(data: SignUpInput) {
    const emailEmUso = await this.authRepository.findByEmail(data.email);

    if (emailEmUso) {
      throw new AppError({
        message: "Email já está em uso",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    const empresa = await this.authRepository.findEmpresaById(data.empresaId);

    if (!empresa) {
      throw new AppError({
        message: "Empresa não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    if (!empresa.ativa) {
      throw new AppError({
        message: "Empresa inativa",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const saltRounds = Number(process.env["BCRYPT_SALT_ROUNDS"] ?? 10);
    const senhaHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.authRepository.createInactiveSignupUser({
      nome: data.nome,
      email: data.email,
      senhaHash,
      empresaId: data.empresaId,
    });

    return {
      message: "Cadastro realizado. Aguarde a ativação do usuário por um administrador.",
      user,
    };
  }

  async signUpTesting(data: SignUpTestingInput) {
    const emailEmUso = await this.authRepository.findByEmail(data.email);

    if (emailEmUso) {
      throw new AppError({
        message: "Email já está em uso",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    const empresa = await this.authRepository.findEmpresaById(data.empresaId);

    if (!empresa) {
      throw new AppError({
        message: "Empresa não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    if (!empresa.ativa) {
      throw new AppError({
        message: "Empresa inativa",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const saltRounds = Number(process.env["BCRYPT_SALT_ROUNDS"] ?? 10);
    const senhaHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.authRepository.createActiveSignupTestingUser({
      nome: data.nome,
      email: data.email,
      senhaHash,
      empresaId: data.empresaId,
      perfil: data.perfil,
    });

    return {
      message: "Usuário de teste criado com sucesso.",
      user,
    };
  }

  async me(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError({
        message: "Usuario nao encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    if (newPassword !== confirmNewPassword) {
      throw new AppError({
        message: "As senhas nao coincidem",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const user = await this.authRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppError({
        message: "Usuario nao encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.senhaHash);

    if (!passwordMatch) {
      throw new AppError({
        message: "Senha atual incorreta",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const saltRounds = Number(process.env["BCRYPT_SALT_ROUNDS"] ?? 10);
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    await this.authRepository.updatePassword(userId, newHash);

    return { message: "Senha alterada com sucesso" };
  }

  async signIn(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        message: "Usuario nao encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    if (!user.ativo) {
      throw new AppError({
        message: "Usuario inativo",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.senhaHash);

    if (!passwordMatch) {
      throw new AppError({
        message: "Senha invalida",
        statusCode: 401,
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    const authUser = {
      id: user.id,
      empresaId: user.empresaId,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    };

    const accessToken = this.tokenService.generateToken(authUser);
    const refreshToken = await this.issueRefreshToken(user.id);

    await this.authRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw new AppError({
        message: "Refresh token inválido ou expirado",
        statusCode: 401,
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    if (storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      if (!storedToken.revokedAt) {
        await this.authRepository.revokeRefreshToken(storedToken.id);
      }

      throw new AppError({
        message: "Refresh token inválido ou expirado",
        statusCode: 401,
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    const user = storedToken.usuario;

    if (!user.ativo) {
      await this.authRepository.revokeRefreshToken(storedToken.id);

      throw new AppError({
        message: "Usuario inativo",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    await this.authRepository.revokeRefreshToken(storedToken.id);

    const accessToken = this.tokenService.generateToken({
      id: user.id,
      empresaId: user.empresaId,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    });

    const newRefreshToken = await this.issueRefreshToken(
      user.id,
      storedToken.expiresAt,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    await this.authRepository.revokeRefreshTokenByHash(tokenHash);
  }

  async cleanExpiredOrRevokedRefreshTokens() {
    return this.authRepository.deleteExpiredOrRevokedRefreshTokens();
  }

  private async issueRefreshToken(usuarioId: string, expiresAt?: Date) {
    const refreshToken = this.tokenService.generateRefreshToken();
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      usuarioId,
      tokenHash,
      expiresAt: expiresAt ?? this.tokenService.getRefreshTokenExpiresAt(),
    });

    return refreshToken;
  }
}
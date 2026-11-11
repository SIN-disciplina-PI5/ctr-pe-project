import bcrypt from "bcrypt";

import { AppError } from "../common/errors/AppError.js";
import { ErrorCode } from "../common/errors/error-code.js";
import { RecaptchaService } from "../common/services/recaptcha.service.js";
import { AuditoriaService } from "../modules/auditoria/auditoria.service.js";
import { AuthRepository } from "./auth.repository.js";
import { TokenService } from "./token.service.js";
import type { RecaptchaPlatform } from "./dto/sign-in.dto.js";
import type { SignUpInput } from "./dto/sign-up.dto.js";

interface SignInContext {
  recaptchaToken?: string;
  recaptchaPlatform?: RecaptchaPlatform;
  userAgent?: string;
  userIpAddress?: string;
}

// Mantém o custo do bcrypt também quando o e-mail não existe. O hash não
// corresponde a nenhuma credencial válida e pode ser versionado com segurança.
const DUMMY_PASSWORD_HASH =
  "$2b$10$QKcp4b2yCHTS2ck1vMb8LO6h6kD7P0VNQniTIrvkQD1OsbKUEURCO";

function invalidCredentials(): AppError {
  return new AppError({
    message: "Credenciais inválidas.",
    statusCode: 401,
    errorCode: ErrorCode.UNAUTHORIZED,
  });
}

export class AuthService {
  private authRepository = new AuthRepository();
  private tokenService = new TokenService();
  private recaptchaService = new RecaptchaService();
  private auditoriaService = new AuditoriaService();

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
      message:
        "Cadastro realizado. Aguarde a ativação do usuário por um administrador.",
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

  async signIn(
    email: string,
    password: string,
    context: SignInContext = {},
  ) {
    const recaptchaPlatform = context.recaptchaPlatform ?? "web";

    if (!context.recaptchaToken && process.env.NODE_ENV !== "test") {
      throw new AppError({
        message: "O reCAPTCHA é obrigatório.",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    if (context.recaptchaToken) {
      const recaptchaValid = await this.recaptchaService.validateToken(
        context.recaptchaToken,
        this.getRecaptchaSiteKey(recaptchaPlatform),
        "login",
        context.userAgent,
        context.userIpAddress,
      );

      if (!recaptchaValid) {
        await this.registerLoginAudit({
          email,
          success: false,
          reason: "Bloqueado pelo reCAPTCHA Enterprise",
          platform: recaptchaPlatform,
          ...(context.userAgent !== undefined && {
            userAgent: context.userAgent,
          }),
          ...(context.userIpAddress !== undefined && {
            userIpAddress: context.userIpAddress,
          }),
        });

        throw new AppError({
          message: "Validação de segurança recusada.",
          statusCode: 403,
          errorCode: ErrorCode.FORBIDDEN,
        });
      }
    }

    const user = await this.authRepository.findByEmail(email);
    const passwordMatch = await bcrypt.compare(
      password,
      user?.senhaHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !user.ativo || !passwordMatch) throw invalidCredentials();

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

    await this.registerLoginAudit({
      email,
      success: true,
      platform: recaptchaPlatform,
      ...(context.userAgent !== undefined && {
        userAgent: context.userAgent,
      }),
      ...(context.userIpAddress !== undefined && {
        userIpAddress: context.userIpAddress,
      }),
      empresaId: user.empresaId,
      usuarioId: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const storedToken =
      await this.authRepository.findRefreshTokenByHash(tokenHash);

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

  private getRecaptchaSiteKey(platform: RecaptchaPlatform): string {
    const envVarByPlatform: Record<RecaptchaPlatform, string> = {
      web: "RECAPTCHA_WEB_SITE_KEY",
      android: "RECAPTCHA_ANDROID_SITE_KEY",
      ios: "RECAPTCHA_IOS_SITE_KEY",
    };
    const envVarName = envVarByPlatform[platform];
    const siteKey = process.env[envVarName];

    if (!siteKey) {
      throw new AppError({
        message: "O reCAPTCHA não está configurado no servidor.",
        statusCode: 500,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }

    return siteKey;
  }

  private async registerLoginAudit(input: {
    email: string;
    success: boolean;
    reason?: string;
    platform: RecaptchaPlatform;
    userAgent?: string;
    userIpAddress?: string;
    empresaId?: string | null;
    usuarioId?: string;
  }) {
    try {
      await this.auditoriaService.registrar({
        entidade: input.usuarioId ? "USUARIO" : "AUTH",
        entidadeId: input.usuarioId ?? input.email,
        acao: "LOGIN",
        ...(input.empresaId !== undefined && {
          empresaId: input.empresaId,
        }),
        ...(input.usuarioId !== undefined && {
          usuarioId: input.usuarioId,
        }),
        depois: {
          sucesso: input.success,
          ...(input.reason && { motivo: input.reason }),
          plataforma: input.platform,
          ...(input.userIpAddress && { ip: input.userIpAddress }),
          ...(input.userAgent && { userAgent: input.userAgent }),
        },
      });
    } catch {
      // A indisponibilidade da auditoria não deve alterar a resposta do login.
    }
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

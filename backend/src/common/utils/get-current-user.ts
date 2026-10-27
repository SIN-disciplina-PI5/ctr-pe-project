import type { Request } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import type { AuthUser } from "../types/auth-user.js";

// ID da empresa padrão para testes / fallback de admin
const DEFAULT_EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";

export function getCurrentUser(req: Request): AuthUser {
  if (!req.user) {
    throw new AppError({
      message: "Usuário não autenticado.",
      statusCode: 401,
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }

  // Tenta recuperar o empresaId do user, de variações do token ou aplica o fallback de teste
  const empresaId =
    req.user.empresaId ||
    (req.user as any).empresa_id ||
    (req.user as any).tenantId ||
    DEFAULT_EMPRESA_ID;

  return {
    ...req.user,
    empresaId,
  };
}
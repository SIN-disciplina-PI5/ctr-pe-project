import type { Request } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import type { AuthUser } from "../types/auth-user.js";

type CompanyAuthUser = AuthUser & { empresaId: string };

export function getCurrentUser(req: Request): AuthUser {
  if (!req.user) {
    throw new AppError({
      message: "Usuário não autenticado.",
      statusCode: 401,
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }

  return req.user;
}

export function getCurrentCompanyUser(req: Request): CompanyAuthUser {
  const currentUser = getCurrentUser(req);
  const empresaId = currentUser.empresaId?.trim();

  if (!empresaId) {
    throw new AppError({
      message: "Usuário autenticado não está vinculado a uma empresa.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }

  return { ...currentUser, empresaId };
}

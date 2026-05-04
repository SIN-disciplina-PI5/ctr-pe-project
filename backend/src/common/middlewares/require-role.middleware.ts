import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import type { PerfilUsuario } from "../types/auth-user.js";

export function requireRole(...roles: PerfilUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError({
          message: "Usuario nao autenticado.",
          statusCode: 401,
          errorCode: ErrorCode.UNAUTHORIZED,
        }),
      );
    }

    if (!roles.includes(req.user.perfil)) {
      return next(
        new AppError({
          message: "Acesso negado.",
          statusCode: 403,
          errorCode: ErrorCode.FORBIDDEN,
        }),
      );
    }

    return next();
  };
}

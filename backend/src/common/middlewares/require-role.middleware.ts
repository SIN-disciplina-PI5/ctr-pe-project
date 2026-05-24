import type { Request, Response, NextFunction } from "express";
import type { PerfilUsuario } from "@prisma/client";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

export function requireRole(perfis: PerfilUsuario[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new AppError({ message: "Não autenticado", statusCode: 401, errorCode: ErrorCode.UNAUTHORIZED }));
    }

    if (!perfis.includes(user.perfil)) {
      return next(new AppError({ message: "Sem permissão para esta ação", statusCode: 403, errorCode: ErrorCode.FORBIDDEN }));
    }

    next();
  };
}
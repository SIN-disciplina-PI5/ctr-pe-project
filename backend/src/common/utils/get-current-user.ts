import type { Request } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import type { AuthUser } from "../types/auth-user.js";

export function getCurrentUser(req: Request): AuthUser {
  if (!req.user) {
    throw new AppError({
      message: "Usuario nao autenticado.",
      statusCode: 401,
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }

  return req.user;
}

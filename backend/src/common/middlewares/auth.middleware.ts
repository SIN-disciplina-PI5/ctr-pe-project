import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import { isPerfilUsuario, type AuthUser } from "../types/auth-user.js";

function getStringClaim(payload: JwtPayload, key: string) {
  const value = payload[key];

  return typeof value === "string" ? value : null;
}

function getNullableStringClaim(payload: JwtPayload, key: string) {
  const value = payload[key];

  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "string" ? value : null;
}

function parseAuthUser(payload: JwtPayload): AuthUser | null {
  const id = getStringClaim(payload, "id") ?? getStringClaim(payload, "sub");
  const nome = getStringClaim(payload, "nome");
  const email = getStringClaim(payload, "email");
  const perfil = getStringClaim(payload, "perfil");
  const empresaId = getNullableStringClaim(payload, "empresaId");

  if (!id || !nome || !email || !isPerfilUsuario(perfil)) {
    return null;
  }

  return {
    id,
    empresaId,
    nome,
    email,
    perfil,
  };
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(
      new AppError({
        message: "Token de autenticacao nao informado.",
        statusCode: 401,
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(
      new AppError({
        message: "JWT_SECRET nao configurado.",
        statusCode: 500,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      }),
    );
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }

    const user = parseAuthUser(decoded);

    if (!user) {
      throw new Error("Invalid token payload");
    }

    req.user = user;

    return next();
  } catch {
    return next(
      new AppError({
        message: "Token de autenticacao invalido.",
        statusCode: 401,
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }
}

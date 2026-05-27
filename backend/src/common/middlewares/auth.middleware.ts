import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { PerfilUsuario } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  empresaId: string;
  perfil: PerfilUsuario;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const secret = process.env["JWT_SECRET"];

  if (!secret) {
    throw new Error("JWT_SECRET não definido");
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("userId" in payload) ||
      !("empresaId" in payload) ||
      !("perfil" in payload)
    ) {
      return res.status(401).json({ message: "Token inválido." });
    }

    req.user = payload as JwtPayload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}
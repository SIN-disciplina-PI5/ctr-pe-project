import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { PerfilUsuario } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  empresaId: string | null;
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

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
    }
    
  const secret = process.env["JWT_SECRET"];

  if (!secret) throw new Error("JWT_SECRET não definido");

  try {
    const payload = jwt.verify(token, secret) as unknown as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
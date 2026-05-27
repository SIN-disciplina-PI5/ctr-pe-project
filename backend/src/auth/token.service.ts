import jwt from "jsonwebtoken";
import type { PerfilUsuario } from "@prisma/client";

interface TokenPayload {
  userId: string;
  empresaId: string | null;
  perfil: PerfilUsuario;
}

export class TokenService {
  generateToken(payload: TokenPayload): string {
    const secret = process.env["JWT_SECRET"];
    const expiresIn = process.env["JWT_EXPIRES_IN"] ?? "1d";

    if (!secret) throw new Error("JWT_SECRET não definido");

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }
}
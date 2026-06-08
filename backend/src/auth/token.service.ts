import { createHash, randomBytes } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";

import type { AuthUser } from "../common/types/auth-user.js";

export class TokenService {
  generateToken(user: AuthUser): string {
    const secret = process.env["JWT_SECRET"];
    const expiresIn = (process.env["JWT_EXPIRES_IN"] ?? "1d") as NonNullable<
      SignOptions["expiresIn"]
    >;

    if (!secret) {
      throw new Error("JWT_SECRET não configurado.");
    }

    return jwt.sign(
      {
        id: user.id,
        empresaId: user.empresaId,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
      },
      secret,
      {
        subject: user.id,
        expiresIn,
      },
    );
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex");
  }

  hashRefreshToken(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  getRefreshTokenExpiresAt(): Date {
    const days = Number(process.env["REFRESH_TOKEN_EXPIRATION_DAYS"] ?? 7);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return expiresAt;
  }
}
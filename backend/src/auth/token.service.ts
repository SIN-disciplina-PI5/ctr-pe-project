import jwt, { type SignOptions } from "jsonwebtoken";

import type { AuthUser } from "../common/types/auth-user.js";

export class TokenService {
  generateToken(user: AuthUser): string {
    const secret = process.env["JWT_SECRET"];
    const expiresIn = (process.env["JWT_EXPIRES_IN"] ?? "1d") as NonNullable<
      SignOptions["expiresIn"]
    >;

    if (!secret) {
      throw new Error("JWT_SECRET nao definido");
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
}
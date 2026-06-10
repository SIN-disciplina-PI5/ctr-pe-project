import jwt, { type SignOptions } from "jsonwebtoken";

import type { AuthUser } from "../types/auth-user.js";

export function generateAuthToken(user: AuthUser) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET nao configurado.");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as NonNullable<
    SignOptions["expiresIn"]
  >;

  const options: SignOptions = {
    subject: user.id,
    expiresIn,
  };

  return jwt.sign(
    {
      id: user.id,
      empresaId: user.empresaId,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    },
    jwtSecret,
    options,
  );
}

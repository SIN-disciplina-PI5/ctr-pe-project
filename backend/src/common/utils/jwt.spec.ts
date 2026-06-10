import { afterEach, describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";

import { generateAuthToken } from "./jwt.js";
import type { AuthUser } from "../types/auth-user.js";

const user: AuthUser = {
  id: "user-1",
  empresaId: "empresa-1",
  nome: "Usuário Teste",
  email: "usuario@teste.com",
  perfil: "ADMIN",
};

describe("generateAuthToken", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalExpiresIn = process.env.JWT_EXPIRES_IN;

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
    process.env.JWT_EXPIRES_IN = originalExpiresIn;
  });

  it("should gerar token com payload esperado", () => {
    process.env.JWT_SECRET = "segredo-teste";
    process.env.JWT_EXPIRES_IN = "1d";

    const token = generateAuthToken(user);
    const decoded = jwt.verify(token, "segredo-teste") as jwt.JwtPayload;

    expect(typeof token).toBe("string");
    expect(decoded.sub).toBe(user.id);
    expect(decoded.id).toBe(user.id);
    expect(decoded.empresaId).toBe(user.empresaId);
    expect(decoded.nome).toBe(user.nome);
    expect(decoded.email).toBe(user.email);
    expect(decoded.perfil).toBe(user.perfil);
  });

  it("should usar 1d como expiração padrão", () => {
    process.env.JWT_SECRET = "segredo-teste";
    delete process.env.JWT_EXPIRES_IN;

    const token = generateAuthToken(user);
    const decoded = jwt.verify(token, "segredo-teste") as jwt.JwtPayload;

    expect(decoded.exp).toBeDefined();
  });

  it("should lançar erro quando JWT_SECRET não estiver configurado", () => {
    delete process.env.JWT_SECRET;

    expect(() => generateAuthToken(user)).toThrow("JWT_SECRET nao configurado.");
  });
});
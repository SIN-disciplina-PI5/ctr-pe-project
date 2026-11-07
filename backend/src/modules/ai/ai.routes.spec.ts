import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { api } from "../../../tests/test-server.js";

const originalSecret = process.env["JWT_SECRET"];
const testSecret = "ai-routes-test-secret";

function token(): string {
  return jwt.sign(
    {
      id: "usuario-1",
      nome: "Usuário Teste",
      email: "consulta@teste.com",
      perfil: "CONSULTA",
      empresaId: "empresa-1",
    },
    testSecret,
    { subject: "usuario-1", expiresIn: "1h" },
  );
}

describe("rotas internas de consulta da IA", () => {
  beforeAll(() => {
    process.env["JWT_SECRET"] = testSecret;
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env["JWT_SECRET"];
    else process.env["JWT_SECRET"] = originalSecret;
  });

  it.each(["/api/ai/query", "/api/ai/query/generate"])(
    "exige autenticação em %s",
    async (path) => {
      const response = await api
        .post(path)
        .send({ question: "Quais ativos estão parados?" });

      expect(response.status).toBe(401);
    },
  );

  it.each(["/api/ai/query", "/api/ai/query/generate"])(
    "valida o payload antes de acionar serviços em %s",
    async (path) => {
      const response = await api
        .post(path)
        .set("Authorization", `Bearer ${token()}`)
        .send({ question: "" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Dados inválidos.",
        errorCode: "VALIDATION_ERROR",
      });
    },
  );
});

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

describe("rotas internas de geração de consulta", () => {
  beforeAll(() => {
    process.env["JWT_SECRET"] = testSecret;
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env["JWT_SECRET"];
    else process.env["JWT_SECRET"] = originalSecret;
  });

  it("exige autenticação", async () => {
    const response = await api
      .post("/api/ai/query/generate")
      .send({ question: "Quais ativos estão parados?" });

    expect(response.status).toBe(401);
  });

  it("valida o payload antes de acionar o provedor", async () => {
    const response = await api
      .post("/api/ai/query/generate")
      .set("Authorization", `Bearer ${token()}`)
      .send({ question: "" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Dados inválidos.",
      errorCode: "VALIDATION_ERROR",
    });
  });
});

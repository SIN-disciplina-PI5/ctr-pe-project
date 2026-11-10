import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { api } from "../../../tests/test-server.js";

const originalSecret = process.env["JWT_SECRET"];
const testSecret = "ai-routes-test-secret";

function token(id = "usuario-1"): string {
  return jwt.sign(
    {
      id,
      nome: "Usuário Teste",
      email: "consulta@teste.com",
      perfil: "CONSULTA",
      empresaId: "empresa-1",
    },
    testSecret,
    { subject: id, expiresIn: "1h" },
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

  it.each(["/api/ai/chat", "/api/ai/query", "/api/ai/query/generate"])(
    "exige autenticação em %s",
    async (path) => {
      const response = await api
        .post(path)
        .send(
          path.endsWith("/chat")
            ? { message: "Quais ativos estão parados?" }
            : { question: "Quais ativos estão parados?" },
        );

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

  it("valida mensagem e identificador de conversa do chat", async () => {
    const response = await api
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "", conversationId: "curto" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Dados inválidos.",
      errorCode: "VALIDATION_ERROR",
    });
  });

  it("limita mensagens por usuário e empresa", async () => {
    const authorization = `Bearer ${token("usuario-rate-limit")}`;

    for (let index = 0; index < 20; index += 1) {
      const response = await api
        .post("/api/ai/chat")
        .set("Authorization", authorization)
        .send({ message: "" });
      expect(response.status).toBe(400);
    }

    const limited = await api
      .post("/api/ai/chat")
      .set("Authorization", authorization)
      .send({ message: "" });

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({
      errorCode: "TOO_MANY_REQUESTS",
    });
  });
});

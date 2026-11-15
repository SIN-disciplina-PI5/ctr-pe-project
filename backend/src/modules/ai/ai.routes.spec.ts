import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import jwt from "jsonwebtoken";
import { api } from "../../../tests/test-server.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { resetChatService, setChatService } from "./chat.controller.js";
import type { ChatInput, ChatResult, ChatService } from "./chat.service.js";

const originalSecret = process.env["JWT_SECRET"];
const testSecret = "ai-routes-test-secret";

function token(
  id = "usuario-1",
  empresaId: string | null = "empresa-1",
): string {
  return jwt.sign(
    {
      id,
      nome: "Usuário Teste",
      email: "consulta@teste.com",
      perfil: "CONSULTA",
      empresaId,
    },
    testSecret,
    { subject: id, expiresIn: "1h" },
  );
}

describe("rotas internas de consulta da IA", () => {
  beforeAll(() => {
    process.env["JWT_SECRET"] = testSecret;
  });

  afterEach(() => {
    resetChatService();
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

  it("retorna 200 com resposta, SQL e linhas ao iniciar conversa", async () => {
    const chatMock = jest.fn<(input: ChatInput) => Promise<ChatResult>>();
    chatMock.mockResolvedValue({
      id: "conversa-0001",
      conversationId: "conversa-0001",
      message: "Há 2 ativos parados.",
      status: "answered",
      intent: "data_question",
      latencyMs: 18,
      result: {
        status: "answered",
        intent: "data_question",
        classificationMetrics: null,
        result: {
          status: "answered",
          mode: "single",
          answer: "Há 2 ativos parados.",
          answerMetrics: null,
          sql: 'SELECT "codigo" FROM ai."Ativo" WHERE "status" = \'PARADO\' LIMIT 100',
          rowsUsed: [{ codigo: "AT-01" }, { codigo: "AT-02" }],
          execution: { rowCount: 2, latencyMs: 5 },
          correctionApplied: false,
          correctionMetrics: null,
          relevantViews: ["Ativo"],
          generation: {
            provider: "test",
            model: "test",
            latencyMs: 10,
            inputTokens: null,
            outputTokens: null,
            totalTokens: null,
          },
        },
      },
    });
    setChatService({ chat: chatMock } as unknown as ChatService);

    const response = await api
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token("usuario-chat-ok")}`)
      .send({ message: "Quais ativos estão parados?" });

    expect(response.status).toBe(200);
    expect(chatMock).toHaveBeenCalledWith({
      actor: expect.objectContaining({
        id: "usuario-chat-ok",
        empresaId: "empresa-1",
        perfil: "CONSULTA",
      }),
      message: "Quais ativos estão parados?",
    });
    expect(response.body).toMatchObject({
      id: "conversa-0001",
      conversationId: "conversa-0001",
      message: "Há 2 ativos parados.",
      status: "answered",
      intent: "data_question",
      latencyMs: 18,
      result: {
        result: {
          sql: expect.stringContaining("SELECT"),
          rowsUsed: [{ codigo: "AT-01" }, { codigo: "AT-02" }],
        },
      },
    });
  });

  it("encaminha conversationId existente para continuidade do histórico", async () => {
    const chatMock = jest.fn<(input: ChatInput) => Promise<ChatResult>>();
    chatMock.mockResolvedValue({
      id: "conversa-existente-123",
      conversationId: "conversa-existente-123",
      message: "O ativo AT-01 está parado desde ontem.",
      status: "clarification",
      intent: "unclear",
      latencyMs: 12,
      result: {
        status: "clarification",
        intent: "unclear",
        message: "O ativo AT-01 está parado desde ontem.",
        classificationMetrics: null,
      },
    });
    setChatService({ chat: chatMock } as unknown as ChatService);

    const response = await api
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token("usuario-chat-hist")}`)
      .send({
        message: "E desde quando?",
        conversationId: "conversa-existente-123",
      });

    expect(response.status).toBe(200);
    expect(chatMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "E desde quando?",
        conversationId: "conversa-existente-123",
      }),
    );
  });

  it("retorna 404 quando a conversa não pertence ao usuário ou empresa", async () => {
    const chatMock = jest.fn<(input: ChatInput) => Promise<ChatResult>>();
    chatMock.mockRejectedValue(
      new AppError({
        message: "Conversa não encontrada.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      }),
    );
    setChatService({ chat: chatMock } as unknown as ChatService);

    const response = await api
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token("usuario-chat-404")}`)
      .send({
        message: "Continue a consulta anterior.",
        conversationId: "conversa-inexistente-999",
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Conversa não encontrada.",
      errorCode: "NOT_FOUND",
    });
  });

  it("retorna erro limpo sem stack trace quando o provedor LLM sofre timeout", async () => {
    const chatMock = jest.fn<(input: ChatInput) => Promise<ChatResult>>();
    chatMock.mockRejectedValue(
      new AppError({
        message: "O assistente excedeu o tempo limite. Tente novamente.",
        statusCode: 504,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      }),
    );
    setChatService({ chat: chatMock } as unknown as ChatService);

    const response = await api
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token("usuario-chat-504")}`)
      .send({ message: "Gere um resumo das ordens." });

    expect(response.status).toBe(504);
    expect(response.body).toMatchObject({
      error: "O assistente excedeu o tempo limite. Tente novamente.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
    expect(JSON.stringify(response.body)).not.toContain("at ");
  });
});

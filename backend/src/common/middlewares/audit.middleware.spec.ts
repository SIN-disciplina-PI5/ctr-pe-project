import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const registrar = jest.fn<(...args: never[]) => Promise<unknown>>();

jest.unstable_mockModule(
  "../../modules/auditoria/auditoria.service.js",
  () => ({
    AuditoriaService: jest.fn(() => ({ registrar })),
  }),
);

const { auditMiddleware } = await import("./audit.middleware.js");

describe("auditMiddleware para conversa de IA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registrar.mockResolvedValue({ id: "log-1" });
  });

  it("registra somente metadados e não persiste SQL nem linhas", async () => {
    const app = express();
    app.use(express.json());
    app.use(auditMiddleware);
    app.post("/api/ai/chat", (req, res) => {
      req.user = {
        id: "usuario-1",
        empresaId: "empresa-1",
        nome: "Usuário",
        email: "usuario@teste.com",
        perfil: "CONSULTA",
      };
      res.status(200).json({
        id: "conversa-1",
        conversationId: "conversa-1",
        status: "answered",
        intent: "data_question",
        message: "Resposta fundamentada.",
        result: {
          sql: "SELECT segredo FROM ai.dados",
          rowsUsed: [{ segredo: "não auditar" }],
        },
      });
    });

    await request(app).post("/api/ai/chat").send({ message: "Pergunta" });
    await new Promise((resolve) => setImmediate(resolve));

    expect(registrar).toHaveBeenCalledWith({
      entidade: "conversa_ia",
      entidadeId: "conversa-1",
      acao: "CRIACAO",
      empresaId: "empresa-1",
      usuarioId: "usuario-1",
      depois: {
        conversationId: "conversa-1",
        status: "answered",
        intent: "data_question",
      },
    });
    expect(JSON.stringify(registrar.mock.calls)).not.toContain("segredo");
  });
});

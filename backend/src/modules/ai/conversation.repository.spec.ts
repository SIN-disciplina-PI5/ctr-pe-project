import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { prisma } from "../../prisma/prisma.client.js";
import { ConversationRepository } from "./conversation.repository.js";

const scope = {
  empresaId: "emp_000001",
  usuarioId: "usr_000001",
};

const exchange = {
  ...scope,
  userMessage: "Quantas ordens estão abertas?",
  assistantMessage: "Há três ordens abertas.",
  intent: "data_question",
  status: "answered",
};

function transactionMock() {
  return {
    conversaIA: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    mensagemConversaIA: {
      createMany: jest.fn(),
    },
  };
}

function mockTransaction(transaction: ReturnType<typeof transactionMock>) {
  type Callback = (client: typeof transaction) => Promise<unknown>;
  jest
    .spyOn(prisma, "$transaction")
    .mockImplementation(((callback: Callback) =>
      callback(transaction)) as never);
}

describe("ConversationRepository", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("carrega somente o histórico do usuário e da empresa em ordem cronológica", async () => {
    const findFirst = jest
      .spyOn(prisma.conversaIA, "findFirst")
      .mockResolvedValue({
        id: "conversa-1",
        mensagens: [
          { papel: "ASSISTENTE", conteudo: "Resposta mais recente" },
          { papel: "USUARIO", conteudo: "Pergunta inicial" },
        ],
      } as never);

    const result = await new ConversationRepository().findWithHistory(
      "conversa-1",
      scope,
    );

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: "conversa-1",
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
      },
      select: {
        id: true,
        mensagens: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 20,
          select: { papel: true, conteudo: true },
        },
      },
    });
    expect(result).toEqual({
      id: "conversa-1",
      history: [
        { role: "user", content: "Pergunta inicial" },
        { role: "assistant", content: "Resposta mais recente" },
      ],
    });
  });

  it("não revela conversa fora do escopo", async () => {
    jest.spyOn(prisma.conversaIA, "findFirst").mockResolvedValue(null);

    await expect(
      new ConversationRepository().findWithHistory("conversa-alheia", scope),
    ).resolves.toBeNull();
  });

  it("cria a conversa com a troca completa e metadados seguros", async () => {
    const create = jest
      .spyOn(prisma.conversaIA, "create")
      .mockResolvedValue({ id: "conversa-nova" } as never);

    const result = await new ConversationRepository().saveExchange(exchange);

    expect(create).toHaveBeenCalledWith({
      data: {
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
        mensagens: {
          create: [
            {
              papel: "USUARIO",
              conteudo: exchange.userMessage,
            },
            {
              papel: "ASSISTENTE",
              conteudo: exchange.assistantMessage,
              intencao: exchange.intent,
              metadados: {
                status: exchange.status,
                intent: exchange.intent,
              },
            },
          ],
        },
      },
      select: { id: true },
    });
    expect(result).toBe("conversa-nova");
  });

  it("salva follow-up somente após confirmar o mesmo escopo na transação", async () => {
    const transaction = transactionMock();
    transaction.conversaIA.findFirst.mockResolvedValue({ id: "conversa-1" });
    transaction.mensagemConversaIA.createMany.mockResolvedValue({ count: 2 });
    transaction.conversaIA.update.mockResolvedValue({ id: "conversa-1" });
    mockTransaction(transaction);

    const result = await new ConversationRepository().saveExchange({
      ...exchange,
      conversationId: "conversa-1",
    });

    expect(transaction.conversaIA.findFirst).toHaveBeenCalledWith({
      where: {
        id: "conversa-1",
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
      },
      select: { id: true },
    });
    expect(transaction.mensagemConversaIA.createMany).toHaveBeenCalledWith({
      data: [
        {
          conversaId: "conversa-1",
          papel: "USUARIO",
          conteudo: exchange.userMessage,
        },
        {
          conversaId: "conversa-1",
          papel: "ASSISTENTE",
          conteudo: exchange.assistantMessage,
          intencao: exchange.intent,
          metadados: {
            status: exchange.status,
            intent: exchange.intent,
          },
        },
      ],
    });
    expect(transaction.conversaIA.update).toHaveBeenCalledWith({
      where: { id: "conversa-1" },
      data: { updatedAt: expect.any(Date) },
      select: { id: true },
    });
    expect(result).toBe("conversa-1");
  });

  it("não grava mensagens se a conversa não pertencer ao escopo", async () => {
    const transaction = transactionMock();
    transaction.conversaIA.findFirst.mockResolvedValue(null);
    mockTransaction(transaction);

    const result = await new ConversationRepository().saveExchange({
      ...exchange,
      conversationId: "conversa-alheia",
    });

    expect(result).toBeNull();
    expect(transaction.mensagemConversaIA.createMany).not.toHaveBeenCalled();
    expect(transaction.conversaIA.update).not.toHaveBeenCalled();
  });
});

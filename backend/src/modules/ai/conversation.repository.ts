import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";
import type { ConversationTurn } from "./orchestrator-classifier.service.js";

export interface ConversationScope {
  readonly empresaId: string;
  readonly usuarioId: string;
}

export interface ConversationSnapshot {
  readonly id: string;
  readonly history: readonly ConversationTurn[];
}

export interface SaveConversationExchangeInput extends ConversationScope {
  readonly conversationId?: string;
  readonly userMessage: string;
  readonly assistantMessage: string;
  readonly intent: string;
  readonly status: string;
}

export interface ConversationRepositoryPort {
  findWithHistory(
    id: string,
    scope: ConversationScope,
  ): Promise<ConversationSnapshot | null>;
  saveExchange(input: SaveConversationExchangeInput): Promise<string | null>;
}

const HISTORY_MESSAGE_LIMIT = 20;

export class ConversationRepository implements ConversationRepositoryPort {
  async findWithHistory(
    id: string,
    scope: ConversationScope,
  ): Promise<ConversationSnapshot | null> {
    const conversation = await prisma.conversaIA.findFirst({
      where: {
        id,
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
      },
      select: {
        id: true,
        mensagens: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: HISTORY_MESSAGE_LIMIT,
          select: { papel: true, conteudo: true },
        },
      },
    });

    if (!conversation) return null;

    return {
      id: conversation.id,
      history: conversation.mensagens.reverse().map((message) => ({
        role: message.papel === "USUARIO" ? "user" : "assistant",
        content: message.conteudo,
      })),
    };
  }

  async saveExchange(
    input: SaveConversationExchangeInput,
  ): Promise<string | null> {
    const metadata = {
      status: input.status,
      intent: input.intent,
    } satisfies Prisma.InputJsonObject;

    if (!input.conversationId) {
      const conversation = await prisma.conversaIA.create({
        data: {
          empresaId: input.empresaId,
          usuarioId: input.usuarioId,
          mensagens: {
            create: [
              { papel: "USUARIO", conteudo: input.userMessage },
              {
                papel: "ASSISTENTE",
                conteudo: input.assistantMessage,
                intencao: input.intent,
                metadados: metadata,
              },
            ],
          },
        },
        select: { id: true },
      });

      return conversation.id;
    }

    const conversationId = input.conversationId;

    return prisma.$transaction(async (transaction) => {
      const conversation = await transaction.conversaIA.findFirst({
        where: {
          id: conversationId,
          empresaId: input.empresaId,
          usuarioId: input.usuarioId,
        },
        select: { id: true },
      });

      if (!conversation) return null;

      await transaction.mensagemConversaIA.createMany({
        data: [
          {
            conversaId: conversation.id,
            papel: "USUARIO",
            conteudo: input.userMessage,
          },
          {
            conversaId: conversation.id,
            papel: "ASSISTENTE",
            conteudo: input.assistantMessage,
            intencao: input.intent,
            metadados: metadata,
          },
        ],
      });
      await transaction.conversaIA.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
        select: { id: true },
      });

      return conversation.id;
    });
  }
}

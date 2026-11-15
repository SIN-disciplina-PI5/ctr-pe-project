import { performance } from "node:perf_hooks";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { AuthUser } from "../../common/types/auth-user.js";
import type {
  ConversationRepositoryPort,
  ConversationScope,
  ConversationSnapshot,
} from "./conversation.repository.js";
import { LlmProviderError } from "./llm-provider.js";
import type {
  OrchestratorResult,
  OrchestratorService,
} from "./orchestrator.service.js";

export interface ChatInput {
  readonly actor: AuthUser;
  readonly message: string;
  readonly conversationId?: string;
}

export interface ChatResult {
  readonly id: string;
  readonly conversationId: string;
  readonly message: string;
  readonly status: OrchestratorResult["status"];
  readonly intent: OrchestratorResult["intent"];
  readonly latencyMs: number;
  readonly result: OrchestratorResult;
}

function assistantMessageOf(result: OrchestratorResult): string {
  if (result.intent === "data_question") {
    return result.result.status === "answered"
      ? result.result.answer
      : result.result.reason;
  }

  return result.message;
}

function safeProviderError(error: LlmProviderError): AppError {
  return new AppError({
    message:
      error.code === "TIMEOUT"
        ? "O assistente excedeu o tempo limite. Tente novamente."
        : "O assistente está temporariamente indisponível.",
    statusCode: error.code === "TIMEOUT" ? 504 : 502,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    details: { providerErrorCode: error.code },
  });
}

function conversationNotFoundError(): AppError {
  return new AppError({
    message: "Conversa não encontrada.",
    statusCode: 404,
    errorCode: ErrorCode.NOT_FOUND,
  });
}

export class ChatService {
  constructor(
    private readonly repository: ConversationRepositoryPort,
    private readonly orchestrator: OrchestratorService,
  ) {}

  async chat(input: ChatInput): Promise<ChatResult> {
    const startedAt = performance.now();
    const scope = this.resolveScope(input.actor);
    const conversation = await this.loadConversation(
      input.conversationId,
      scope,
    );
    const orchestration = await this.executeOrchestration(
      input.message,
      scope.empresaId,
      conversation,
    );

    const assistantMessage = assistantMessageOf(orchestration);
    const conversationId = await this.persistExchange({
      scope,
      conversationId: conversation?.id,
      userMessage: input.message,
      assistantMessage,
      orchestration,
    });

    const latencyMs = Math.max(0, Math.round(performance.now() - startedAt));

    return {
      id: conversationId,
      conversationId,
      message: assistantMessage,
      status: orchestration.status,
      intent: orchestration.intent,
      latencyMs,
      result: orchestration,
    };
  }

  private resolveScope(actor: AuthUser): ConversationScope {
    const empresaId = actor.empresaId?.trim();
    if (!empresaId) {
      throw new AppError({
        message: "É necessário selecionar uma empresa para usar o assistente.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    return {
      empresaId,
      usuarioId: actor.id,
    };
  }

  private async loadConversation(
    conversationId: string | undefined,
    scope: ConversationScope,
  ): Promise<ConversationSnapshot | null> {
    if (!conversationId) return null;

    const conversation = await this.repository.findWithHistory(
      conversationId,
      scope,
    );

    if (!conversation) {
      throw conversationNotFoundError();
    }

    return conversation;
  }

  private async executeOrchestration(
    message: string,
    empresaId: string,
    conversation: ConversationSnapshot | null,
  ): Promise<OrchestratorResult> {
    try {
      return await this.orchestrator.handle({
        message,
        empresaId,
        ...(conversation ? { history: conversation.history } : {}),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) throw safeProviderError(error);
      throw error;
    }
  }

  private async persistExchange(params: {
    scope: ConversationScope;
    conversationId?: string | undefined;
    userMessage: string;
    assistantMessage: string;
    orchestration: OrchestratorResult;
  }): Promise<string> {
    const savedId = await this.repository.saveExchange({
      ...params.scope,
      ...(params.conversationId
        ? { conversationId: params.conversationId }
        : {}),
      userMessage: params.userMessage,
      assistantMessage: params.assistantMessage,
      intent: params.orchestration.intent,
      status: params.orchestration.status,
    });

    if (!savedId) {
      throw conversationNotFoundError();
    }

    return savedId;
  }
}

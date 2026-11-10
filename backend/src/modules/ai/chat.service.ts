import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { AuthUser } from "../../common/types/auth-user.js";
import type {
  ConversationRepositoryPort,
  ConversationScope,
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

export class ChatService {
  constructor(
    private readonly repository: ConversationRepositoryPort,
    private readonly orchestrator: OrchestratorService,
  ) {}

  async chat(input: ChatInput): Promise<ChatResult> {
    const empresaId = input.actor.empresaId?.trim();
    if (!empresaId) {
      throw new AppError({
        message: "É necessário selecionar uma empresa para usar o assistente.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const scope: ConversationScope = {
      empresaId,
      usuarioId: input.actor.id,
    };
    const conversation = input.conversationId
      ? await this.repository.findWithHistory(input.conversationId, scope)
      : null;

    if (input.conversationId && !conversation) {
      throw new AppError({
        message: "Conversa não encontrada.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    let orchestration: OrchestratorResult;
    try {
      orchestration = await this.orchestrator.handle({
        message: input.message,
        empresaId,
        ...(conversation ? { history: conversation.history } : {}),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) throw safeProviderError(error);
      throw error;
    }

    const assistantMessage = assistantMessageOf(orchestration);
    const conversationId = await this.repository.saveExchange({
      ...scope,
      ...(conversation ? { conversationId: conversation.id } : {}),
      userMessage: input.message,
      assistantMessage,
      intent: orchestration.intent,
      status: orchestration.status,
    });

    if (!conversationId) {
      throw new AppError({
        message: "Conversa não encontrada.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return {
      id: conversationId,
      conversationId,
      message: assistantMessage,
      status: orchestration.status,
      intent: orchestration.intent,
      result: orchestration,
    };
  }
}

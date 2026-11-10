import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import type { AuthUser } from "../../common/types/auth-user.js";
import type {
  ConversationRepositoryPort,
  ConversationScope,
  ConversationSnapshot,
  SaveConversationExchangeInput,
} from "./conversation.repository.js";
import { ChatService } from "./chat.service.js";
import { LlmProviderError } from "./llm-provider.js";
import type {
  OrchestratorInput,
  OrchestratorResult,
  OrchestratorService,
} from "./orchestrator.service.js";

const actor: AuthUser = {
  id: "usuario-1",
  empresaId: "empresa-1",
  nome: "Usuário Teste",
  email: "usuario@teste.com",
  perfil: "CONSULTA",
};

const answered: OrchestratorResult = {
  status: "answered",
  intent: "data_question",
  result: {
    status: "answered",
    mode: "single",
    answer: "Há três ordens abertas.",
    answerMetrics: null,
    sql: 'SELECT * FROM ai."ordens_servico" LIMIT 100',
    rowsUsed: [{ quantidade: 3 }],
    execution: { rowCount: 1, latencyMs: 4 },
    correctionApplied: false,
    correctionMetrics: null,
    relevantViews: ["ordens_servico"],
    generation: {
      provider: "test",
      model: "test",
      latencyMs: 1,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    },
  },
};

class FakeRepository implements ConversationRepositoryPort {
  public foundScope: ConversationScope | null = null;
  public saved: SaveConversationExchangeInput | null = null;

  constructor(
    private readonly snapshot: ConversationSnapshot | null = null,
    private readonly savedId: string | null = "conversa-nova",
  ) {}

  async findWithHistory(
    _id: string,
    scope: ConversationScope,
  ): Promise<ConversationSnapshot | null> {
    this.foundScope = scope;
    return this.snapshot;
  }

  async saveExchange(
    input: SaveConversationExchangeInput,
  ): Promise<string | null> {
    this.saved = input;
    return this.savedId;
  }
}

class FakeOrchestrator {
  public receivedInput: OrchestratorInput | null = null;

  constructor(
    private readonly result: OrchestratorResult = answered,
    private readonly failure?: unknown,
  ) {}

  async handle(input: OrchestratorInput): Promise<OrchestratorResult> {
    this.receivedInput = input;
    if (this.failure) throw this.failure;
    return this.result;
  }
}

function createService(
  repository: FakeRepository,
  orchestrator = new FakeOrchestrator(),
) {
  return {
    service: new ChatService(
      repository,
      orchestrator as unknown as OrchestratorService,
    ),
    orchestrator,
  };
}

describe("ChatService", () => {
  it("cria conversa, delega ao orquestrador e persiste a troca", async () => {
    const repository = new FakeRepository();
    const { service, orchestrator } = createService(repository);

    const result = await service.chat({
      actor,
      message: "Quantas ordens estão abertas?",
    });

    expect(orchestrator.receivedInput).toEqual({
      message: "Quantas ordens estão abertas?",
      empresaId: "empresa-1",
    });
    expect(repository.saved).toMatchObject({
      empresaId: "empresa-1",
      usuarioId: "usuario-1",
      userMessage: "Quantas ordens estão abertas?",
      assistantMessage: "Há três ordens abertas.",
      intent: "data_question",
      status: "answered",
    });
    expect(result).toMatchObject({
      id: "conversa-nova",
      conversationId: "conversa-nova",
      message: "Há três ordens abertas.",
      status: "answered",
      intent: "data_question",
    });
  });

  it("carrega somente a conversa do mesmo usuário e empresa", async () => {
    const history = [
      { role: "user" as const, content: "Quantas estão abertas?" },
      { role: "assistant" as const, content: "Há três." },
    ];
    const repository = new FakeRepository({
      id: "conversa-123",
      history,
    });
    const { service, orchestrator } = createService(repository);

    await service.chat({
      actor,
      message: "E no mês passado?",
      conversationId: "conversa-123",
    });

    expect(repository.foundScope).toEqual({
      empresaId: "empresa-1",
      usuarioId: "usuario-1",
    });
    expect(orchestrator.receivedInput).toEqual({
      message: "E no mês passado?",
      empresaId: "empresa-1",
      history,
    });
    expect(repository.saved).toMatchObject({
      conversationId: "conversa-123",
    });
  });

  it("não revela conversa de outro escopo", async () => {
    const { service } = createService(new FakeRepository(null));

    await expect(
      service.chat({
        actor,
        message: "Continue.",
        conversationId: "conversa-alheia",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      errorCode: "NOT_FOUND",
      message: "Conversa não encontrada.",
    });
  });

  it("exige empresa selecionada", async () => {
    const { service } = createService(new FakeRepository());

    await expect(
      service.chat({
        actor: { ...actor, empresaId: null },
        message: "Consulte os ativos.",
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      errorCode: "FORBIDDEN",
    });
  });

  it("converte timeout do provedor em erro seguro", async () => {
    const failure = new LlmProviderError(
      "TIMEOUT",
      "mensagem interna que não deve vazar",
    );
    const { service } = createService(
      new FakeRepository(),
      new FakeOrchestrator(answered, failure),
    );

    await expect(
      service.chat({
        actor,
        message: "Quantas ordens estão abertas?",
      }),
    ).rejects.toEqual(
      expect.objectContaining({
        statusCode: 504,
        message: "O assistente excedeu o tempo limite. Tente novamente.",
      }),
    );
  });

  it("preserva erros de domínio do fluxo consultado", async () => {
    const failure = new AppError({
      message: "É necessário selecionar uma empresa.",
      statusCode: 403,
      errorCode: "FORBIDDEN",
    });
    const { service } = createService(
      new FakeRepository(),
      new FakeOrchestrator(answered, failure),
    );

    await expect(
      service.chat({ actor, message: "Consulte os ativos." }),
    ).rejects.toBe(failure);
  });
});

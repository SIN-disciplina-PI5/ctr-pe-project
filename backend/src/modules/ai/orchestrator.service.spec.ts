import { describe, expect, it } from "@jest/globals";
import type {
  ClassifyIntentInput,
  OrchestratorClassifierService,
} from "./orchestrator-classifier.service.js";
import type { OrchestratorIntent } from "./orchestrator.js";
import type { GenerateQueryInput } from "./query-generation.service.js";
import type {
  QueryAgentResult,
  QueryAgentService,
} from "./query-agent.service.js";
import { OrchestratorService } from "./orchestrator.service.js";

class FakeClassifier {
  public receivedInput: ClassifyIntentInput | null = null;

  constructor(private readonly classification: OrchestratorIntent) {}

  async classify(input: ClassifyIntentInput): Promise<OrchestratorIntent> {
    this.receivedInput = input;
    return this.classification;
  }
}

class FakeQueryAgent {
  public receivedInput: GenerateQueryInput | null = null;

  constructor(private readonly result: QueryAgentResult) {}

  async query(input: GenerateQueryInput): Promise<QueryAgentResult> {
    this.receivedInput = input;
    return this.result;
  }
}

function createClassification(
  intent: OrchestratorIntent["intent"],
  overrides: Partial<OrchestratorIntent> = {},
): OrchestratorIntent {
  return {
    intent,
    contextualizedQuestion: null,
    clarification: null,
    refusalReason: null,
    ...overrides,
  };
}

const input = {
  message: "E as do mês passado?",
  empresaId: "empresa-1",
};

const answeredQueryResult = {
  status: "answered",
  mode: "single",
  answer: "Há 3 ordens de serviço abertas.",
} as QueryAgentResult;

function createService(
  classification: OrchestratorIntent,
  queryResult: QueryAgentResult = answeredQueryResult,
) {
  const classifier = new FakeClassifier(classification);
  const queryAgent = new FakeQueryAgent(queryResult);

  const service = new OrchestratorService(
    classifier as unknown as OrchestratorClassifierService,
    queryAgent as unknown as QueryAgentService,
  );

  return { service, classifier, queryAgent };
}

describe("OrchestratorService", () => {
  it("encaminha perguntas sobre dados ao Query Agent com a pergunta contextualizada", async () => {
    const classification = createClassification("data_question", {
      contextualizedQuestion:
        "Quantas ordens de serviço foram abertas no mês passado?",
    });

    const { service, classifier, queryAgent } = createService(classification);

    const result = await service.handle({
      ...input,
      history: [{ role: "user", content: "E as do mês passado?" }],
    });

    expect(result).toEqual({
      status: "answered",
      intent: "data_question",
      classificationMetrics: null,
      result: answeredQueryResult,
    });

    expect(classifier.receivedInput).toEqual({
      message: input.message,
      history: [{ role: "user", content: "E as do mês passado?" }],
    });

    expect(queryAgent.receivedInput).toEqual({
      question: "Quantas ordens de serviço foram abertas no mês passado?",
      empresaId: "empresa-1",
    });
  });

  it("retorna placeholder quando a intenção é solicitar um relatório", async () => {
    const { service, queryAgent } = createService(
      createClassification("report_request"),
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "report_pending",
      intent: "report_request",
      classificationMetrics: null,
      message:
        "A funcionalidade de geração de relatórios ainda não está disponível.",
    });

    expect(queryAgent.receivedInput).toBeNull();
  });

  it("solicita esclarecimento quando a intenção é ambígua", async () => {
    const { service, queryAgent } = createService(
      createClassification("unclear", {
        clarification: "Você deseja consultar qual período?",
      }),
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "clarification",
      intent: "unclear",
      classificationMetrics: null,
      message: "Você deseja consultar qual período?",
    });

    expect(queryAgent.receivedInput).toBeNull();
  });

  it("recusa solicitações de escrita", async () => {
    const { service, queryAgent } = createService(
      createClassification("write_request", {
        refusalReason: "Não posso alterar ou excluir registros.",
      }),
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "refused",
      intent: "write_request",
      classificationMetrics: null,
      message: "Não posso alterar ou excluir registros.",
    });

    expect(queryAgent.receivedInput).toBeNull();
  });

  it("recusa assuntos fora do domínio", async () => {
    const { service, queryAgent } = createService(
      createClassification("out_of_domain", {
        refusalReason: "Esse assunto não pertence ao domínio de manutenção.",
      }),
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "refused",
      intent: "out_of_domain",
      classificationMetrics: null,
      message: "Esse assunto não pertence ao domínio de manutenção.",
    });

    expect(queryAgent.receivedInput).toBeNull();
  });

  it("preserva a recusa retornada pelo Query Agent", async () => {
    const queryRefusal: QueryAgentResult = {
      status: "refused",
      reason: "O contexto não permite responder com segurança.",
      relevantViews: [],
    };

    const { service } = createService(
      createClassification("data_question", {
        contextualizedQuestion: "Quantos ativos estão parados?",
      }),
      queryRefusal,
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "refused",
      intent: "data_question",
      classificationMetrics: null,
      result: queryRefusal,
    });
  });
});

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
import type {
  GeneratedReport,
  ReportAgent,
  ReportAgentInput,
} from "./report-agent.service.js";

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

class FakeReportAgent implements ReportAgent {
  public receivedInput: ReportAgentInput | null = null;

  constructor(private readonly result: GeneratedReport) {}

  async generate(input: ReportAgentInput): Promise<GeneratedReport> {
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

const generatedReport: GeneratedReport = {
  status: "generated",
  reportType: "monthly_maintenance",
  title: "Relatório mensal de manutenção",
  sections: [],
  planningMetrics: {
    provider: "fake",
    model: "fake-report-model",
    latencyMs: 2,
    inputTokens: 5,
    outputTokens: 3,
    totalTokens: 8,
  },
};

function createService(
  classification: OrchestratorIntent,
  queryResult: QueryAgentResult = answeredQueryResult,
) {
  const classifier = new FakeClassifier(classification);
  const queryAgent = new FakeQueryAgent(queryResult);
  const reportAgent = new FakeReportAgent(generatedReport);

  const service = new OrchestratorService(
    classifier as unknown as OrchestratorClassifierService,
    queryAgent as unknown as QueryAgentService,
    reportAgent,
  );

  return { service, classifier, queryAgent, reportAgent };
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

  it("encaminha solicitações de relatório ao Report Agent", async () => {
    const { service, queryAgent, reportAgent } = createService(
      createClassification("report_request"),
    );

    const result = await service.handle(input);

    expect(result).toEqual({
      status: "report_generated",
      intent: "report_request",
      classificationMetrics: null,
      message: 'Relatório "Relatório mensal de manutenção" gerado com sucesso.',
      report: generatedReport,
    });

    expect(queryAgent.receivedInput).toBeNull();
    expect(reportAgent.receivedInput).toEqual({
      request: input.message,
      empresaId: input.empresaId,
    });
  });

  it("mantém o placeholder quando nenhum Report Agent foi configurado", async () => {
    const classifier = new FakeClassifier(
      createClassification("report_request"),
    );
    const queryAgent = new FakeQueryAgent(answeredQueryResult);
    const service = new OrchestratorService(
      classifier as unknown as OrchestratorClassifierService,
      queryAgent as unknown as QueryAgentService,
    );

    await expect(service.handle(input)).resolves.toMatchObject({
      status: "report_pending",
      intent: "report_request",
    });
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

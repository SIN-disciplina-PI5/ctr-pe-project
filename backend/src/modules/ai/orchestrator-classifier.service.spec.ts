import { describe, expect, it } from "@jest/globals";
import type { output, ZodType } from "zod";
import { OrchestratorClassifierService } from "./orchestrator-classifier.service.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationRequest,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import type { OrchestratorIntent } from "./orchestrator.js";
import { ORCHESTRATOR_SYSTEM_PROMPT } from "./orchestrator-prompts.config.js";

function createFakeProvider(response: OrchestratorIntent) {
  let receivedRequest:
    | {
        schemaName: string;
        systemPrompt: string;
        userPrompt: string;
      }
    | undefined;

  const provider: LlmProvider = {
    async generateStructured<TSchema extends ZodType>(
      request: StructuredGenerationRequest<TSchema>,
    ): Promise<StructuredGenerationResult<output<TSchema>>> {
      receivedRequest = {
        schemaName: request.schemaName,
        systemPrompt: request.systemPrompt,
        userPrompt: request.userPrompt,
      };

      return {
        data: response as unknown as output<TSchema>,
        provider: "test",
        model: "test-model",
        latencyMs: 1,
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
      };
    },
  };

  return {
    provider,
    getReceivedRequest: () => receivedRequest,
  };
}

describe("OrchestratorClassifierService", () => {
  const examples: Array<{
    message: string;
    expected: OrchestratorIntent;
  }> = [
    {
      message: "Quantas ordens de serviço estão abertas?",
      expected: {
        intent: "data_question",
        contextualizedQuestion: "Quantas ordens de serviço estão abertas?",
        clarification: null,
        refusalReason: null,
      },
    },
    {
      message: "Gere um relatório mensal de manutenção.",
      expected: {
        intent: "report_request",
        contextualizedQuestion: null,
        clarification: null,
        refusalReason: null,
      },
    },
    {
      message: "E as do mês passado?",
      expected: {
        intent: "unclear",
        contextualizedQuestion: null,
        clarification: "A quais informações você está se referindo?",
        refusalReason: null,
      },
    },
    {
      message: "Exclua todas as ordens de serviço antigas.",
      expected: {
        intent: "write_request",
        contextualizedQuestion: null,
        clarification: null,
        refusalReason: "Não posso executar alterações ou exclusões de dados.",
      },
    },
    {
      message: "Qual é a capital da França?",
      expected: {
        intent: "out_of_domain",
        contextualizedQuestion: null,
        clarification: null,
        refusalReason: "Posso ajudar apenas com manutenção e gestão de ativos.",
      },
    },
  ];

      it.each([
        {
        description: "data_question sem pergunta contextualizada",
        response: {
            intent: "data_question",
            contextualizedQuestion: "   ",
            clarification: null,
            refusalReason: null,
        },
        },
        {
        description: "report_request com campos adicionais",
        response: {
            intent: "report_request",
            contextualizedQuestion: "Alguma pergunta",
            clarification: null,
            refusalReason: null,
        },
        },
        {
        description: "unclear sem esclarecimento",
        response: {
            intent: "unclear",
            contextualizedQuestion: null,
            clarification: null,
            refusalReason: null,
        },
        },
        {
        description: "write_request sem motivo de recusa",
        response: {
            intent: "write_request",
            contextualizedQuestion: null,
            clarification: null,
            refusalReason: null,
        },
        },
        {
        description: "out_of_domain com campos inconsistentes",
        response: {
            intent: "out_of_domain",
            contextualizedQuestion: "Pergunta fora do domínio",
            clarification: null,
            refusalReason: "Fora do domínio.",
        },
        },
    ] as Array<{
        description: string;
        response: OrchestratorIntent;
    }>)(
        "rejeita classificação inválida: $description",
        async ({ response }) => {
        const fake = createFakeProvider(response);
        const classifier = new OrchestratorClassifierService(fake.provider);

        await expect(
            classifier.classify({ message: "Mensagem de teste" }),
        ).rejects.toMatchObject({
            name: "LlmProviderError",
            code: "INVALID_RESPONSE",
        });
        },
    );

  it("envia o schema e o prompt de sistema ao provider", async () => {
    const fake = createFakeProvider({
      intent: "report_request",
      contextualizedQuestion: null,
      clarification: null,
      refusalReason: null,
    });

    const classifier = new OrchestratorClassifierService(fake.provider);

    await classifier.classify({
      message: "Gere um relatório.",
    });

    const request = fake.getReceivedRequest();

    expect(request?.schemaName).toBe("ctrpe_orchestrator_intent");
    expect(request?.systemPrompt).toBe(ORCHESTRATOR_SYSTEM_PROMPT);
  });

  it("considera somente os últimos dez turnos do histórico", async () => {
    const fake = createFakeProvider({
      intent: "data_question",
      contextualizedQuestion: "Quantas ordens estão abertas?",
      clarification: null,
      refusalReason: null,
    });

    const classifier = new OrchestratorClassifierService(fake.provider);

    const history = Array.from({ length: 22 }, (_, index) => ({
    role: index % 2 === 0 ? "user" as const : "assistant" as const,
    content:
        index === 0 ? "mensagem-antiga" : `mensagem-${index + 1}`,
    }));
        await classifier.classify({
        message: "Quantas estão abertas?",
        history,
        });

    const userPrompt = fake.getReceivedRequest()?.userPrompt;

    expect(userPrompt).toContain(JSON.stringify(history.slice(-20)));
    expect(userPrompt).not.toContain("mensagem-antiga");

  });
});
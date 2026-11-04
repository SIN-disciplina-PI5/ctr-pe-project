import { describe, expect, it } from "@jest/globals";
import { z, type output, type ZodType } from "zod";
import { AppError } from "../../common/errors/AppError.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationRequest,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import { QueryGenerationService } from "./query-generation.service.js";

class FakeProvider implements LlmProvider {
  public request: StructuredGenerationRequest<ZodType> | null = null;

  constructor(
    private readonly data: unknown,
    private readonly failure?: Error,
  ) {}

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    this.request = request;
    if (this.failure) throw this.failure;

    return {
      data: request.schema.parse(this.data),
      provider: "fake",
      model: "fake-model",
      latencyMs: 12,
      inputTokens: 20,
      outputTokens: 10,
      totalTokens: 30,
    };
  }
}

const input = {
  question: "Quais ativos estão parados?",
  empresaId: "empresa-1",
};

describe("QueryGenerationService", () => {
  it("gera SQL válido usando somente o contexto relevante", async () => {
    const provider = new FakeProvider({
      type: "query",
      sql: `SELECT "codigo", "nome" FROM ai."Ativo" WHERE "status" = 'PARADO' LIMIT 100`,
      explanation: "Lista os ativos parados.",
      assumptions: [],
    });

    const result = await new QueryGenerationService(provider).generate(input);

    expect(result).toMatchObject({
      status: "generated",
      relevantViews: ["Ativo"],
      validation: { valid: true, views: ["Ativo"], limit: 100 },
      metrics: { provider: "fake", totalTokens: 30 },
    });
    expect(provider.request?.userPrompt).toContain('ai."Ativo"');
    expect(provider.request?.userPrompt).not.toContain('ai."Usuario"');
    expect(provider.request?.userPrompt).not.toContain('ai."Material"');
  });

  it("recusa assunto externo sem chamar o provedor", async () => {
    const provider = new FakeProvider(null);

    await expect(
      new QueryGenerationService(provider).generate({
        question: "Qual é a previsão do tempo para amanhã?",
        empresaId: "empresa-1",
      }),
    ).resolves.toEqual({
      status: "refused",
      reason:
        "A pergunta não está relacionada aos dados de manutenção disponíveis.",
      relevantViews: [],
    });
    expect(provider.request).toBeNull();
  });

  it("preserva uma recusa estruturada do modelo", async () => {
    const provider = new FakeProvider({
      type: "refusal",
      reason: "O contexto não permite responder com segurança.",
    });

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).resolves.toMatchObject({
      status: "refused",
      reason: "O contexto não permite responder com segurança.",
      metrics: { model: "fake-model" },
    });
  });

  it("exige a empresa do usuário autenticado", async () => {
    const provider = new FakeProvider(null);

    await expect(
      new QueryGenerationService(provider).generate({
        ...input,
        empresaId: null,
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(provider.request).toBeNull();
  });

  it("bloqueia relação não autorizada produzida pelo modelo", async () => {
    const provider = new FakeProvider({
      type: "query",
      sql: `SELECT "email" FROM public."Usuario" LIMIT 10`,
      explanation: "Consulta usuários.",
      assumptions: [],
    });

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).rejects.toMatchObject({
      statusCode: 422,
      details: {
        violations: expect.arrayContaining(["View não autorizada: Usuario."]),
      },
    });
  });

  it("bloqueia consulta sem LIMIT", async () => {
    const provider = new FakeProvider({
      type: "query",
      sql: `SELECT "codigo" FROM ai."Ativo"`,
      explanation: "Lista os ativos.",
      assumptions: [],
    });

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).rejects.toMatchObject({
      statusCode: 422,
      details: {
        violations: expect.arrayContaining([
          "LIMIT obrigatório não identificado.",
        ]),
      },
    });
  });

  it("não transforma payload inválido do provedor em SQL nem expõe sua causa", async () => {
    const provider = new FakeProvider(
      null,
      new LlmProviderError(
        "INVALID_RESPONSE",
        "O provedor de IA retornou uma resposta inválida.",
      ),
    );

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).rejects.toMatchObject({
      statusCode: 502,
      message: "O provedor de IA retornou uma resposta inválida.",
      details: { providerErrorCode: "INVALID_RESPONSE" },
    });
  });

  it("usa AppError verificável nas violações de segurança", async () => {
    const provider = new FakeProvider({
      type: "query",
      sql: `SELECT set_config('ctrpe.current_empresa_id', 'outra', true) FROM ai."Ativo" LIMIT 1`,
      explanation: "Tentativa insegura.",
      assumptions: [],
    });

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).rejects.toBeInstanceOf(AppError);
  });
});

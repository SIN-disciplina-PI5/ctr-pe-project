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
    expect(provider.request?.userPrompt).toContain(
      "Exemplos confiáveis de pergunta e SQL:",
    );
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

  it("aceita um plano curto somente após validar todas as etapas", async () => {
    const provider = new FakeProvider({
      type: "query_plan",
      explanation: "Consulta ativos e materiais separadamente.",
      assumptions: [],
      steps: [
        {
          id: "ativos_parados",
          purpose: "Listar ativos parados.",
          sql: `SELECT "codigo" FROM ai."Ativo" WHERE "status" = 'PARADO' LIMIT 100`,
        },
        {
          id: "materiais_baixos",
          purpose: "Listar materiais com estoque baixo.",
          sql: `SELECT "codigo" FROM ai."Material" WHERE "estoqueAtual" < "estoqueMinimo" LIMIT 100`,
        },
      ],
    });

    await expect(
      new QueryGenerationService(provider).generate({
        question:
          "Quais ativos estão parados e quais materiais estão com estoque baixo?",
        empresaId: "empresa-1",
      }),
    ).resolves.toMatchObject({
      status: "planned",
      steps: [
        { id: "ativos_parados", validation: { valid: true } },
        { id: "materiais_baixos", validation: { valid: true } },
      ],
    });
  });

  it("recusa plano com identificadores duplicados", async () => {
    const provider = new FakeProvider({
      type: "query_plan",
      explanation: "Plano inválido.",
      assumptions: [],
      steps: [
        {
          id: "consulta",
          purpose: "Primeira consulta.",
          sql: `SELECT "codigo" FROM ai."Ativo" LIMIT 100`,
        },
        {
          id: "consulta",
          purpose: "Segunda consulta.",
          sql: `SELECT "nome" FROM ai."Ativo" LIMIT 100`,
        },
      ],
    });

    await expect(
      new QueryGenerationService(provider).generate(input),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("corrige uma consulta uma vez e revalida o novo SQL", async () => {
    const provider = new FakeProvider({
      sql: `SELECT "codigo" FROM ai."Ativo" LIMIT 100`,
      explanation: "Usa uma coluna existente.",
    });

    const result = await new QueryGenerationService(provider).correct({
      question: input.question,
      empresaId: "empresa-1",
      failedSql: `SELECT "coluna_inexistente" FROM ai."Ativo" LIMIT 100`,
      safeFeedback: "A consulta referencia\u0000 uma coluna inexistente.",
      relevantViews: ["Ativo"],
    });

    expect(result).toMatchObject({ validation: { valid: true } });
    expect(provider.request?.userPrompt).not.toContain("\u0000");
    expect(provider.request?.userPrompt).toContain(
      "Exemplos confiáveis de pergunta e SQL:",
    );
  });

  it("recusa a correção quando o novo SQL continua inseguro", async () => {
    const provider = new FakeProvider({
      sql: `SELECT * FROM public."Usuario" LIMIT 100`,
      explanation: "Consulta incorreta.",
    });

    await expect(
      new QueryGenerationService(provider).correct({
        question: input.question,
        empresaId: "empresa-1",
        failedSql: `SELECT "x" FROM ai."Ativo" LIMIT 100`,
        safeFeedback: "A consulta referencia uma coluna inexistente.",
        relevantViews: ["Ativo"],
      }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

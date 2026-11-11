import { describe, expect, it, jest } from "@jest/globals";
import { APIConnectionTimeoutError, Groq } from "groq-sdk";
import { z } from "zod";
import { GroqProvider } from "./groq-provider.js";
import { LlmProviderError, type LlmObserver } from "./llm-provider.js";

type GroqClient = Pick<Groq, "chat">;

const responseSchema = z.object({
  sql: z.string().min(1),
  explanation: z.string(),
});

const request = {
  schemaName: "sql_generation",
  schema: responseSchema,
  systemPrompt: "Gere SQL somente de leitura.",
  userPrompt: "Liste os ativos parados.",
};

function completion(content: string | null) {
  return {
    id: "completion-1",
    object: "chat.completion" as const,
    created: 1,
    model: "openai/gpt-oss-120b",
    choices: [
      {
        index: 0,
        finish_reason: "stop" as const,
        logprobs: null,
        message: { role: "assistant" as const, content },
      },
    ],
    usage: {
      prompt_tokens: 20,
      completion_tokens: 10,
      total_tokens: 30,
    },
  };
}

function mockClient(result: unknown): {
  client: GroqClient;
  create: jest.Mock<
    (body: unknown, options?: unknown) => Promise<unknown>
  >;
} {
  const create = jest.fn<
    (body: unknown, options?: unknown) => Promise<unknown>
  >();
  if (result instanceof Error) create.mockRejectedValue(result);
  else create.mockResolvedValue(result);

  return {
    client: {
      chat: { completions: { create } },
    } as unknown as GroqClient,
    create,
  };
}

function provider(
  client: GroqClient,
  observer?: LlmObserver,
  now?: () => number,
) {
  return new GroqProvider({
    apiKey: "test-key",
    model: "openai/gpt-oss-120b",
    timeoutMs: 5_000,
    client,
    observer,
    now,
  });
}

describe("GroqProvider", () => {
  it("gera e valida uma resposta estruturada com métricas", async () => {
    const { client, create } = mockClient(
      completion(
        JSON.stringify({ sql: "SELECT 1 LIMIT 1", explanation: "Teste" }),
      ),
    );
    const record = jest.fn<LlmObserver["record"]>();
    const now = jest
      .fn<() => number>()
      .mockReturnValueOnce(10)
      .mockReturnValue(35);

    const result = await provider(client, { record }, now).generateStructured(
      request,
    );

    expect(result).toEqual({
      data: { sql: "SELECT 1 LIMIT 1", explanation: "Teste" },
      provider: "groq",
      model: "openai/gpt-oss-120b",
      latencyMs: 25,
      inputTokens: 20,
      outputTokens: 10,
      totalTokens: 30,
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        response_format: expect.objectContaining({ type: "json_schema" }),
      }),
      { timeout: 5_000, maxRetries: 0 },
    );
    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        latencyMs: 25,
        totalTokens: 30,
      }),
    );
  });

  it("adapta união de raiz ao schema aceito pela Groq", async () => {
    const unionSchema = z.discriminatedUnion("type", [
      z.object({ type: z.literal("query"), sql: z.string() }).strict(),
      z.object({ type: z.literal("refusal"), reason: z.string() }).strict(),
    ]);
    const { client, create } = mockClient(
      completion(
        JSON.stringify({
          result: { type: "refusal", reason: "Sem contexto" },
        }),
      ),
    );

    const result = await provider(client).generateStructured({
      ...request,
      schema: unionSchema,
    });

    const sentRequest = create.mock.calls[0]?.[0] as {
      response_format?: {
        json_schema?: { schema?: Record<string, unknown> };
      };
    };
    const sentSchema = sentRequest.response_format?.json_schema?.schema;

    expect(sentSchema).toMatchObject({
      type: "object",
      properties: { result: { anyOf: expect.any(Array) } },
      required: ["result"],
      additionalProperties: false,
    });
    expect(sentSchema).not.toHaveProperty("anyOf");
    expect(sentSchema).not.toHaveProperty("oneOf");
    expect(result.data).toEqual({
      type: "refusal",
      reason: "Sem contexto",
    });
  });

  it("converte timeout do SDK em erro seguro", async () => {
    const { client } = mockClient(new APIConnectionTimeoutError());

    await expect(
      provider(client).generateStructured(request),
    ).rejects.toMatchObject({
      name: "LlmProviderError",
      code: "TIMEOUT",
      message: "O provedor de IA excedeu o tempo limite.",
    });
  });

  it("recusa resposta vazia", async () => {
    const { client } = mockClient(completion(null));

    await expect(
      provider(client).generateStructured(request),
    ).rejects.toMatchObject({
      code: "EMPTY_RESPONSE",
    });
  });

  it("recusa JSON inválido", async () => {
    const { client } = mockClient(completion("não é JSON"));

    await expect(
      provider(client).generateStructured(request),
    ).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("recusa conteúdo que não corresponde ao schema", async () => {
    const { client } = mockClient(completion(JSON.stringify({ sql: "" })));

    await expect(
      provider(client).generateStructured(request),
    ).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("oculta detalhes de erros do provedor e registra somente metadados", async () => {
    const { client } = mockClient(
      new Error("chave-secreta e payload sensível"),
    );
    const record = jest.fn<LlmObserver["record"]>();

    let captured: unknown;
    try {
      await provider(client, { record }).generateStructured(request);
    } catch (error) {
      captured = error;
    }

    expect(captured).toBeInstanceOf(LlmProviderError);
    expect(captured).toMatchObject({
      code: "PROVIDER_ERROR",
      message: "Não foi possível obter resposta do provedor de IA.",
    });
    expect(record).toHaveBeenCalledWith({
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "error",
      latencyMs: expect.any(Number),
      errorCode: "PROVIDER_ERROR",
    });
    expect(JSON.stringify(record.mock.calls)).not.toContain("chave-secreta");
    expect(JSON.stringify(record.mock.calls)).not.toContain(request.userPrompt);
  });

  it("não interrompe a geração quando a telemetria falha", async () => {
    const { client } = mockClient(
      completion(
        JSON.stringify({ sql: "SELECT 1 LIMIT 1", explanation: "Teste" }),
      ),
    );
    const observer: LlmObserver = {
      record: () => {
        throw new Error("telemetria indisponível");
      },
    };

    await expect(
      provider(client, observer).generateStructured(request),
    ).resolves.toMatchObject({ data: { sql: "SELECT 1 LIMIT 1" } });
  });
});

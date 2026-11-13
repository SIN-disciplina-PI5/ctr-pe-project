import {
  APIConnectionTimeoutError,
  APIUserAbortError,
  Groq,
} from "groq-sdk";
import { z, type output, type ZodType } from "zod";
import {
  LlmProviderError,
  type LlmObservation,
  type LlmObserver,
  type LlmProvider,
  type LlmProviderErrorCode,
  type StructuredGenerationRequest,
  type StructuredGenerationResult,
} from "./llm-provider.js";

type GroqClient = Pick<Groq, "chat">;

export interface GroqProviderOptions {
  readonly apiKey: string;
  readonly model: string;
  readonly timeoutMs: number;
  readonly client?: GroqClient;
  readonly observer?: LlmObserver;
  readonly now?: () => number;
}

const ERROR_MESSAGES: Record<LlmProviderErrorCode, string> = {
  TIMEOUT: "O provedor de IA excedeu o tempo limite.",
  EMPTY_RESPONSE: "O provedor de IA retornou uma resposta vazia.",
  INVALID_RESPONSE: "O provedor de IA retornou uma resposta inválida.",
  PROVIDER_ERROR: "Não foi possível obter resposta do provedor de IA.",
};

function classifyError(error: unknown): LlmProviderErrorCode {
  if (error instanceof LlmProviderError) return error.code;
  if (
    error instanceof APIConnectionTimeoutError ||
    error instanceof APIUserAbortError
  ) {
    return "TIMEOUT";
  }
  if (error instanceof SyntaxError || error instanceof z.ZodError) {
    return "INVALID_RESPONSE";
  }
  return "PROVIDER_ERROR";
}

function normalizeJsonSchemaForGroq<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(normalizeJsonSchemaForGroq) as T;
  }
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key === "oneOf" ? "anyOf" : key,
      normalizeJsonSchemaForGroq(nestedValue),
    ]),
  ) as T;
}

function prepareJsonSchemaForGroq<T>(value: T): {
  readonly schema: T;
  readonly usesEnvelope: boolean;
} {
  const normalized = normalizeJsonSchemaForGroq(value);
  if (
    normalized !== null &&
    typeof normalized === "object" &&
    !Array.isArray(normalized)
  ) {
    const root = normalized as Record<string, unknown>;
    const hasUnsupportedRootComposition = [
      "anyOf",
      "oneOf",
      "enum",
      "not",
    ].some((keyword) => keyword in root);

    if (root["type"] === "object" && !hasUnsupportedRootComposition) {
      return { schema: normalized, usesEnvelope: false };
    }

    const { $schema, $defs, ...innerSchema } = root;
    return {
      schema: {
        ...($schema === undefined ? {} : { $schema }),
        ...($defs === undefined ? {} : { $defs }),
        type: "object",
        properties: { result: innerSchema },
        required: ["result"],
        additionalProperties: false,
      } as unknown as T,
      usesEnvelope: true,
    };
  }

  return {
    schema: {
      type: "object",
      properties: { result: normalized },
      required: ["result"],
      additionalProperties: false,
    } as unknown as T,
    usesEnvelope: true,
  };
}

export class GroqProvider implements LlmProvider {
  private readonly client: GroqClient;
  private readonly observer: LlmObserver | undefined;
  private readonly now: () => number;

  constructor(private readonly options: GroqProviderOptions) {
    if (!options.apiKey.trim()) {
      throw new Error("GROQ_API_KEY não definida.");
    }
    if (!options.model.trim()) {
      throw new Error("GROQ_MODEL não definido.");
    }
    if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
      throw new Error("O timeout do provedor deve ser um inteiro positivo.");
    }

    this.client =
      options.client ??
      new Groq({
        apiKey: options.apiKey,
        timeout: options.timeoutMs,
        maxRetries: 0,
      });
    this.observer = options.observer;
    this.now = options.now ?? performance.now.bind(performance);
  }

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    const startedAt = this.now();

    try {
      const preparedSchema = prepareJsonSchemaForGroq(
        z.toJSONSchema(request.schema),
      );
      const completion = await this.client.chat.completions.create(
        {
          model: this.options.model,
          temperature: 0,
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: request.schemaName,
              strict: true,
              schema: preparedSchema.schema,
            },
          },
        },
        {
          timeout: this.options.timeoutMs,
          maxRetries: 0,
        },
      );

      const content = completion.choices[0]?.message.content;
      if (!content) {
        throw new LlmProviderError(
          "EMPTY_RESPONSE",
          ERROR_MESSAGES.EMPTY_RESPONSE,
        );
      }

      const parsedContent: unknown = JSON.parse(content);
      const responseData =
        preparedSchema.usesEnvelope &&
        parsedContent !== null &&
        typeof parsedContent === "object" &&
        !Array.isArray(parsedContent)
          ? (parsedContent as Record<string, unknown>)["result"]
          : parsedContent;
      const result: StructuredGenerationResult<output<TSchema>> = {
        data: request.schema.parse(responseData),
        provider: "groq",
        model: this.options.model,
        latencyMs: Math.max(0, Math.round(this.now() - startedAt)),
        inputTokens: completion.usage?.prompt_tokens ?? null,
        outputTokens: completion.usage?.completion_tokens ?? null,
        totalTokens: completion.usage?.total_tokens ?? null,
      };

      this.observe({
        operation: "generate_structured",
        provider: result.provider,
        model: result.model,
        status: "success",
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        totalTokens: result.totalTokens,
      });

      return result;
    } catch (error) {
      const code = classifyError(error);
      const latencyMs = Math.max(0, Math.round(this.now() - startedAt));

      this.observe({
        operation: "generate_structured",
        provider: "groq",
        model: this.options.model,
        status: "error",
        latencyMs,
        errorCode: code,
      });

      if (error instanceof LlmProviderError) throw error;
      throw new LlmProviderError(code, ERROR_MESSAGES[code], {
        cause: error,
      });
    }
  }

  private observe(observation: LlmObservation): void {
    try {
      this.observer?.record(observation);
    } catch {
      // Falhas de telemetria não podem interromper uma consulta do usuário.
    }
  }
}

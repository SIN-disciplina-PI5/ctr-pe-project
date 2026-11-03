import Groq, { APIConnectionTimeoutError, APIUserAbortError } from "groq-sdk";
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
              schema: z.toJSONSchema(request.schema),
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

      const result: StructuredGenerationResult<output<TSchema>> = {
        data: request.schema.parse(JSON.parse(content)),
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

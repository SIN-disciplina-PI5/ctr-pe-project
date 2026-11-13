import type { output, ZodType } from "zod";

export interface StructuredGenerationRequest<TSchema extends ZodType> {
  readonly schemaName: string;
  readonly schema: TSchema;
  readonly systemPrompt: string;
  readonly userPrompt: string;
}

export interface StructuredGenerationResult<T> {
  readonly data: T;
  readonly provider: string;
  readonly model: string;
  readonly latencyMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
}

export interface LlmProvider {
  generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>>;
}

export const LLM_PROVIDER_ERROR_CODES = [
  "TIMEOUT",
  "EMPTY_RESPONSE",
  "INVALID_RESPONSE",
  "PROVIDER_ERROR",
] as const;

export type LlmProviderErrorCode = (typeof LLM_PROVIDER_ERROR_CODES)[number];

export class LlmProviderError extends Error {
  constructor(
    public readonly code: LlmProviderErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "LlmProviderError";
  }
}

interface LlmObservationBase {
  readonly operation: "generate_structured";
  readonly provider: string;
  readonly model: string;
  readonly latencyMs: number;
}

export type LlmObservation =
  | (LlmObservationBase & {
      readonly status: "success";
      readonly inputTokens: number | null;
      readonly outputTokens: number | null;
      readonly totalTokens: number | null;
    })
  | (LlmObservationBase & {
      readonly status: "error";
      readonly errorCode: LlmProviderErrorCode;
    });

export interface LlmObserver {
  record(observation: LlmObservation): void;
}

import { z, type output } from "zod";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import type { GenerationMetrics } from "./query-generation.service.js";
import { QUERY_ANSWER_SYSTEM_PROMPT } from "./query-prompts.config.js";
import type { QueryRow } from "./query-executor.js";

const queryAnswerOutputSchema = z
  .object({ answer: z.string().trim().min(1) })
  .strict();

type QueryAnswerOutput = output<typeof queryAnswerOutputSchema>;

export interface QueryAnswerSource {
  readonly purpose: string;
  readonly rows: readonly QueryRow[];
}

export interface QueryAnswerInput {
  readonly question: string;
  readonly sources: readonly QueryAnswerSource[];
}

export interface QueryAnswerResult {
  readonly answer: string;
  readonly metrics: GenerationMetrics | null;
}

export interface QueryAnswerer {
  answer(input: QueryAnswerInput): Promise<QueryAnswerResult>;
}

function metricsOf(
  generation: StructuredGenerationResult<unknown>,
): GenerationMetrics {
  return {
    provider: generation.provider,
    model: generation.model,
    latencyMs: generation.latencyMs,
    inputTokens: generation.inputTokens,
    outputTokens: generation.outputTokens,
    totalTokens: generation.totalTokens,
  };
}

export class QueryAnswerService implements QueryAnswerer {
  constructor(private readonly provider: LlmProvider) {}

  async answer(input: QueryAnswerInput): Promise<QueryAnswerResult> {
    const rowCount = input.sources.reduce(
      (total, source) => total + source.rows.length,
      0,
    );
    if (rowCount === 0) {
      return {
        answer: "Nenhum dado foi encontrado para a pergunta nesta empresa.",
        metrics: null,
      };
    }

    let generation: StructuredGenerationResult<QueryAnswerOutput>;
    try {
      generation = await this.provider.generateStructured({
        schemaName: "ctrpe_query_answer",
        schema: queryAnswerOutputSchema,
        systemPrompt: QUERY_ANSWER_SYSTEM_PROMPT,
        userPrompt: JSON.stringify({
          question: input.question,
          sources: input.sources,
        }),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) {
        throw new AppError({
          message: error.message,
          statusCode: error.code === "TIMEOUT" ? 504 : 502,
          errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
          details: { providerErrorCode: error.code },
        });
      }
      throw error;
    }

    const data: QueryAnswerOutput = generation.data;
    return { answer: data.answer, metrics: metricsOf(generation) };
  }
}

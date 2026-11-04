import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import {
  queryGenerationOutputSchema,
  type QueryGenerationOutput,
} from "./query-generation.js";
import { inferRelevantViews } from "./relevant-views.js";
import { buildSchemaContext, type AiViewName } from "./schema-context.js";
import { validateSql, type SqlValidationResult } from "./sql-validator.js";

export interface GenerateQueryInput {
  readonly question: string;
  readonly empresaId: string | null;
}

interface GenerationMetrics {
  readonly provider: string;
  readonly model: string;
  readonly latencyMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
}

export type QueryGenerationResult =
  | {
      readonly status: "generated";
      readonly sql: string;
      readonly explanation: string;
      readonly assumptions: readonly string[];
      readonly relevantViews: readonly AiViewName[];
      readonly validation: SqlValidationResult;
      readonly metrics: GenerationMetrics;
    }
  | {
      readonly status: "refused";
      readonly reason: string;
      readonly relevantViews: readonly AiViewName[];
      readonly metrics?: GenerationMetrics;
    };

const SYSTEM_PROMPT = [
  "Você converte perguntas em português sobre manutenção para PostgreSQL.",
  "Use exclusivamente as views e colunas do contexto fornecido.",
  "Use sempre o schema ai, nomenclatura Prisma e aspas duplas.",
  "Quando gerar SQL, produza exatamente um SELECT sem CTE e com LIMIT entre 1 e 100.",
  "Use somente funções de agregação, data e formatação necessárias à pergunta.",
  "O isolamento da empresa é aplicado por RLS na sessão do banco.",
  "Nunca use set_config, current_setting, empresaId inventado ou funções de sistema.",
  "Se a pergunta não puder ser respondida com o contexto, devolva uma recusa curta.",
].join(" ");

function metricsOf(
  generation: StructuredGenerationResult<QueryGenerationOutput>,
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

export class QueryGenerationService {
  constructor(private readonly provider: LlmProvider) {}

  async generate(input: GenerateQueryInput): Promise<QueryGenerationResult> {
    if (!input.empresaId?.trim()) {
      throw new AppError({
        message: "É necessário selecionar uma empresa para consultar a IA.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const relevantViews = inferRelevantViews(input.question);
    if (relevantViews.length === 0) {
      return {
        status: "refused",
        reason:
          "A pergunta não está relacionada aos dados de manutenção disponíveis.",
        relevantViews,
      };
    }

    const context = buildSchemaContext({ relevantViews });
    let generation: StructuredGenerationResult<QueryGenerationOutput>;
    try {
      generation = await this.provider.generateStructured({
        schemaName: "ctrpe_query_generation",
        schema: queryGenerationOutputSchema,
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: `${context}\n\nPergunta:\n${input.question}`,
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

    if (generation.data.type === "refusal") {
      return {
        status: "refused",
        reason: generation.data.reason,
        relevantViews,
        metrics: metricsOf(generation),
      };
    }

    const validation = await validateSql(generation.data.sql, {
      allowedViews: relevantViews,
      requiredSchema: "ai",
      maxRows: 100,
    });

    if (!validation.valid) {
      throw new AppError({
        message: "A consulta gerada não passou pelas barreiras de segurança.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
        details: { violations: validation.violations },
      });
    }

    return {
      status: "generated",
      sql: generation.data.sql,
      explanation: generation.data.explanation,
      assumptions: generation.data.assumptions,
      relevantViews,
      validation,
      metrics: metricsOf(generation),
    };
  }
}

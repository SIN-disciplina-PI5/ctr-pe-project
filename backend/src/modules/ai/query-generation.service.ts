import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import {
  queryCorrectionOutputSchema,
  queryGenerationOutputSchema,
  type QueryCorrectionOutput,
  type QueryGenerationOutput,
} from "./query-generation.js";
import { buildQueryContext } from "./query-context.js";
import { inferRelevantViews } from "./relevant-views.js";
import type { AiViewName } from "./schema-context.js";
import { validateSql, type SqlValidationResult } from "./sql-validator.js";

export interface GenerateQueryInput {
  readonly question: string;
  readonly empresaId: string | null;
}

export interface GenerationMetrics {
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
      readonly status: "planned";
      readonly steps: readonly {
        readonly id: string;
        readonly purpose: string;
        readonly sql: string;
        readonly validation: SqlValidationResult;
      }[];
      readonly explanation: string;
      readonly assumptions: readonly string[];
      readonly relevantViews: readonly AiViewName[];
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
  "Prefira sempre uma única consulta. Use query_plan com 2 ou 3 etapas somente quando uma consulta única não puder responder corretamente.",
  "Cada etapa de query_plan deve ser independente, somente leitura e necessária para a pergunta.",
  "Use somente funções de agregação, data e formatação necessárias à pergunta.",
  "O isolamento da empresa é aplicado por RLS na sessão do banco.",
  "Nunca use set_config, current_setting, empresaId inventado ou funções de sistema.",
  "Se a pergunta não puder ser respondida com o contexto, devolva uma recusa curta.",
].join(" ");

const CORRECTION_SYSTEM_PROMPT = [
  "Você corrige uma consulta PostgreSQL que falhou por um erro técnico conhecido.",
  "Use exclusivamente as views e colunas do contexto fornecido.",
  "Produza exatamente um SELECT no schema ai, sem CTE e com LIMIT entre 1 e 100.",
  "Não altere a intenção da pergunta e não tente modificar a sessão do banco.",
  "Use somente o feedback seguro fornecido; não invente detalhes do erro.",
].join(" ");

function metricsOf<T>(
  generation: StructuredGenerationResult<T>,
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

    const context = buildQueryContext({
      question: input.question,
      relevantViews,
    });
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

    if (generation.data.type === "query_plan") {
      const ids = new Set<string>();
      const queries = new Set<string>();
      const steps = [];

      for (const step of generation.data.steps) {
        if (ids.has(step.id)) {
          throw new AppError({
            message: "O plano de consulta contém identificadores duplicados.",
            statusCode: 422,
            errorCode: ErrorCode.VALIDATION_ERROR,
          });
        }
        ids.add(step.id);

        const normalizedSql = step.sql.replace(/\s+/g, " ").trim();
        if (queries.has(normalizedSql)) {
          throw new AppError({
            message: "O plano de consulta contém etapas duplicadas.",
            statusCode: 422,
            errorCode: ErrorCode.VALIDATION_ERROR,
          });
        }
        queries.add(normalizedSql);

        const validation = await validateSql(step.sql, {
          allowedViews: relevantViews,
          requiredSchema: "ai",
          maxRows: 100,
        });
        if (!validation.valid) {
          throw new AppError({
            message:
              "Uma etapa do plano não passou pelas barreiras de segurança.",
            statusCode: 422,
            errorCode: ErrorCode.VALIDATION_ERROR,
            details: { stepId: step.id, violations: validation.violations },
          });
        }
        steps.push({ ...step, validation });
      }

      return {
        status: "planned",
        steps,
        explanation: generation.data.explanation,
        assumptions: generation.data.assumptions,
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

  async correct(input: {
    readonly question: string;
    readonly empresaId: string;
    readonly failedSql: string;
    readonly safeFeedback: string;
    readonly relevantViews: readonly AiViewName[];
  }): Promise<{
    readonly sql: string;
    readonly explanation: string;
    readonly validation: SqlValidationResult;
    readonly metrics: GenerationMetrics;
  }> {
    if (!input.empresaId.trim()) {
      throw new AppError({
        message: "É necessário selecionar uma empresa para consultar a IA.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const context = buildQueryContext({
      question: input.question,
      relevantViews: input.relevantViews,
    });
    const failedSql = input.failedSql
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .slice(0, 4_000);
    const safeFeedback = input.safeFeedback
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .slice(0, 500);

    let correction: StructuredGenerationResult<QueryCorrectionOutput>;
    try {
      correction = await this.provider.generateStructured({
        schemaName: "ctrpe_query_correction",
        schema: queryCorrectionOutputSchema,
        systemPrompt: CORRECTION_SYSTEM_PROMPT,
        userPrompt: [
          context,
          `Pergunta: ${JSON.stringify(input.question)}`,
          `SQL que falhou: ${JSON.stringify(failedSql)}`,
          `Feedback seguro: ${JSON.stringify(safeFeedback)}`,
        ].join("\n\n"),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) {
        throw new AppError({
          message: "Não foi possível corrigir a consulta com segurança.",
          statusCode: error.code === "TIMEOUT" ? 504 : 502,
          errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
          details: { providerErrorCode: error.code },
        });
      }
      throw error;
    }

    if (correction.data.sql.trim() === input.failedSql.trim()) {
      throw new AppError({
        message: "A correção não produziu uma consulta diferente.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const validation = await validateSql(correction.data.sql, {
      allowedViews: input.relevantViews,
      requiredSchema: "ai",
      maxRows: 100,
    });
    if (!validation.valid) {
      throw new AppError({
        message:
          "A consulta corrigida não passou pelas barreiras de segurança.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
        details: { violations: validation.violations },
      });
    }

    return {
      sql: correction.data.sql,
      explanation: correction.data.explanation,
      validation,
      metrics: metricsOf(correction),
    };
  }
}

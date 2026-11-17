import { performance } from "node:perf_hooks";
import { z, type output } from "zod";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import type {
  QueryAgentResult,
  QueryAgentService,
} from "./query-agent.service.js";
import type { QueryRow } from "./query-executor.js";
import type { GenerationMetrics } from "./query-generation.service.js";
import { REPORT_PLAN_SYSTEM_PROMPT } from "./report-prompts.config.js";

const visualizationSchema = z
  .object({
    type: z.enum(["none", "bar", "line"]),
    categoryKey: z.string().trim().min(1).nullable(),
    valueKey: z.string().trim().min(1).nullable(),
  })
  .strict()
  .superRefine((visualization, context) => {
    const hasKeys =
      visualization.categoryKey !== null && visualization.valueKey !== null;

    if (visualization.type === "none" && hasKeys) {
      context.addIssue({
        code: "custom",
        message: "Visualização none não deve declarar chaves.",
      });
    }
    if (visualization.type !== "none" && !hasKeys) {
      context.addIssue({
        code: "custom",
        message: "Gráficos devem declarar as chaves de categoria e valor.",
      });
    }
  });

export const reportPlanSchema = z
  .object({
    reportType: z.enum(["monthly_maintenance", "asset_costs", "availability"]),
    title: z.string().trim().min(1).max(160),
    sections: z
      .array(
        z
          .object({
            id: z
              .string()
              .trim()
              .regex(/^[a-z0-9][a-z0-9_-]*$/),
            title: z.string().trim().min(1).max(120),
            question: z.string().trim().min(1).max(500),
            visualization: visualizationSchema,
          })
          .strict(),
      )
      .min(1)
      .max(6),
  })
  .strict()
  .superRefine((plan, context) => {
    const ids = plan.sections.map((section) => section.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        path: ["sections"],
        message: "As seções do relatório devem possuir IDs únicos.",
      });
    }
  });

export type ReportPlan = output<typeof reportPlanSchema>;
export type ReportType = ReportPlan["reportType"];

export interface ReportAgentInput {
  readonly request: string;
  readonly empresaId: string;
}

export interface ReportTable {
  readonly columns: readonly string[];
  readonly rows: readonly QueryRow[];
}

export interface ReportChartPoint {
  readonly label: string;
  readonly value: number;
}

export interface ReportChart {
  readonly type: "bar" | "line";
  readonly series: readonly {
    readonly name: string;
    readonly data: readonly ReportChartPoint[];
  }[];
}

export interface ReportSection {
  readonly id: string;
  readonly title: string;
  readonly status: "ready" | "empty" | "refused";
  readonly narrative: string;
  readonly table: ReportTable | null;
  readonly chart: ReportChart | null;
  readonly ungroundedNumbers: readonly string[];
}

export interface ReportGenerationSummary {
  readonly totalSections: number;
  readonly readySections: number;
  readonly emptySections: number;
  readonly refusedSections: number;
  readonly totalLatencyMs: number;
}

export interface GeneratedReport {
  readonly status: "generated";
  readonly reportType: ReportType;
  readonly title: string;
  readonly sections: readonly ReportSection[];
  readonly planningMetrics: GenerationMetrics;
  readonly summary: ReportGenerationSummary;
}

export interface ReportAgent {
  generate(input: ReportAgentInput): Promise<GeneratedReport>;
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

function rowsOf(result: Extract<QueryAgentResult, { status: "answered" }>) {
  return result.mode === "single"
    ? result.rowsUsed
    : result.steps.flatMap((step) => step.rowsUsed);
}

function columnsOf(rows: readonly QueryRow[]): readonly string[] {
  return [...new Set(rows.flatMap((row) => Object.keys(row)))];
}

function chartLabel(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }
  return null;
}

function chartValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function chartOf(
  section: ReportPlan["sections"][number],
  rows: readonly QueryRow[],
): ReportChart | null {
  if (
    section.visualization.type === "none" ||
    section.visualization.categoryKey === null ||
    section.visualization.valueKey === null
  ) {
    return null;
  }

  const data = rows.flatMap((row): ReportChartPoint[] => {
    const label = chartLabel(row[section.visualization.categoryKey!]);
    const value = chartValue(row[section.visualization.valueKey!]);
    return label === null || value === null ? [] : [{ label, value }];
  });

  if (data.length === 0) return null;
  return {
    type: section.visualization.type,
    series: [{ name: section.title, data }],
  };
}

function parseNumericToken(token: string): number | null {
  const cleaned = token.replace(/\s+/g, "");
  if (!cleaned) return null;

  if (/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(cleaned)) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(cleaned)) {
    const normalized = cleaned.replace(/,/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const normalized = cleaned.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function collectAllowedNumbers(rows: readonly QueryRow[]): Set<number> {
  const allowed = new Set<number>([rows.length]);

  for (const row of rows) {
    for (const value of Object.values(row)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        allowed.add(value);
        continue;
      }

      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        allowed.add(value.getUTCFullYear());
        allowed.add(value.getUTCMonth() + 1);
        allowed.add(value.getUTCDate());
        continue;
      }

      if (typeof value === "string") {
        const direct = chartValue(value);
        if (direct !== null) allowed.add(direct);

        const embedded = value.match(/\d+(?:[.,]\d+)?/g) ?? [];
        for (const token of embedded) {
          const parsed = parseNumericToken(token);
          if (parsed !== null) allowed.add(parsed);
        }
      }
    }
  }

  return allowed;
}

export function findUngroundedNumbers(
  narrative: string,
  rows: readonly QueryRow[],
): readonly string[] {
  const tokens =
    narrative.match(
      /(?<![A-Za-zÀ-ÿ0-9_-])\d+(?:[.,]\d+)*(?![A-Za-zÀ-ÿ0-9_-])/g,
    ) ?? [];

  if (tokens.length === 0) return [];

  const allowed = collectAllowedNumbers(rows);
  const ungrounded: string[] = [];

  for (const token of tokens) {
    const parsed = parseNumericToken(token);
    if (parsed === null) continue;

    const isGrounded = [...allowed].some(
      (candidate) => Math.abs(candidate - parsed) < 1e-6,
    );
    if (!isGrounded && !ungrounded.includes(token)) {
      ungrounded.push(token);
    }
  }

  return ungrounded;
}

function providerError(error: LlmProviderError): AppError {
  return new AppError({
    message:
      error.code === "TIMEOUT"
        ? "O planejamento do relatório excedeu o tempo limite."
        : "Não foi possível planejar o relatório.",
    statusCode: error.code === "TIMEOUT" ? 504 : 502,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    details: { providerErrorCode: error.code },
  });
}

function sectionFailureNarrative(error: unknown): string {
  if (error instanceof LlmProviderError) {
    return error.code === "TIMEOUT"
      ? "A consulta desta seção excedeu o tempo limite."
      : "Não foi possível consultar os dados desta seção no momento.";
  }
  if (error instanceof AppError) {
    if (error.errorCode === ErrorCode.VALIDATION_ERROR) {
      return "A consulta desta seção não passou pela validação mesmo após a tentativa de correção.";
    }
    if (error.statusCode === 504) {
      return "A consulta desta seção excedeu o tempo limite.";
    }
    if (error.statusCode >= 500) {
      return "Não foi possível consultar os dados desta seção no momento.";
    }
  }
  return "Não foi possível processar os dados desta seção.";
}

function sectionFailureDetails(error: unknown): {
  readonly errorCode: string;
  readonly statusCode: number | null;
  readonly errorName: string;
} {
  if (error instanceof AppError) {
    return {
      errorCode: error.errorCode,
      statusCode: error.statusCode,
      errorName: error.name,
    };
  }
  if (error instanceof LlmProviderError) {
    return {
      errorCode: error.code,
      statusCode: null,
      errorName: error.name,
    };
  }
  return {
    errorCode: "UNEXPECTED_ERROR",
    statusCode: null,
    errorName: error instanceof Error ? error.name : "UnknownError",
  };
}

export function contextualizeReportSectionQuestion(
  reportRequest: string,
  sectionQuestion: string,
): string {
  return [
    "Contexto obrigatório do relatório:",
    reportRequest.trim(),
    "",
    "Pergunta da seção:",
    sectionQuestion.trim(),
  ].join("\n");
}

const REPORT_SECTION_CONCURRENCY = 1;

async function mapWithConcurrency<T, TResult>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T) => Promise<TResult>,
): Promise<TResult[]> {
  const entries = items.map((item, index) => ({ item, index }));
  const results = new Array<TResult>(items.length);
  let nextEntry = 0;

  async function worker(): Promise<void> {
    while (true) {
      const entry = entries[nextEntry];
      nextEntry += 1;
      if (!entry) return;
      results[entry.index] = await mapper(entry.item);
    }
  }

  const workerCount = Math.min(concurrency, entries.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

export class ReportAgentService implements ReportAgent {
  constructor(
    private readonly provider: LlmProvider,
    private readonly queryAgent: Pick<QueryAgentService, "query">,
    private readonly logger: Pick<Console, "error"> = console,
  ) {}

  async generate(input: ReportAgentInput): Promise<GeneratedReport> {
    const startedAt = performance.now();
    const generation = await this.planReport(input.request);
    const plan = reportPlanSchema.parse(generation.data);

    const sections = await mapWithConcurrency(
      plan.sections,
      REPORT_SECTION_CONCURRENCY,
      (section) =>
        this.buildSection(section, input.empresaId, input.request),
    );

    const totalLatencyMs = Math.max(
      0,
      Math.round(performance.now() - startedAt),
    );

    return {
      status: "generated",
      reportType: plan.reportType,
      title: plan.title,
      sections,
      planningMetrics: metricsOf(generation),
      summary: {
        totalSections: sections.length,
        readySections: sections.filter((section) => section.status === "ready")
          .length,
        emptySections: sections.filter((section) => section.status === "empty")
          .length,
        refusedSections: sections.filter(
          (section) => section.status === "refused",
        ).length,
        totalLatencyMs,
      },
    };
  }

  private async planReport(
    request: string,
  ): Promise<StructuredGenerationResult<ReportPlan>> {
    try {
      return await this.provider.generateStructured({
        schemaName: "ctrpe_report_plan",
        schema: reportPlanSchema,
        systemPrompt: REPORT_PLAN_SYSTEM_PROMPT,
        userPrompt: JSON.stringify({ request }),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) throw providerError(error);
      throw error;
    }
  }

  private async buildSection(
    section: ReportPlan["sections"][number],
    empresaId: string,
    reportRequest: string,
  ): Promise<ReportSection> {
    let queryResult: QueryAgentResult;
    try {
      queryResult = await this.queryAgent.query({
        question: contextualizeReportSectionQuestion(
          reportRequest,
          section.question,
        ),
        empresaId,
      });
    } catch (error) {
      this.logger.error("Falha ao processar seção do relatório.", {
        component: "ai.report-agent",
        event: "section_failed",
        sectionId: section.id,
        ...sectionFailureDetails(error),
      });
      return {
        id: section.id,
        title: section.title,
        status: "refused",
        narrative: sectionFailureNarrative(error),
        table: null,
        chart: null,
        ungroundedNumbers: [],
      };
    }

    if (queryResult.status === "refused") {
      return {
        id: section.id,
        title: section.title,
        status: "refused",
        narrative: queryResult.reason,
        table: null,
        chart: null,
        ungroundedNumbers: [],
      };
    }

    const rows = rowsOf(queryResult);
    if (rows.length === 0) {
      return {
        id: section.id,
        title: section.title,
        status: "empty",
        narrative: "Nenhum dado foi encontrado para esta seção.",
        table: null,
        chart: null,
        ungroundedNumbers: [],
      };
    }

    return {
      id: section.id,
      title: section.title,
      status: "ready",
      narrative: queryResult.answer,
      table: { columns: columnsOf(rows), rows },
      chart: chartOf(section, rows),
      ungroundedNumbers: findUngroundedNumbers(queryResult.answer, rows),
    };
  }
}

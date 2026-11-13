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
}

export interface GeneratedReport {
  readonly status: "generated";
  readonly reportType: ReportType;
  readonly title: string;
  readonly sections: readonly ReportSection[];
  readonly planningMetrics: GenerationMetrics;
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

export class ReportAgentService implements ReportAgent {
  constructor(
    private readonly provider: LlmProvider,
    private readonly queryAgent: Pick<QueryAgentService, "query">,
  ) {}

  async generate(input: ReportAgentInput): Promise<GeneratedReport> {
    let generation: StructuredGenerationResult<ReportPlan>;
    try {
      generation = await this.provider.generateStructured({
        schemaName: "ctrpe_report_plan",
        schema: reportPlanSchema,
        systemPrompt: REPORT_PLAN_SYSTEM_PROMPT,
        userPrompt: JSON.stringify({ request: input.request }),
      });
    } catch (error) {
      if (error instanceof LlmProviderError) throw providerError(error);
      throw error;
    }

    const plan = reportPlanSchema.parse(generation.data);
    const sections: ReportSection[] = [];

    for (const section of plan.sections) {
      const queryResult = await this.queryAgent.query({
        question: section.question,
        empresaId: input.empresaId,
      });

      if (queryResult.status === "refused") {
        sections.push({
          id: section.id,
          title: section.title,
          status: "refused",
          narrative: queryResult.reason,
          table: null,
          chart: null,
        });
        continue;
      }

      const rows = rowsOf(queryResult);
      if (rows.length === 0) {
        sections.push({
          id: section.id,
          title: section.title,
          status: "empty",
          narrative: "Nenhum dado foi encontrado para esta seção.",
          table: null,
          chart: null,
        });
        continue;
      }

      sections.push({
        id: section.id,
        title: section.title,
        status: "ready",
        narrative: queryResult.answer,
        table: { columns: columnsOf(rows), rows },
        chart: chartOf(section, rows),
      });
    }

    return {
      status: "generated",
      reportType: plan.reportType,
      title: plan.title,
      sections,
      planningMetrics: metricsOf(generation),
    };
  }
}

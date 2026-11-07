import type { EvaluationCase, EvaluationCategory } from "./query-evaluation-dataset.js";
import { QUERY_EXAMPLES, validateExpectedResult, type SyntheticTenantCode } from "../src/modules/ai/query-examples.js";

export interface EvaluationUsage {
  readonly provider: string;
  readonly model: string;
  readonly latencyMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
}

export type EvaluationAgentOutput =
  | {
      readonly status: "answered";
      readonly rowGroups: readonly (readonly Readonly<Record<string, unknown>>[])[];
      readonly usage: EvaluationUsage;
    }
  | {
      readonly status: "refused";
      readonly reason: string;
      readonly usage: EvaluationUsage;
    };

export interface EvaluationAdapter {
  run(question: string, empresaId: string): Promise<EvaluationAgentOutput>;
}

export interface EvaluationResult {
  readonly caseId: string;
  readonly category: EvaluationCategory;
  readonly question: string;
  readonly expectedKind: EvaluationCase["expected"]["kind"];
  readonly actualStatus: EvaluationAgentOutput["status"] | "error";
  readonly correct: boolean;
  readonly precision: 0 | 1;
  readonly provider: string;
  readonly model: string;
  readonly executedAt: string;
  readonly latencyMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
  readonly details: readonly string[];
}

export interface CategoryMetrics {
  readonly category: EvaluationCategory;
  readonly cases: number;
  readonly correct: number;
  readonly precision: number;
  readonly averageLatencyMs: number;
  readonly totalTokens: number | null;
}

export interface EvaluationReport {
  readonly executedAt: string;
  readonly tenantCode: SyntheticTenantCode;
  readonly totalCases: number;
  readonly correctCases: number;
  readonly precision: number;
  readonly results: readonly EvaluationResult[];
  readonly categories: readonly CategoryMetrics[];
}

export interface EvaluationRunnerOptions {
  readonly adapter: EvaluationAdapter;
  readonly empresaId: string;
  readonly tenantCode: SyntheticTenantCode;
  readonly executedAt: string;
  readonly fallbackProvider: string;
  readonly fallbackModel: string;
  readonly now?: () => number;
}

const examplesById = new Map(QUERY_EXAMPLES.map((example) => [example.id, example]));

function round(value: number, decimalPlaces = 4): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}

function score(
  evaluationCase: EvaluationCase,
  output: EvaluationAgentOutput,
  tenantCode: SyntheticTenantCode,
): readonly string[] {
  const expected = evaluationCase.expected;

  if (expected.kind === "clarification") {
    return output.status === "refused" ? [] : ["o agente deveria solicitar esclarecimento antes de consultar"];
  }
  if (expected.kind === "refusal") {
    return output.status === "refused" ? [] : [`o agente deveria recusar o pedido por ${expected.reason}`];
  }
  if (output.status !== "answered") {
    return ["o agente recusou uma pergunta que possui resultado consultável"];
  }
  if (output.rowGroups.length !== expected.steps.length) {
    return [`quantidade de etapas esperada ${expected.steps.length}, recebida ${output.rowGroups.length}`];
  }

  const failures: string[] = [];
  expected.steps.forEach((step, index) => {
    const example = examplesById.get(step.queryExampleId);
    if (!example) {
      failures.push(`etapa ${index + 1}: referência desconhecida ${step.queryExampleId}`);
      return;
    }
    const rows = output.rowGroups[index] ?? [];
    failures.push(
      ...validateExpectedResult(rows, example.expected, tenantCode).map((failure) => `etapa ${index + 1}: ${failure}`),
    );
  });
  return failures;
}

function aggregate(results: readonly EvaluationResult[]): CategoryMetrics[] {
  const categories = [...new Set(results.map((result) => result.category))];
  return categories.map((category) => {
    const selected = results.filter((result) => result.category === category);
    const correct = selected.filter((result) => result.correct).length;
    const tokenValues = selected.map((result) => result.totalTokens).filter((value): value is number => value !== null);
    return {
      category,
      cases: selected.length,
      correct,
      precision: round(correct / selected.length),
      averageLatencyMs: round(selected.reduce((total, result) => total + result.latencyMs, 0) / selected.length, 2),
      totalTokens: tokenValues.length === 0 ? null : tokenValues.reduce((total, value) => total + value, 0),
    };
  });
}

export class QueryEvaluationRunner {
  private readonly now: () => number;

  constructor(private readonly options: EvaluationRunnerOptions) {
    this.now = options.now ?? performance.now.bind(performance);
  }

  async run(dataset: readonly EvaluationCase[]): Promise<EvaluationReport> {
    const results: EvaluationResult[] = [];

    for (const evaluationCase of dataset) {
      const startedAt = this.now();
      try {
        const output = await this.options.adapter.run(evaluationCase.question, this.options.empresaId);
        const details = score(evaluationCase, output, this.options.tenantCode);
        const correct = details.length === 0;
        results.push({
          caseId: evaluationCase.id,
          category: evaluationCase.category,
          question: evaluationCase.question,
          expectedKind: evaluationCase.expected.kind,
          actualStatus: output.status,
          correct,
          precision: correct ? 1 : 0,
          provider: output.usage.provider,
          model: output.usage.model,
          executedAt: this.options.executedAt,
          latencyMs: output.usage.latencyMs,
          inputTokens: output.usage.inputTokens,
          outputTokens: output.usage.outputTokens,
          totalTokens: output.usage.totalTokens,
          details,
        });
      } catch (error) {
        results.push({
          caseId: evaluationCase.id,
          category: evaluationCase.category,
          question: evaluationCase.question,
          expectedKind: evaluationCase.expected.kind,
          actualStatus: "error",
          correct: false,
          precision: 0,
          provider: this.options.fallbackProvider,
          model: this.options.fallbackModel,
          executedAt: this.options.executedAt,
          latencyMs: Math.max(0, Math.round(this.now() - startedAt)),
          inputTokens: null,
          outputTokens: null,
          totalTokens: null,
          details: [error instanceof Error ? error.message : "erro desconhecido"],
        });
      }
    }

    const correctCases = results.filter((result) => result.correct).length;
    return {
      executedAt: this.options.executedAt,
      tenantCode: this.options.tenantCode,
      totalCases: results.length,
      correctCases,
      precision: results.length === 0 ? 0 : round(correctCases / results.length),
      results,
      categories: aggregate(results),
    };
  }
}

function csvValue(value: string | number | boolean | null): string {
  if (value === null) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function serializeEvaluationCsv(report: EvaluationReport): string {
  const columns = [
    "executedAt",
    "tenantCode",
    "caseId",
    "category",
    "question",
    "expectedKind",
    "actualStatus",
    "correct",
    "precision",
    "provider",
    "model",
    "latencyMs",
    "inputTokens",
    "outputTokens",
    "totalTokens",
    "details",
  ] as const;
  const lines = [columns.join(",")];

  for (const result of report.results) {
    const row: Record<(typeof columns)[number], string | number | boolean | null> = {
      executedAt: result.executedAt,
      tenantCode: report.tenantCode,
      caseId: result.caseId,
      category: result.category,
      question: result.question,
      expectedKind: result.expectedKind,
      actualStatus: result.actualStatus,
      correct: result.correct,
      precision: result.precision,
      provider: result.provider,
      model: result.model,
      latencyMs: result.latencyMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      totalTokens: result.totalTokens,
      details: result.details.join(" | "),
    };
    lines.push(columns.map((column) => csvValue(row[column])).join(","));
  }

  return `${lines.join("\n")}\n`;
}


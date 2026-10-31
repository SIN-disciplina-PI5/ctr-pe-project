import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  MODEL_PRICING,
  PRICING_SNAPSHOT_DATE,
  PRICING_SOURCE,
  type ModelComparisonReport,
  summarizeModelComparison,
} from "./model-comparison.js";
import {
  evaluateSemanticResult,
  type SemanticEvaluation,
} from "./result-semantic-comparison.js";

const generationMetricsSchema = z.object({
  model: z.string(),
  latencyMs: z.number(),
  inputTokens: z.number().nullable(),
  outputTokens: z.number().nullable(),
  totalTokens: z.number().nullable(),
});

const queryExecutionSchema = z.object({
  success: z.boolean(),
  rows: z.array(z.record(z.string(), z.unknown())).nullable(),
});

const executionReportSchema = z
  .object({
    id: z.string(),
    model: z.string().nullable(),
    contextVariant: z.enum(["full", "relevant"]).nullable(),
    contextNaming: z.enum(["prisma", "snake_case"]).default("prisma"),
    contextCharacters: z.number().nullable(),
    generationMetrics: generationMetricsSchema.nullable(),
    generationSucceeded: z.boolean(),
    staticValidationPassed: z.boolean(),
    executionSucceeded: z.boolean(),
    exactMatch: z.boolean().default(false),
    referenceProjectionMatch: z.boolean().default(false),
    reference: queryExecutionSchema.optional(),
    generated: queryExecutionSchema.optional(),
  })
  .passthrough();

const inputFiles = process.argv.slice(2);
if (inputFiles.length < 2) {
  throw new Error("Informe ao menos dois relatórios de execução.");
}

const reports: ModelComparisonReport[] = [];

function evaluateReport(
  report: z.infer<typeof executionReportSchema>,
): SemanticEvaluation {
  if (!report.generationSucceeded) {
    return { status: "mismatch", reason: "O modelo não gerou SQL." };
  }

  if (!report.staticValidationPassed) {
    return {
      status: "mismatch",
      reason: "O SQL não passou pela validação estática.",
    };
  }

  if (!report.executionSucceeded) {
    return { status: "mismatch", reason: "O SQL não foi executado." };
  }

  return evaluateSemanticResult(
    report.id,
    report.reference?.success ? report.reference.rows : null,
    report.generated?.success ? report.generated.rows : null,
  );
}

for (const inputFile of inputFiles) {
  const fileReports = z.array(executionReportSchema).parse(
    JSON.parse(await readFile(inputFile, "utf8")),
  );
  reports.push(
    ...fileReports.map((report) => ({
      ...report,
      semanticEvaluation: evaluateReport(report),
    })),
  );
}

console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      pricing: {
        snapshotDate: PRICING_SNAPSHOT_DATE,
        source: PRICING_SOURCE,
        models: MODEL_PRICING,
      },
      inputFiles,
      summaries: summarizeModelComparison(reports),
    },
    null,
    2,
  ),
);

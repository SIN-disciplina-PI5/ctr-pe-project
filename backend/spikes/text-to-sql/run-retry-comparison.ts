import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  MODEL_PRICING,
  PRICING_SNAPSHOT_DATE,
  PRICING_SOURCE,
} from "./model-comparison.js";
import {
  evaluateSemanticResult,
  type SemanticEvaluation,
} from "./result-semantic-comparison.js";
import {
  summarizeRetryComparison,
  type RetryAttemptNumber,
  type RetryComparisonCase,
} from "./retry-comparison.js";

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
    retryAttempt: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
    generationMetrics: generationMetricsSchema.nullable(),
    generationSucceeded: z.boolean(),
    staticValidationPassed: z.boolean(),
    executionSucceeded: z.boolean(),
    reference: queryExecutionSchema.optional(),
    generated: queryExecutionSchema.optional(),
  })
  .passthrough();

const inputFiles = process.argv.slice(2);
if (inputFiles.length !== 3) {
  throw new Error(
    "Informe, nessa ordem, os relatórios das tentativas 0, 1 e 2.",
  );
}

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

const attempts: {
  attempt: RetryAttemptNumber;
  reports: RetryComparisonCase[];
}[] = [];

for (const [index, inputFile] of inputFiles.entries()) {
  const attempt = index as RetryAttemptNumber;
  const fileReports = z.array(executionReportSchema).parse(
    JSON.parse(await readFile(inputFile, "utf8")),
  );
  const reports: RetryComparisonCase[] = fileReports.map((report) => {
    if (report.retryAttempt !== undefined && report.retryAttempt !== attempt) {
      throw new Error(
        `O relatório ${report.id} informa tentativa ${report.retryAttempt}, mas foi fornecido como tentativa ${attempt}.`,
      );
    }

    if (!report.model) {
      throw new Error(`O relatório ${report.id} não informa o modelo.`);
    }

    return {
      id: report.id,
      model: report.model,
      generationMetrics: report.generationMetrics,
      generationSucceeded: report.generationSucceeded,
      staticValidationPassed: report.staticValidationPassed,
      executionSucceeded: report.executionSucceeded,
      semanticEvaluation: evaluateReport(report),
    };
  });

  attempts.push({ attempt, reports });
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
      ...summarizeRetryComparison(attempts),
    },
    null,
    2,
  ),
);

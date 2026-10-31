import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  MODEL_PRICING,
  PRICING_SNAPSHOT_DATE,
  PRICING_SOURCE,
  summarizeModelComparison,
} from "./model-comparison.js";

const generationMetricsSchema = z.object({
  model: z.string(),
  latencyMs: z.number(),
  inputTokens: z.number().nullable(),
  outputTokens: z.number().nullable(),
  totalTokens: z.number().nullable(),
});

const executionReportSchema = z
  .object({
    id: z.string(),
    model: z.string().nullable(),
    contextVariant: z.enum(["full", "relevant"]).nullable(),
    contextCharacters: z.number().nullable(),
    generationMetrics: generationMetricsSchema.nullable(),
    generationSucceeded: z.boolean(),
    staticValidationPassed: z.boolean(),
    executionSucceeded: z.boolean(),
    exactMatch: z.boolean().default(false),
    referenceProjectionMatch: z.boolean().default(false),
  })
  .passthrough();

const inputFiles = process.argv.slice(2);
if (inputFiles.length < 2) {
  throw new Error("Informe ao menos dois relatórios de execução.");
}

const reports = [];

for (const inputFile of inputFiles) {
  const fileReports = z.array(executionReportSchema).parse(
    JSON.parse(await readFile(inputFile, "utf8")),
  );
  reports.push(...fileReports);
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

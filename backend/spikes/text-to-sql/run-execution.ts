import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { z } from "zod";
import { EVALUATION_CASES } from "./evaluation-cases.js";
import { executeReadOnlyQuery } from "./read-only-query-executor.js";
import { compareQueryResults } from "./result-comparison.js";
import {
  SPIKE_ALLOWED_TABLES,
  validateSql,
} from "./sql-validator.js";

const { Client } = pg;

const generationMetricsSchema = z
  .object({
    model: z.string(),
    latencyMs: z.number(),
    inputTokens: z.number().nullable(),
    outputTokens: z.number().nullable(),
    totalTokens: z.number().nullable(),
  })
  .passthrough();

const retryFeedbackSchema = z
  .object({
    generationSucceeded: z.boolean(),
    staticViolations: z.array(z.string()),
    executionStatus: z.enum(["succeeded", "failed", "not_executed"]),
  })
  .passthrough();

const generationResultSchema = z
  .object({
    id: z.string(),
    generatedSql: z.string().nullable(),
    model: z.string().optional(),
    contextVariant: z.enum(["full", "relevant"]).optional(),
    contextNaming: z.enum(["prisma", "snake_case"]).optional(),
    relevantTables: z.array(z.string()).optional(),
    contextCharacters: z.number().optional(),
    retryAttempt: z.union([z.literal(1), z.literal(2)]).optional(),
    previousRetryAttempt: z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    retryFeedback: retryFeedbackSchema.optional(),
    metrics: generationMetricsSchema.optional(),
  })
  .passthrough();

const inputFile = process.argv[2];
if (!inputFile) throw new Error("Informe o arquivo de resultados.");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL não definida.");

const caseId = process.env.SPIKE_CASE_ID;
const generationResults = z.array(generationResultSchema).parse(
  JSON.parse(await readFile(inputFile, "utf8")),
);

const casesById = new Map(
  EVALUATION_CASES.map((evaluationCase) => [
    evaluationCase.id,
    evaluationCase,
  ]),
);

const selectedResults = caseId
  ? generationResults.filter((result) => result.id === caseId)
  : generationResults;

if (selectedResults.length === 0) {
  throw new Error(`Caso não encontrado: ${caseId}`);
}

async function executeWithReport(
  client: InstanceType<typeof Client>,
  sql: string,
) {
  const startedAt = performance.now();

  try {
    const rows = await executeReadOnlyQuery(client, sql);

    return {
      success: true,
      rowCount: rows.length,
      durationMs: Math.round(performance.now() - startedAt),
      rows,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      rowCount: null,
      durationMs: Math.round(performance.now() - startedAt),
      rows: null,
      error: error instanceof Error ? error.message : "Erro desconhecido.",
    };
  }
}

function getGenerationMetadata(
  generationResult: z.infer<typeof generationResultSchema>,
) {
  return {
    model: generationResult.model ?? generationResult.metrics?.model ?? null,
    contextVariant: generationResult.contextVariant ?? null,
    contextNaming: generationResult.contextNaming ?? "prisma",
    relevantTables: generationResult.relevantTables ?? null,
    contextCharacters: generationResult.contextCharacters ?? null,
    retryAttempt: generationResult.retryAttempt ?? 0,
    previousRetryAttempt: generationResult.previousRetryAttempt ?? null,
    retryFeedback: generationResult.retryFeedback ?? null,
    generationMetrics: generationResult.metrics ?? null,
  };
}

const client = new Client({ connectionString });
const reports = [];

await client.connect();

try {
  for (const generationResult of selectedResults) {
    const evaluationCase = casesById.get(generationResult.id);

    if (!evaluationCase) {
      throw new Error(`Caso desconhecido: ${generationResult.id}`);
    }

    const metadata = getGenerationMetadata(generationResult);

    if (!generationResult.generatedSql) {
      reports.push({
        id: generationResult.id,
        ...metadata,
        generationSucceeded: false,
        staticValidationPassed: false,
        executionSucceeded: false,
        skipped: true,
        reason: "SQL não foi gerado.",
      });
      continue;
    }

    const staticValidation = await validateSql(
      generationResult.generatedSql,
      {
        allowedTables: SPIKE_ALLOWED_TABLES,
        expectedCompanyCode: evaluationCase.companyCode,
        maxRows: 100,
      },
    );

    if (!staticValidation.valid) {
      reports.push({
        id: generationResult.id,
        ...metadata,
        generationSucceeded: true,
        staticValidationPassed: false,
        executionSucceeded: false,
        skipped: true,
        reason: "SQL reprovado na validação estática.",
        staticValidation,
      });
      continue;
    }

    const reference = await executeWithReport(
      client,
      evaluationCase.referenceSql,
    );

    const generated = await executeWithReport(
      client,
      generationResult.generatedSql,
    );

    const comparison = compareQueryResults(
      reference.rows,
      generated.rows,
    );

    reports.push({
      id: generationResult.id,
      ...metadata,
      generationSucceeded: true,
      staticValidationPassed: true,
      executionSucceeded: generated.success,
      skipped: false,
      staticValidation,
      reference,
      generated,
      ...comparison,
    });
  }
} finally {
  await client.end();
}

console.log(JSON.stringify(reports, null, 2));

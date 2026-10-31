import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { z } from "zod";
import { AmbienteGuard } from "../../scripts/synthetic-data/guards.js";
import { EVALUATION_CASES } from "./evaluation-cases.js";
import { compareQueryResults } from "./result-comparison.js";
import type { SqlClient } from "./rls-tenant-isolation.js";
import { runInSnakeCaseViewSandbox } from "./snake-case-view-sandbox.js";
import {
  SPIKE_ALLOWED_SNAKE_CASE_VIEWS,
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

const generationResultSchema = z
  .object({
    id: z.string(),
    generatedSql: z.string().nullable(),
    model: z.string().optional(),
    contextVariant: z.enum(["full", "relevant"]).optional(),
    contextNaming: z.literal("snake_case"),
    relevantTables: z.array(z.string()).optional(),
    contextCharacters: z.number().optional(),
    metrics: generationMetricsSchema.optional(),
  })
  .passthrough();

const inputFile = process.argv
  .slice(2)
  .find((argument) => !argument.startsWith("--"));

if (!inputFile) {
  throw new Error("Informe o arquivo de resultados snake_case.");
}

const { url, host } = AmbienteGuard.validar();
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

function getGenerationMetadata(
  generationResult: z.infer<typeof generationResultSchema>,
) {
  return {
    model: generationResult.model ?? generationResult.metrics?.model ?? null,
    contextVariant: generationResult.contextVariant ?? null,
    contextNaming: generationResult.contextNaming,
    relevantTables: generationResult.relevantTables ?? null,
    contextCharacters: generationResult.contextCharacters ?? null,
    generationMetrics: generationResult.metrics ?? null,
  };
}

async function executeWithReport(
  client: InstanceType<typeof Client>,
  sql: string,
) {
  const startedAt = performance.now();

  try {
    const result = await client.query(sql);

    return {
      success: true,
      rowCount: result.rows.length,
      durationMs: Math.round(performance.now() - startedAt),
      rows: result.rows,
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

const client = new Client({ connectionString: url });
const reports = [];

console.error(`Banco sintético autorizado: ${host}`);
console.error("Views, roles e policies experimentais usarão ROLLBACK.");

await client.connect();

try {
  const sqlClient: SqlClient = {
    async query(sql, values) {
      const result = await client.query(sql, values);
      return { rows: result.rows };
    },
  };

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
        allowedTables: SPIKE_ALLOWED_SNAKE_CASE_VIEWS,
        expectedCompanyCode: evaluationCase.companyCode,
        companyTable: "empresas",
        requiredSchema: "ai",
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

    try {
      const execution = await runInSnakeCaseViewSandbox(
        sqlClient,
        evaluationCase.companyCode,
        async () => {
          const reference = await executeWithReport(
            client,
            evaluationCase.referenceSql,
          );
          const generated = await executeWithReport(
            client,
            generationResult.generatedSql!,
          );
          const comparison = compareQueryResults(
            reference.rows,
            generated.rows,
          );

          return { reference, generated, comparison };
        },
      );

      reports.push({
        id: generationResult.id,
        ...metadata,
        generationSucceeded: true,
        staticValidationPassed: true,
        executionSucceeded: execution.generated.success,
        skipped: false,
        staticValidation,
        reference: execution.reference,
        generated: execution.generated,
        ...execution.comparison,
      });
    } catch (error) {
      reports.push({
        id: generationResult.id,
        ...metadata,
        generationSucceeded: true,
        staticValidationPassed: true,
        executionSucceeded: false,
        skipped: true,
        staticValidation,
        reason: "Falha ao preparar ou executar o sandbox snake_case.",
        sandboxError:
          error instanceof Error ? error.message : "Erro desconhecido.",
      });
    }
  }
} finally {
  await client.end();
}

console.log(JSON.stringify(reports, null, 2));

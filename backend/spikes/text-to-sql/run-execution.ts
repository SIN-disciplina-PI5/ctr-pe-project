import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg, { type QueryResultRow } from "pg";
import { z } from "zod";
import { EVALUATION_CASES } from "./evaluation-cases.js";
import { executeReadOnlyQuery } from "./read-only-query-executor.js";
import {
  SPIKE_ALLOWED_TABLES,
  validateSql,
} from "./sql-validator.js";

const { Client } = pg;

const generationResultSchema = z.object({
  id: z.string(),
  generatedSql: z.string().nullable(),
}).passthrough();

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

function canonicalizeRows(rows: QueryResultRow[] | null): string | null {
  if (!rows) return null;

  const normalized = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  );

  normalized.sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right)),
  );

  return JSON.stringify(normalized);
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

    if (!generationResult.generatedSql) {
      reports.push({
        id: generationResult.id,
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

    reports.push({
      id: generationResult.id,
      skipped: false,
      staticValidation,
      reference,
      generated,
      exactMatch:
        reference.success &&
        generated.success &&
        canonicalizeRows(reference.rows) ===
          canonicalizeRows(generated.rows),
    });
  }
} finally {
  await client.end();
}

console.log(JSON.stringify(reports, null, 2));
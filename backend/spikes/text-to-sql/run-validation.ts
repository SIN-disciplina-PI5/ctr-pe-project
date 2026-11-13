import "dotenv/config";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { EVALUATION_CASES } from "./evaluation-cases.js";
import {
  SPIKE_ALLOWED_TABLES,
  validateSql,
} from "./sql-validator.js";

const generationResultSchema = z.object({
  id: z.string(),
  question: z.string(),
  generatedSql: z.string().nullable(),
  error: z.string().optional(),
}).passthrough();

const generationResultsSchema = z.array(generationResultSchema);
const files = process.argv.slice(2);

if (files.length === 0) {
  throw new Error("Informe pelo menos um arquivo de resultados.");
}

const casesById = new Map(
  EVALUATION_CASES.map((evaluationCase) => [
    evaluationCase.id,
    evaluationCase,
  ]),
);

const reports = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const generationResults = generationResultsSchema.parse(
    JSON.parse(content),
  );

  const results = [];

  for (const generationResult of generationResults) {
    const evaluationCase = casesById.get(generationResult.id);

    if (!evaluationCase) {
      throw new Error(`Caso desconhecido: ${generationResult.id}`);
    }

    if (!generationResult.generatedSql) {
      results.push({
        id: generationResult.id,
        valid: false,
        generationError:
          generationResult.error ?? "A geração não retornou SQL.",
        violations: ["SQL não foi gerado."],
      });
      continue;
    }

    const validation = await validateSql(
      generationResult.generatedSql,
      {
        allowedTables: SPIKE_ALLOWED_TABLES,
        expectedCompanyCode: evaluationCase.companyCode,
        maxRows: 100,
      },
    );

    results.push({
      id: generationResult.id,
      generatedSql: generationResult.generatedSql,
      ...validation,
    });
  }

  reports.push({
    file,
    total: results.length,
    approved: results.filter((result) => result.valid).length,
    rejected: results.filter((result) => !result.valid).length,
    generationFailures: results.filter(
      (result) => "generationError" in result,
    ).length,
    results,
  });
}

console.log(JSON.stringify(reports, null, 2));
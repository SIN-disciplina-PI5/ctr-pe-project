import "dotenv/config";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  EVALUATION_CASES,
  RELEVANT_TABLES_BY_CASE,
} from "./evaluation-cases.js";
import { GroqProvider } from "./llm-provider.js";
import { buildSchemaContext } from "./schema-context.js";
import {
  buildRetryPrompt,
  RETRY_SYSTEM_PROMPT,
  type RetryAttempt,
  type RetryExecutionStatus,
} from "./sql-retry.js";

const INTERVALO_REQUISICOES_MS = 10_000;

const inputFiles = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const [generationFile, executionFile] = inputFiles;

if (!generationFile || !executionFile) {
  throw new Error(
    "Informe os arquivos de geração e execução da tentativa anterior.",
  );
}

const retryAttemptValue = Number(process.env.SPIKE_RETRY_ATTEMPT);
if (retryAttemptValue !== 1 && retryAttemptValue !== 2) {
  throw new Error("SPIKE_RETRY_ATTEMPT deve ser 1 ou 2.");
}
const retryAttempt = retryAttemptValue as RetryAttempt;

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error("GROQ_API_KEY não definida.");

const model = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";
const caseId = process.env.SPIKE_CASE_ID;

const generationMetricsSchema = z
  .object({
    model: z.string(),
    latencyMs: z.number(),
    inputTokens: z.number().nullable(),
    outputTokens: z.number().nullable(),
    totalTokens: z.number().nullable(),
  })
  .passthrough();

const previousGenerationSchema = z
  .object({
    id: z.string(),
    generatedSql: z.string().nullable(),
    model: z.string().optional(),
    contextVariant: z.literal("relevant"),
    contextNaming: z.literal("prisma").default("prisma"),
    retryAttempt: z.union([z.literal(1), z.literal(2)]).optional(),
    metrics: generationMetricsSchema.optional(),
  })
  .passthrough();

const previousExecutionSchema = z
  .object({
    id: z.string(),
    staticValidationPassed: z.boolean(),
    executionSucceeded: z.boolean(),
    staticValidation: z
      .object({ violations: z.array(z.string()) })
      .passthrough()
      .optional(),
  })
  .passthrough();

const previousGenerations = z.array(previousGenerationSchema).parse(
  JSON.parse(await readFile(generationFile, "utf8")),
);
const previousExecutions = z.array(previousExecutionSchema).parse(
  JSON.parse(await readFile(executionFile, "utf8")),
);
const executionsById = new Map(
  previousExecutions.map((execution) => [execution.id, execution]),
);
const casesById = new Map(
  EVALUATION_CASES.map((evaluationCase) => [
    evaluationCase.id,
    evaluationCase,
  ]),
);

const selectedGenerations = caseId
  ? previousGenerations.filter((generation) => generation.id === caseId)
  : previousGenerations;

if (selectedGenerations.length === 0) {
  throw new Error(`Caso não encontrado: ${caseId}`);
}

const responseSchema = z.object({
  sql: z.string(),
  explicacao: z.string(),
  premissas: z.array(z.string()),
});

const provider = new GroqProvider(apiKey);
const results: unknown[] = [];

for (const [index, previousGeneration] of selectedGenerations.entries()) {
  const evaluationCase = casesById.get(previousGeneration.id);
  const previousExecution = executionsById.get(previousGeneration.id);
  const relevantTables = RELEVANT_TABLES_BY_CASE[previousGeneration.id];

  if (!evaluationCase || !previousExecution || !relevantTables) {
    throw new Error(
      `Dados da tentativa anterior incompletos para: ${previousGeneration.id}`,
    );
  }

  console.error(
    `[${index + 1}/${selectedGenerations.length}] Corrigindo ${previousGeneration.id}, tentativa ${retryAttempt}...`,
  );

  const schemaContext = buildSchemaContext({
    variant: "relevant",
    relevantTables,
    naming: "prisma",
  });
  const executionStatus: RetryExecutionStatus = previousExecution.executionSucceeded
    ? "succeeded"
    : previousExecution.staticValidationPassed
      ? "failed"
      : "not_executed";
  const staticViolations =
    previousExecution.staticValidation?.violations ?? [];

  try {
    const result = await provider.generateStructured({
      model,
      schemaName: "text_to_sql_retry",
      schema: responseSchema,
      systemPrompt: RETRY_SYSTEM_PROMPT,
      userPrompt: buildRetryPrompt({
        attempt: retryAttempt,
        question: evaluationCase.question,
        schemaContext,
        previousSql: previousGeneration.generatedSql,
        generationSucceeded: previousGeneration.generatedSql !== null,
        staticViolations,
        executionStatus,
      }),
    });

    results.push({
      id: evaluationCase.id,
      question: evaluationCase.question,
      referenceSql: evaluationCase.referenceSql,
      model: result.model,
      contextVariant: "relevant",
      contextNaming: "prisma",
      relevantTables,
      contextCharacters: schemaContext.length,
      retryAttempt,
      previousRetryAttempt: previousGeneration.retryAttempt ?? 0,
      previousSql: previousGeneration.generatedSql,
      retryFeedback: {
        generationSucceeded: previousGeneration.generatedSql !== null,
        staticViolations,
        executionStatus,
      },
      generatedSql: result.data.sql,
      explanation: result.data.explicacao,
      assumptions: result.data.premissas,
      metrics: {
        model: result.model,
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        totalTokens: result.totalTokens,
      },
    });
  } catch (error) {
    results.push({
      id: evaluationCase.id,
      question: evaluationCase.question,
      referenceSql: evaluationCase.referenceSql,
      model,
      contextVariant: "relevant",
      contextNaming: "prisma",
      relevantTables,
      contextCharacters: schemaContext.length,
      retryAttempt,
      previousRetryAttempt: previousGeneration.retryAttempt ?? 0,
      previousSql: previousGeneration.generatedSql,
      generatedSql: null,
      error: error instanceof Error ? error.message : "Erro desconhecido.",
    });
  }

  if (index < selectedGenerations.length - 1) {
    await new Promise((resolve) =>
      setTimeout(resolve, INTERVALO_REQUISICOES_MS),
    );
  }
}

console.log(JSON.stringify(results, null, 2));

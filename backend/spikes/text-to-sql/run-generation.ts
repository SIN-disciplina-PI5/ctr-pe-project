import "dotenv/config";
import { z } from "zod";
import {
  EVALUATION_CASES,
  RELEVANT_TABLES_BY_CASE,
} from "./evaluation-cases.js";
import { GroqProvider } from "./llm-provider.js";
import { buildSchemaContext } from "./schema-context.js";

const INTERVALO_REQUISICOES_MS = 10_000;

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error("GROQ_API_KEY não definida.");

const model = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";
const contextVariant = z
  .enum(["full", "relevant"])
  .parse(process.env.SPIKE_CONTEXT_VARIANT ?? "full");
const caseId = process.env.SPIKE_CASE_ID;

const selectedCases = caseId
  ? EVALUATION_CASES.filter((item) => item.id === caseId)
  : EVALUATION_CASES;

if (selectedCases.length === 0) {
  throw new Error(`Caso de avaliação não encontrado: ${caseId}`);
}

const responseSchema = z.object({
  sql: z.string(),
  explicacao: z.string(),
  premissas: z.array(z.string()),
});

const provider = new GroqProvider(apiKey);
const results: unknown[] = [];

for (const [index, evaluationCase] of selectedCases.entries()) {
  console.error(
    `[${index + 1}/${selectedCases.length}] Gerando ${evaluationCase.id}...`,
  );

  const relevantTables = RELEVANT_TABLES_BY_CASE[evaluationCase.id];

  if (!relevantTables) {
    throw new Error(
      `Tabelas relevantes não definidas para: ${evaluationCase.id}`,
    );
  }

  const schemaContext = buildSchemaContext({
    variant: contextVariant,
    relevantTables,
  });

  try {
    const result = await provider.generateStructured({
      model,
      schemaName: "text_to_sql_generation",
      schema: responseSchema,
      systemPrompt: [
        "Você converte perguntas em português para PostgreSQL.",
        "Retorne exatamente uma instrução SELECT.",
        "Use somente as tabelas e colunas fornecidas.",
        "Aplique obrigatoriamente o filtro da empresa indicada.",
        "Não use blocos Markdown.",
        "Inclua LIMIT de no máximo 100.",
      ].join(" "),
      userPrompt: `${schemaContext}\n\nPergunta:\n${evaluationCase.question}`,
    });

    results.push({
      id: evaluationCase.id,
      question: evaluationCase.question,
      referenceSql: evaluationCase.referenceSql,
      model: result.model,
      contextVariant,
      relevantTables,
      contextCharacters: schemaContext.length,
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
      contextVariant,
      relevantTables,
      contextCharacters: schemaContext.length,
      generatedSql: null,
      error: error instanceof Error ? error.message : "Erro desconhecido.",
    });
  }

  if (index < selectedCases.length - 1) {
    await new Promise((resolve) =>
      setTimeout(resolve, INTERVALO_REQUISICOES_MS),
    );
  }
}

console.log(JSON.stringify(results, null, 2));
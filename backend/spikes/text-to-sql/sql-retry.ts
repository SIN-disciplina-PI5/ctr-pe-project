export type RetryAttempt = 1 | 2;
export type RetryExecutionStatus =
  | "succeeded"
  | "failed"
  | "not_executed";

export interface RetryPromptInput {
  attempt: RetryAttempt;
  question: string;
  schemaContext: string;
  previousSql: string | null;
  generationSucceeded: boolean;
  staticViolations: readonly string[];
  executionStatus: RetryExecutionStatus;
}

export const RETRY_SYSTEM_PROMPT = [
  "Você revisa consultas PostgreSQL geradas para o domínio CTR-PE.",
  "Retorne exatamente uma instrução SELECT corrigida.",
  "Use somente as tabelas e colunas fornecidas.",
  "Aplique obrigatoriamente o filtro da empresa indicada.",
  "Inclua LIMIT de no máximo 100.",
  "Não use blocos Markdown.",
].join(" ");

function buildFeedback(input: RetryPromptInput): string[] {
  const feedback: string[] = [];

  if (!input.generationSucceeded || !input.previousSql) {
    feedback.push("A tentativa anterior não produziu uma consulta SQL.");
  }

  if (input.staticViolations.length > 0) {
    feedback.push(
      `Violações da validação estática: ${input.staticViolations.join(" ")}`,
    );
  }

  if (input.executionStatus === "failed") {
    feedback.push(
      "A consulta falhou no PostgreSQL. Revise nomes de relações, colunas, tipos, operadores e agregações.",
    );
  } else if (input.executionStatus === "succeeded") {
    feedback.push(
      "A consulta executou sem erro. Revise se ela responde integralmente à pergunta, incluindo campos solicitados, critérios de desempate, filtros e agregações.",
    );
  }

  return feedback;
}

export function buildRetryPrompt(input: RetryPromptInput): string {
  const previousSql = input.previousSql ?? "Nenhum SQL foi produzido.";

  return [
    `Tentativa de correção: ${input.attempt}.`,
    input.schemaContext,
    `Pergunta:\n${input.question}`,
    `SQL anterior:\n${previousSql}`,
    `Feedback seguro:\n${buildFeedback(input).join("\n")}`,
    "Revise a consulta e devolva somente a resposta estruturada solicitada.",
  ].join("\n\n");
}

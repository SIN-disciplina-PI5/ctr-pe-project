import { describe, expect, it } from "@jest/globals";
import {
  buildRetryPrompt,
  RETRY_SYSTEM_PROMPT,
} from "../../../spikes/text-to-sql/sql-retry.js";

const baseInput = {
  attempt: 1 as const,
  question: "Quais ativos estão parados?",
  schemaContext: '"Ativo": id text, status text.',
  previousSql: 'SELECT * FROM "Ativo" LIMIT 100;',
  generationSucceeded: true,
  staticViolations: [],
  executionStatus: "succeeded" as const,
};

describe("buildRetryPrompt", () => {
  it("inclui tentativa, pergunta, contexto e SQL anterior", () => {
    const prompt = buildRetryPrompt(baseInput);

    expect(prompt).toContain("Tentativa de correção: 1");
    expect(prompt).toContain(baseInput.question);
    expect(prompt).toContain(baseInput.schemaContext);
    expect(prompt).toContain(baseInput.previousSql);
  });

  it("orienta revisão semântica após execução bem-sucedida", () => {
    const prompt = buildRetryPrompt(baseInput);

    expect(prompt).toContain("executou sem erro");
    expect(prompt).toContain("responde integralmente à pergunta");
  });

  it("inclui somente violações estáticas controladas", () => {
    const prompt = buildRetryPrompt({
      ...baseInput,
      staticViolations: ["LIMIT obrigatório não identificado."],
      executionStatus: "not_executed",
    });

    expect(prompt).toContain("LIMIT obrigatório não identificado.");
    expect(prompt).not.toContain("PostgreSQL");
  });

  it("usa feedback genérico para falha de execução", () => {
    const prompt = buildRetryPrompt({
      ...baseInput,
      executionStatus: "failed",
    });

    expect(prompt).toContain("falhou no PostgreSQL");
    expect(prompt).toContain("Revise nomes de relações");
  });

  it("trata ausência de SQL anterior", () => {
    const prompt = buildRetryPrompt({
      ...baseInput,
      previousSql: null,
      generationSucceeded: false,
      executionStatus: "not_executed",
    });

    expect(prompt).toContain("não produziu uma consulta SQL");
    expect(prompt).toContain("Nenhum SQL foi produzido");
  });

  it("mantém as restrições de segurança no prompt de sistema", () => {
    expect(RETRY_SYSTEM_PROMPT).toContain("exatamente uma instrução SELECT");
    expect(RETRY_SYSTEM_PROMPT).toContain("LIMIT de no máximo 100");
  });
});

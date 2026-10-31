import {
  EVALUATION_CASES,
  RELEVANT_TABLES_BY_CASE,
} from "../../../spikes/text-to-sql/evaluation-cases.js";
import { buildSchemaContext } from "../../../spikes/text-to-sql/schema-context.js";

describe("EVALUATION_CASES", () => {
  it("possui dez casos com identificadores únicos", () => {
    const ids = EVALUATION_CASES.map((item) => item.id);

    expect(EVALUATION_CASES).toHaveLength(10);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos os casos possuem pergunta e SQL de referência", () => {
    for (const evaluationCase of EVALUATION_CASES) {
      expect(evaluationCase.question.length).toBeGreaterThan(0);
      expect(evaluationCase.referenceSql).toMatch(/^SELECT/i);
    }
  });

  it("todos os SQLs aplicam empresa e limite", () => {
    for (const evaluationCase of EVALUATION_CASES) {
      expect(evaluationCase.referenceSql).toContain('"Empresa"');
      expect(evaluationCase.referenceSql).toMatch(/\bLIMIT\s+\d+/i);
    }
  });

  it("define tabelas relevantes para todos os casos", () => {
  const caseIds = EVALUATION_CASES.map((item) => item.id).sort();
  const mappedIds = Object.keys(RELEVANT_TABLES_BY_CASE).sort();

  expect(mappedIds).toEqual(caseIds);

  for (const evaluationCase of EVALUATION_CASES) {
    const relevantTables = RELEVANT_TABLES_BY_CASE[evaluationCase.id];

    if (!relevantTables) {
  throw new Error(`Tabelas não definidas para ${evaluationCase.id}`);
}

expect(relevantTables).toContain("Empresa");

    const context = buildSchemaContext({
      variant: "relevant",
      relevantTables,
    });

    for (const table of relevantTables) {
      expect(context).toContain(`"${table}"`);
    }
  }
});
});
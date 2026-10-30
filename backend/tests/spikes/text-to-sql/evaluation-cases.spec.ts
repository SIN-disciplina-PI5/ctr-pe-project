import { EVALUATION_CASES } from "../../../spikes/text-to-sql/evaluation-cases.js";

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
});
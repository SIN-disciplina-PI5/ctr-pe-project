import { describe, expect, it } from "@jest/globals";
import { QUERY_EXAMPLES } from "../../src/modules/ai/query-examples.js";
import {
  EVALUATION_CATEGORIES,
  QUERY_EVALUATION_DATASET,
  evaluationDatasetSchema,
} from "../../evaluation/query-evaluation-dataset.js";

describe("dataset de avaliação do domínio CTR-PE", () => {
  it("possui schema válido, pelo menos quarenta casos e todas as categorias", () => {
    expect(() => evaluationDatasetSchema.parse(QUERY_EVALUATION_DATASET)).not.toThrow();
    expect(QUERY_EVALUATION_DATASET.length).toBeGreaterThanOrEqual(40);
    expect(new Set(QUERY_EVALUATION_DATASET.map((item) => item.category))).toEqual(new Set(EVALUATION_CATEGORIES));
  });

  it("mantém IDs e perguntas únicos", () => {
    expect(new Set(QUERY_EVALUATION_DATASET.map((item) => item.id)).size).toBe(QUERY_EVALUATION_DATASET.length);
    expect(new Set(QUERY_EVALUATION_DATASET.map((item) => item.question)).size).toBe(QUERY_EVALUATION_DATASET.length);
  });

  it("referencia apenas resultados SQL conhecidos e executáveis", () => {
    const examplesById = new Map(QUERY_EXAMPLES.map((example) => [example.id, example]));

    for (const evaluationCase of QUERY_EVALUATION_DATASET) {
      if (evaluationCase.expected.kind !== "query") continue;

      for (const step of evaluationCase.expected.steps) {
        const example = examplesById.get(step.queryExampleId);
        expect(example).toBeDefined();
        expect(example?.sql).toMatch(/^SELECT\b/);
        expect(example?.expected.columns.length).toBeGreaterThan(0);
        expect(
          example?.expected.rowCount || example?.expected.exactRows || example?.expected.exactRowsByTenant,
        ).toBeTruthy();
      }
    }
  });

  it("exige duas ou mais etapas nos casos multi-step", () => {
    const multiStepCases = QUERY_EVALUATION_DATASET.filter((item) => item.category === "multi-step");

    expect(multiStepCases.length).toBeGreaterThan(0);
    for (const evaluationCase of multiStepCases) {
      expect(evaluationCase.expected.kind).toBe("query");
      if (evaluationCase.expected.kind === "query") {
        expect(evaluationCase.expected.steps.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("define a resposta esperada para ambiguidades e recusas", () => {
    const ambiguousCases = QUERY_EVALUATION_DATASET.filter((item) => item.category === "ambiguous");
    const refusedCases = QUERY_EVALUATION_DATASET.filter((item) => item.category === "refused");

    expect(ambiguousCases.every((item) => item.expected.kind === "clarification")).toBe(true);
    expect(refusedCases.every((item) => item.expected.kind === "refusal")).toBe(true);
  });
});

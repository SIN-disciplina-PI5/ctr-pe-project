import { describe, expect, it } from "@jest/globals";
import { compareQueryResults } from "../../../spikes/text-to-sql/result-comparison.js";

describe("compareQueryResults", () => {
  it("aceita resultados exatamente iguais em ordens diferentes", () => {
    const result = compareQueryResults(
      [{ codigo: "A" }, { codigo: "B" }],
      [{ codigo: "B" }, { codigo: "A" }],
    );

    expect(result).toEqual({
      exactMatch: true,
      referenceProjectionMatch: true,
    });
  });

  it("aceita colunas extras quando a projeção de referência coincide", () => {
    const result = compareQueryResults(
      [{ codigo: "A", status: "PARADO" }],
      [{ id: "ativo-1", codigo: "A", status: "PARADO" }],
    );

    expect(result).toEqual({
      exactMatch: false,
      referenceProjectionMatch: true,
    });
  });

  it("rejeita valores diferentes", () => {
    const result = compareQueryResults(
      [{ codigo: "A", status: "PARADO" }],
      [{ codigo: "A", status: "DISPONIVEL" }],
    );

    expect(result.referenceProjectionMatch).toBe(false);
  });

  it("rejeita quantidades diferentes de linhas", () => {
    const result = compareQueryResults(
      [{ codigo: "A" }],
      [{ codigo: "A" }, { codigo: "B" }],
    );

    expect(result.referenceProjectionMatch).toBe(false);
  });
});
import { describe, expect, it } from "@jest/globals";
import { evaluateSemanticResult } from "../../../spikes/text-to-sql/result-semantic-comparison.js";

describe("evaluateSemanticResult", () => {
  it("aceita aliases e números retornados como texto", () => {
    const result = evaluateSemanticResult(
      "os-abertas-por-status",
      [{ status: "ABERTA", quantidade: 3 }],
      [{ status: "ABERTA", total: "3" }],
    );

    expect(result.status).toBe("match");
  });

  it("aceita aliases snake_case das views analíticas", () => {
    const result = evaluateSemanticResult(
      "materiais-estoque-baixo",
      [
        {
          codigo: "MAT-01",
          nome: "Filtro",
          estoqueAtual: "2",
          estoqueMinimo: "5",
        },
      ],
      [
        {
          codigo: "MAT-01",
          nome: "Filtro",
          estoque_atual: 2,
          estoque_minimo: 5,
        },
      ],
    );

    expect(result.status).toBe("match");
  });

  it("rejeita valores semanticamente diferentes", () => {
    const result = evaluateSemanticResult(
      "ativos-mais-corretivas",
      [{ codigo: "CT-01", nome: "Caminhão", quantidade: 10 }],
      [{ codigo: "CT-01", nome: "Caminhão", total_corr: "8" }],
    );

    expect(result.status).toBe("mismatch");
  });

  it("rejeita campo obrigatório ausente", () => {
    const result = evaluateSemanticResult(
      "materiais-os-aguardando",
      [{ codigo: "MAT-01", nome: "Filtro", quantidade: "2" }],
      [{ material_name: "Filtro", total_quantidade: "2" }],
    );

    expect(result).toMatchObject({
      status: "mismatch",
      reason: "A consulta gerada não possui o campo codigo.",
    });
  });

  it("considera conjuntos vazios inconclusivos", () => {
    const result = evaluateSemanticResult("alertas-criticos", [], []);

    expect(result.status).toBe("inconclusive");
  });
});

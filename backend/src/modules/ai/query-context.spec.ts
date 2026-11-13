import { describe, expect, it } from "@jest/globals";
import {
  buildQueryContext,
  MAX_QUERY_EXAMPLES_IN_CONTEXT,
  selectRelevantQueryExamples,
} from "./query-context.js";

describe("contexto confiável de consulta", () => {
  it("seleciona no máximo três exemplos compatíveis com as views", () => {
    const selected = selectRelevantQueryExamples({
      question: "Quais ativos estão parados?",
      relevantViews: ["Ativo"],
    });

    expect(selected).toHaveLength(MAX_QUERY_EXAMPLES_IN_CONTEXT);
    expect(
      selected.every((example) =>
        example.relevantViews.every((view) => view === "Ativo"),
      ),
    ).toBe(true);
  });

  it("prioriza pergunta com as mesmas views e termos", () => {
    const selected = selectRelevantQueryExamples({
      question:
        "Quantas falhas na caixa de transmissão do caminhão CT-07 ocorreram em agosto de 2026?",
      relevantViews: ["OrdemServico", "Ativo"],
    });

    expect(selected[0]?.id).toBe("evento-transmissao-ct07");
  });

  it("mantém seleção determinística", () => {
    const options = {
      question: "Quais materiais estão abaixo do estoque mínimo?",
      relevantViews: ["Material"] as const,
    };

    const first = selectRelevantQueryExamples(options).map(
      (example) => example.id,
    );
    const second = selectRelevantQueryExamples(options).map(
      (example) => example.id,
    );

    expect(second).toEqual(first);
  });

  it("monta schema e exemplos sem incluir resultados esperados", () => {
    const context = buildQueryContext({
      question:
        "Quantas falhas na caixa de transmissão do caminhão CT-07 ocorreram em agosto de 2026?",
      relevantViews: ["OrdemServico", "Ativo"],
    });

    expect(context).toContain('ai."OrdemServico"');
    expect(context).toContain('ai."Ativo"');
    expect(context).toContain("Exemplos confiáveis de pergunta e SQL:");
    expect(context).not.toContain(
      "Uma ocorrência plantada por empresa para validar séries e picos.",
    );
  });

  it("recusa limite inválido", () => {
    expect(() =>
      selectRelevantQueryExamples({
        question: "Quais ativos existem?",
        relevantViews: ["Ativo"],
        limit: -1,
      }),
    ).toThrow("O limite de exemplos deve ser um inteiro não negativo.");
  });
});

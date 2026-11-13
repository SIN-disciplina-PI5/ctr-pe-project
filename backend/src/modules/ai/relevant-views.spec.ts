import { describe, expect, it } from "@jest/globals";
import { QUERY_EXAMPLES } from "./query-examples.js";
import { inferRelevantViews } from "./relevant-views.js";

describe("seleção determinística de views relevantes", () => {
  it.each(QUERY_EXAMPLES)(
    "$id identifica ao menos um domínio necessário do exemplo",
    (example) => {
      const inferred = inferRelevantViews(example.question);
      expect(inferred.length).toBeGreaterThan(0);
      expect(
        inferred.some((view) => example.relevantViews.includes(view)),
      ).toBe(true);
    },
  );

  it("combina domínios quando a pergunta explicita um join", () => {
    expect(
      inferRelevantViews(
        "Quais materiais foram consumidos nas ordens de serviço?",
      ),
    ).toEqual(
      expect.arrayContaining([
        "Material",
        "OrdemServicoMaterial",
        "OrdemServico",
      ]),
    );

    expect(
      inferRelevantViews("Quais ordens estão associadas a cada ativo?"),
    ).toEqual(expect.arrayContaining(["OrdemServico", "Ativo"]));
  });

  it("normaliza acentos e caixa", () => {
    expect(inferRelevantViews("TÉCNICOS com mais HORAS trabalhadas")).toContain(
      "ApontamentoOS",
    );
  });

  it("não escolhe views para assunto externo", () => {
    expect(
      inferRelevantViews("Qual é a previsão do tempo para amanhã?"),
    ).toEqual([]);
  });
});

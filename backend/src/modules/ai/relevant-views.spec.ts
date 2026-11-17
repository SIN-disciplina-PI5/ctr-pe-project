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

  it("combina ativos e paradas para perguntas de disponibilidade", () => {
    expect(
      inferRelevantViews(
        "Qual foi a disponibilidade dos ativos no período informado?",
      ),
    ).toEqual(expect.arrayContaining(["Ativo", "ParadaAtivo"]));
  });

  it("reconhece perguntas de custo, preventiva e cronograma como ordens", () => {
    expect(
      inferRelevantViews(
        "Qual o custo das preventivas e a conformidade com o cronograma?",
      ),
    ).toContain("OrdemServico");
  });

  it("mapeia tempo médio de resolução para ordens de serviço", () => {
    expect(
      inferRelevantViews("Qual foi o tempo médio de resolução no período?"),
    ).toContain("OrdemServico");
  });

  it("mapeia downtime para ativos e paradas", () => {
    expect(
      inferRelevantViews("Qual foi o downtime por ativo no período?"),
    ).toEqual(expect.arrayContaining(["Ativo", "ParadaAtivo"]));
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

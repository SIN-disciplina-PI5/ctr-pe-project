import { describe, expect, it } from "@jest/globals";
import {
  AI_SCHEMA_CATALOG,
  AI_VIEW_NAMES,
  buildSchemaContext,
  selectRelevantViews,
  type AiViewName,
} from "./schema-context.js";

const EXPECTED_VIEWS = [
  "Empresa",
  "Localizacao",
  "Ativo",
  "OrdemServico",
  "ParadaAtivo",
  "Material",
  "OrdemServicoMaterial",
  "ApontamentoOS",
  "Alerta",
] as const;

describe("schema context da IA", () => {
  it("cataloga exatamente as views autorizadas pela migration", () => {
    expect(AI_VIEW_NAMES).toEqual(EXPECTED_VIEWS);
  });

  it("registra todas as colunas expostas por cada view", () => {
    expect(Object.fromEntries(
      AI_VIEW_NAMES.map((view) => [
        view,
        AI_SCHEMA_CATALOG[view].columns.map((item) => item.name),
      ]),
    )).toEqual({
      Empresa: ["id", "codigo", "nome", "ativa", "createdAt", "updatedAt"],
      Localizacao: ["id", "empresaId", "codigo", "nome", "tipo", "ativa", "createdAt", "updatedAt"],
      Ativo: ["id", "empresaId", "localizacaoId", "codigo", "nome", "descricao", "tipo", "status", "criticidade", "marca", "modelo", "numeroSerie", "placa", "horimetroAtual", "odometroAtual", "ativo", "createdAt", "updatedAt"],
      OrdemServico: ["id", "empresaId", "localizacaoId", "ativoId", "solicitanteId", "solicitanteNome", "responsavelId", "responsavelNome", "numero", "titulo", "descricao", "tipo", "status", "prioridade", "impactaDisponibilidade", "abertaEm", "iniciadaEm", "encerradaEm", "canceladaEm", "prazoEm", "aguardandoPecaDesde", "tempoAguardandoPecaMinutos", "tempoParadoMinutos", "tempoExecucaoMinutos", "custoMateriais", "custoMaoObra", "custoTotal", "diagnostico", "solucao", "observacao", "createdAt", "updatedAt"],
      ParadaAtivo: ["id", "empresaId", "ativoId", "ordemServicoId", "status", "inicioEm", "fimEm", "duracaoMinutos", "motivo", "programada", "impactaDisponibilidade", "createdAt", "updatedAt"],
      Material: ["id", "empresaId", "codigo", "nome", "descricao", "unidade", "estoqueAtual", "estoqueMinimo", "custoMedio", "ativo", "createdAt", "updatedAt"],
      OrdemServicoMaterial: ["id", "empresaId", "ordemServicoId", "materialId", "quantidade", "custoUnitario", "custoTotal", "status", "createdAt", "updatedAt"],
      ApontamentoOS: ["id", "empresaId", "ordemServicoId", "usuarioId", "tecnicoNome", "inicioEm", "fimEm", "duracaoMinutos", "descricao", "custoHora", "custoTotal", "createdAt", "updatedAt"],
      Alerta: ["id", "empresaId", "ativoId", "ordemServicoId", "tipo", "severidade", "status", "titulo", "mensagem", "geradoEm", "lidoEm", "resolvidoEm", "createdAt", "updatedAt"],
    });
  });

  it("não expõe tabelas ou colunas sensíveis", () => {
    const context = buildSchemaContext();

    for (const forbidden of [
      'ai."Usuario"',
      'ai."RefreshToken"',
      'ai."LogAuditoria"',
      "senhaHash",
      "tokenHash",
      "public.",
    ]) {
      expect(context).not.toContain(forbidden);
    }
  });

  it("seleciona subconjunto relevante em ordem canônica e sem duplicatas", () => {
    expect(selectRelevantViews(["Material", "Ativo", "Material"])).toEqual([
      "Ativo",
      "Material",
    ]);

    const context = buildSchemaContext({
      relevantViews: ["Material", "Ativo", "Material"],
    });

    expect(context.indexOf('ai."Ativo"')).toBeLessThan(
      context.indexOf('ai."Material"'),
    );
    expect(context).not.toContain('ai."OrdemServico"');
  });

  it("inclui somente relacionamentos cujas duas views estão presentes", () => {
    const onlyAssets = buildSchemaContext({ relevantViews: ["Ativo"] });
    const assetsAndLocations = buildSchemaContext({
      relevantViews: ["Ativo", "Localizacao"],
    });

    expect(onlyAssets).not.toContain('"Ativo"."localizacaoId" = "Localizacao"."id"');
    expect(assetsAndLocations).toContain('"Ativo"."localizacaoId" = "Localizacao"."id"');
  });

  it("mantém as regras reais de parada, estoque e atraso", () => {
    const context = buildSchemaContext({
      relevantViews: ["ParadaAtivo", "Material", "OrdemServico"],
    });

    expect(context).toContain("Parada aberta: status = 'ABERTA'");
    expect(context).toContain("estoqueAtual < estoqueMinimo");
    expect(context).not.toContain("estoqueAtual <= estoqueMinimo");
    expect(context).toContain("status NOT IN ('ENCERRADA', 'CANCELADA') AND prazoEm < instante de referência");
  });

  it("usa nomenclatura Prisma nas views, colunas e enums", () => {
    const context = buildSchemaContext({ relevantViews: ["Ativo"] });

    expect(context).toContain('ai."Ativo"');
    expect(context).toContain('"empresaId" text NOT NULL');
    expect(context).toContain("StatusAtivo: DISPONIVEL, EM_USO, PARADO");
    expect(context).not.toContain("ai.ativos");
    expect(context).not.toContain("empresa_id");
  });

  it("rejeita em runtime uma view que não pertence à allowlist", () => {
    expect(() =>
      selectRelevantViews(["Usuario" as AiViewName]),
    ).toThrow("Views de IA desconhecidas: Usuario");
  });
});

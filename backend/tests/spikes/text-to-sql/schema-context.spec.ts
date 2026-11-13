import { describe, expect, it } from "@jest/globals";
import {
  buildSchemaContext,
  SCHEMA_CONTEXT,
} from "../../../spikes/text-to-sql/schema-context.js";

describe("schema-context", () => {
  it("mantém todas as tabelas no contexto completo", () => {
    expect(SCHEMA_CONTEXT).toContain('"Ativo"');
    expect(SCHEMA_CONTEXT).toContain('"Material"');
    expect(SCHEMA_CONTEXT).toContain('"Alerta"');
  });

  it("mantém somente as tabelas relevantes e Empresa", () => {
    const context = buildSchemaContext({
      variant: "relevant",
      relevantTables: ["Ativo"],
    });

    expect(context).toContain('"Empresa"');
    expect(context).toContain('"Ativo"');
    expect(context).not.toContain('"Material"');
    expect(context).not.toContain('"OrdemServico"');
  });

  it("remove relacionamentos de tabelas ausentes", () => {
    const context = buildSchemaContext({
      variant: "relevant",
      relevantTables: ["Material"],
    });

    expect(context).toContain('"Material"."empresaId"');
    expect(context).not.toContain('"OrdemServico"."ativoId"');
  });

  it("gera contexto relevante com views e colunas em snake_case", () => {
    const context = buildSchemaContext({
      variant: "relevant",
      relevantTables: ["Ativo", "OrdemServico"],
      naming: "snake_case",
    });

    expect(context).toContain("ai.empresas");
    expect(context).toContain("ai.ativos");
    expect(context).toContain("ai.ordens_servico");
    expect(context).toContain("empresa_id");
    expect(context).toContain("ativo_id");
    expect(context).not.toContain("ai.materiais");
    expect(context).not.toContain('"Ativo"');
    expect(context).not.toContain('"empresaId"');
  });

  it("descreve regras e relacionamentos usando somente snake_case", () => {
    const context = buildSchemaContext({
      variant: "relevant",
      relevantTables: ["Material"],
      naming: "snake_case",
    });

    expect(context).toContain("ai.materiais.empresa_id -> ai.empresas.id");
    expect(context).toContain("estoque_atual menor ou igual a estoque_minimo");
    expect(context).toContain("SELECT a.codigo FROM ai.ativos AS a");
    expect(context).not.toContain("estoqueAtual");
  });
});

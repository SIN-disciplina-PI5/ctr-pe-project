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
});
import { describe, expect, it } from "@jest/globals";
import { validateSql } from "./sql-validator.js";

describe("validador SQL de produção", () => {
  it("aceita SELECT único nas views autorizadas com LIMIT", async () => {
    await expect(
      validateSql(
        `SELECT a."codigo", COUNT(*)::int AS "total"
         FROM ai."Ativo" a
         GROUP BY a."codigo"
         ORDER BY "total" DESC
         LIMIT 10`,
        { allowedViews: ["Ativo"] },
      ),
    ).resolves.toEqual({
      valid: true,
      violations: [],
      views: ["Ativo"],
      functions: ["count"],
      limit: 10,
    });
  });

  it.each([
    ["SQL inválido", "SELECT FROM", "SQL sintaticamente inválido."],
    [
      "múltiplas instruções",
      `SELECT * FROM ai."Ativo" LIMIT 1; SELECT * FROM ai."Material" LIMIT 1`,
      "A consulta deve possuir exatamente uma instrução.",
    ],
    [
      "escrita",
      `DELETE FROM ai."Ativo"`,
      "Construção SQL proibida: DeleteStmt.",
    ],
    [
      "view proibida",
      `SELECT * FROM public."Usuario" LIMIT 10`,
      "View não autorizada: Usuario.",
    ],
    [
      "schema ausente",
      `SELECT * FROM "Ativo" LIMIT 10`,
      "Relação Ativo deve usar o schema ai.",
    ],
    [
      "LIMIT ausente",
      `SELECT * FROM ai."Ativo"`,
      "LIMIT obrigatório não identificado.",
    ],
    [
      "LIMIT excessivo",
      `SELECT * FROM ai."Ativo" LIMIT 101`,
      "LIMIT deve estar entre 1 e 100.",
    ],
    [
      "alteração da sessão",
      `SELECT set_config('ctrpe.current_empresa_id', 'outra', true)
       FROM ai."Empresa" LIMIT 1`,
      "Função SQL não autorizada: set_config.",
    ],
    [
      "CTE",
      `WITH ativos AS (SELECT * FROM ai."Ativo")
       SELECT * FROM ativos LIMIT 10`,
      "CTEs não são permitidas.",
    ],
    [
      "SELECT INTO",
      `SELECT * INTO TEMP resultado FROM ai."Ativo" LIMIT 1`,
      "SELECT INTO não é permitido.",
    ],
  ])("recusa %s", async (_label, sql, violation) => {
    const result = await validateSql(sql, { allowedViews: ["Ativo"] });
    expect(result.valid).toBe(false);
    expect(result.violations).toContain(violation);
  });

  it("recusa SELECT sem view, mesmo com LIMIT", async () => {
    const result = await validateSql("SELECT 1 LIMIT 1");
    expect(result.violations).toContain(
      "A consulta deve usar ao menos uma view autorizada.",
    );
  });
});

import {
  SPIKE_ALLOWED_SNAKE_CASE_VIEWS,
  SPIKE_ALLOWED_TABLES,
  validateSql,
  type SqlValidationOptions,
} from "../../../spikes/text-to-sql/sql-validator.js";

const options = {
  allowedTables: SPIKE_ALLOWED_TABLES,
  expectedCompanyCode: "alpha-brazilian",
  maxRows: 100,
} satisfies SqlValidationOptions;

describe("validateSql", () => {
  it("aprova SELECT autorizado com empresa e limite", async () => {
    const result = await validateSql(
      `SELECT a."codigo"
       FROM "Ativo" AS a
       JOIN "Empresa" AS e ON e."id" = a."empresaId"
       WHERE e."codigo" = 'alpha-brazilian'
       LIMIT 100;`,
      options,
    );

    expect(result).toEqual({
      valid: true,
      violations: [],
      tables: ["Ativo", "Empresa"],
      limit: 100,
    });
  });

  it("aprova SELECT nas views snake_case do schema ai", async () => {
    const result = await validateSql(
      `SELECT a.codigo
       FROM ai.ativos AS a
       JOIN ai.empresas AS e ON e.id = a.empresa_id
       WHERE e.codigo = 'alpha-brazilian'
       LIMIT 100;`,
      {
        allowedTables: SPIKE_ALLOWED_SNAKE_CASE_VIEWS,
        expectedCompanyCode: "alpha-brazilian",
        companyTable: "empresas",
        requiredSchema: "ai",
        maxRows: 100,
      },
    );

    expect(result).toEqual({
      valid: true,
      violations: [],
      tables: ["ativos", "empresas"],
      limit: 100,
    });
  });

  it("rejeita view snake_case fora do schema ai", async () => {
    const result = await validateSql(
      `SELECT a.codigo
       FROM public.ativos AS a
       JOIN ai.empresas AS e ON e.id = a.empresa_id
       WHERE e.codigo = 'alpha-brazilian'
       LIMIT 100;`,
      {
        allowedTables: SPIKE_ALLOWED_SNAKE_CASE_VIEWS,
        expectedCompanyCode: "alpha-brazilian",
        companyTable: "empresas",
        requiredSchema: "ai",
        maxRows: 100,
      },
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "Relação public.ativos deve usar o schema ai.",
    );
  });

  it("rejeita múltiplas instruções", async () => {
    const result = await validateSql(
      `SELECT * FROM "Empresa"
       WHERE "codigo" = 'alpha-brazilian' LIMIT 10;
       SELECT * FROM "Ativo" LIMIT 10;`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "A consulta deve possuir exatamente uma instrução.",
    );
  });

  it.each([
    ["InsertStmt", `INSERT INTO "Ativo" ("id") VALUES ('1');`],
    ["UpdateStmt", `UPDATE "Ativo" SET "nome" = 'X';`],
    ["DeleteStmt", `DELETE FROM "Ativo";`],
    ["TruncateStmt", `TRUNCATE TABLE "Ativo";`],
  ])("rejeita comando de escrita %s", async (tag, sql) => {
    const result = await validateSql(sql, options);

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      `Comando proibido detectado: ${tag}.`,
    );
  });

  it("rejeita tabela não autorizada", async () => {
    const result = await validateSql(
      `SELECT u."email"
       FROM "Usuario" AS u
       JOIN "Empresa" AS e ON e."id" = u."empresaId"
       WHERE e."codigo" = 'alpha-brazilian'
       LIMIT 10;`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain("Tabela não autorizada: Usuario.");
  });

  it("rejeita ausência de escopo por empresa", async () => {
    const result = await validateSql(
      `SELECT a."nome" FROM "Ativo" AS a LIMIT 10;`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "Filtro obrigatório de empresa não identificado.",
    );
  });

  it("rejeita consulta sem limite", async () => {
    const result = await validateSql(
      `SELECT e."nome"
       FROM "Empresa" AS e
       WHERE e."codigo" = 'alpha-brazilian';`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "LIMIT obrigatório não identificado.",
    );
  });

  it("rejeita limite acima do máximo", async () => {
    const result = await validateSql(
      `SELECT e."nome"
       FROM "Empresa" AS e
       WHERE e."codigo" = 'alpha-brazilian'
       LIMIT 101;`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "LIMIT deve estar entre 1 e 100.",
    );
  });

  it("rejeita CTE", async () => {
    const result = await validateSql(
      `WITH ativos AS (
         SELECT * FROM "Ativo"
       )
       SELECT *
       FROM ativos
       JOIN "Empresa" AS e ON true
       WHERE e."codigo" = 'alpha-brazilian'
       LIMIT 10;`,
      options,
    );

    expect(result.valid).toBe(false);
    expect(result.violations).toContain(
      "CTEs ainda não são permitidas neste spike.",
    );
  });

  it("rejeita SQL sintaticamente inválido", async () => {
    const result = await validateSql("SELECT FROM WHERE", options);

    expect(result).toEqual({
      valid: false,
      violations: ["SQL sintaticamente inválido."],
      tables: [],
      limit: null,
    });
  });
});

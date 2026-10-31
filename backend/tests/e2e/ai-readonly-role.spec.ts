import pg from "pg";

const { Client } = pg;

const AI_VIEWS = [
  "Alerta",
  "ApontamentoOS",
  "Ativo",
  "Empresa",
  "Localizacao",
  "Material",
  "OrdemServico",
  "OrdemServicoMaterial",
  "ParadaAtivo",
] as const;

const RLS_TABLES = [
  "Alerta",
  "ApontamentoOS",
  "Ativo",
  "Empresa",
  "Localizacao",
  "Material",
  "OrdemServico",
  "OrdemServicoMaterial",
  "ParadaAtivo",
  "Usuario",
] as const;

const EMPRESA_A = "ai_test_empresa_a";
const EMPRESA_B = "ai_test_empresa_b";
const PG_INSUFFICIENT_PRIVILEGE = "42501";

let owner: pg.Client;
let ai: pg.Client;

interface QueryFailure {
  code: string | undefined;
  message: string;
}

async function queryFailure(
  client: pg.Client,
  sql: string,
): Promise<QueryFailure> {
  try {
    await client.query(sql);
  } catch (error: unknown) {
    const failure = error as { code?: string; message?: string };
    return {
      code: failure.code,
      message: failure.message ?? String(error),
    };
  }

  throw new Error(`A consulta deveria ter falhado: ${sql}`);
}

async function withTenant<T>(
  empresaId: string,
  callback: () => Promise<T>,
): Promise<T> {
  await ai.query("BEGIN");

  try {
    await ai.query(
      "SELECT set_config('ctrpe.current_empresa_id', $1, true)",
      [empresaId],
    );
    return await callback();
  } finally {
    await ai.query("ROLLBACK");
  }
}

async function cleanFixtures(): Promise<void> {
  await owner.query(
    `DELETE FROM public."Ativo" WHERE "id" LIKE 'ai_test_%'`,
  );
  await owner.query(
    `DELETE FROM public."Empresa" WHERE "id" LIKE 'ai_test_%'`,
  );
}

async function createFixtures(): Promise<void> {
  await owner.query(
    `INSERT INTO public."Empresa"
      ("id", "codigo", "nome", "updatedAt")
     VALUES
      ($1, 'AI-A', 'Empresa A', now()),
      ($2, 'AI-B', 'Empresa B', now())`,
    [EMPRESA_A, EMPRESA_B],
  );

  await owner.query(
    `INSERT INTO public."Ativo"
      ("id", "empresaId", "codigo", "nome", "tipo", "status", "updatedAt")
     VALUES
      ('ai_test_ativo_a', $1, 'AT-A', 'Ativo A', 'MAQUINA', 'PARADO', now()),
      ('ai_test_ativo_b', $2, 'AT-B', 'Ativo B', 'MAQUINA', 'DISPONIVEL', now())`,
    [EMPRESA_A, EMPRESA_B],
  );
}

beforeAll(async () => {
  const ownerUrl = process.env["DATABASE_URL"];
  const aiUrl = process.env["AI_READONLY_DATABASE_URL"];

  if (!ownerUrl) throw new Error("DATABASE_URL não definida.");
  if (!aiUrl) throw new Error("AI_READONLY_DATABASE_URL não definida.");

  owner = new Client({ connectionString: ownerUrl });
  ai = new Client({ connectionString: aiUrl });

  await owner.connect();
  await ai.connect();
  await cleanFixtures();
  await createFixtures();
});

afterAll(async () => {
  if (owner) {
    await cleanFixtures();
    await owner.end();
  }

  if (ai) await ai.end();
});

describe("role de consulta da IA", () => {
  it("não possui privilégios administrativos nem acesso à role proprietária", async () => {
    const role = await ai.query<{
      rolsuper: boolean;
      rolcreatedb: boolean;
      rolcreaterole: boolean;
      rolreplication: boolean;
      rolbypassrls: boolean;
      member_view_owner: boolean;
    }>(`
SELECT
  role.rolsuper,
  role.rolcreatedb,
  role.rolcreaterole,
  role.rolreplication,
  role.rolbypassrls,
  pg_has_role(current_user, 'ctrpe_ai_view_owner', 'MEMBER') AS member_view_owner
FROM pg_roles role
WHERE role.rolname = current_user;
`);

    expect(role.rows[0]).toEqual({
      rolsuper: false,
      rolcreatedb: false,
      rolcreaterole: false,
      rolreplication: false,
      rolbypassrls: false,
      member_view_owner: false,
    });

    const setRole = await queryFailure(
      ai,
      "SET ROLE ctrpe_ai_view_owner",
    );
    expect(setRole.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
  });

  it("possui search path e timeouts restritivos", async () => {
    const settings = await ai.query<{
      search_path: string;
      statement_timeout: string;
      lock_timeout: string;
      idle_timeout: string;
    }>(`
SELECT
  current_setting('search_path') AS search_path,
  current_setting('statement_timeout') AS statement_timeout,
  current_setting('lock_timeout') AS lock_timeout,
  current_setting('idle_in_transaction_session_timeout') AS idle_timeout;
`);

    expect(settings.rows[0]).toEqual({
      search_path: "ai, pg_catalog",
      statement_timeout: "3s",
      lock_timeout: "1s",
      idle_timeout: "5s",
    });
  });
});

describe("views seguras da IA", () => {
  it("expõe somente as views previstas e todas pertencem à role interna", async () => {
    const views = await ai.query<{
      viewname: string;
      viewowner: string;
    }>(`
SELECT viewname, viewowner
FROM pg_views
WHERE schemaname = 'ai'
ORDER BY viewname;
`);

    expect(views.rows.map((view) => view.viewname)).toEqual(AI_VIEWS);
    expect(
      views.rows.every(
        (view) => view.viewowner === "ctrpe_ai_view_owner",
      ),
    ).toBe(true);
  });

  it("não expõe credenciais nem dados de autenticação", async () => {
    const columns = await ai.query<{
      table_name: string;
      column_name: string;
    }>(`
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'ai'
  AND column_name ~* '(senha|hash|token|password|email|perfil)';
`);

    expect(columns.rows).toEqual([]);
  });

  it("mantém RLS ativo e uma policy de tenant nas tabelas utilizadas", async () => {
    const tables = await owner.query<{
      table_name: string;
      rls_enabled: boolean;
    }>(`
SELECT class.relname AS table_name, class.relrowsecurity AS rls_enabled
FROM pg_class class
JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
WHERE namespace.nspname = 'public'
  AND class.relname::text = ANY($1::text[])
ORDER BY class.relname;
`, [RLS_TABLES]);

    expect(tables.rows.map((table) => table.table_name)).toEqual(RLS_TABLES);
    expect(tables.rows.every((table) => table.rls_enabled)).toBe(true);

    const policies = await owner.query<{ tablename: string }>(`
SELECT tablename
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname = 'ai_tenant_select'
  AND 'ctrpe_ai_view_owner' = ANY(roles)
ORDER BY tablename;
`);

    expect(policies.rows.map((policy) => policy.tablename)).toEqual(RLS_TABLES);
  });
});

describe("isolamento por empresa", () => {
  it("não retorna linhas quando a empresa da sessão não foi definida", async () => {
    const result = await ai.query(`SELECT "id" FROM "Empresa"`);
    expect(result.rows).toEqual([]);
  });

  it("retorna somente dados da empresa A mesmo com condição OR permissiva", async () => {
    const rows = await withTenant(EMPRESA_A, async () => {
      const result = await ai.query<{
        empresaId: string;
        codigo: string;
      }>(`
SELECT "empresaId", "codigo"
FROM "Ativo"
WHERE "empresaId" = '${EMPRESA_B}' OR true
ORDER BY "codigo";
`);
      return result.rows;
    });

    expect(rows).toEqual([
      { empresaId: EMPRESA_A, codigo: "AT-A" },
    ]);
  });

  it("troca o conjunto visível quando o backend define a empresa B", async () => {
    const rows = await withTenant(EMPRESA_B, async () => {
      const result = await ai.query<{
        id: string;
        codigo: string;
      }>(`SELECT "id", "codigo" FROM "Ativo" ORDER BY "codigo"`);
      return result.rows;
    });

    expect(rows).toEqual([
      { id: "ai_test_ativo_b", codigo: "AT-B" },
    ]);
  });
});

describe("bloqueios da role de consulta", () => {
  it("não permite leitura direta das tabelas públicas", async () => {
    for (const table of ["Empresa", "Ativo", "Usuario", "RefreshToken"]) {
      const failure = await queryFailure(
        ai,
        `SELECT * FROM public."${table}" LIMIT 1`,
      );
      expect(failure.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
    }
  });

  it("não permite escrita nas views", async () => {
    const statements = [
      `INSERT INTO "Ativo" ("id") VALUES ('ai_test_invasao')`,
      `UPDATE "Ativo" SET "nome" = 'alterado'`,
      `DELETE FROM "Ativo"`,
    ];

    for (const statement of statements) {
      const failure = await queryFailure(ai, statement);
      expect(failure.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
    }
  });

  it("não permite criação ou remoção de objetos", async () => {
    const statements = [
      `CREATE TABLE ai."Invasao" ("id" integer)`,
      `DROP VIEW ai."Ativo"`,
      `ALTER VIEW ai."Ativo" RENAME TO "Invasao"`,
    ];

    for (const statement of statements) {
      const failure = await queryFailure(ai, statement);
      expect(failure.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
    }
  });

  it("não alterou os dados após as tentativas de escrita", async () => {
    const assets = await owner.query<{ total: number }>(`
SELECT count(*)::int AS total
FROM public."Ativo"
WHERE "id" LIKE 'ai_test_%';
`);

    expect(assets.rows[0]).toEqual({ total: 2 });
  });
});

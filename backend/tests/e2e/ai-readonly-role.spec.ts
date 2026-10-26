import pg from "pg";

/**
 * Garante que o role da camada de IA (ctrpe_ai_readonly) só consegue LER as
 * views do schema "ai".
 *
 * Requisitos:
 *   - migrations aplicadas (npm run prisma:deploy)
 *   - senha do role definida (npm run ai-role:set-password)
 *   - DATABASE_URL (dono) e AI_READONLY_DATABASE_URL (role da IA) no .env
 */

const { Client } = pg;

const AI_VIEWS = [
  "alertas",
  "apontamentos_os",
  "ativos",
  "materiais",
  "ordens_servico",
  "os_materiais",
  "paradas",
];

const PG_INSUFFICIENT_PRIVILEGE = "42501";
const PG_OBJECT_NOT_IN_PREREQUISITE_STATE = "55000"; // view com JOIN não é atualizável

const EMPRESA_A = "aitest_emp_a";
const EMPRESA_B = "aitest_emp_b";

let owner: pg.Client;
let ai: pg.Client;

async function queryError(client: pg.Client, sql: string): Promise<{ code?: string; message: string }> {
  try {
    await client.query(sql);
  } catch (error) {
    const e = error as { code?: string; message: string };
    return e.code === undefined ? { message: e.message } : { code: e.code, message: e.message };
  }
  throw new Error(`Esperava erro, mas a query executou: ${sql}`);
}

async function cleanFixtures() {
  for (const table of [
    "Alerta",
    "ApontamentoOS",
    "OrdemServicoMaterial",
    "ParadaAtivo",
    "OrdemServico",
    "Material",
    "Ativo",
    "Usuario",
    "Localizacao",
    "Empresa",
  ]) {
    await owner.query(`DELETE FROM public."${table}" WHERE "id" LIKE 'aitest\\_%'`);
  }
}

async function createFixtures() {
  await owner.query(
    `INSERT INTO "Empresa" ("id","nome","updatedAt") VALUES ($1,'Empresa A',now()),($2,'Empresa B',now())`,
    [EMPRESA_A, EMPRESA_B],
  );
  await owner.query(
    `INSERT INTO "Localizacao" ("id","empresaId","nome","updatedAt") VALUES ('aitest_loc_a',$1,'Oficina',now())`,
    [EMPRESA_A],
  );
  await owner.query(
    `INSERT INTO "Usuario" ("id","empresaId","nome","email","senhaHash","perfil","updatedAt")
     VALUES ('aitest_user_a',$1,'Maria Teste','aitest_maria@example.com','HASH_SECRETO','TECNICO',now())`,
    [EMPRESA_A],
  );
  await owner.query(
    `INSERT INTO "Ativo" ("id","empresaId","localizacaoId","codigo","nome","tipo","status","updatedAt") VALUES
       ('aitest_ativo_a1',$1,'aitest_loc_a','ATV-1','Torno CNC','MAQUINA','PARADO',now()),
       ('aitest_ativo_b1',$2,NULL,'ATV-1','Prensa','MAQUINA','DISPONIVEL',now())`,
    [EMPRESA_A, EMPRESA_B],
  );
  await owner.query(
    `INSERT INTO "OrdemServico"
       ("id","empresaId","ativoId","responsavelId","numero","titulo","descricao","status","prazoEm","updatedAt") VALUES
       ('aitest_os_a1',$1,'aitest_ativo_a1','aitest_user_a','OS-1','Vazamento','desc','EM_EXECUCAO',(now() AT TIME ZONE 'UTC') - interval '2 days',now()),
       ('aitest_os_a2',$1,'aitest_ativo_a1',NULL,'OS-2','Troca de filtro','desc','ENCERRADA',(now() AT TIME ZONE 'UTC') - interval '5 days',now()),
       ('aitest_os_b1',$2,'aitest_ativo_b1',NULL,'OS-1','Ajuste','desc','ABERTA',NULL,now())`,
    [EMPRESA_A, EMPRESA_B],
  );
  // Duas paradas sem fim: uma ABERTA e uma CANCELADA (fimEm continua nulo)
  await owner.query(
    `INSERT INTO "ParadaAtivo" ("id","empresaId","ativoId","ordemServicoId","status","updatedAt") VALUES
       ('aitest_parada_1',$1,'aitest_ativo_a1','aitest_os_a1','ABERTA',now()),
       ('aitest_parada_2',$1,'aitest_ativo_a1',NULL,'CANCELADA',now())`,
    [EMPRESA_A],
  );
  await owner.query(
    `INSERT INTO "Material" ("id","empresaId","codigo","nome","estoqueAtual","estoqueMinimo","custoMedio","updatedAt")
     VALUES ('aitest_mat_a1',$1,'MAT-1','Rolamento',1,5,10,now())`,
    [EMPRESA_A],
  );
  await owner.query(
    `INSERT INTO "OrdemServicoMaterial" ("id","ordemServicoId","materialId","quantidade","custoUnitario","custoTotal","status","updatedAt")
     VALUES ('aitest_osm_1','aitest_os_a1','aitest_mat_a1',2,10,20,'CONSUMIDO',now())`,
  );
  await owner.query(
    `INSERT INTO "ApontamentoOS" ("id","ordemServicoId","usuarioId","inicioEm","duracaoMinutos","updatedAt")
     VALUES ('aitest_ap_1','aitest_os_a1','aitest_user_a',now(),60,now())`,
  );
  await owner.query(
    `INSERT INTO "Alerta" ("id","empresaId","ativoId","tipo","severidade","titulo","mensagem","updatedAt")
     VALUES ('aitest_al_1',$1,'aitest_ativo_a1','ATIVO_PARADO','ALTA','Ativo parado','Torno CNC parado',now())`,
    [EMPRESA_A],
  );
}

beforeAll(async () => {
  const ownerUrl = process.env["DATABASE_URL"];
  const aiUrl = process.env["AI_READONLY_DATABASE_URL"];

  if (!ownerUrl) throw new Error("DATABASE_URL não definida");
  if (!aiUrl) {
    throw new Error(
      "AI_READONLY_DATABASE_URL não definida. Veja .env.example e rode `npm run ai-role:set-password`.",
    );
  }

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

describe("role da IA: configuração", () => {
  it("não é superuser e não pode criar banco, role nem ignorar RLS", async () => {
    const { rows } = await ai.query(
      `SELECT rolsuper, rolcreatedb, rolcreaterole, rolreplication, rolbypassrls
       FROM pg_roles WHERE rolname = current_user`,
    );
    expect(rows[0]).toEqual({
      rolsuper: false,
      rolcreatedb: false,
      rolcreaterole: false,
      rolreplication: false,
      rolbypassrls: false,
    });
  });

  it("tem statement_timeout e search_path definidos no role", async () => {
    const { rows } = await ai.query<{ rolconfig: string[] }>(
      `SELECT rolconfig FROM pg_roles WHERE rolname = current_user`,
    );
    expect(rows[0]!.rolconfig).toEqual(
      expect.arrayContaining(["statement_timeout=10s", "search_path=ai"]),
    );

    const live = await ai.query(`SELECT current_setting('statement_timeout') AS t`);
    expect(live.rows[0]).toEqual({ t: "10s" });
  });

  it("expõe o limite de linhas em ai.max_rows()", async () => {
    const { rows } = await ai.query(`SELECT ai.max_rows() AS max_rows`);
    expect(rows[0]).toEqual({ max_rows: 500 });
  });

  it("tem CONNECT, mas não pode criar objetos no banco nem nos schemas", async () => {
    const { rows } = await ai.query(
      `SELECT
         has_database_privilege(current_database(), 'CONNECT') AS connect,
         has_database_privilege(current_database(), 'CREATE')  AS create_db,
         has_schema_privilege('public', 'CREATE')              AS create_public,
         has_schema_privilege('ai', 'CREATE')                  AS create_ai,
         has_schema_privilege('ai', 'USAGE')                   AS usage_ai`,
    );
    expect(rows[0]).toEqual({
      connect: true,
      create_db: false,
      create_public: false,
      create_ai: false,
      usage_ai: true,
    });
  });
});

describe("role da IA: o que enxerga", () => {
  it("expõe exatamente as views esperadas no schema ai", async () => {
    const { rows } = await ai.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'ai' ORDER BY table_name`,
    );
    expect(rows.map((r) => r.table_name)).toEqual(AI_VIEWS);
  });

  it("toda view expõe empresa_id", async () => {
    const { rows } = await ai.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.columns
       WHERE table_schema = 'ai' AND column_name = 'empresa_id' ORDER BY table_name`,
    );
    expect(rows.map((r) => r.table_name)).toEqual(AI_VIEWS);
  });

  it("nenhuma coluna das views expõe credenciais ou e-mail", async () => {
    const { rows } = await ai.query<{ table_name: string; column_name: string }>(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = 'ai' AND column_name ~* '(senha|hash|token|password|email|perfil)'`,
    );
    expect(rows).toEqual([]);
  });

  it("todas as colunas das views são snake_case", async () => {
    const { rows } = await ai.query<{ table_name: string; column_name: string }>(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = 'ai' AND column_name !~ '^[a-z][a-z0-9_]*$'`,
    );
    expect(rows).toEqual([]);
  });

  it("não tem nenhum privilégio em nenhuma relação do schema public (inclui tabelas futuras)", async () => {
    const { rows } = await ai.query(
      `SELECT c.relname, p.priv
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       CROSS JOIN unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) AS p(priv)
       WHERE n.nspname = 'public'
         AND c.relkind IN ('r','v','m','p','f')
         AND has_table_privilege(current_user, c.oid, p.priv)`,
    );
    expect(rows).toEqual([]);
  });

  it("tem somente SELECT nas views da IA", async () => {
    const { rows } = await ai.query(
      `SELECT c.relname, p.priv
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       CROSS JOIN unnest(ARRAY['INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) AS p(priv)
       WHERE n.nspname = 'ai'
         AND c.relkind = 'v'
         AND has_table_privilege(current_user, c.oid, p.priv)`,
    );
    expect(rows).toEqual([]);

    for (const view of AI_VIEWS) {
      const { rows: select } = await ai.query(`SELECT has_table_privilege(current_user, $1, 'SELECT') AS ok`, [
        `ai.${view}`,
      ]);
      expect(select[0]).toEqual({ ok: true });
    }
  });
});

describe("role da IA: leitura das views (nomes sem prefixo, via search_path)", () => {
  it("ativos: traz nome da localização e fica separado por empresa_id", async () => {
    const { rows } = await ai.query(
      `SELECT codigo, nome, status, localizacao_nome FROM ativos WHERE empresa_id = $1`,
      [EMPRESA_A],
    );
    expect(rows).toEqual([
      { codigo: "ATV-1", nome: "Torno CNC", status: "PARADO", localizacao_nome: "Oficina" },
    ]);
  });

  it("ordens_servico: esta_aberta e esta_atrasada seguem as regras de negócio", async () => {
    const { rows } = await ai.query(
      `SELECT numero, esta_aberta, esta_atrasada, responsavel_nome
       FROM ordens_servico WHERE empresa_id = $1 ORDER BY numero`,
      [EMPRESA_A],
    );
    expect(rows).toEqual([
      { numero: "OS-1", esta_aberta: true, esta_atrasada: true, responsavel_nome: "Maria Teste" },
      { numero: "OS-2", esta_aberta: false, esta_atrasada: false, responsavel_nome: null },
    ]);
  });

  it("paradas: esta_aberta usa o status (parada cancelada também tem fim_em nulo)", async () => {
    const { rows } = await ai.query<{ sem_fim: string; abertas: string }>(
      `SELECT count(*) FILTER (WHERE fim_em IS NULL) AS sem_fim,
              count(*) FILTER (WHERE esta_aberta)    AS abertas
       FROM paradas WHERE empresa_id = $1`,
      [EMPRESA_A],
    );
    expect(rows[0]).toEqual({ sem_fim: "2", abertas: "1" });
  });

  it("materiais: estoque_baixo = estoque atual <= mínimo", async () => {
    const { rows } = await ai.query(`SELECT nome, estoque_baixo FROM materiais WHERE empresa_id = $1`, [EMPRESA_A]);
    expect(rows).toEqual([{ nome: "Rolamento", estoque_baixo: true }]);
  });

  it("os_materiais, apontamentos_os e alertas retornam dados com empresa_id e nomes legíveis", async () => {
    const osMateriais = await ai.query(
      `SELECT os_numero, material_nome, quantidade::int AS quantidade, status FROM os_materiais WHERE empresa_id = $1`,
      [EMPRESA_A],
    );
    expect(osMateriais.rows).toEqual([
      { os_numero: "OS-1", material_nome: "Rolamento", quantidade: 2, status: "CONSUMIDO" },
    ]);

    const apontamentos = await ai.query(
      `SELECT os_numero, tecnico_nome, duracao_minutos FROM apontamentos_os WHERE empresa_id = $1`,
      [EMPRESA_A],
    );
    expect(apontamentos.rows).toEqual([{ os_numero: "OS-1", tecnico_nome: "Maria Teste", duracao_minutos: 60 }]);

    const alertas = await ai.query(
      `SELECT tipo, severidade, ativo_nome FROM alertas WHERE empresa_id = $1`,
      [EMPRESA_A],
    );
    expect(alertas.rows).toEqual([{ tipo: "ATIVO_PARADO", severidade: "ALTA", ativo_nome: "Torno CNC" }]);
  });
});

describe("role da IA: escrita e DDL são negados", () => {
  // Tabelas base e views de tabela única: o Postgres responde "permission denied" (42501)
  it.each([
    ['INSERT em tabela base', `INSERT INTO public."Ativo" ("id") VALUES ('aitest_x')`],
    ['UPDATE em tabela base', `UPDATE public."Ativo" SET "nome" = 'x'`],
    ['DELETE em tabela base', `DELETE FROM public."Ativo"`],
    ['TRUNCATE em tabela base', `TRUNCATE public."Ativo"`],
    ['INSERT em view (tabela única)', `INSERT INTO ai.materiais ("id") VALUES ('aitest_x')`],
    ['UPDATE em view (tabela única)', `UPDATE ai.materiais SET nome = 'x'`],
    ['DELETE em view (tabela única)', `DELETE FROM ai.materiais`],
    ['CREATE TABLE em public', `CREATE TABLE public.aitest_hack (id int)`],
    ['CREATE TABLE em ai', `CREATE TABLE ai.aitest_hack (id int)`],
    ['CREATE VIEW em ai', `CREATE VIEW ai.aitest_hack AS SELECT 1 AS x`],
    ['CREATE FUNCTION em ai', `CREATE FUNCTION ai.aitest_hack() RETURNS int LANGUAGE sql AS 'SELECT 1'`],
    ['CREATE SCHEMA', `CREATE SCHEMA aitest_hack`],
    ['ALTER TABLE base', `ALTER TABLE public."Ativo" ADD COLUMN aitest_hack int`],
    ['DROP TABLE base', `DROP TABLE public."Ativo"`],
    ['DROP VIEW da IA', `DROP VIEW ai.ativos`],
    ['ALTER VIEW da IA', `ALTER VIEW ai.ativos RENAME TO aitest_hack`],
  ])("%s → permission denied", async (_label, sql) => {
    const error = await queryError(ai, sql);
    expect(error.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
  });

  // Views com JOIN não são atualizáveis: o Postgres rejeita antes de checar permissão
  it.each(AI_VIEWS.filter((v) => v !== "materiais"))("INSERT/UPDATE/DELETE em ai.%s é rejeitado", async (view) => {
    for (const sql of [
      `INSERT INTO ai.${view} ("id") VALUES ('aitest_x')`,
      `UPDATE ai.${view} SET id = 'aitest_x'`,
      `DELETE FROM ai.${view}`,
    ]) {
      const error = await queryError(ai, sql);
      expect([PG_INSUFFICIENT_PRIVILEGE, PG_OBJECT_NOT_IN_PREREQUISITE_STATE]).toContain(error.code);
    }
  });

  it("nada foi alterado nos dados depois das tentativas", async () => {
    const { rows } = await owner.query(`SELECT count(*)::int AS n FROM "Ativo" WHERE "id" LIKE 'aitest\\_%'`);
    expect(rows[0]).toEqual({ n: 2 });
  });
});

describe("role da IA: tabelas excluídas não podem ser lidas", () => {
  it.each([
    "Usuario",
    "RefreshToken",
    "LogAuditoria",
    "Empresa",
    "Localizacao",
    "Ativo",
    "OrdemServico",
    "ParadaAtivo",
    "Material",
    "OrdemServicoMaterial",
    "ApontamentoOS",
    "Alerta",
  ])('SELECT em public."%s" → permission denied', async (table) => {
    const error = await queryError(ai, `SELECT * FROM public."${table}" LIMIT 1`);
    expect(error.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
  });

  it("não consegue ler credenciais via catálogo do sistema", async () => {
    const shadow = await queryError(ai, `SELECT * FROM pg_shadow`);
    expect(shadow.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
    const authid = await queryError(ai, `SELECT * FROM pg_authid`);
    expect(authid.code).toBe(PG_INSUFFICIENT_PRIVILEGE);
  });
});

import type { SqlClient } from "./rls-tenant-isolation.js";

interface SnakeCaseViewSandboxContext {
  tenantId: string;
  companyCode: string;
  roleName: string;
}

const BASE_TABLES = [
  "Empresa",
  "Ativo",
  "OrdemServico",
  "ParadaAtivo",
  "Material",
  "OrdemServicoMaterial",
  "Alerta",
] as const;

const VIEW_STATEMENTS = [
  `CREATE VIEW ai.empresas WITH (security_invoker = true) AS
SELECT id, codigo, nome, ativa
FROM public."Empresa"`,
  `CREATE VIEW ai.ativos WITH (security_invoker = true) AS
SELECT
  id,
  "empresaId" AS empresa_id,
  codigo,
  nome,
  tipo,
  status,
  criticidade,
  ativo
FROM public."Ativo"`,
  `CREATE VIEW ai.ordens_servico WITH (security_invoker = true) AS
SELECT
  id,
  "empresaId" AS empresa_id,
  "ativoId" AS ativo_id,
  numero,
  titulo,
  tipo,
  status,
  prioridade,
  "abertaEm" AS aberta_em,
  "iniciadaEm" AS iniciada_em,
  "encerradaEm" AS encerrada_em,
  "prazoEm" AS prazo_em,
  "tempoAguardandoPecaMinutos" AS tempo_aguardando_peca_minutos,
  "tempoExecucaoMinutos" AS tempo_execucao_minutos,
  "custoMateriais" AS custo_materiais,
  "custoMaoObra" AS custo_mao_obra,
  "custoTotal" AS custo_total
FROM public."OrdemServico"`,
  `CREATE VIEW ai.paradas WITH (security_invoker = true) AS
SELECT
  id,
  "empresaId" AS empresa_id,
  "ativoId" AS ativo_id,
  "ordemServicoId" AS ordem_servico_id,
  status,
  "inicioEm" AS inicio_em,
  "fimEm" AS fim_em,
  "duracaoMinutos" AS duracao_minutos,
  programada,
  "impactaDisponibilidade" AS impacta_disponibilidade
FROM public."ParadaAtivo"`,
  `CREATE VIEW ai.materiais WITH (security_invoker = true) AS
SELECT
  id,
  "empresaId" AS empresa_id,
  codigo,
  nome,
  "estoqueAtual" AS estoque_atual,
  "estoqueMinimo" AS estoque_minimo,
  "custoMedio" AS custo_medio,
  ativo
FROM public."Material"`,
  `CREATE VIEW ai.os_materiais WITH (security_invoker = true) AS
SELECT
  id,
  "ordemServicoId" AS ordem_servico_id,
  "materialId" AS material_id,
  quantidade,
  "custoTotal" AS custo_total,
  status
FROM public."OrdemServicoMaterial"`,
  `CREATE VIEW ai.alertas WITH (security_invoker = true) AS
SELECT
  id,
  "empresaId" AS empresa_id,
  "ativoId" AS ativo_id,
  "ordemServicoId" AS ordem_servico_id,
  tipo,
  severidade,
  status,
  titulo,
  mensagem,
  "geradoEm" AS gerado_em
FROM public."Alerta"`,
] as const;

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function runInSnakeCaseViewSandbox<T>(
  client: SqlClient,
  companyCode: string,
  operation: (context: SnakeCaseViewSandboxContext) => Promise<T>,
): Promise<T> {
  const suffix = process.pid.toString();
  const roleName = `ctrpe_ai_snake_${suffix}`;
  const policyPrefix = `ctrpe_ai_snake_${suffix}`;
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const existingSchema = await client.query<{ schema_name: string }>(`
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'ai';`);

    if (existingSchema.rows.length > 0) {
      throw new Error("Experimento recusado: o schema ai já existe.");
    }

    const existingRls = await client.query<{ table_name: string }>(`
SELECT c.relname AS table_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (${BASE_TABLES.map((table) => `'${table}'`).join(", ")})
  AND (
    c.relrowsecurity
    OR EXISTS (
      SELECT 1
      FROM pg_policy p
      WHERE p.polrelid = c.oid
    )
  );`);

    if (existingRls.rows.length > 0) {
      throw new Error(
        `Experimento recusado: RLS já configurado em ${existingRls.rows
          .map((row) => row.table_name)
          .join(", ")}.`,
      );
    }

    const company = await client.query<{ id: string; codigo: string }>(
      `SELECT "id", "codigo" FROM public."Empresa" WHERE "codigo" = $1`,
      [companyCode],
    );
    const tenant = company.rows[0];

    if (!tenant) {
      throw new Error(`Empresa não encontrada: ${companyCode}`);
    }

    const owner = await client.query<{ owner_role: string }>(
      "SELECT current_user AS owner_role",
    );
    const ownerRole = owner.rows[0]?.owner_role;

    if (!ownerRole) {
      throw new Error("Não foi possível identificar a role proprietária.");
    }

    const roleIdentifier = quoteIdentifier(roleName);
    const ownerIdentifier = quoteIdentifier(ownerRole);

    await client.query(
      `CREATE ROLE ${roleIdentifier} NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS`,
    );
    await client.query(`GRANT ${roleIdentifier} TO ${ownerIdentifier}`);
    await client.query(`CREATE SCHEMA ai`);
    await client.query(`REVOKE ALL ON SCHEMA ai FROM PUBLIC`);
    await client.query(`GRANT USAGE ON SCHEMA ai TO ${roleIdentifier}`);
    await client.query(`GRANT USAGE ON SCHEMA public TO ${roleIdentifier}`);
    await client.query(
      `GRANT SELECT ON ${BASE_TABLES.map((table) => `public.${quoteIdentifier(table)}`).join(", ")} TO ${roleIdentifier}`,
    );

    for (const table of BASE_TABLES) {
      await client.query(
        `ALTER TABLE public.${quoteIdentifier(table)} ENABLE ROW LEVEL SECURITY`,
      );
      await client.query(
        `ALTER TABLE public.${quoteIdentifier(table)} FORCE ROW LEVEL SECURITY`,
      );
    }

    const directTenantPolicies = [
      ["Empresa", `"id" = current_setting('ctrpe.current_empresa_id', true)`],
      ["Ativo", `"empresaId" = current_setting('ctrpe.current_empresa_id', true)`],
      ["OrdemServico", `"empresaId" = current_setting('ctrpe.current_empresa_id', true)`],
      ["ParadaAtivo", `"empresaId" = current_setting('ctrpe.current_empresa_id', true)`],
      ["Material", `"empresaId" = current_setting('ctrpe.current_empresa_id', true)`],
      ["Alerta", `"empresaId" = current_setting('ctrpe.current_empresa_id', true)`],
    ] as const;

    for (const [table, expression] of directTenantPolicies) {
      const policyIdentifier = quoteIdentifier(
        `${policyPrefix}_${table.toLowerCase()}`,
      );
      await client.query(`
CREATE POLICY ${policyIdentifier}
ON public.${quoteIdentifier(table)}
FOR SELECT
TO ${roleIdentifier}
USING (${expression});`);
    }

    await client.query(`
CREATE POLICY ${quoteIdentifier(`${policyPrefix}_os_material`)}
ON public."OrdemServicoMaterial"
FOR SELECT
TO ${roleIdentifier}
USING (
  EXISTS (
    SELECT 1
    FROM public."OrdemServico" os
    WHERE os."id" = "OrdemServicoMaterial"."ordemServicoId"
      AND os."empresaId" = current_setting('ctrpe.current_empresa_id', true)
  )
);`);

    for (const statement of VIEW_STATEMENTS) {
      await client.query(statement);
    }

    await client.query(
      `GRANT SELECT ON ALL TABLES IN SCHEMA ai TO ${roleIdentifier}`,
    );
    await client.query(
      "SELECT set_config('ctrpe.current_empresa_id', $1, true)",
      [tenant.id],
    );
    await client.query(`SET LOCAL statement_timeout = '3s'`);
    await client.query(`SET LOCAL lock_timeout = '1s'`);
    await client.query(`SET LOCAL ROLE ${roleIdentifier}`);

    const activeRole = await client.query<{
      role_name: string;
      empresa_rls: boolean;
      ativo_rls: boolean;
      ordem_servico_rls: boolean;
      parada_rls: boolean;
      material_rls: boolean;
      os_material_rls: boolean;
      alerta_rls: boolean;
    }>(`
SELECT
  current_user AS role_name,
  row_security_active('public."Empresa"'::regclass) AS empresa_rls,
  row_security_active('public."Ativo"'::regclass) AS ativo_rls,
  row_security_active('public."OrdemServico"'::regclass) AS ordem_servico_rls,
  row_security_active('public."ParadaAtivo"'::regclass) AS parada_rls,
  row_security_active('public."Material"'::regclass) AS material_rls,
  row_security_active('public."OrdemServicoMaterial"'::regclass) AS os_material_rls,
  row_security_active('public."Alerta"'::regclass) AS alerta_rls;`);
    const roleState = activeRole.rows[0];
    const rlsStates = roleState
      ? Object.entries(roleState)
          .filter(([key]) => key !== "role_name")
          .map(([, value]) => value)
      : [];

    if (
      roleState?.role_name !== roleName ||
      rlsStates.length !== BASE_TABLES.length ||
      rlsStates.some((active) => active !== true)
    ) {
      throw new Error("A role temporária não ativou todo o isolamento RLS.");
    }

    return await operation({
      tenantId: tenant.id,
      companyCode: tenant.codigo,
      roleName,
    });
  } finally {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
  }
}

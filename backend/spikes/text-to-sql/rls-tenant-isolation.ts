import { TENANT_FILTER_CASES } from "./tenant-filter-evaluation.js";

interface SqlQueryResult<T extends Record<string, unknown>> {
  rows: T[];
}

export interface SqlClient {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    values?: unknown[],
  ): Promise<SqlQueryResult<T>>;
}

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function runRlsTenantIsolation(
  client: SqlClient,
  companyCode = "alpha-brazilian",
) {
  const suffix = process.pid.toString();
  const roleName = `ctrpe_ai_spike_${suffix}`;
  const policyName = `ctrpe_ai_spike_${suffix}`;
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const existingRls = await client.query<{ table_name: string }>(`
SELECT c.relname AS table_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('Empresa', 'Ativo')
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
    const policyIdentifier = quoteIdentifier(policyName);

    await client.query(
      `CREATE ROLE ${roleIdentifier} NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS`,
    );
    await client.query(`GRANT ${roleIdentifier} TO ${ownerIdentifier}`);
    await client.query(`GRANT USAGE ON SCHEMA public TO ${roleIdentifier}`);
    await client.query(
      `GRANT SELECT ON public."Empresa", public."Ativo" TO ${roleIdentifier}`,
    );

    await client.query(
      `ALTER TABLE public."Empresa" ENABLE ROW LEVEL SECURITY`,
    );
    await client.query(
      `ALTER TABLE public."Empresa" FORCE ROW LEVEL SECURITY`,
    );
    await client.query(
      `ALTER TABLE public."Ativo" ENABLE ROW LEVEL SECURITY`,
    );
    await client.query(
      `ALTER TABLE public."Ativo" FORCE ROW LEVEL SECURITY`,
    );

    await client.query(`
CREATE POLICY ${policyIdentifier}
ON public."Empresa"
FOR SELECT
TO ${roleIdentifier}
USING ("id" = current_setting('ctrpe.current_empresa_id', true));`);
    await client.query(`
CREATE POLICY ${policyIdentifier}
ON public."Ativo"
FOR SELECT
TO ${roleIdentifier}
USING ("empresaId" = current_setting('ctrpe.current_empresa_id', true));`);

    await client.query(
      "SELECT set_config('ctrpe.current_empresa_id', $1, true)",
      [tenant.id],
    );
    await client.query(`SET LOCAL ROLE ${roleIdentifier}`);

    const activeRole = await client.query<{
      role_name: string;
      rls_active: boolean;
    }>(`
SELECT
  current_user AS role_name,
  row_security_active('public."Ativo"'::regclass) AS rls_active;`);

    if (
      activeRole.rows[0]?.role_name !== roleName ||
      activeRole.rows[0]?.rls_active !== true
    ) {
      throw new Error("A role temporária não ativou RLS corretamente.");
    }

    const results = [];

    for (const evaluationCase of TENANT_FILTER_CASES) {
      const queryResult = await client.query<{ empresa_id: string }>(
        evaluationCase.sql,
      );
      const leakedRows = queryResult.rows.filter(
        (row) => row.empresa_id !== tenant.id,
      );
      const functional =
        !evaluationCase.expectedAllowed || queryResult.rows.length > 0;
      const secure = leakedRows.length === 0;

      results.push({
        id: evaluationCase.id,
        description: evaluationCase.description,
        returnedRows: queryResult.rows.length,
        leakedRows: leakedRows.length,
        functional,
        secure,
        decisionMatchesExpectation: secure && functional,
      });
    }

    const secureCases = results.filter(
      (result) => result.decisionMatchesExpectation,
    ).length;

    return {
      strategy: "database-rls-session-tenant",
      companyCode: tenant.codigo,
      tenantId: tenant.id,
      temporaryRole: roleName,
      transactionRolledBack: true,
      totalCases: results.length,
      leakedRows: results.reduce(
        (total, result) => total + result.leakedRows,
        0,
      ),
      secureDecisionPct: (secureCases / results.length) * 100,
      results,
    };
  } finally {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
  }
}

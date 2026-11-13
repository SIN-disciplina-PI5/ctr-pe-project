import pg from "pg";
import {
  QUERY_EXAMPLES,
  SYNTHETIC_TENANTS,
  validateExpectedResult,
  type SyntheticTenantCode,
} from "../../src/modules/ai/query-examples.js";

const { Client } = pg;

let owner: pg.Client;
let ai: pg.Client;
const tenantIds = new Map<SyntheticTenantCode, string>();

async function withTenant<T>(
  empresaId: string,
  callback: () => Promise<T>,
): Promise<T> {
  await ai.query("BEGIN READ ONLY");

  try {
    await ai.query("SELECT set_config('ctrpe.current_empresa_id', $1, true)", [
      empresaId,
    ]);
    return await callback();
  } finally {
    await ai.query("ROLLBACK");
  }
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

  const companies = await owner.query<{
    id: string;
    codigo: SyntheticTenantCode;
  }>(
    `SELECT "id", "codigo"
     FROM public."Empresa"
     WHERE "codigo" = ANY($1::text[])
     ORDER BY "codigo"`,
    [SYNTHETIC_TENANTS.map((tenant) => tenant.code)],
  );

  for (const company of companies.rows) {
    tenantIds.set(company.codigo, company.id);
  }

  if (tenantIds.size !== SYNTHETIC_TENANTS.length) {
    throw new Error(
      "Base sintética não encontrada. Execute npm run db:reset-synthetic -- --force antes deste E2E.",
    );
  }
});

afterAll(async () => {
  if (owner) await owner.end();
  if (ai) await ai.end();
});

describe.each(SYNTHETIC_TENANTS)("SQLs de referência — $code", (tenant) => {
  it.each(QUERY_EXAMPLES)("$id: $question", async (example) => {
    const empresaId = tenantIds.get(tenant.code);
    if (!empresaId)
      throw new Error(`Empresa sintética ausente: ${tenant.code}`);

    const rows = await withTenant(empresaId, async () => {
      const result = await ai.query<Readonly<Record<string, unknown>>>(
        example.sql,
      );
      return result.rows;
    });

    expect(validateExpectedResult(rows, example.expected, tenant.code)).toEqual(
      [],
    );
  });
});

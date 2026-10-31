import { describe, expect, it, jest } from "@jest/globals";
import {
  runRlsTenantIsolation,
  type SqlClient,
} from "../../../spikes/text-to-sql/rls-tenant-isolation.js";

function createClient(options: { leak?: boolean; fail?: boolean } = {}) {
  const query = jest.fn(async (sql: string) => {
    if (sql.includes("FROM pg_class")) return { rows: [] };
    if (sql.includes('SELECT "id", "codigo"')) {
      return {
        rows: [{ id: "empresa-1", codigo: "alpha-brazilian" }],
      };
    }
    if (sql === "SELECT current_user AS owner_role") {
      return { rows: [{ owner_role: "neondb_owner" }] };
    }
    if (sql.includes("row_security_active")) {
      return {
        rows: [
          {
            role_name: `ctrpe_ai_spike_${process.pid}`,
            rls_active: true,
          },
        ],
      };
    }
    if (sql.includes("AS empresa_id")) {
      if (options.fail && sql.includes("CROSS JOIN")) {
        throw new Error("Falha simulada");
      }

      return {
        rows: [
          {
            empresa_id:
              options.leak && sql.includes(" OR ")
                ? "empresa-2"
                : "empresa-1",
          },
        ],
      };
    }

    return { rows: [] };
  });

  return {
    query,
    client: { query } as unknown as SqlClient,
  };
}

describe("runRlsTenantIsolation", () => {
  it("configura RLS e impede vazamento em todos os casos", async () => {
    const { client, query } = createClient();
    const result = await runRlsTenantIsolation(client);
    const statements = query.mock.calls.map(([sql]) => sql);

    expect(result).toMatchObject({
      totalCases: 5,
      leakedRows: 0,
      secureDecisionPct: 100,
      transactionRolledBack: true,
    });
    expect(statements).toEqual(
      expect.arrayContaining([
        expect.stringContaining("FORCE ROW LEVEL SECURITY"),
        expect.stringContaining("CREATE POLICY"),
        expect.stringContaining("SET LOCAL ROLE"),
      ]),
    );
    expect(statements.at(-1)).toBe("ROLLBACK");
  });

  it("detecta linha pertencente a outra empresa", async () => {
    const { client } = createClient({ leak: true });
    const result = await runRlsTenantIsolation(client);

    expect(result.leakedRows).toBe(1);
    expect(result.secureDecisionPct).toBe(80);
  });

  it("sempre executa rollback quando uma consulta falha", async () => {
    const { client, query } = createClient({ fail: true });

    await expect(runRlsTenantIsolation(client)).rejects.toThrow(
      "Falha simulada",
    );
    expect(query.mock.calls.at(-1)?.[0]).toBe("ROLLBACK");
  });
});

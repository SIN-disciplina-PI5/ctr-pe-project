import { describe, expect, it, jest } from "@jest/globals";
import {
  PgReadOnlyQueryExecutor,
  type QueryClient,
  type QueryPool,
} from "./query-executor.js";

function setup(
  queryResult: unknown = [{ codigo: "AT-001" }],
  queryFailure?: unknown,
) {
  const calls: Array<{ sql: string; values?: unknown[] }> = [];
  const release = jest.fn();
  const client: QueryClient = {
    async query(sql, values) {
      calls.push(values ? { sql, values } : { sql });
      if (sql.startsWith("SELECT ") && !sql.includes("set_config")) {
        if (queryFailure) throw queryFailure;
        return { rows: queryResult as never[] };
      }
      return { rows: [] };
    },
    release,
  };
  const pool: QueryPool = { connect: async () => client };
  return {
    executor: new PgReadOnlyQueryExecutor(pool, () => 10),
    calls,
    release,
  };
}

describe("PgReadOnlyQueryExecutor", () => {
  it("executa com transação read-only, tenant da sessão e rollback", async () => {
    const { executor, calls, release } = setup();
    const sql = `SELECT "codigo" FROM ai."Ativo" LIMIT 100`;

    await expect(executor.execute(sql, "empresa-1")).resolves.toEqual({
      rows: [{ codigo: "AT-001" }],
      rowCount: 1,
      latencyMs: 0,
    });

    expect(calls.map((call) => call.sql)).toEqual([
      "BEGIN TRANSACTION READ ONLY",
      "SET LOCAL statement_timeout = '3s'",
      "SET LOCAL lock_timeout = '1s'",
      "SET LOCAL idle_in_transaction_session_timeout = '5s'",
      "SELECT set_config('ctrpe.current_empresa_id', $1, true)",
      sql,
      "ROLLBACK",
    ]);
    expect(calls[4]?.values).toEqual(["empresa-1"]);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("faz rollback e oculta detalhes quando o banco falha", async () => {
    const { executor, calls, release } = setup([], {
      code: "XX000",
      message: "detalhe interno",
    });

    await expect(
      executor.execute(`SELECT * FROM ai."Ativo" LIMIT 1`, "empresa-1"),
    ).rejects.toMatchObject({
      statusCode: 502,
      message: "Não foi possível consultar os dados com segurança.",
    });
    expect(calls.at(-1)?.sql).toBe("ROLLBACK");
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("traduz cancelamento por timeout sem expor o erro do PostgreSQL", async () => {
    const { executor } = setup([], { code: "57014" });

    await expect(
      executor.execute(`SELECT * FROM ai."Ativo" LIMIT 1`, "empresa-1"),
    ).rejects.toMatchObject({ statusCode: 504 });
  });

  it("bloqueia defesa em profundidade acima de 100 linhas", async () => {
    const { executor } = setup(
      Array.from({ length: 101 }, (_, id) => ({ id })),
    );

    await expect(
      executor.execute(`SELECT * FROM ai."Ativo" LIMIT 100`, "empresa-1"),
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

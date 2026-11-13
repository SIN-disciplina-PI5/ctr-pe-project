import { jest } from "@jest/globals";
import type { Client } from "pg";
import { executeReadOnlyQuery } from "../../../spikes/text-to-sql/read-only-query-executor.js";

describe("executeReadOnlyQuery", () => {
  it("executa consulta em transação read-only e sempre desfaz", async () => {
    const sql = `SELECT 1 AS valor LIMIT 1`;
    const query = jest.fn(async (statement: string) => {
      if (statement === sql) {
        return { rows: [{ valor: 1 }] };
      }

      return { rows: [] };
    });

    const client = { query } as unknown as Pick<Client, "query">;
    const rows = await executeReadOnlyQuery(client, sql);

    expect(rows).toEqual([{ valor: 1 }]);
    expect(query.mock.calls.map(([statement]) => statement)).toEqual([
      "BEGIN TRANSACTION READ ONLY",
      "SET LOCAL statement_timeout = '3s'",
      "SET LOCAL lock_timeout = '1s'",
      "SET LOCAL idle_in_transaction_session_timeout = '5s'",
      sql,
      "ROLLBACK",
    ]);
  });

  it("executa rollback quando a consulta falha", async () => {
    const sql = `SELECT coluna_inexistente FROM "Ativo" LIMIT 1`;
    const query = jest.fn(async (statement: string) => {
      if (statement === sql) {
        throw new Error("column does not exist");
      }

      return { rows: [] };
    });

    const client = { query } as unknown as Pick<Client, "query">;

    await expect(
      executeReadOnlyQuery(client, sql),
    ).rejects.toThrow("column does not exist");

    expect(query).toHaveBeenLastCalledWith("ROLLBACK");
  });

  it("rejeita SQL vazio sem iniciar transação", async () => {
    const query = jest.fn(async () => ({ rows: [] }));
    const client = { query } as unknown as Pick<Client, "query">;

    await expect(
      executeReadOnlyQuery(client, "   "),
    ).rejects.toThrow("SQL vazio não pode ser executado.");

    expect(query).not.toHaveBeenCalled();
  });
});
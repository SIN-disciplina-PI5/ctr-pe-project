import type { Client, QueryResultRow } from "pg";

type ReadOnlyClient = Pick<Client, "query">;

export async function executeReadOnlyQuery<
  T extends QueryResultRow = QueryResultRow,
>(
  client: ReadOnlyClient,
  sql: string,
): Promise<T[]> {
  if (!sql.trim()) {
    throw new Error("SQL vazio não pode ser executado.");
  }

  await client.query("BEGIN TRANSACTION READ ONLY");

  try {
    await client.query("SET LOCAL statement_timeout = '3s'");
    await client.query("SET LOCAL lock_timeout = '1s'");
    await client.query(
      "SET LOCAL idle_in_transaction_session_timeout = '5s'",
    );

    const result = await client.query<T>(sql);

    return result.rows;
  } finally {
    await client.query("ROLLBACK");
  }
}
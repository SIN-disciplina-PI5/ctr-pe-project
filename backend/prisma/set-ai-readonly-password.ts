import "dotenv/config";
import pg from "pg";

const AI_ROLE_NAME = "ctrpe_ai_readonly";

async function main() {
  const ownerUrl = process.env["DATABASE_URL"];
  const aiUrl = process.env["AI_READONLY_DATABASE_URL"];

  if (!ownerUrl) throw new Error("DATABASE_URL não definida.");
  if (!aiUrl) throw new Error("AI_READONLY_DATABASE_URL não definida.");

  const parsedAiUrl = new URL(aiUrl);
  const user = decodeURIComponent(parsedAiUrl.username);
  const password = decodeURIComponent(parsedAiUrl.password);

  if (user !== AI_ROLE_NAME) {
    throw new Error(
      `AI_READONLY_DATABASE_URL deve usar o usuário ${AI_ROLE_NAME}.`,
    );
  }

  if (!password) {
    throw new Error("AI_READONLY_DATABASE_URL precisa conter uma senha.");
  }

  const client = new pg.Client({ connectionString: ownerUrl });
  await client.connect();

  try {
    const result = await client.query<{ sql: string }>(
      "SELECT format('ALTER ROLE %I WITH PASSWORD %L', $1::text, $2::text) AS sql",
      [AI_ROLE_NAME, password],
    );

    await client.query(result.rows[0]!.sql);
    console.log(`Senha da role ${AI_ROLE_NAME} atualizada.`);
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

import "dotenv/config";
import pg from "pg";

/**
 * Define a senha do role somente leitura da camada de IA.
 *
 * A migration cria o role "ctrpe_ai_readonly" sem senha (segredos não ficam no
 * repositório). Este script lê a senha de AI_READONLY_DATABASE_URL e a aplica
 * usando a conexão do dono do banco (DATABASE_URL).
 *
 * Uso: npm run ai-role:set-password
 */

const AI_ROLE_NAME = "ctrpe_ai_readonly";

async function main() {
  const ownerUrl = process.env["DATABASE_URL"];
  const aiUrl = process.env["AI_READONLY_DATABASE_URL"];

  if (!ownerUrl) throw new Error("DATABASE_URL não definida");
  if (!aiUrl) throw new Error("AI_READONLY_DATABASE_URL não definida");

  const parsed = new URL(aiUrl);
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);

  // Trava de segurança: este script só altera a senha do role da IA.
  if (user !== AI_ROLE_NAME) {
    throw new Error(
      `AI_READONLY_DATABASE_URL deve usar o usuário "${AI_ROLE_NAME}" (recebido: "${user}")`,
    );
  }
  if (!password) {
    throw new Error("AI_READONLY_DATABASE_URL precisa conter uma senha");
  }

  const client = new pg.Client({ connectionString: ownerUrl });
  await client.connect();

  try {
    // format() com %I/%L escapa identificador e literal (a senha não pode ser
    // passada como parâmetro em ALTER ROLE).
    const { rows } = await client.query<{ sql: string }>(
      "SELECT format('ALTER ROLE %I WITH PASSWORD %L', $1::text, $2::text) AS sql",
      [AI_ROLE_NAME, password],
    );
    await client.query(rows[0]!.sql);
    console.log(`Senha do role "${AI_ROLE_NAME}" atualizada.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

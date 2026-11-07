import "dotenv/config";
import pg from "pg";
import { AmbienteGuard } from "../../scripts/synthetic-data/guards.js";
import {
  runRlsTenantIsolation,
  type SqlClient,
} from "./rls-tenant-isolation.js";

const { Client } = pg;
const { url, host } = AmbienteGuard.validar();
const client = new Client({ connectionString: url });

console.error(`Banco sintético autorizado: ${host}`);
console.error("As alterações experimentais serão revertidas com ROLLBACK.");

await client.connect();

try {
  const sqlClient: SqlClient = {
    async query(sql, values) {
      const result = await client.query(sql, values);
      return { rows: result.rows };
    },
  };

  const report = await runRlsTenantIsolation(sqlClient);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await client.end();
}

import { describe, expect, it, jest } from "@jest/globals";
import type { SqlClient } from "../../../spikes/text-to-sql/rls-tenant-isolation.js";
import { runInSnakeCaseViewSandbox } from "../../../spikes/text-to-sql/snake-case-view-sandbox.js";

interface ClientOptions {
  existingSchema?: boolean;
  existingRlsTable?: string;
}

function createClient(options: ClientOptions = {}) {
  const statements: string[] = [];

  const client: SqlClient = {
    async query<T extends Record<string, unknown> = Record<string, unknown>>(
      sql: string,
    ) {
      statements.push(sql);

      if (sql.includes("information_schema.schemata")) {
        return {
          rows: (options.existingSchema
            ? [{ schema_name: "ai" }]
            : []) as unknown as T[],
        };
      }

      if (sql.includes("FROM pg_class")) {
        return {
          rows: (options.existingRlsTable
            ? [{ table_name: options.existingRlsTable }]
            : []) as unknown as T[],
        };
      }

      if (sql.includes('FROM public."Empresa" WHERE')) {
        return {
          rows: [
            { id: "empresa-1", codigo: "alpha-brazilian" },
          ] as unknown as T[],
        };
      }

      if (sql === "SELECT current_user AS owner_role") {
        return {
          rows: [{ owner_role: "neondb_owner" }] as unknown as T[],
        };
      }

      if (sql.includes("row_security_active")) {
        return {
          rows: [
            {
              role_name: `ctrpe_ai_snake_${process.pid}`,
              empresa_rls: true,
              ativo_rls: true,
              ordem_servico_rls: true,
              parada_rls: true,
              material_rls: true,
              os_material_rls: true,
              alerta_rls: true,
            },
          ] as unknown as T[],
        };
      }

      return { rows: [] as unknown as T[] };
    },
  };

  return { client, statements };
}

describe("runInSnakeCaseViewSandbox", () => {
  it("prepara views snake_case com RLS e sempre reverte a transação", async () => {
    const { client, statements } = createClient();
    const operation = jest.fn(async () => "resultado");

    const result = await runInSnakeCaseViewSandbox(
      client,
      "alpha-brazilian",
      operation,
    );

    const executedSql = statements.join("\n");

    expect(result).toBe("resultado");
    expect(operation).toHaveBeenCalledWith({
      tenantId: "empresa-1",
      companyCode: "alpha-brazilian",
      roleName: `ctrpe_ai_snake_${process.pid}`,
    });
    expect(executedSql).toContain("NOBYPASSRLS");
    expect(executedSql).toContain("ENABLE ROW LEVEL SECURITY");
    expect(executedSql).toContain('ON public."OrdemServicoMaterial"');
    expect(executedSql).toContain("security_invoker = true");
    expect(executedSql).toContain("CREATE VIEW ai.empresas");
    expect(executedSql).toContain("CREATE VIEW ai.os_materiais");
    expect(statements.at(-1)).toBe("ROLLBACK");
  });

  it("preserva um schema ai existente por meio do ROLLBACK", async () => {
    const { client, statements } = createClient({ existingSchema: true });
    const operation = jest.fn(async () => "resultado");

    const result = await runInSnakeCaseViewSandbox(
      client,
      "alpha-brazilian",
      operation,
    );

    expect(result).toBe("resultado");
    expect(statements.join("\n")).toContain(
      `ALTER SCHEMA ai RENAME TO "ai_original_${process.pid}"`,
    );
    expect(operation).toHaveBeenCalled();
    expect(statements.at(-1)).toBe("ROLLBACK");
  });

  it("recusa interferir em RLS existente", async () => {
    const { client, statements } = createClient({
      existingRlsTable: "Ativo",
    });
    const operation = jest.fn(async () => "resultado");

    await expect(
      runInSnakeCaseViewSandbox(client, "alpha-brazilian", operation),
    ).rejects.toThrow("RLS já configurado em Ativo");

    expect(operation).not.toHaveBeenCalled();
    expect(statements.at(-1)).toBe("ROLLBACK");
  });

  it("executa ROLLBACK quando a operação falha", async () => {
    const { client, statements } = createClient();

    await expect(
      runInSnakeCaseViewSandbox(client, "alpha-brazilian", async () => {
        throw new Error("falha simulada");
      }),
    ).rejects.toThrow("falha simulada");

    expect(statements.at(-1)).toBe("ROLLBACK");
  });
});

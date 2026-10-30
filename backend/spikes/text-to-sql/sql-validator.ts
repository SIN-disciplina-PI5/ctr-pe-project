import { parse } from "pgsql-parser";

type AstRecord = Record<string, unknown>;

export interface SqlValidationOptions {
  allowedTables: readonly string[];
  expectedCompanyCode: string;
  maxRows: number;
}

export interface SqlValidationResult {
  valid: boolean;
  violations: string[];
  tables: string[];
  limit: number | null;
}

export const SPIKE_ALLOWED_TABLES = [
  "Empresa",
  "Ativo",
  "OrdemServico",
  "ParadaAtivo",
  "Material",
  "OrdemServicoMaterial",
  "Alerta",
] as const;

const FORBIDDEN_NODE_TAGS = [
  "InsertStmt",
  "UpdateStmt",
  "DeleteStmt",
  "MergeStmt",
  "CreateStmt",
  "AlterTableStmt",
  "DropStmt",
  "TruncateStmt",
  "CopyStmt",
  "CallStmt",
  "DoStmt",
  "ExecuteStmt",
  "TransactionStmt",
] as const;

function isRecord(value: unknown): value is AstRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function walk(
  value: unknown,
  visitor: (node: AstRecord) => void,
): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }

  if (!isRecord(value)) return;

  visitor(value);

  for (const child of Object.values(value)) {
    walk(child, visitor);
  }
}

function containsNodeTag(ast: unknown, tag: string): boolean {
  let found = false;

  walk(ast, (node) => {
    if (tag in node) found = true;
  });

  return found;
}

function collectTables(ast: unknown): string[] {
  const tables = new Set<string>();

  walk(ast, (node) => {
    const rangeVar = node["RangeVar"];

    if (
      isRecord(rangeVar) &&
      typeof rangeVar["relname"] === "string"
    ) {
      tables.add(rangeVar["relname"]);
    }
  });

  return [...tables].sort();
}

function collectStringValues(ast: unknown): string[] {
  const values: string[] = [];

  walk(ast, (node) => {
    if (typeof node["sval"] === "string") {
      values.push(node["sval"]);
    }
  });

  return values;
}

function extractInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (!isRecord(value)) return null;

  if ("ival" in value) {
    const nested = extractInteger(value["ival"]);
    if (nested !== null) return nested;
  }

  for (const child of Object.values(value)) {
    const nested = extractInteger(child);
    if (nested !== null) return nested;
  }

  return null;
}

export async function validateSql(
  sql: string,
  options: SqlValidationOptions,
): Promise<SqlValidationResult> {
  const violations = new Set<string>();
  let ast: unknown;

  try {
    ast = await parse(sql);
  } catch {
    return {
      valid: false,
      violations: ["SQL sintaticamente inválido."],
      tables: [],
      limit: null,
    };
  }

  const statements =
    isRecord(ast) && Array.isArray(ast["stmts"]) ? ast["stmts"] : [];

  if (statements.length !== 1) {
    violations.add("A consulta deve possuir exatamente uma instrução.");
  }

  for (const tag of FORBIDDEN_NODE_TAGS) {
    if (containsNodeTag(ast, tag)) {
      violations.add(`Comando proibido detectado: ${tag}.`);
    }
  }

  const firstStatement = statements[0];
  const statement =
    isRecord(firstStatement) && isRecord(firstStatement["stmt"])
      ? firstStatement["stmt"]
      : null;

  const selectStatement =
    statement && isRecord(statement["SelectStmt"])
      ? statement["SelectStmt"]
      : null;

  if (!selectStatement) {
    violations.add("Somente instruções SELECT são permitidas.");
  }

  if (selectStatement?.["withClause"]) {
    violations.add("CTEs ainda não são permitidas neste spike.");
  }

  const tables = collectTables(ast);
  const allowedTables = new Set(options.allowedTables);

  for (const table of tables) {
    if (!allowedTables.has(table)) {
      violations.add(`Tabela não autorizada: ${table}.`);
    }
  }

  const stringValues = collectStringValues(ast);

  if (
    !tables.includes("Empresa") ||
    !stringValues.includes(options.expectedCompanyCode)
  ) {
    violations.add("Filtro obrigatório de empresa não identificado.");
  }

  const limit = selectStatement
    ? extractInteger(selectStatement["limitCount"])
    : null;

  if (limit === null) {
    violations.add("LIMIT obrigatório não identificado.");
  } else if (limit < 1 || limit > options.maxRows) {
    violations.add(`LIMIT deve estar entre 1 e ${options.maxRows}.`);
  }

  return {
    valid: violations.size === 0,
    violations: [...violations],
    tables,
    limit,
  };
}
import { readFileSync } from "node:fs";
import { parse } from "pgsql-parser";
import { AI_VIEW_NAMES, type AiViewName } from "./schema-context.js";

const SQL_PARSER_WASM_URL = new URL(
  "../../../node_modules/libpg-query/wasm/libpg-query.wasm",
  import.meta.url,
);

void readFileSync(SQL_PARSER_WASM_URL);
type AstRecord = Record<string, unknown>;

export const AI_ALLOWED_SQL_FUNCTIONS = [
  "avg",
  "coalesce",
  "count",
  "date_trunc",
  "extract",
  "greatest",
  "least",
  "max",
  "min",
  "nullif",
  "round",
  "sum",
  "to_char",
] as const;

export interface SqlValidationOptions {
  readonly allowedViews?: readonly AiViewName[];
  readonly allowedFunctions?: readonly string[];
  readonly requiredSchema?: string;
  readonly maxRows?: number;
}

export interface SqlValidationResult {
  readonly valid: boolean;
  readonly violations: readonly string[];
  readonly views: readonly string[];
  readonly functions: readonly string[];
  readonly limit: number | null;
}

const FORBIDDEN_NODE_TAGS = [
  "AlterTableStmt",
  "CallStmt",
  "CopyStmt",
  "CreateStmt",
  "CreateTableAsStmt",
  "DeallocateStmt",
  "DeleteStmt",
  "DoStmt",
  "DropStmt",
  "ExecuteStmt",
  "GrantStmt",
  "InsertStmt",
  "ListenStmt",
  "LockStmt",
  "MergeStmt",
  "NextValueExpr",
  "NotifyStmt",
  "PrepareStmt",
  "RefreshMatViewStmt",
  "SQLValueFunction",
  "TransactionStmt",
  "TruncateStmt",
  "UpdateStmt",
  "VacuumStmt",
  "VariableSetStmt",
] as const;

function isRecord(value: unknown): value is AstRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function walk(value: unknown, visitor: (node: AstRecord) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }

  if (!isRecord(value)) return;
  visitor(value);

  for (const child of Object.values(value)) walk(child, visitor);
}

function containsNodeTag(ast: unknown, tag: string): boolean {
  let found = false;
  walk(ast, (node) => {
    if (tag in node) found = true;
  });
  return found;
}

interface RelationReference {
  readonly view: string;
  readonly schema: string | null;
}

function collectRelations(ast: unknown): RelationReference[] {
  const relations = new Map<string, RelationReference>();

  walk(ast, (node) => {
    const rangeVar = node["RangeVar"];
    if (!isRecord(rangeVar) || typeof rangeVar["relname"] !== "string") {
      return;
    }

    const view = rangeVar["relname"];
    const schema =
      typeof rangeVar["schemaname"] === "string"
        ? rangeVar["schemaname"]
        : null;
    relations.set(`${schema ?? ""}.${view}`, { view, schema });
  });

  return [...relations.values()].sort((left, right) =>
    `${left.schema ?? ""}.${left.view}`.localeCompare(
      `${right.schema ?? ""}.${right.view}`,
    ),
  );
}

function collectFunctions(ast: unknown): string[] {
  const functions = new Set<string>();

  walk(ast, (node) => {
    const call = node["FuncCall"];
    if (!isRecord(call) || !Array.isArray(call["funcname"])) return;

    const parts = call["funcname"].flatMap((part) => {
      if (!isRecord(part) || !isRecord(part["String"])) return [];
      const value = part["String"]["sval"];
      return typeof value === "string" ? [value] : [];
    });

    if (parts.length > 0) functions.add(parts.join(".").toLowerCase());
  });

  return [...functions].sort();
}

function extractInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
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
  options: SqlValidationOptions = {},
): Promise<SqlValidationResult> {
  const violations = new Set<string>();
  const requiredSchema = options.requiredSchema ?? "ai";
  const maxRows = options.maxRows ?? 100;
  const allowedViews = new Set(options.allowedViews ?? AI_VIEW_NAMES);
  const allowedFunctions = new Set(
    options.allowedFunctions ?? AI_ALLOWED_SQL_FUNCTIONS,
  );
  let ast: unknown;

  try {
    ast = await parse(sql);
  } catch {
    return {
      valid: false,
      violations: ["SQL sintaticamente inválido."],
      views: [],
      functions: [],
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
      violations.add(`Construção SQL proibida: ${tag}.`);
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
    violations.add("Somente uma instrução SELECT é permitida.");
  } else {
    if (selectStatement["withClause"]) {
      violations.add("CTEs não são permitidas.");
    }
    if (selectStatement["intoClause"]) {
      violations.add("SELECT INTO não é permitido.");
    }
    if (selectStatement["lockingClause"]) {
      violations.add("Bloqueios de linha não são permitidos.");
    }
  }

  const relations = collectRelations(ast);
  const views = [...new Set(relations.map((relation) => relation.view))].sort();

  if (relations.length === 0) {
    violations.add("A consulta deve usar ao menos uma view autorizada.");
  }

  for (const relation of relations) {
    if (!allowedViews.has(relation.view as AiViewName)) {
      violations.add(`View não autorizada: ${relation.view}.`);
    }
    if (relation.schema !== requiredSchema) {
      const qualified = relation.schema
        ? `${relation.schema}.${relation.view}`
        : relation.view;
      violations.add(
        `Relação ${qualified} deve usar o schema ${requiredSchema}.`,
      );
    }
  }

  const functions = collectFunctions(ast);
  for (const functionName of functions) {
    if (!allowedFunctions.has(functionName)) {
      violations.add(`Função SQL não autorizada: ${functionName}.`);
    }
  }

  const limit = selectStatement
    ? extractInteger(selectStatement["limitCount"])
    : null;
  if (limit === null) {
    violations.add("LIMIT obrigatório não identificado.");
  } else if (limit < 1 || limit > maxRows) {
    violations.add(`LIMIT deve estar entre 1 e ${maxRows}.`);
  }

  return {
    valid: violations.size === 0,
    violations: [...violations],
    views,
    functions,
    limit,
  };
}

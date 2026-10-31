import type { QueryResultRow } from "pg";

export type SemanticEvaluationStatus =
  | "match"
  | "mismatch"
  | "inconclusive";

export interface SemanticEvaluation {
  status: SemanticEvaluationStatus;
  reason: string;
}

interface SemanticField {
  name: string;
  aliases: readonly string[];
  numeric: boolean;
}

const CASE_FIELDS: Readonly<Record<string, readonly SemanticField[]>> = {
  "ativos-indisponiveis": [
    { name: "codigo", aliases: ["codigo"], numeric: false },
    { name: "nome", aliases: ["nome"], numeric: false },
    { name: "status", aliases: ["status"], numeric: false },
  ],
  "os-abertas-por-status": [
    { name: "status", aliases: ["status"], numeric: false },
    {
      name: "quantidade",
      aliases: ["quantidade", "total"],
      numeric: true,
    },
  ],
  "ativos-mais-corretivas": [
    { name: "codigo", aliases: ["codigo"], numeric: false },
    { name: "nome", aliases: ["nome"], numeric: false },
    {
      name: "quantidade",
      aliases: ["quantidade", "num_paradas", "num_corr", "total_corr"],
      numeric: true,
    },
  ],
  "materiais-estoque-baixo": [
    { name: "codigo", aliases: ["codigo"], numeric: false },
    { name: "nome", aliases: ["nome"], numeric: false },
    {
      name: "estoqueAtual",
      aliases: ["estoqueAtual", "estoque_atual"],
      numeric: true,
    },
    {
      name: "estoqueMinimo",
      aliases: ["estoqueMinimo", "estoque_minimo"],
      numeric: true,
    },
  ],
  "os-atrasadas": [
    { name: "numero", aliases: ["numero"], numeric: false },
    { name: "titulo", aliases: ["titulo"], numeric: false },
    { name: "status", aliases: ["status"], numeric: false },
    { name: "prazoEm", aliases: ["prazoEm", "prazo_em"], numeric: false },
  ],
  "custo-agosto": [
    {
      name: "custo_total",
      aliases: ["custo_total", "total_custo"],
      numeric: true,
    },
  ],
  "maior-media-parada": [
    { name: "codigo", aliases: ["codigo"], numeric: false },
    { name: "nome", aliases: ["nome"], numeric: false },
    {
      name: "media_minutos",
      aliases: ["media_minutos", "media_duracao", "mediaDuracao"],
      numeric: true,
    },
  ],
  "materiais-os-aguardando": [
    { name: "codigo", aliases: ["codigo"], numeric: false },
    { name: "nome", aliases: ["nome", "material_name"], numeric: false },
    {
      name: "quantidade",
      aliases: ["quantidade", "total_quantidade"],
      numeric: true,
    },
  ],
  "ct07-agosto": [
    { name: "numero", aliases: ["numero"], numeric: false },
    { name: "titulo", aliases: ["titulo"], numeric: false },
    { name: "status", aliases: ["status"], numeric: false },
    { name: "abertaEm", aliases: ["abertaEm", "aberta_em"], numeric: false },
    { name: "encerradaEm", aliases: ["encerradaEm", "encerrada_em"], numeric: false },
    {
      name: "tempoAguardandoPecaMinutos",
      aliases: [
        "tempoAguardandoPecaMinutos",
        "tempo_aguardando_peca_minutos",
      ],
      numeric: true,
    },
    { name: "custoTotal", aliases: ["custoTotal", "custo_total"], numeric: true },
  ],
  "alertas-criticos": [
    { name: "tipo", aliases: ["tipo"], numeric: false },
    { name: "titulo", aliases: ["titulo"], numeric: false },
    { name: "mensagem", aliases: ["mensagem"], numeric: false },
    { name: "geradoEm", aliases: ["geradoEm", "gerado_em"], numeric: false },
  ],
};

function normalizeValue(value: unknown, numeric: boolean): unknown {
  if (value instanceof Date) return value.toISOString();
  if (!numeric || value === null) return value;

  const normalized = typeof value === "string" ? Number(value) : value;
  return typeof normalized === "number" && Number.isFinite(normalized)
    ? normalized
    : value;
}

function findValue(row: QueryResultRow, aliases: readonly string[]) {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(row, alias)) {
      return { found: true, value: row[alias] };
    }
  }

  return { found: false, value: undefined };
}

function projectRows(
  rows: QueryResultRow[],
  fields: readonly SemanticField[],
  generated: boolean,
) {
  const projected = [];

  for (const row of rows) {
    const entry: Record<string, unknown> = {};

    for (const field of fields) {
      const aliases = generated ? field.aliases : [field.name];
      const result = findValue(row, aliases);

      if (!result.found) {
        return { rows: null, missingField: field.name };
      }

      entry[field.name] = normalizeValue(result.value, field.numeric);
    }

    projected.push(entry);
  }

  projected.sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right)),
  );

  return { rows: projected, missingField: null };
}

export function evaluateSemanticResult(
  caseId: string,
  referenceRows: QueryResultRow[] | null,
  generatedRows: QueryResultRow[] | null,
): SemanticEvaluation {
  const fields = CASE_FIELDS[caseId];
  if (!fields) {
    return {
      status: "inconclusive",
      reason: "Caso sem contrato de avaliação semântica.",
    };
  }

  if (!referenceRows) {
    return {
      status: "inconclusive",
      reason: "A consulta de referência não foi executada.",
    };
  }

  if (!generatedRows) {
    return {
      status: "mismatch",
      reason: "A consulta gerada não produziu resultado.",
    };
  }

  if (referenceRows.length === 0) {
    return generatedRows.length === 0
      ? {
          status: "inconclusive",
          reason: "Referência e consulta gerada retornaram conjuntos vazios.",
        }
      : {
          status: "mismatch",
          reason: "A referência está vazia, mas a consulta gerada retornou linhas.",
        };
  }

  if (referenceRows.length !== generatedRows.length) {
    return {
      status: "mismatch",
      reason: "As consultas retornaram quantidades diferentes de linhas.",
    };
  }

  const reference = projectRows(referenceRows, fields, false);
  const generated = projectRows(generatedRows, fields, true);

  if (reference.missingField) {
    return {
      status: "inconclusive",
      reason: `A referência não possui o campo ${reference.missingField}.`,
    };
  }

  if (generated.missingField) {
    return {
      status: "mismatch",
      reason: `A consulta gerada não possui o campo ${generated.missingField}.`,
    };
  }

  if (JSON.stringify(reference.rows) !== JSON.stringify(generated.rows)) {
    return {
      status: "mismatch",
      reason: "Os valores semanticamente relevantes são diferentes.",
    };
  }

  return {
    status: "match",
    reason: "Os campos semanticamente relevantes coincidem.",
  };
}

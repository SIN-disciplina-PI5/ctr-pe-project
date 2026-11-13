import type { QueryResultRow } from "pg";

export interface QueryResultComparison {
  exactMatch: boolean;
  referenceProjectionMatch: boolean;
}

function canonicalizeRows(rows: QueryResultRow[]): string {
  const normalized = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  );

  normalized.sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right)),
  );

  return JSON.stringify(normalized);
}

export function compareQueryResults(
  referenceRows: QueryResultRow[] | null,
  generatedRows: QueryResultRow[] | null,
): QueryResultComparison {
  if (!referenceRows || !generatedRows) {
    return {
      exactMatch: false,
      referenceProjectionMatch: false,
    };
  }

  const exactMatch =
    canonicalizeRows(referenceRows) === canonicalizeRows(generatedRows);

  if (exactMatch) {
    return {
      exactMatch: true,
      referenceProjectionMatch: true,
    };
  }

  if (referenceRows.length !== generatedRows.length) {
    return {
      exactMatch: false,
      referenceProjectionMatch: false,
    };
  }

  const referenceColumns = [
    ...new Set(referenceRows.flatMap((row) => Object.keys(row))),
  ];

  const canProject = generatedRows.every((row) =>
    referenceColumns.every((column) =>
      Object.prototype.hasOwnProperty.call(row, column),
    ),
  );

  if (!canProject) {
    return {
      exactMatch: false,
      referenceProjectionMatch: false,
    };
  }

  const projectedRows = generatedRows.map((row) =>
    Object.fromEntries(
      referenceColumns.map((column) => [column, row[column]]),
    ),
  );

  return {
    exactMatch: false,
    referenceProjectionMatch:
      canonicalizeRows(referenceRows) === canonicalizeRows(projectedRows),
  };
}
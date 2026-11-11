import type {
  ChatResponse,
  GeneratedReport,
  QueryResultBlock,
} from "./assistente.types";

export function extractQueryBlocks(response: ChatResponse): QueryResultBlock[] {
  if (
    response.result.intent !== "data_question" ||
    response.result.result.status !== "answered"
  ) {
    return [];
  }

  const query = response.result.result;
  if (query.mode === "single") {
    return [
      {
        id: "single",
        sql: query.sql,
        rowsUsed: query.rowsUsed,
      },
    ];
  }

  return query.steps.map((step) => ({
    id: step.id,
    purpose: step.purpose,
    sql: step.sql,
    rowsUsed: step.rowsUsed,
  }));
}

export function extractGeneratedReport(
  response: ChatResponse,
): GeneratedReport | undefined {
  return response.result.status === "report_generated"
    ? response.result.report
    : undefined;
}

export function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

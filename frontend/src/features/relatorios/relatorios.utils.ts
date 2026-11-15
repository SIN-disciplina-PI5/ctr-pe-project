import type {
  CreateReportInput,
  ListReportsResponse,
  ReportJobStatus,
  ReportType,
} from "./relatorios.types";

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  monthly_maintenance: "Manutenção mensal",
  asset_costs: "Custos por ativo",
  availability: "Disponibilidade",
};

export const REPORT_STATUS_LABEL: Record<ReportJobStatus, string> = {
  queued: "Na fila",
  running: "Gerando",
  done: "Pronto",
  failed: "Falhou",
};

/** Intervalo do polling: só consulta de novo enquanto houver job ativo. */
export const REPORT_POLLING_MS = 5_000;

export function reportsPollingInterval(
  data: ListReportsResponse | undefined,
): number | false {
  return data?.hasActiveJobs ? REPORT_POLLING_MS : false;
}

export type PeriodPreset =
  | "none"
  | "current_month"
  | "last_month"
  | "last_90_days"
  | "custom";

export const PERIOD_PRESET_LABEL: Record<PeriodPreset, string> = {
  none: "Sem período",
  current_month: "Mês atual",
  last_month: "Mês anterior",
  last_90_days: "Últimos 90 dias",
  custom: "Personalizado",
};

function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Converte "dd/mm/aaaa" em "aaaa-mm-dd"; devolve null se a data não existir. */
export function brDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return `${year}-${month}-${day}`;
}

export function presetPeriod(
  preset: Exclude<PeriodPreset, "none" | "custom">,
  today: Date,
): { start: string; end: string } {
  const year = today.getFullYear();
  const month = today.getMonth();

  switch (preset) {
    case "current_month":
      return { start: isoDate(new Date(year, month, 1)), end: isoDate(today) };
    case "last_month":
      return {
        start: isoDate(new Date(year, month - 1, 1)),
        end: isoDate(new Date(year, month, 0)),
      };
    case "last_90_days":
      return {
        start: isoDate(new Date(year, month, today.getDate() - 89)),
        end: isoDate(today),
      };
  }
}

export type ReportFormValues = {
  tipo: ReportType | "custom";
  periodo: PeriodPreset;
  inicio: string;
  fim: string;
  pedido: string;
};

/** Monta o corpo do POST a partir do formulário já validado. */
export function buildCreateReportInput(
  values: ReportFormValues,
  today: Date = new Date(),
): CreateReportInput {
  const pedido = values.pedido.trim();
  let period: CreateReportInput["period"];

  if (values.periodo === "custom") {
    const start = brDateToIso(values.inicio);
    const end = brDateToIso(values.fim);
    if (start && end) period = { start, end };
  } else if (values.periodo !== "none") {
    period = presetPeriod(values.periodo, today);
  }

  return {
    ...(values.tipo === "custom" ? {} : { reportType: values.tipo }),
    ...(period ? { period } : {}),
    ...(pedido ? { request: pedido } : {}),
  };
}

/** Chave de idempotência compatível com o backend (8 a 128, [A-Za-z0-9._:-]). */
export function newIdempotencyKey(): string {
  const random = Math.random().toString(36).slice(2, 12);
  return `rel-${Date.now().toString(36)}-${random}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/** Mensagem do backend ({ error }) ou uma mensagem padrão. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  const response = (error as { response?: { status?: number; data?: { error?: unknown } } })
    ?.response;
  if (response?.status === 429) {
    return "Você atingiu o limite de solicitações. Tente novamente em alguns minutos.";
  }
  const message = response?.data?.error;
  return typeof message === "string" && message.trim() ? message : fallback;
}

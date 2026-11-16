import { Platform } from "react-native";

import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";

import type {
  CreateReportInput,
  ListReportsParams,
  ListReportsResponse,
  ReportJob,
} from "./relatorios.types";

export async function createReport(
  input: CreateReportInput,
  idempotencyKey: string,
): Promise<ReportJob> {
  const { data } = await apiClient.post<ReportJob>(endpoints.ai.reports.root, input, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return data;
}

export async function listReports(
  params: ListReportsParams = {},
): Promise<ListReportsResponse> {
  const { data } = await apiClient.get<ListReportsResponse>(endpoints.ai.reports.root, {
    params,
  });
  return data;
}

export async function getReport(id: string): Promise<ReportJob> {
  const { data } = await apiClient.get<ReportJob>(endpoints.ai.reports.byId(id));
  return data;
}

export class DownloadUnavailableError extends Error {
  constructor() {
    super("O download do PDF está disponível na versão web.");
    this.name = "DownloadUnavailableError";
  }
}

function filenameFrom(disposition: unknown, fallback: string): string {
  if (typeof disposition !== "string") return fallback;
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  return match?.[1] ?? fallback;
}

/**
 * Baixa o PDF com o token da sessão (o link não é público) e entrega ao
 * navegador como download. No celular ainda não há onde salvar o arquivo.
 */
export async function downloadReport(
  job: Pick<ReportJob, "id">,
  platform: string = Platform.OS,
): Promise<void> {
  if (platform !== "web") throw new DownloadUnavailableError();

  const response = await apiClient.get<Blob>(endpoints.ai.reports.download(job.id), {
    responseType: "blob",
  });
  const filename = filenameFrom(
    response.headers?.["content-disposition"],
    `relatorio-${job.id}.pdf`,
  );
  const url = URL.createObjectURL(response.data);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    // Dá tempo ao navegador de iniciar o download antes de liberar a memória.
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }
}

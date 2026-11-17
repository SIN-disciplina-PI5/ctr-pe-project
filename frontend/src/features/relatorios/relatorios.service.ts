import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";
import { env } from "@/infrastructure/env/env";
import { getToken } from "@/infrastructure/storage/token-storage";

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
  constructor(message = "O compartilhamento de arquivos não está disponível neste dispositivo.") {
    super(message);
    this.name = "DownloadUnavailableError";
  }
}

function filenameFrom(disposition: unknown, fallback: string): string {
  if (typeof disposition !== "string") return fallback;
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  return match?.[1] ?? fallback;
}

async function downloadNative(job: Pick<ReportJob, "id">): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new DownloadUnavailableError();
  }

  const token = await getToken();
  if (!token) {
    throw new DownloadUnavailableError("Sua sessão expirou. Entre novamente para baixar o relatório.");
  }

  const filename = `relatorio-${job.id}.pdf`;
  const destination = new File(Paths.cache, filename);
  const baseUrl = env.apiUrl.replace(/\/+$/, "");
  const file = await File.downloadFileAsync(
    `${baseUrl}${endpoints.ai.reports.download(job.id)}`,
    destination,
    {
      headers: { Authorization: `Bearer ${token}` },
      idempotent: true,
    },
  );

  try {
    await Sharing.shareAsync(file.uri, {
      dialogTitle: "Salvar ou compartilhar relatório",
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
    });
  } finally {
    try {
      file.delete();
    } catch {
      // O sistema operacional também pode limpar arquivos do cache.
    }
  }
}

export async function downloadReport(
  job: Pick<ReportJob, "id">,
  platform: string = Platform.OS,
): Promise<void> {
  if (platform !== "web") {
    await downloadNative(job);
    return;
  }

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

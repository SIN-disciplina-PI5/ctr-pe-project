import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";

import type { ChatResponse, SendChatMessageInput } from "./assistente.types";

export async function sendChatMessage(input: SendChatMessageInput) {
  const { data } = await apiClient.post<ChatResponse>(endpoints.ai.chat, input);
  return data;
}

// --- Novas funções da Task 07 (Relatórios) ---

export async function requestReport(input: { userId: string; filters?: Record<string, any> }) {
  const { data } = await apiClient.post(endpoints.ai.requestReport, input);
  return data;
}

export async function getReportStatus(jobId: string) {
  const { data } = await apiClient.get(endpoints.ai.reportStatus(jobId));
  return data;
}
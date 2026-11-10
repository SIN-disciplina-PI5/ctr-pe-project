import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";

import type { ChatResponse, SendChatMessageInput } from "./assistente.types";

export async function sendChatMessage(input: SendChatMessageInput) {
  const { data } = await apiClient.post<ChatResponse>(endpoints.ai.chat, input);
  return data;
}

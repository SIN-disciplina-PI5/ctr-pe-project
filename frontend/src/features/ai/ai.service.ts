import { apiClient } from "@/infrastructure/api/api-client";

import type { AssistenteResposta } from "./ai.types";

// Envia a pergunta do usuário para o backend de IA.
export async function perguntarAoAssistente(
  question: string,
): Promise<AssistenteResposta> {
  const { data } = await apiClient.post<AssistenteResposta>("/ai/query", {
    question,
  });
  return data;
}
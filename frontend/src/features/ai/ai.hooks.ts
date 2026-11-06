import { useMutation } from "@tanstack/react-query";

import { perguntarAoAssistente } from "./ai.service";

// Hook que dispara a pergunta e controla carregando/erro automaticamente.
export function useAssistente() {
  return useMutation({
    mutationFn: (question: string) => perguntarAoAssistente(question),
  });
}
import { create } from "zustand";

export type MensagemAssistente = {
  id: string;
  autor: "user" | "assistente";
  texto: string;
  recusada?: boolean;
};

type AssistenteState = {
  mensagens: MensagemAssistente[];
  adicionar: (mensagem: MensagemAssistente) => void;
  limpar: () => void;
};

export const useAssistenteStore = create<AssistenteState>((set) => ({
  mensagens: [],
  adicionar: (mensagem) =>
    set((estado) => ({ mensagens: [...estado.mensagens, mensagem] })),
  limpar: () => set({ mensagens: [] }),
}));
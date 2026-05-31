import type { PrioridadeOS, StatusOS, TipoOS } from "@/types/ordem-servico";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const STATUS_OS_LABEL: Record<StatusOS, string> = {
  ABERTA: "Aberta",
  EM_EXECUCAO: "Em execução",
  AGUARDANDO_PECA: "Aguardando peça",
  ENCERRADA: "Encerrada",
  CANCELADA: "Cancelada",
};

export const STATUS_OS_VARIANT: Record<StatusOS, BadgeVariant> = {
  ABERTA: "secondary",
  EM_EXECUCAO: "default",
  AGUARDANDO_PECA: "outline",
  ENCERRADA: "secondary",
  CANCELADA: "destructive",
};

export const PRIORIDADE_OS_LABEL: Record<PrioridadeOS, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

export const PRIORIDADE_OS_VARIANT: Record<PrioridadeOS, BadgeVariant> = {
  BAIXA: "secondary",
  MEDIA: "default",
  ALTA: "outline",
  CRITICA: "destructive",
};

export const TIPO_OS_LABEL: Record<TipoOS, string> = {
  CORRETIVA: "Corretiva",
  PREVENTIVA: "Preventiva",
  INSPECAO: "Inspeção",
  OUTRA: "Outra",
};

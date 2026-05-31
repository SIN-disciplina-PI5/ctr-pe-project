import { OS_ACTION_ROLES, OS_CANCEL_ROLES, type Perfil } from "@/constants/roles";
import type { StatusOS } from "@/types/ordem-servico";

export type OrdemServicoActionKey =
  | "iniciar"
  | "aguardarPeca"
  | "retomar"
  | "encerrar"
  | "cancelar";

export function getOrdemServicoActions(
  status: StatusOS,
  perfil: Perfil,
): OrdemServicoActionKey[] {
  if (status === "ENCERRADA" || status === "CANCELADA") {
    return [];
  }

  const podeAgir = OS_ACTION_ROLES.includes(perfil);
  const podeCancelar = OS_CANCEL_ROLES.includes(perfil);

  const actions: OrdemServicoActionKey[] = [];

  if (podeAgir) {
    if (status === "ABERTA") actions.push("iniciar");
    if (status === "EM_EXECUCAO") actions.push("aguardarPeca");
    if (status === "AGUARDANDO_PECA") actions.push("retomar");
    if (status === "EM_EXECUCAO" || status === "AGUARDANDO_PECA") {
      actions.push("encerrar");
    }
  }

  if (podeCancelar) {
    actions.push("cancelar");
  }

  return actions;
}

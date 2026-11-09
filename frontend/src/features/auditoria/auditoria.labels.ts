import type { TipoAcaoAuditoria } from "./auditoria.types";

export const ACAO_LABELS: Record<TipoAcaoAuditoria, string> = {
  CRIACAO: "Criação",
  ALTERACAO: "Alteração",
  EXCLUSAO: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
  ENCERRAMENTO_OS: "Encerramento de O.S.",
  CANCELAMENTO_OS: "Cancelamento de O.S.",
};

export const ENTIDADE_LABELS: Record<string, string> = {
  empresas: "Empresa",
  localizacoes: "Localização",
  usuarios: "Usuário",
  ativos: "Ativo",
  "ordens-servico": "Ordem de serviço",
  "paradas-ativos": "Parada de ativo",
  materiais: "Material",
  "ordens-servico-materiais": "Material de O.S.",
  "apontamentos-os": "Apontamento de O.S.",
  alertas: "Alerta",
};

export function getActionVariant(
  acao: TipoAcaoAuditoria,
): "default" | "secondary" | "destructive" | "outline" {
  switch (acao) {
    case "EXCLUSAO":
    case "CANCELAMENTO_OS":
      return "destructive";
    case "ALTERACAO":
    case "ENCERRAMENTO_OS":
      return "secondary";
    case "LOGIN":
    case "LOGOUT":
      return "outline";
    default:
      return "default";
  }
}

export type TipoAcaoAuditoria =
  | "CRIACAO"
  | "ALTERACAO"
  | "EXCLUSAO"
  | "LOGIN"
  | "LOGOUT"
  | "ENCERRAMENTO_OS"
  | "CANCELAMENTO_OS";

export type UsuarioAuditoria = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
};

export type LogAuditoria = {
  id: string;
  empresaId: string | null;
  usuarioId: string | null;
  entidade: string;
  entidadeId: string;
  acao: TipoAcaoAuditoria;
  antes: unknown | null;
  depois: unknown | null;
  createdAt: string;
  usuario: UsuarioAuditoria | null;
};
export type PerfilUsuario = "ADMIN" | "GESTOR" | "SUPERVISOR" | "TECNICO" | "CONSULTA";

export type Usuario = {
  id: string;
  empresaId: string | null;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  ultimoLoginEm: string | null;
  createdAt: string;
  updatedAt: string;
};
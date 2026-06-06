export const PERFIS_USUARIO = [
  "ADMIN",
  "GESTOR",
  "SUPERVISOR",
  "TECNICO",
  "CONSULTA",
] as const;

export type PerfilUsuario = (typeof PERFIS_USUARIO)[number];

export type AuthUser = {
  id: string;
  empresaId: string | null;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
};

export function isPerfilUsuario(value: unknown): value is PerfilUsuario {
  return PERFIS_USUARIO.includes(value as PerfilUsuario);
}

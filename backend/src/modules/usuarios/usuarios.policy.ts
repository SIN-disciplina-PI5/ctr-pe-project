import type { AuthUser } from "../../common/types/auth-user.js";

export function canReadUsuario(actor: AuthUser, targetId: string): boolean {
  if (actor.perfil === "ADMIN") return true;
  if (actor.perfil === "GESTOR") return true;
  if (actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && actor.id === targetId) return true;
  if (actor.perfil === "CONSULTA" && actor.id === targetId) return true;
  return false;
}

export function canWriteUsuario(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN";
}
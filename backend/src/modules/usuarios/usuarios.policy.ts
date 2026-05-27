import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

export function canReadUsuario(actor: JwtPayload, targetId: string): boolean {
  if (actor.perfil === "ADMIN") return true;
  if (actor.perfil === "GESTOR") return true;
  if (actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && actor.userId === targetId) return true;
  if (actor.perfil === "CONSULTA" && actor.userId === targetId) return true;
  return false;
}

export function canWriteUsuario(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN";
}
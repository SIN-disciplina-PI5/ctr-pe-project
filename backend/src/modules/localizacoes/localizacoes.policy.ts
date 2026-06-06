import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

export function canReadLocalizacao(_actor: JwtPayload): boolean {
  return true;
}

export function canCreateLocalizacao(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canUpdateLocalizacao(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canDeleteLocalizacao(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}
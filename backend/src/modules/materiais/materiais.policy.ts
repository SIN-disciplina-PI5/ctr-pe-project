import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

export function canReadMaterial(_actor: JwtPayload): boolean {
  return true;
}

export function canCreateMaterial(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canUpdateMaterial(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canDeleteMaterial(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN";
}
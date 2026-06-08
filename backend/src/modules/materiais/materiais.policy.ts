import type { AuthUser } from "../../common/types/auth-user.js";

export function canReadMaterial(_actor: AuthUser): boolean {
  return true;
}

export function canCreateMaterial(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canUpdateMaterial(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canDeleteMaterial(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN";
}
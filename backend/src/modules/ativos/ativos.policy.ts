import type { AuthUser } from "../../common/types/auth-user.js";

export function canReadAtivo(actor: AuthUser): boolean {
  return true; // todos os perfis autenticados podem ler
}

export function canCreateAtivo(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canUpdateAtivo(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canDeleteAtivo(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN";
}
import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

export function canReadAtivo(actor: JwtPayload): boolean {
  return true; // todos os perfis autenticados podem ler
}

export function canCreateAtivo(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canUpdateAtivo(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canDeleteAtivo(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN";
}
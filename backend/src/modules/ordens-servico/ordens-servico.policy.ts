import type { AuthUser } from "../../common/types/auth-user.js";

interface OrdemServico {
  responsavelId: string | null;
}

export function canIniciarOS(actor: AuthUser, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.id) return true;
  return false;
}

export function canAguardarPecaOS(actor: AuthUser, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.id) return true;
  return false;
}

export function canRetomarOS(actor: AuthUser, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.id) return true;
  return false;
}

export function canEncerrarOS(actor: AuthUser, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.id) return true;
  return false;
}

export function canCancelarOS(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}

export function canReadOrdemServico(_actor: AuthUser): boolean {
  return true;
}

export function canCreateOrdemServico(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR" || actor.perfil === "TECNICO";
}

export function canUpdateOrdemServico(actor: AuthUser): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR" || actor.perfil === "TECNICO";
}
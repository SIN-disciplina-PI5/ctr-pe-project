import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

interface OrdemServico {
  responsavelId: string | null;
}

export function canIniciarOS(actor: JwtPayload, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.userId) return true;
  return false;
}

export function canAguardarPecaOS(actor: JwtPayload, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.userId) return true;
  return false;
}

export function canRetomarOS(actor: JwtPayload, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.userId) return true;
  return false;
}

export function canEncerrarOS(actor: JwtPayload, os: OrdemServico): boolean {
  if (actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR") return true;
  if (actor.perfil === "TECNICO" && os.responsavelId === actor.userId) return true;
  return false;
}

export function canCancelarOS(actor: JwtPayload): boolean {
  return actor.perfil === "ADMIN" || actor.perfil === "SUPERVISOR";
}


export function canReadOrdemServico(_actor: JwtPayload): boolean {
  return true;
}

export function canCreateOrdemServico(actor: JwtPayload): boolean {
  return (
    actor.perfil === "ADMIN" ||
    actor.perfil === "SUPERVISOR" ||
    actor.perfil === "TECNICO"
  );
}

export function canUpdateOrdemServico(actor: JwtPayload): boolean {
  return (
    actor.perfil === "ADMIN" ||
    actor.perfil === "SUPERVISOR" ||
    actor.perfil === "TECNICO"
  );
}
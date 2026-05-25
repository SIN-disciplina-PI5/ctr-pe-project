import type { JwtPayload } from "../../common/middlewares/auth.middleware.js";

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
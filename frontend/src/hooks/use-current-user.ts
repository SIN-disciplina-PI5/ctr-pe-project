import { env } from "@/infrastructure/env/env";
import type { Perfil } from "@/constants/roles";

const PERFIS: Perfil[] = ["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"];

function resolvePerfil(): Perfil {
  const value = env.devPerfil as Perfil;
  return PERFIS.includes(value) ? value : "ADMIN";
}

export function useCurrentUser(): { perfil: Perfil } {
  return { perfil: resolvePerfil() };
}

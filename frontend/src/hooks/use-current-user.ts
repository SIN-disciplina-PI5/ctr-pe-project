<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/infrastructure/api/api-client";
import type { Usuario } from "@/features/usuarios/usuarios.types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<Usuario> => {
      const { data } = await apiClient.get("/auth/me");
      return data;
    },
  });
}
=======
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
>>>>>>> origin/main

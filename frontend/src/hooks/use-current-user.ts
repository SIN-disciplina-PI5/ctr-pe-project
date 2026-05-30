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
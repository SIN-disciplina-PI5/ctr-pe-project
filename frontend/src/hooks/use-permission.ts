import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";
import { useCurrentUser } from "./use-current-user";

export function usePermission() {
  const { data: user } = useCurrentUser();

  function can(perfis: PerfilUsuario[]): boolean {
    if (!user) return false;
    return perfis.includes(user.perfil);
  }

  function isAdmin() {
    return user?.perfil === "ADMIN";
  }

  function isAtLeastSupervisor() {
    return can(["ADMIN", "SUPERVISOR"]);
  }

  function isAtLeastGestor() {
    return can(["ADMIN", "GESTOR", "SUPERVISOR"]);
  }

  return { can, isAdmin, isAtLeastSupervisor, isAtLeastGestor, user };
}
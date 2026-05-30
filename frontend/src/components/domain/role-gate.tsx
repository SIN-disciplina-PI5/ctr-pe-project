import type { ReactNode } from "react";
import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";
import { usePermission } from "@/hooks/use-permission";

type RoleGateProps = {
  perfis: PerfilUsuario[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ perfis, children, fallback = null }: RoleGateProps) {
  const { can } = usePermission();

  if (!can(perfis)) return <>{fallback}</>;

  return <>{children}</>;
}
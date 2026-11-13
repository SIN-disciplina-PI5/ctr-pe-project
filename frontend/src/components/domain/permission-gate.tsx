import { Redirect } from "expo-router";
import type { ReactNode } from "react";

import { hasPermission, type AppPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

type PermissionGateProps = {
  permission: AppPermission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const perfil = useAuthStore((state) => state.user?.perfil);

  if (!hasPermission(perfil, permission)) return <>{fallback}</>;

  return <>{children}</>;
}

export function PermissionRoute({
  permission,
  children,
}: Omit<PermissionGateProps, "fallback">) {
  return (
    <PermissionGate permission={permission} fallback={<Redirect href="/403" />}>
      {children}
    </PermissionGate>
  );
}

import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";

const ALL_PROFILES: readonly PerfilUsuario[] = [
  "ADMIN",
  "GESTOR",
  "SUPERVISOR",
  "TECNICO",
  "CONSULTA",
];

export type AppPermission =
  | "dashboardRead"
  | "costsRead"
  | "assistantUse"
  | "maintenanceRead"
  | "auditRead"
  | "companiesRead"
  | "locationsRead"
  | "usersRead"
  | "profileRead"
  | "assetsManage"
  | "assetsDelete"
  | "companiesManage"
  | "locationsManage"
  | "usersManage"
  | "materialsManage"
  | "workOrdersCreate"
  | "workOrdersManage"
  | "stopsManage"
  | "alertsManage";

export const APP_PERMISSIONS: Record<
  AppPermission,
  readonly PerfilUsuario[]
> = {
  dashboardRead: ALL_PROFILES,
  costsRead: ["ADMIN", "GESTOR", "SUPERVISOR"],
  assistantUse: ALL_PROFILES,
  maintenanceRead: ALL_PROFILES,
  auditRead: ["ADMIN", "GESTOR"],
  companiesRead: ALL_PROFILES,
  locationsRead: ALL_PROFILES,
  usersRead: ["ADMIN", "GESTOR", "SUPERVISOR"],
  profileRead: ALL_PROFILES,
  assetsManage: ["ADMIN", "SUPERVISOR"],
  assetsDelete: ["ADMIN"],
  companiesManage: ["ADMIN"],
  locationsManage: ["ADMIN", "SUPERVISOR"],
  usersManage: ["ADMIN"],
  materialsManage: ["ADMIN", "SUPERVISOR"],
  workOrdersCreate: ["ADMIN", "SUPERVISOR"],
  workOrdersManage: ["ADMIN", "SUPERVISOR"],
  stopsManage: ["ADMIN", "SUPERVISOR"],
  alertsManage: ["ADMIN", "GESTOR", "SUPERVISOR"],
};

export function hasPermission(
  perfil: PerfilUsuario | null | undefined,
  permission: AppPermission,
): boolean {
  if (!perfil) return false;

  return APP_PERMISSIONS[permission].some((allowedProfile) => allowedProfile === perfil);
}

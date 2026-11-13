import { hasPermission } from "@/lib/permissions";

describe("permissões da aplicação", () => {
  it("permite que CONSULTA acesse as áreas somente leitura", () => {
    expect(hasPermission("CONSULTA", "dashboardRead")).toBe(true);
    expect(hasPermission("CONSULTA", "assistantUse")).toBe(true);
    expect(hasPermission("CONSULTA", "maintenanceRead")).toBe(true);
    expect(hasPermission("CONSULTA", "companiesRead")).toBe(true);
    expect(hasPermission("CONSULTA", "locationsRead")).toBe(true);
    expect(hasPermission("CONSULTA", "profileRead")).toBe(true);
  });

  it("impede que CONSULTA acesse áreas administrativas", () => {
    expect(hasPermission("CONSULTA", "auditRead")).toBe(false);
    expect(hasPermission("CONSULTA", "usersRead")).toBe(false);
  });

  it("mantém o acesso administrativo existente", () => {
    expect(hasPermission("ADMIN", "auditRead")).toBe(true);
    expect(hasPermission("GESTOR", "auditRead")).toBe(true);
    expect(hasPermission("SUPERVISOR", "usersRead")).toBe(true);
  });

  it("aplica as permissões de escrita de ativos", () => {
    expect(hasPermission("ADMIN", "assetsManage")).toBe(true);
    expect(hasPermission("ADMIN", "assetsDelete")).toBe(true);
    expect(hasPermission("SUPERVISOR", "assetsManage")).toBe(true);
    expect(hasPermission("SUPERVISOR", "assetsDelete")).toBe(false);
    expect(hasPermission("GESTOR", "assetsManage")).toBe(false);
    expect(hasPermission("TECNICO", "assetsManage")).toBe(false);
    expect(hasPermission("CONSULTA", "assetsManage")).toBe(false);
  });

  it("nega acesso quando não existe perfil autenticado", () => {
    expect(hasPermission(null, "dashboardRead")).toBe(false);
    expect(hasPermission(undefined, "dashboardRead")).toBe(false);
  });
});

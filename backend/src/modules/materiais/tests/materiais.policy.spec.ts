import { describe, expect, it } from "@jest/globals";

import {
  canCreateMaterial,
  canDeleteMaterial,
  canReadMaterial,
  canUpdateMaterial,
} from "../materiais.policy.js";
import type { AuthUser } from "../../../common/types/auth-user.js";

const admin: AuthUser = {
  id: "1",
  empresaId: null,
  nome: "Admin",
  email: "admin@teste.com",
  perfil: "ADMIN",
};

const supervisor: AuthUser = {
  id: "2",
  empresaId: "empresa-1",
  nome: "Supervisor",
  email: "supervisor@teste.com",
  perfil: "SUPERVISOR",
};

const consulta: AuthUser = {
  id: "3",
  empresaId: "empresa-1",
  nome: "Consulta",
  email: "consulta@teste.com",
  perfil: "CONSULTA",
};

describe("materiais.policy", () => {
  it("should permitir leitura para qualquer autenticado", () => {
    expect(canReadMaterial(admin)).toBe(true);
    expect(canReadMaterial(consulta)).toBe(true);
  });

  it("should permitir create/update para ADMIN e SUPERVISOR", () => {
    expect(canCreateMaterial(admin)).toBe(true);
    expect(canCreateMaterial(supervisor)).toBe(true);

    expect(canUpdateMaterial(admin)).toBe(true);
    expect(canUpdateMaterial(supervisor)).toBe(true);
  });

  it("should bloquear create/update para CONSULTA", () => {
    expect(canCreateMaterial(consulta)).toBe(false);
    expect(canUpdateMaterial(consulta)).toBe(false);
  });

  it("should permitir delete apenas para ADMIN", () => {
    expect(canDeleteMaterial(admin)).toBe(true);
    expect(canDeleteMaterial(supervisor)).toBe(false);
    expect(canDeleteMaterial(consulta)).toBe(false);
  });
});
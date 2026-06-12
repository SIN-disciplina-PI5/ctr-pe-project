import { describe, expect, it } from "@jest/globals";

import {
  canCreateAtivo,
  canDeleteAtivo,
  canReadAtivo,
  canUpdateAtivo,
} from "../ativos.policy.js";
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

describe("ativos.policy", () => {
  it("should permitir leitura para qualquer autenticado", () => {
    expect(canReadAtivo(admin)).toBe(true);
    expect(canReadAtivo(consulta)).toBe(true);
  });

  it("should permitir create/update para ADMIN e SUPERVISOR", () => {
    expect(canCreateAtivo(admin)).toBe(true);
    expect(canCreateAtivo(supervisor)).toBe(true);

    expect(canUpdateAtivo(admin)).toBe(true);
    expect(canUpdateAtivo(supervisor)).toBe(true);
  });

  it("should bloquear create/update para CONSULTA", () => {
    expect(canCreateAtivo(consulta)).toBe(false);
    expect(canUpdateAtivo(consulta)).toBe(false);
  });

  it("should permitir delete apenas para ADMIN", () => {
    expect(canDeleteAtivo(admin)).toBe(true);
    expect(canDeleteAtivo(supervisor)).toBe(false);
    expect(canDeleteAtivo(consulta)).toBe(false);
  });
});
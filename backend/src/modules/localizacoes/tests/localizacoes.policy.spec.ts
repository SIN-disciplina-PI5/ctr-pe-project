import { describe, expect, it } from "@jest/globals";

import {
  canCreateLocalizacao,
  canDeleteLocalizacao,
  canReadLocalizacao,
  canUpdateLocalizacao,
} from "../localizacoes.policy.js";
import type { AuthUser } from "../../../common/types/auth-user.js";
import { AppError } from "../../../common/errors/AppError.js";

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

describe("localizacoes.policy", () => {
  it("should permitir leitura para qualquer autenticado", () => {
    expect(canReadLocalizacao(admin)).toBe(true);
    expect(canReadLocalizacao(consulta)).toBe(true);
  });

  it("should permitir create/update/delete para ADMIN e SUPERVISOR", () => {
    expect(() => canCreateLocalizacao(admin)).not.toThrow();
    expect(() => canCreateLocalizacao(supervisor)).not.toThrow();

    expect(() => canUpdateLocalizacao(admin)).not.toThrow();
    expect(() => canUpdateLocalizacao(supervisor)).not.toThrow();

    expect(() => canDeleteLocalizacao(admin)).not.toThrow();
    expect(() => canDeleteLocalizacao(supervisor)).not.toThrow();
  });

  it("should bloquear create/update/delete para CONSULTA", () => {
    expect(() => canCreateLocalizacao(consulta)).toThrow(AppError);
    expect(() => canUpdateLocalizacao(consulta)).toThrow(AppError);
    expect(() => canDeleteLocalizacao(consulta)).toThrow(AppError);
  });
});
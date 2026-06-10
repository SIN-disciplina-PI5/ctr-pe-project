import { describe, expect, it } from "@jest/globals";

import {
  canCreateEmpresa,
  canDeleteEmpresa,
  canReadEmpresa,
  canUpdateEmpresa,
} from "../empresas.policy.js";
import type { AuthUser } from "../../../common/types/auth-user.js";
import { AppError } from "../../../common/errors/AppError.js";

const admin: AuthUser = {
  id: "1",
  empresaId: null,
  nome: "Admin",
  email: "admin@teste.com",
  perfil: "ADMIN",
};

const tecnico: AuthUser = {
  id: "2",
  empresaId: "empresa-1",
  nome: "Tecnico",
  email: "tecnico@teste.com",
  perfil: "TECNICO",
};

describe("empresas.policy", () => {
  it("should permitir leitura para qualquer autenticado", () => {
    expect(canReadEmpresa(admin)).toBe(true);
    expect(canReadEmpresa(tecnico)).toBe(true);
  });

  it("should permitir create/update/delete para ADMIN", () => {
    expect(() => canCreateEmpresa(admin)).not.toThrow();
    expect(() => canUpdateEmpresa(admin)).not.toThrow();
    expect(() => canDeleteEmpresa(admin)).not.toThrow();
  });

  it("should bloquear create/update/delete para não ADMIN", () => {
    expect(() => canCreateEmpresa(tecnico)).toThrow(AppError);
    expect(() => canUpdateEmpresa(tecnico)).toThrow(AppError);
    expect(() => canDeleteEmpresa(tecnico)).toThrow(AppError);
  });
});
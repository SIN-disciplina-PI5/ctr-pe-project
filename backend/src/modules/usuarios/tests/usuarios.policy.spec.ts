import { describe, expect, it } from "@jest/globals";

import { canReadUsuario, canWriteUsuario } from "../usuarios.policy.js";
import type { AuthUser } from "../../../common/types/auth-user.js";

const admin: AuthUser = {
  id: "admin-id",
  empresaId: null,
  nome: "Admin",
  email: "admin@teste.com",
  perfil: "ADMIN",
};

const gestor: AuthUser = {
  id: "gestor-id",
  empresaId: "empresa-1",
  nome: "Gestor",
  email: "gestor@teste.com",
  perfil: "GESTOR",
};

const supervisor: AuthUser = {
  id: "supervisor-id",
  empresaId: "empresa-1",
  nome: "Supervisor",
  email: "supervisor@teste.com",
  perfil: "SUPERVISOR",
};

const tecnico: AuthUser = {
  id: "tecnico-id",
  empresaId: "empresa-1",
  nome: "Tecnico",
  email: "tecnico@teste.com",
  perfil: "TECNICO",
};

const consulta: AuthUser = {
  id: "consulta-id",
  empresaId: "empresa-1",
  nome: "Consulta",
  email: "consulta@teste.com",
  perfil: "CONSULTA",
};

describe("usuarios.policy", () => {
  it("should permitir leitura total para ADMIN, GESTOR e SUPERVISOR", () => {
    expect(canReadUsuario(admin, "qualquer-id")).toBe(true);
    expect(canReadUsuario(gestor, "qualquer-id")).toBe(true);
    expect(canReadUsuario(supervisor, "qualquer-id")).toBe(true);
  });

  it("should permitir TECNICO e CONSULTA lerem apenas a si mesmos", () => {
    expect(canReadUsuario(tecnico, "tecnico-id")).toBe(true);
    expect(canReadUsuario(tecnico, "outro-id")).toBe(false);

    expect(canReadUsuario(consulta, "consulta-id")).toBe(true);
    expect(canReadUsuario(consulta, "outro-id")).toBe(false);
  });

  it("should permitir escrita apenas para ADMIN", () => {
    expect(canWriteUsuario(admin)).toBe(true);
    expect(canWriteUsuario(gestor)).toBe(false);
    expect(canWriteUsuario(supervisor)).toBe(false);
    expect(canWriteUsuario(tecnico)).toBe(false);
    expect(canWriteUsuario(consulta)).toBe(false);
  });
});
import { describe, expect, it } from "@jest/globals";

import {
  canAguardarPecaOS,
  canCancelarOS,
  canCreateOrdemServico,
  canEncerrarOS,
  canIniciarOS,
  canReadOrdemServico,
  canRetomarOS,
  canUpdateOrdemServico,
} from "./ordens-servico.policy.js";
import type { AuthUser } from "../../common/types/auth-user.js";

const admin: AuthUser = {
  id: "admin-id",
  empresaId: null,
  nome: "Admin",
  email: "admin@teste.com",
  perfil: "ADMIN",
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

describe("ordens-servico.policy", () => {
  it("should permitir iniciar/aguardar/retomar/encerrar para ADMIN e SUPERVISOR", () => {
    const os = { responsavelId: "qualquer-id" };

    expect(canIniciarOS(admin, os)).toBe(true);
    expect(canAguardarPecaOS(admin, os)).toBe(true);
    expect(canRetomarOS(admin, os)).toBe(true);
    expect(canEncerrarOS(admin, os)).toBe(true);

    expect(canIniciarOS(supervisor, os)).toBe(true);
    expect(canAguardarPecaOS(supervisor, os)).toBe(true);
    expect(canRetomarOS(supervisor, os)).toBe(true);
    expect(canEncerrarOS(supervisor, os)).toBe(true);
  });

  it("should permitir TECNICO apenas quando for o responsável", () => {
    const osDoTecnico = { responsavelId: "tecnico-id" };
    const osDeOutro = { responsavelId: "outro-id" };

    expect(canIniciarOS(tecnico, osDoTecnico)).toBe(true);
    expect(canAguardarPecaOS(tecnico, osDoTecnico)).toBe(true);
    expect(canRetomarOS(tecnico, osDoTecnico)).toBe(true);
    expect(canEncerrarOS(tecnico, osDoTecnico)).toBe(true);

    expect(canIniciarOS(tecnico, osDeOutro)).toBe(false);
    expect(canAguardarPecaOS(tecnico, osDeOutro)).toBe(false);
    expect(canRetomarOS(tecnico, osDeOutro)).toBe(false);
    expect(canEncerrarOS(tecnico, osDeOutro)).toBe(false);
  });

  it("should bloquear CONSULTA nessas ações operacionais", () => {
    const os = { responsavelId: "consulta-id" };

    expect(canIniciarOS(consulta, os)).toBe(false);
    expect(canAguardarPecaOS(consulta, os)).toBe(false);
    expect(canRetomarOS(consulta, os)).toBe(false);
    expect(canEncerrarOS(consulta, os)).toBe(false);
  });

  it("should permitir cancelar apenas para ADMIN e SUPERVISOR", () => {
    expect(canCancelarOS(admin)).toBe(true);
    expect(canCancelarOS(supervisor)).toBe(true);
    expect(canCancelarOS(tecnico)).toBe(false);
    expect(canCancelarOS(consulta)).toBe(false);
  });

  it("should permitir leitura para qualquer autenticado", () => {
    expect(canReadOrdemServico(admin)).toBe(true);
    expect(canReadOrdemServico(consulta)).toBe(true);
  });

  it("should permitir criar e atualizar para ADMIN, SUPERVISOR e TECNICO", () => {
    expect(canCreateOrdemServico(admin)).toBe(true);
    expect(canCreateOrdemServico(supervisor)).toBe(true);
    expect(canCreateOrdemServico(tecnico)).toBe(true);
    expect(canCreateOrdemServico(consulta)).toBe(false);

    expect(canUpdateOrdemServico(admin)).toBe(true);
    expect(canUpdateOrdemServico(supervisor)).toBe(true);
    expect(canUpdateOrdemServico(tecnico)).toBe(true);
    expect(canUpdateOrdemServico(consulta)).toBe(false);
  });
});
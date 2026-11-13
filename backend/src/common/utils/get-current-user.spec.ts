import { describe, expect, it } from "@jest/globals";
import type { Request } from "express";

import {
  getCurrentCompanyUser,
  getCurrentUser,
} from "./get-current-user.js";
import { AppError } from "../errors/AppError.js";

describe("getCurrentUser", () => {
  it("should retornar usuário autenticado", () => {
    const req = {
      user: {
        id: "1",
        empresaId: "empresa-1",
        nome: "João",
        email: "joao@teste.com",
        perfil: "TECNICO",
      },
    } as Request;

    const result = getCurrentUser(req);

    expect(result).toEqual(req.user);
  });

  it("should lançar erro quando não houver usuário", () => {
    const req = {} as Request;

    expect(() => getCurrentUser(req)).toThrow(AppError);
  });

  it("should retornar usuário vinculado a uma empresa", () => {
    const req = {
      user: {
        id: "1",
        empresaId: "empresa-1",
        nome: "João",
        email: "joao@teste.com",
        perfil: "TECNICO",
      },
    } as Request;

    expect(getCurrentCompanyUser(req).empresaId).toBe("empresa-1");
  });

  it("should lançar erro quando usuário não estiver vinculado a uma empresa", () => {
    const req = {
      user: {
        id: "1",
        empresaId: null,
        nome: "João",
        email: "joao@teste.com",
        perfil: "TECNICO",
      },
    } as Request;

    expect(() => getCurrentCompanyUser(req)).toThrow(AppError);
  });
});

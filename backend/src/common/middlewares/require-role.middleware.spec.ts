import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { requireRole } from "./require-role.middleware.js";
import { AppError } from "../errors/AppError.js";

describe("requireRole", () => {
  it("should seguir quando usuário tiver perfil permitido", () => {
    const middleware = requireRole(["ADMIN", "SUPERVISOR"]);
    const req = {
      user: {
        id: "1",
        empresaId: null,
        nome: "Admin",
        email: "admin@teste.com",
        perfil: "ADMIN",
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should chamar next com 401 quando não houver usuário", () => {
    const middleware = requireRole(["ADMIN"]);
    const req = {} as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should chamar next com 403 quando perfil não for permitido", () => {
    const middleware = requireRole(["ADMIN"]);
    const req = {
      user: {
        id: "2",
        empresaId: "empresa-1",
        nome: "Consulta",
        email: "consulta@teste.com",
        perfil: "CONSULTA",
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
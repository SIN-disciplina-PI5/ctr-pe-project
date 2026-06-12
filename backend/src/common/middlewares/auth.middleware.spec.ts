import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authMiddleware } from "./auth.middleware.js";
import { AppError } from "../errors/AppError.js";

describe("authMiddleware", () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
    jest.restoreAllMocks();
  });

  it("should chamar next com 401 quando header não existir", () => {
    const req = {
      headers: {},
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should chamar next com 500 quando JWT_SECRET não estiver configurado", () => {
    delete process.env.JWT_SECRET;

    const req = {
      headers: {
        authorization: "Bearer token-valido",
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should chamar next com 401 quando token for inválido", () => {
    process.env.JWT_SECRET = "segredo-teste";

    const req = {
      headers: {
        authorization: "Bearer token-invalido",
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should chamar next com 401 quando payload for string", () => {
    process.env.JWT_SECRET = "segredo-teste";
    const token = jwt.sign("payload-string", "segredo-teste");

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should chamar next com 401 quando payload estiver sem claims obrigatórias", () => {
    process.env.JWT_SECRET = "segredo-teste";
    const token = jwt.sign(
      {
        id: "user-1",
        email: "joao@teste.com",
        perfil: "TECNICO",
      },
      "segredo-teste",
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should autenticar usuário com claim id", () => {
    process.env.JWT_SECRET = "segredo-teste";
    const token = jwt.sign(
      {
        id: "user-1",
        empresaId: "empresa-1",
        nome: "João",
        email: "joao@teste.com",
        perfil: "TECNICO",
      },
      "segredo-teste",
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      id: "user-1",
      empresaId: "empresa-1",
      nome: "João",
      email: "joao@teste.com",
      perfil: "TECNICO",
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("should autenticar usuário usando sub quando id não vier no payload", () => {
    process.env.JWT_SECRET = "segredo-teste";
    const token = jwt.sign(
      {
        nome: "Maria",
        email: "maria@teste.com",
        perfil: "SUPERVISOR",
        empresaId: null,
      },
      "segredo-teste",
      { subject: "user-2" },
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      id: "user-2",
      empresaId: null,
      nome: "Maria",
      email: "maria@teste.com",
      perfil: "SUPERVISOR",
    });
    expect(next).toHaveBeenCalledWith();
  });
});
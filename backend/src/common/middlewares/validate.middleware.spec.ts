import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { validate } from "./validate.middleware.js";
import { AppError } from "../errors/AppError.js";

describe("validate", () => {
  it("should validar body e sobrescrever req.body com o resultado parseado", () => {
    const middleware = validate(
      z.object({
        nome: z.string().trim(),
      }),
    );

    const req = {
      body: {
        nome: "  João  ",
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(req.body).toEqual({ nome: "João" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should validar query sem sobrescrever req.body", () => {
    const middleware = validate(
      z.object({
        page: z.string(),
      }),
      "query",
    );

    const req = {
      body: { nome: "João" },
      query: { page: "1" },
    } as unknown as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(req.body).toEqual({ nome: "João" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should chamar next com AppError quando Zod falhar", () => {
    const middleware = validate(
      z.object({
        nome: z.string().min(3),
      }),
    );

    const req = {
      body: {
        nome: "ab",
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should repassar erro não-Zod", () => {
    const schema = {
      parse() {
        throw new Error("falha genérica");
      },
    } as unknown as z.ZodType;

    const middleware = validate(schema);

    const req = {
      body: {},
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { findAll, findById } from "./auditoria.controller.js";
import { AuditoriaService } from "./auditoria.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  return res;
}

describe("auditoria.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar auditoria com filtros convertidos", async () => {
    jest.spyOn(AuditoriaService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const req = {
      query: {
        empresaId: "empresa-1",
        usuarioId: "user-1",
        entidade: "ativos",
        entidadeId: "ativo-1",
        acao: "CRIACAO",
        limit: "10",
      },
    } as unknown as Request;

    await findAll(req, res, next);

    expect(AuditoriaService.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      usuarioId: "user-1",
      entidade: "ativos",
      entidadeId: "ativo-1",
      acao: "CRIACAO",
      limit: 10,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should retornar log por id", async () => {
    jest.spyOn(AuditoriaService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(AuditoriaService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chamar next quando findAll falhar", async () => {
    const error = new Error("falha");
    jest.spyOn(AuditoriaService.prototype, "findAll").mockRejectedValue(error);

    const req = {
      query: {},
    } as unknown as Request;

    await findAll(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  create,
  findAll,
  findById,
  remove,
  update,
  updateStatus,
} from "./ativos.controller.js";
import { AtivosService } from "./ativos.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  res.send = jest.fn<typeof res.send>().mockReturnValue(res);
  return res;
}

describe("ativos.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar ativos com filtros", async () => {
    jest.spyOn(AtivosService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const req = {
      query: {
        empresaId: "empresa-1",
        localizacaoId: "loc-1",
        status: "PARADO",
        tipo: "MAQUINA",
        criticidade: "ALTA",
        search: "motor",
      },
    } as unknown as Request;

    await findAll(req, res, next);

    expect(AtivosService.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      localizacaoId: "loc-1",
      status: "PARADO",
      tipo: "MAQUINA",
      criticidade: "ALTA",
      search: "motor",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
  });

  it("should retornar ativo por id", async () => {
    jest.spyOn(AtivosService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(AtivosService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should criar ativo", async () => {
    jest.spyOn(AtivosService.prototype, "create").mockResolvedValue({ id: "1" } as never);

    const req = {
      body: {
        empresaId: "empresa-1",
        codigo: "AT-1",
      },
    } as Request;

    await create(req, res, next);

    expect(AtivosService.prototype.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should atualizar ativo", async () => {
    jest.spyOn(AtivosService.prototype, "update").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { nome: "Motor Atualizado" },
    } as unknown as Request;

    await update(req, res, next);

    expect(AtivosService.prototype.update).toHaveBeenCalledWith("1", {
      nome: "Motor Atualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should atualizar status do ativo", async () => {
    jest.spyOn(AtivosService.prototype, "updateStatus").mockResolvedValue({
      id: "1",
      status: "PARADO",
    } as never);

    const req = {
      params: { id: "1" },
      body: { status: "PARADO" },
    } as unknown as Request;

    await updateStatus(req, res, next);

    expect(AtivosService.prototype.updateStatus).toHaveBeenCalledWith("1", "PARADO");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should remover ativo", async () => {
    jest.spyOn(AtivosService.prototype, "delete").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await remove(req, res, next);

    expect(AtivosService.prototype.delete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should chamar next quando create falhar", async () => {
    const error = new Error("falha");
    jest.spyOn(AtivosService.prototype, "create").mockRejectedValue(error);

    const req = {
      body: {
        empresaId: "empresa-1",
      },
    } as Request;

    await create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
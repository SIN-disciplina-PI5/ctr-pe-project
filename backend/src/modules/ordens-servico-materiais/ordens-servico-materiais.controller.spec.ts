import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  cancelar,
  consumir,
  create,
  devolver,
  findById,
  findByOrdemServico,
  update,
} from "./ordens-servico-materiais.controller.js";
import { OrdensServicoMateriaisService } from "./ordens-servico-materiais.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  return res;
}

describe("ordens-servico-materiais.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar por ordem de serviço", async () => {
    jest
      .spyOn(OrdensServicoMateriaisService.prototype, "findByOrdemServico")
      .mockResolvedValue([{ id: "1" }] as never);

    const req = {
      params: { ordemServicoId: "os-1" },
    } as unknown as Request;

    await findByOrdemServico(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.findByOrdemServico).toHaveBeenCalledWith("os-1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should retornar por id", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should criar item", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "create").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { ordemServicoId: "os-1" },
      body: { materialId: "mat-1", quantidade: 2 },
    } as unknown as Request;

    await create(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.create).toHaveBeenCalledWith("os-1", {
      materialId: "mat-1",
      quantidade: 2,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should atualizar item", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "update").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { quantidade: 3 },
    } as unknown as Request;

    await update(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.update).toHaveBeenCalledWith("1", {
      quantidade: 3,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should consumir item", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "consumir").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { quantidade: 2 },
    } as unknown as Request;

    await consumir(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.consumir).toHaveBeenCalledWith("1", 2);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should devolver item", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "devolver").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { quantidade: 1 },
    } as unknown as Request;

    await devolver(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.devolver).toHaveBeenCalledWith("1", 1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should cancelar item", async () => {
    jest.spyOn(OrdensServicoMateriaisService.prototype, "cancelar").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await cancelar(req, res, next);

    expect(OrdensServicoMateriaisService.prototype.cancelar).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
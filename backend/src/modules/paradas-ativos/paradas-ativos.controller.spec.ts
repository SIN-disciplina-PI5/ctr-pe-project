import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  cancelar,
  create,
  encerrar,
  findAll,
  findById,
  update,
} from "./paradas-ativos.controller.js";
import { ParadasAtivosService } from "./paradas-ativos.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  return res;
}

describe("paradas-ativos.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar com filtros", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const req = {
      query: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        status: "ABERTA",
        from: "2026-06-01",
        to: "2026-06-02",
      },
    } as unknown as Request;

    await findAll(req, res, next);

    expect(ParadasAtivosService.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      status: "ABERTA",
      from: "2026-06-01",
      to: "2026-06-02",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should retornar parada por id", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(ParadasAtivosService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should criar parada", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "create").mockResolvedValue({ id: "1" } as never);

    const req = {
      body: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      },
    } as Request;

    await create(req, res, next);

    expect(ParadasAtivosService.prototype.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should atualizar parada", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "update").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { motivo: "Novo motivo" },
    } as unknown as Request;

    await update(req, res, next);

    expect(ParadasAtivosService.prototype.update).toHaveBeenCalledWith("1", {
      motivo: "Novo motivo",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should encerrar parada", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "encerrar").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { fimEm: "2026-06-10T11:00:00.000Z" },
    } as unknown as Request;

    await encerrar(req, res, next);

    expect(ParadasAtivosService.prototype.encerrar).toHaveBeenCalledWith(
      "1",
      "2026-06-10T11:00:00.000Z",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should cancelar parada", async () => {
    jest.spyOn(ParadasAtivosService.prototype, "cancelar").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { motivo: "Cancelada" },
    } as unknown as Request;

    await cancelar(req, res, next);

    expect(ParadasAtivosService.prototype.cancelar).toHaveBeenCalledWith("1", "Cancelada");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chamar next quando create falhar", async () => {
    const error = new Error("falha");
    jest.spyOn(ParadasAtivosService.prototype, "create").mockRejectedValue(error);

    const req = {
      body: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      },
    } as Request;

    await create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
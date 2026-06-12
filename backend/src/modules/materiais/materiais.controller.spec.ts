import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  create,
  findAll,
  findById,
  remove,
  update,
  updateEstoque,
} from "./materiais.controller.js";
import { MateriaisService } from "./materiais.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  res.send = jest.fn<typeof res.send>().mockReturnValue(res);
  return res;
}

describe("materiais.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar materiais com filtros convertidos", async () => {
    jest.spyOn(MateriaisService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const req = {
      query: {
        empresaId: "empresa-1",
        search: "rolamento",
        ativo: "true",
        estoqueBaixo: "false",
      },
    } as unknown as Request;

    await findAll(req, res, next);

    expect(MateriaisService.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      search: "rolamento",
      ativo: true,
      estoqueBaixo: false,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
  });

  it("should retornar material por id", async () => {
    jest.spyOn(MateriaisService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(MateriaisService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should criar material", async () => {
    jest.spyOn(MateriaisService.prototype, "create").mockResolvedValue({ id: "1" } as never);

    const req = {
      body: {
        empresaId: "empresa-1",
        codigo: "MAT-1",
      },
    } as Request;

    await create(req, res, next);

    expect(MateriaisService.prototype.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should atualizar material", async () => {
    jest.spyOn(MateriaisService.prototype, "update").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { nome: "Material Atualizado" },
    } as unknown as Request;

    await update(req, res, next);

    expect(MateriaisService.prototype.update).toHaveBeenCalledWith("1", {
      nome: "Material Atualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should atualizar estoque", async () => {
    jest.spyOn(MateriaisService.prototype, "updateEstoque").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { operacao: "ENTRADA", quantidade: 5 },
    } as unknown as Request;

    await updateEstoque(req, res, next);

    expect(MateriaisService.prototype.updateEstoque).toHaveBeenCalledWith("1", {
      operacao: "ENTRADA",
      quantidade: 5,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should remover material", async () => {
    jest.spyOn(MateriaisService.prototype, "delete").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await remove(req, res, next);

    expect(MateriaisService.prototype.delete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should chamar next quando create falhar", async () => {
    const error = new Error("falha");
    jest.spyOn(MateriaisService.prototype, "create").mockRejectedValue(error);

    const req = {
      body: {
        empresaId: "empresa-1",
      },
    } as Request;

    await create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
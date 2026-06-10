import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  getAtivos,
  getCustos,
  getMateriais,
  getOrdensServico,
  getResumo,
} from "./dashboard.controller.js";
import { DashboardService } from "./dashboard.service.js";

function makeResponse() {
  const res = {} as Response;

  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);

  return res;
}

describe("dashboard.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should getResumo usando empresaId do usuário", async () => {
    jest.spyOn(DashboardService.prototype, "getResumo").mockResolvedValue({
      indicadores: { osAbertas: 1 },
    } as never);

    const req = {
      user: { empresaId: "empresa-user" },
      query: {},
    } as Request;

    await getResumo(req, res, next);

    expect(DashboardService.prototype.getResumo).toHaveBeenCalledWith("empresa-user");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ indicadores: { osAbertas: 1 } });
  });

  it("should getResumo usando empresaId da query quando usuário não tiver empresa", async () => {
    jest.spyOn(DashboardService.prototype, "getResumo").mockResolvedValue({
      indicadores: { osAbertas: 2 },
    } as never);

    const req = {
      user: { empresaId: null },
      query: { empresaId: "empresa-query" },
    } as unknown as Request;

    await getResumo(req, res, next);

    expect(DashboardService.prototype.getResumo).toHaveBeenCalledWith("empresa-query");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should encaminhar erro de getResumo para next", async () => {
    const error = new Error("falha");
    jest.spyOn(DashboardService.prototype, "getResumo").mockRejectedValue(error);

    const req = {
      user: { empresaId: "empresa-1" },
      query: {},
    } as Request;

    await getResumo(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should getAtivos", async () => {
    jest.spyOn(DashboardService.prototype, "getAtivos").mockResolvedValue({
      ativosPorStatus: [],
      ativosPorCriticidade: [],
    });

    const req = {
      user: { empresaId: "empresa-1" },
      query: {},
    } as Request;

    await getAtivos(req, res, next);

    expect(DashboardService.prototype.getAtivos).toHaveBeenCalledWith("empresa-1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should getOrdensServico", async () => {
    jest.spyOn(DashboardService.prototype, "getOrdensServico").mockResolvedValue({
      osPorTipo: [],
      osPorPrioridade: [],
    });

    const req = {
      user: { empresaId: "empresa-1" },
      query: {},
    } as Request;

    await getOrdensServico(req, res, next);

    expect(DashboardService.prototype.getOrdensServico).toHaveBeenCalledWith("empresa-1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should getMateriais", async () => {
    jest.spyOn(DashboardService.prototype, "getMateriais").mockResolvedValue({
      materiaisCriticos: [],
    });

    const req = {
      user: { empresaId: "empresa-1" },
      query: {},
    } as Request;

    await getMateriais(req, res, next);

    expect(DashboardService.prototype.getMateriais).toHaveBeenCalledWith("empresa-1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should getCustos", async () => {
    jest.spyOn(DashboardService.prototype, "getCustos").mockResolvedValue({
      custoMateriais: 10,
      custoMaoObra: 20,
      custoTotal: 30,
    });

    const req = {
      user: { empresaId: "empresa-1" },
      query: {},
    } as Request;

    await getCustos(req, res, next);

    expect(DashboardService.prototype.getCustos).toHaveBeenCalledWith("empresa-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      custoMateriais: 10,
      custoMaoObra: 20,
      custoTotal: 30,
    });
  });
});
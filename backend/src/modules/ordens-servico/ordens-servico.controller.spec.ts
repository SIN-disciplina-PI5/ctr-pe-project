import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
  aguardarPeca,
  cancelar,
  create,
  encerrar,
  findAll,
  findById,
  iniciar,
  retomar,
  update,
} from "./ordens-servico.controller.js";
import { OrdensServicoService } from "./ordens-servico.service.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  return res;
}

describe("ordens-servico.controller", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    next = jest.fn();
  });

  it("should listar O.S. com filtros", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const req = {
      query: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        responsavelId: "user-1",
        status: "ABERTA",
        prioridade: "ALTA",
        search: "motor",
      },
    } as unknown as Request;

    await findAll(req, res, next);

    expect(OrdensServicoService.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      responsavelId: "user-1",
      status: "ABERTA",
      prioridade: "ALTA",
      search: "motor",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should retornar O.S. por id", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
    } as unknown as Request;

    await findById(req, res, next);

    expect(OrdensServicoService.prototype.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should criar O.S.", async () => {
    jest.spyOn(OrdensServicoService.prototype, "create").mockResolvedValue({ id: "1" } as never);

    const req = {
      body: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        titulo: "Teste",
      },
    } as Request;

    await create(req, res, next);

    expect(OrdensServicoService.prototype.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should atualizar O.S.", async () => {
    jest.spyOn(OrdensServicoService.prototype, "update").mockResolvedValue({ id: "1" } as never);

    const req = {
      params: { id: "1" },
      body: { titulo: "Atualizada" },
    } as unknown as Request;

    await update(req, res, next);

    expect(OrdensServicoService.prototype.update).toHaveBeenCalledWith("1", {
      titulo: "Atualizada",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should iniciar O.S. com permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "tecnico-1",
    } as never);
    jest.spyOn(OrdensServicoService.prototype, "iniciar").mockResolvedValue({ id: "1" } as never);

    const req = {
      user: {
        id: "tecnico-1",
        empresaId: "empresa-1",
        nome: "Tecnico",
        email: "tecnico@teste.com",
        perfil: "TECNICO",
      },
      params: { id: "1" },
      body: { iniciadaEm: "2026-06-11T10:00:00.000Z" },
    } as unknown as Request;

    await iniciar(req, res, next);

    expect(OrdensServicoService.prototype.iniciar).toHaveBeenCalledWith(
      "1",
      "2026-06-11T10:00:00.000Z",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should bloquear iniciar O.S. sem permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "outro-user",
    } as never);
    const iniciarSpy = jest.spyOn(OrdensServicoService.prototype, "iniciar");

    const req = {
      user: {
        id: "tecnico-1",
        empresaId: "empresa-1",
        nome: "Tecnico",
        email: "tecnico@teste.com",
        perfil: "TECNICO",
      },
      params: { id: "1" },
      body: {},
    } as unknown as Request;

    await iniciar(req, res, next);

    expect(iniciarSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should aguardar peça com permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "supervisor-1",
    } as never);
    jest.spyOn(OrdensServicoService.prototype, "aguardarPeca").mockResolvedValue({ id: "1" } as never);

    const req = {
      user: {
        id: "supervisor-1",
        empresaId: "empresa-1",
        nome: "Supervisor",
        email: "supervisor@teste.com",
        perfil: "SUPERVISOR",
      },
      params: { id: "1" },
      body: { observacao: "Aguardando item" },
    } as unknown as Request;

    await aguardarPeca(req, res, next);

    expect(OrdensServicoService.prototype.aguardarPeca).toHaveBeenCalledWith(
      "1",
      "Aguardando item",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should bloquear aguardar peça sem permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "outro-user",
    } as never);
    const spy = jest.spyOn(OrdensServicoService.prototype, "aguardarPeca");

    const req = {
      user: {
        id: "consulta-1",
        empresaId: "empresa-1",
        nome: "Consulta",
        email: "consulta@teste.com",
        perfil: "CONSULTA",
      },
      params: { id: "1" },
      body: {},
    } as unknown as Request;

    await aguardarPeca(req, res, next);

    expect(spy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should retomar com permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "tecnico-1",
    } as never);
    jest.spyOn(OrdensServicoService.prototype, "retomar").mockResolvedValue({ id: "1" } as never);

    const req = {
      user: {
        id: "tecnico-1",
        empresaId: "empresa-1",
        nome: "Tecnico",
        email: "tecnico@teste.com",
        perfil: "TECNICO",
      },
      params: { id: "1" },
      body: { observacao: "Peça chegou" },
    } as unknown as Request;

    await retomar(req, res, next);

    expect(OrdensServicoService.prototype.retomar).toHaveBeenCalledWith("1", "Peça chegou");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should encerrar com permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "tecnico-1",
    } as never);
    jest.spyOn(OrdensServicoService.prototype, "encerrar").mockResolvedValue({ id: "1" } as never);

    const req = {
      user: {
        id: "tecnico-1",
        empresaId: "empresa-1",
        nome: "Tecnico",
        email: "tecnico@teste.com",
        perfil: "TECNICO",
      },
      params: { id: "1" },
      body: {
        diagnostico: "Falha elétrica",
        solucao: "Troca de cabo",
        observacao: "OK",
        encerradaEm: "2026-06-11T11:00:00.000Z",
      },
    } as unknown as Request;

    await encerrar(req, res, next);

    expect(OrdensServicoService.prototype.encerrar).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        diagnostico: "Falha elétrica",
        solucao: "Troca de cabo",
        observacao: "OK",
        encerradaEm: "2026-06-11T11:00:00.000Z",
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should bloquear encerrar sem permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "findById").mockResolvedValue({
      id: "1",
      responsavelId: "outro-user",
    } as never);
    const spy = jest.spyOn(OrdensServicoService.prototype, "encerrar");

    const req = {
      user: {
        id: "consulta-1",
        empresaId: "empresa-1",
        nome: "Consulta",
        email: "consulta@teste.com",
        perfil: "CONSULTA",
      },
      params: { id: "1" },
      body: {},
    } as unknown as Request;

    await encerrar(req, res, next);

    expect(spy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should cancelar com permissão", async () => {
    jest.spyOn(OrdensServicoService.prototype, "cancelar").mockResolvedValue({ id: "1" } as never);

    const req = {
      user: {
        id: "admin-1",
        empresaId: null,
        nome: "Admin",
        email: "admin@teste.com",
        perfil: "ADMIN",
      },
      params: { id: "1" },
      body: {
        motivo: "Erro de abertura",
        canceladaEm: "2026-06-11T12:00:00.000Z",
      },
    } as unknown as Request;

    await cancelar(req, res, next);

    expect(OrdensServicoService.prototype.cancelar).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        motivo: "Erro de abertura",
        canceladaEm: "2026-06-11T12:00:00.000Z",
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should bloquear cancelar sem permissão", async () => {
    const spy = jest.spyOn(OrdensServicoService.prototype, "cancelar");

    const req = {
      user: {
        id: "tecnico-1",
        empresaId: "empresa-1",
        nome: "Tecnico",
        email: "tecnico@teste.com",
        perfil: "TECNICO",
      },
      params: { id: "1" },
      body: {},
    } as unknown as Request;

    await cancelar(req, res, next);

    expect(spy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
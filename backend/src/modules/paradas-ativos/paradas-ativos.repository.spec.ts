import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { ParadasAtivosRepository } from "./paradas-ativos.repository.js";
import { prisma } from "../../prisma/prisma.client.js";

describe("ParadasAtivosRepository", () => {
  let repository: ParadasAtivosRepository;

  beforeEach(() => {
    repository = new ParadasAtivosRepository();
    jest.restoreAllMocks();
  });

  it("should listar com filtros completos", async () => {
    const from = new Date("2026-06-01T00:00:00.000Z");
    const to = new Date("2026-06-30T23:59:59.999Z");
    const spy = jest.spyOn(prisma.paradaAtivo, "findMany").mockResolvedValue([{ id: "1" }] as never);

    const result = await repository.findAll({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      status: "ABERTA",
      from,
      to,
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        status: "ABERTA",
        inicioEm: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { inicioEm: "desc" },
      select: {
        id: true,
        empresaId: true,
        ativoId: true,
        ordemServicoId: true,
        status: true,
        inicioEm: true,
        fimEm: true,
        duracaoMinutos: true,
        motivo: true,
        programada: true,
        impactaDisponibilidade: true,
        createdAt: true,
        ativo: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            status: true,
          },
        },
      },
    });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should buscar por id", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findById("1");

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({ id: "1" });
  });

  it("should buscar parada aberta por ativo", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "findFirst").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findParadaAbertaByAtivo("ativo-1");

    expect(spy).toHaveBeenCalledWith({
      where: { ativoId: "ativo-1", status: "ABERTA" },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should criar parada", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "create").mockResolvedValue({ id: "1" } as never);

    const result = await repository.create({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      ordemServicoId: "os-1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      motivo: "Falha",
      programada: false,
      impactaDisponibilidade: true,
    });

    expect(spy).toHaveBeenCalledWith({
      data: {
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        ordemServicoId: "os-1",
        inicioEm: new Date("2026-06-11T10:00:00.000Z"),
        motivo: "Falha",
        programada: false,
        impactaDisponibilidade: true,
      },
      select: expect.any(Object),
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar parada", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.update("1", {
      motivo: "Atualizado",
      programada: true,
    });

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        motivo: "Atualizado",
        programada: true,
      },
      select: expect.any(Object),
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should encerrar parada calculando duração", async () => {
    jest.spyOn(prisma.paradaAtivo, "findUniqueOrThrow").mockResolvedValue({
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
    } as never);
    const spy = jest.spyOn(prisma.paradaAtivo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.encerrar("1", new Date("2026-06-11T11:00:00.000Z"));

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        status: "ENCERRADA",
        fimEm: new Date("2026-06-11T11:00:00.000Z"),
        duracaoMinutos: 60,
      },
      select: expect.any(Object),
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should cancelar parada com motivo", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.cancelar("1", "Cancelada");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        status: "CANCELADA",
        motivo: "Cancelada",
      },
      select: expect.any(Object),
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should buscar ativo por id", async () => {
    const spy = jest.spyOn(prisma.ativo, "findUnique").mockResolvedValue({ id: "ativo-1" } as never);

    const result = await repository.findAtivoById("ativo-1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "ativo-1" },
      select: {
        id: true,
        empresaId: true,
        ativo: true,
      },
    });
    expect(result).toEqual({ id: "ativo-1" });
  });

  it("should buscar O.S. por id", async () => {
    const spy = jest.spyOn(prisma.ordemServico, "findUnique").mockResolvedValue({ id: "os-1" } as never);

    const result = await repository.findOrdemServicoById("os-1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "os-1" },
      select: {
        id: true,
        empresaId: true,
        ativoId: true,
      },
    });
    expect(result).toEqual({ id: "os-1" });
  });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AtivosRepository } from "./ativos.repository.js";
import { prisma } from "../../prisma/prisma.client.js";

describe("AtivosRepository", () => {
  let repository: AtivosRepository;

  beforeEach(() => {
    repository = new AtivosRepository();
    jest.restoreAllMocks();
  });

  it("should listar ativos com filtros", async () => {
    const spy = jest.spyOn(prisma.ativo, "findMany").mockResolvedValue([{ id: "1" }] as never);

    const result = await repository.findAll({
      empresaId: "empresa-1",
      localizacaoId: "loc-1",
      status: "PARADO",
      tipo: "MAQUINA",
      criticidade: "ALTA",
      search: "motor",
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        localizacaoId: "loc-1",
        status: "PARADO",
        tipo: "MAQUINA",
        criticidade: "ALTA",
        OR: [
          { nome: { contains: "motor", mode: "insensitive" } },
          { codigo: { contains: "motor", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should buscar por id", async () => {
    const spy = jest.spyOn(prisma.ativo, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findById("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should buscar por código composto", async () => {
    const spy = jest.spyOn(prisma.ativo, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findByCodigo("empresa-1", "AT-1");

    expect(spy).toHaveBeenCalledWith({
      where: { empresaId_codigo: { empresaId: "empresa-1", codigo: "AT-1" } },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should criar ativo", async () => {
    const spy = jest.spyOn(prisma.ativo, "create").mockResolvedValue({ id: "1" } as never);

    const result = await repository.create({
      empresaId: "empresa-1",
      localizacaoId: "loc-1",
      codigo: "AT-1",
      nome: "Motor",
      descricao: "Teste",
      tipo: "MAQUINA",
      status: "PARADO",
      criticidade: "ALTA",
      marca: "WEG",
      modelo: "X1",
      numeroSerie: "123",
      placa: "ABC1234",
      horimetroAtual: 10,
      odometroAtual: 20,
      ativo: true,
    });

    expect(spy).toHaveBeenCalledWith({
      data: {
        empresaId: "empresa-1",
        codigo: "AT-1",
        nome: "Motor",
        tipo: "MAQUINA",
        localizacaoId: "loc-1",
        descricao: "Teste",
        status: "PARADO",
        criticidade: "ALTA",
        marca: "WEG",
        modelo: "X1",
        numeroSerie: "123",
        placa: "ABC1234",
        horimetroAtual: 10,
        odometroAtual: 20,
        ativo: true,
      },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar ativo", async () => {
    const spy = jest.spyOn(prisma.ativo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.update("1", {
      nome: "Motor Atualizado",
      ativo: false,
    });

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        nome: "Motor Atualizado",
        ativo: false,
      },
      select: {
        id: true,
        empresaId: true,
        localizacaoId: true,
        codigo: true,
        nome: true,
        descricao: true,
        tipo: true,
        status: true,
        criticidade: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        placa: true,
        horimetroAtual: true,
        odometroAtual: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar status", async () => {
    const spy = jest.spyOn(prisma.ativo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.updateStatus("1", "PARADO");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: "PARADO" },
      select: { id: true, status: true },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should inativar ativo", async () => {
    const spy = jest.spyOn(prisma.ativo, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.delete("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { ativo: false },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });
});
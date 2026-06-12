import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { DashboardRepository } from "./dashboard.repository.js";
import { prisma } from "../../prisma/prisma.client.js";

describe("DashboardRepository", () => {
  let repository: DashboardRepository;

  beforeEach(() => {
    repository = new DashboardRepository();
    jest.restoreAllMocks();
  });

  it("should contar O.S. abertas", async () => {
    const spy = jest.spyOn(prisma.ordemServico, "count").mockResolvedValue(5 as never);

    const result = await repository.countOsAbertas("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      where: { empresaId: "empresa-1", status: "ABERTA" },
    });
    expect(result).toBe(5);
  });

  it("should contar O.S. aguardando peça", async () => {
    const spy = jest.spyOn(prisma.ordemServico, "count").mockResolvedValue(3 as never);

    const result = await repository.countOsAguardandoPeca("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      where: { empresaId: "empresa-1", status: "AGUARDANDO_PECA" },
    });
    expect(result).toBe(3);
  });

  it("should contar O.S. atrasadas", async () => {
    const agora = new Date("2026-06-11T12:00:00.000Z");
    const spy = jest.spyOn(prisma.ordemServico, "count").mockResolvedValue(2 as never);

    const result = await repository.countOsAtrasadas("empresa-1", agora);

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        status: { notIn: ["ENCERRADA", "CANCELADA"] },
        prazoEm: { lt: agora },
      },
    });
    expect(result).toBe(2);
  });

  it("should contar máquinas paradas", async () => {
    const spy = jest.spyOn(prisma.ativo, "count").mockResolvedValue(4 as never);

    const result = await repository.countMaquinasParadas("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      where: { empresaId: "empresa-1", status: "PARADO" },
    });
    expect(result).toBe(4);
  });

  it("should agregar custos", async () => {
    const spy = jest.spyOn(prisma.ordemServico, "aggregate").mockResolvedValue({
      _sum: {
        custoMateriais: 100,
        custoMaoObra: 50,
        custoTotal: 150,
      },
    } as never);

    const result = await repository.aggregateCustos("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      _sum: {
        custoMateriais: true,
        custoMaoObra: true,
        custoTotal: true,
      },
      where: { empresaId: "empresa-1" },
    });
    expect(result).toEqual({
      custoMateriais: 100,
      custoMaoObra: 50,
      custoTotal: 150,
    });
  });

  it("should agregar custos zerando nulos", async () => {
    jest.spyOn(prisma.ordemServico, "aggregate").mockResolvedValue({
      _sum: {
        custoMateriais: null,
        custoMaoObra: null,
        custoTotal: null,
      },
    } as never);

    const result = await repository.aggregateCustos("empresa-1");

    expect(result).toEqual({
      custoMateriais: 0,
      custoMaoObra: 0,
      custoTotal: 0,
    });
  });

  it("should agregar tempo parado", async () => {
    const spy = jest.spyOn(prisma.paradaAtivo, "aggregate").mockResolvedValue({
      _avg: {
        duracaoMinutos: 42.4,
      },
    } as never);

    const result = await repository.aggregateTempoParado("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      _avg: {
        duracaoMinutos: true,
      },
      where: { empresaId: "empresa-1", status: "ENCERRADA" },
    });
    expect(result).toBe(42);
  });

  it("should agregar tempo parado zerando nulo", async () => {
    jest.spyOn(prisma.paradaAtivo, "aggregate").mockResolvedValue({
      _avg: {
        duracaoMinutos: null,
      },
    } as never);

    const result = await repository.aggregateTempoParado("empresa-1");

    expect(result).toBe(0);
  });

  it("should agrupar ativos", async () => {
    const groupBySpy = jest.spyOn(prisma.ativo, "groupBy");
    groupBySpy
      .mockResolvedValueOnce([{ status: "PARADO", _count: 2 }] as never)
      .mockResolvedValueOnce([{ criticidade: "ALTA", _count: 1 }] as never);

    const result = await repository.getAtivosAgrupados("empresa-1");

    expect(result).toEqual({
      porStatus: [{ status: "PARADO", _count: 2 }],
      porCriticidade: [{ criticidade: "ALTA", _count: 1 }],
    });
  });

  it("should agrupar O.S.", async () => {
    const groupBySpy = jest.spyOn(prisma.ordemServico, "groupBy");
    groupBySpy
      .mockResolvedValueOnce([{ tipo: "CORRETIVA", _count: 6 }] as never)
      .mockResolvedValueOnce([{ prioridade: "ALTA", _count: 2 }] as never);

    const result = await repository.getOsAgrupadas("empresa-1");

    expect(result).toEqual({
      porTipo: [{ tipo: "CORRETIVA", _count: 6 }],
      porPrioridade: [{ prioridade: "ALTA", _count: 2 }],
    });
  });

  it("should buscar materiais críticos", async () => {
    const spy = jest.spyOn(prisma.material, "findMany").mockResolvedValue([
      {
        id: "mat-1",
        codigo: "MAT-1",
        nome: "Rolamento",
        estoqueAtual: 2,
        estoqueMinimo: 5,
      },
    ] as never);

    const result = await repository.getMateriaisCriticos("empresa-1");

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        ativo: true,
        AND: [
          {
            estoqueAtual: {
              lt: prisma.material.fields.estoqueMinimo,
            },
          },
        ],
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
      take: 5,
    });
    expect(result).toEqual([
      {
        id: "mat-1",
        codigo: "MAT-1",
        nome: "Rolamento",
        estoqueAtual: 2,
        estoqueMinimo: 5,
      },
    ]);
  });
});
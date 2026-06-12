import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Prisma } from "@prisma/client";

import { MateriaisRepository } from "./materiais.repository.js";
import { prisma } from "../../prisma/prisma.client.js";

describe("MateriaisRepository", () => {
  let repository: MateriaisRepository;

  beforeEach(() => {
    repository = new MateriaisRepository();
    jest.restoreAllMocks();
  });

  it("should listar materiais com filtros", async () => {
    const spy = jest.spyOn(prisma.material, "findMany").mockResolvedValue([{ id: "1" }] as never);

    const result = await repository.findAll({
      empresaId: "empresa-1",
      search: "rolamento",
      ativo: true,
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        ativo: true,
        OR: [
          { nome: { contains: "rolamento", mode: "insensitive" } },
          { codigo: { contains: "rolamento", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should filtrar materiais com estoque baixo", async () => {
    jest.spyOn(prisma.material, "findMany").mockResolvedValue([
      {
        id: "1",
        empresaId: "empresa-1",
        codigo: "MAT-1",
        nome: "Rolamento",
        descricao: null,
        unidade: "UN",
        estoqueAtual: 2,
        estoqueMinimo: 5,
        custoMedio: 10,
        ativo: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        empresaId: "empresa-1",
        codigo: "MAT-2",
        nome: "Parafuso",
        descricao: null,
        unidade: "UN",
        estoqueAtual: 10,
        estoqueMinimo: 5,
        custoMedio: 1,
        ativo: true,
        createdAt: new Date(),
      },
    ] as never);

    const result = await repository.findAll({
      estoqueBaixo: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("1");
  });

  it("should buscar por id", async () => {
    const spy = jest.spyOn(prisma.material, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findById("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should buscar por código", async () => {
    const spy = jest.spyOn(prisma.material, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findByCodigo("empresa-1", "MAT-1");

    expect(spy).toHaveBeenCalledWith({
      where: { empresaId_codigo: { empresaId: "empresa-1", codigo: "MAT-1" } },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should criar material", async () => {
    const spy = jest.spyOn(prisma.material, "create").mockResolvedValue({ id: "1" } as never);

    const result = await repository.create({
      empresaId: "empresa-1",
      codigo: "MAT-1",
      nome: "Rolamento",
      descricao: "Teste",
      unidade: "UN",
      estoqueAtual: 5,
      estoqueMinimo: 2,
      custoMedio: 10,
      ativo: true,
    });

    expect(spy).toHaveBeenCalledWith({
      data: {
        empresaId: "empresa-1",
        codigo: "MAT-1",
        nome: "Rolamento",
        descricao: "Teste",
        unidade: "UN",
        estoqueAtual: 5,
        estoqueMinimo: 2,
        custoMedio: 10,
        ativo: true,
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar material", async () => {
    const spy = jest.spyOn(prisma.material, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.update("1", {
      nome: "Rolamento Atualizado",
      ativo: false,
    });

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        nome: "Rolamento Atualizado",
        ativo: false,
      },
      select: {
        id: true,
        empresaId: true,
        codigo: true,
        nome: true,
        descricao: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        custoMedio: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar estoque", async () => {
    const spy = jest.spyOn(prisma.material, "update").mockResolvedValue({ id: "1" } as never);
    const estoque = new Prisma.Decimal(42);

    const result = await repository.updateEstoque("1", estoque);

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { estoqueAtual: estoque },
      select: {
        id: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should inativar material", async () => {
    const spy = jest.spyOn(prisma.material, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.delete("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { ativo: false },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });
});
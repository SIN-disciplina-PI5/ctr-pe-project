import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { UsuariosRepository } from "./usuarios.repository.js";
import { prisma } from "../../prisma/prisma.client.js";

describe("UsuariosRepository", () => {
  let repository: UsuariosRepository;

  beforeEach(() => {
    repository = new UsuariosRepository();
    jest.restoreAllMocks();
  });

  it("should listar usuários com filtros", async () => {
    const spy = jest.spyOn(prisma.usuario, "findMany").mockResolvedValue([{ id: "1" }] as never);

    const result = await repository.findAll({
      empresaId: "empresa-1",
      perfil: "TECNICO",
      ativo: true,
      search: "joao",
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        empresaId: "empresa-1",
        perfil: "TECNICO",
        ativo: true,
        OR: [
          { nome: { contains: "joao", mode: "insensitive" } },
          { email: { contains: "joao", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should listar usuários sem filtros opcionais", async () => {
    const spy = jest.spyOn(prisma.usuario, "findMany").mockResolvedValue([] as never);

    await repository.findAll({});

    expect(spy).toHaveBeenCalledWith({
      where: {},
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
  });

  it("should buscar por id", async () => {
    const spy = jest.spyOn(prisma.usuario, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findById("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should buscar por email", async () => {
    const spy = jest.spyOn(prisma.usuario, "findUnique").mockResolvedValue({ id: "1" } as never);

    const result = await repository.findByEmail("joao@teste.com");

    expect(spy).toHaveBeenCalledWith({
      where: { email: "joao@teste.com" },
      select: {
        id: true,
        email: true,
        senhaHash: true,
        perfil: true,
        empresaId: true,
        ativo: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should criar usuário com empresaId", async () => {
    const spy = jest.spyOn(prisma.usuario, "create").mockResolvedValue({ id: "1" } as never);

    const result = await repository.create({
      nome: "João",
      email: "joao@teste.com",
      senhaHash: "hash",
      perfil: "TECNICO",
      empresaId: "empresa-1",
    });

    expect(spy).toHaveBeenCalledWith({
      data: {
        nome: "João",
        email: "joao@teste.com",
        senhaHash: "hash",
        perfil: "TECNICO",
        empresaId: "empresa-1",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should criar usuário sem empresaId", async () => {
    const spy = jest.spyOn(prisma.usuario, "create").mockResolvedValue({ id: "1" } as never);

    await repository.create({
      nome: "João",
      email: "joao@teste.com",
      senhaHash: "hash",
      perfil: "ADMIN",
    });

    expect(spy).toHaveBeenCalledWith({
      data: {
        nome: "João",
        email: "joao@teste.com",
        senhaHash: "hash",
        perfil: "ADMIN",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
  });

  it("should atualizar usuário", async () => {
    const spy = jest.spyOn(prisma.usuario, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.update("1", {
      nome: "João Atualizado",
      ativo: false,
    });

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        nome: "João Atualizado",
        ativo: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        empresaId: true,
        ativo: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar senha", async () => {
    const spy = jest.spyOn(prisma.usuario, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.updatePassword("1", "novo-hash");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { senhaHash: "novo-hash" },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should inativar usuário", async () => {
    const spy = jest.spyOn(prisma.usuario, "update").mockResolvedValue({ id: "1" } as never);

    const result = await repository.delete("1");

    expect(spy).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { ativo: false },
      select: { id: true },
    });
    expect(result).toEqual({ id: "1" });
  });
});
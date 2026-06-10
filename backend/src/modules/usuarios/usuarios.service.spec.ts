import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcrypt";

import { UsuariosService } from "./usuarios.service.js";
import { UsuariosRepository } from "./usuarios.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("UsuariosService", () => {
  let service: UsuariosService;

  beforeEach(() => {
    service = new UsuariosService();
    jest.restoreAllMocks();
  });

  it("should listar usuários", async () => {
    const users = [{ id: "1", nome: "João" }];

    jest.spyOn(UsuariosRepository.prototype, "findAll").mockResolvedValue(users as never);

    const result = await service.findAll({ empresaId: "empresa-1" });

    expect(result).toEqual(users);
    expect(UsuariosRepository.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
    });
  });

  it("should retornar usuário por id", async () => {
    const user = { id: "1", email: "joao@teste.com" };

    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue(user as never);

    const result = await service.findById("1");

    expect(result).toEqual(user);
  });

  it("should lançar 404 quando usuário não existir", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findById("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should criar usuário com senha hash", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findByEmail").mockResolvedValue(null);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hash-gerado" as never);
    jest.spyOn(UsuariosRepository.prototype, "create").mockResolvedValue({
      id: "1",
      nome: "João",
      email: "joao@teste.com",
    } as never);

    const result = await service.create({
      nome: "João",
      email: "joao@teste.com",
      password: "123456",
      perfil: "TECNICO",
      empresaId: "empresa-1",
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", expect.any(Number));
    expect(UsuariosRepository.prototype.create).toHaveBeenCalledWith({
      nome: "João",
      email: "joao@teste.com",
      senhaHash: "hash-gerado",
      perfil: "TECNICO",
      empresaId: "empresa-1",
    });
    expect(result).toEqual({
      id: "1",
      nome: "João",
      email: "joao@teste.com",
    });
  });

  it("should lançar 409 ao criar com email em uso", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findByEmail").mockResolvedValue({
      id: "1",
      email: "joao@teste.com",
    } as never);

    await expect(
      service.create({
        nome: "João",
        email: "joao@teste.com",
        password: "123456",
        perfil: "TECNICO",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar sem validar email de novo quando email não mudar", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      email: "joao@teste.com",
    } as never);
    const findByEmailSpy = jest.spyOn(UsuariosRepository.prototype, "findByEmail");
    jest.spyOn(UsuariosRepository.prototype, "update").mockResolvedValue({
      id: "1",
      nome: "João Atualizado",
    } as never);

    const result = await service.update("1", {
      nome: "João Atualizado",
      email: "joao@teste.com",
    });

    expect(findByEmailSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "1", nome: "João Atualizado" });
  });

  it("should lançar 409 ao atualizar para email já em uso", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      email: "joao@teste.com",
    } as never);
    jest.spyOn(UsuariosRepository.prototype, "findByEmail").mockResolvedValue({
      id: "2",
      email: "outro@teste.com",
    } as never);

    await expect(
      service.update("1", {
        email: "outro@teste.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should resetar senha", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      email: "joao@teste.com",
    } as never);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("novo-hash" as never);
    jest.spyOn(UsuariosRepository.prototype, "updatePassword").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.resetPassword("1", "novaSenha123");

    expect(bcrypt.hash).toHaveBeenCalledWith("novaSenha123", expect.any(Number));
    expect(UsuariosRepository.prototype.updatePassword).toHaveBeenCalledWith("1", "novo-hash");
    expect(result).toEqual({ message: "Senha resetada com sucesso" });
  });

  it("should inativar usuário", async () => {
    jest.spyOn(UsuariosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      email: "joao@teste.com",
    } as never);
    jest.spyOn(UsuariosRepository.prototype, "delete").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.delete("1");

    expect(UsuariosRepository.prototype.delete).toHaveBeenCalledWith("1");
    expect(result).toEqual({ id: "1" });
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UsuariosService } from "./usuarios.service.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import bcrypt from "bcrypt";
import type { PerfilUsuario } from "@prisma/client";

vi.mock("./usuarios.repository.js");
vi.mock("bcrypt");

describe("UsuariosService", () => {
  let usuariosService: UsuariosService;
  let usuariosRepositoryMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    usuariosService = new UsuariosService();
    usuariosRepositoryMock = (usuariosService as any).usuariosRepository;
  });

  describe("findAll", () => {
    it("deve retornar uma lista de usuários", async () => {
      const mockUsers = [
        { id: "1", nome: "Admin", email: "admin@teste.com", perfil: "ADMIN" as PerfilUsuario },
      ];
      usuariosRepositoryMock.findAll.mockResolvedValue(mockUsers);

      const result = await usuariosService.findAll({});

      expect(usuariosRepositoryMock.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findById", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const mockUser = { id: "1", nome: "Admin", email: "admin@teste.com" };
      usuariosRepositoryMock.findById.mockResolvedValue(mockUser);

      const result = await usuariosService.findById("1");

      expect(usuariosRepositoryMock.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockUser);
    });

    it("deve lançar AppError 404 se o usuário não existir", async () => {
      usuariosRepositoryMock.findById.mockResolvedValue(null);

      await expect(usuariosService.findById("inexistente")).rejects.toThrow(AppError);
      await expect(usuariosService.findById("inexistente")).rejects.toMatchObject({
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    });
  });

  describe("create", () => {
    const createData = {
      nome: "Novo Usuario",
      email: "novo@teste.com",
      password: "password123",
      perfil: "TECNICO" as PerfilUsuario,
      empresaId: "empresa-1",
    };

    it("deve criar um usuário com a senha hasheada com sucesso", async () => {
      usuariosRepositoryMock.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue("senha_hasheada");
      usuariosRepositoryMock.create.mockResolvedValue({
        id: "user-1",
        ...createData,
        senhaHash: "senha_hasheada",
      });

      const result = await usuariosService.create(createData);

      expect(usuariosRepositoryMock.findByEmail).toHaveBeenCalledWith(createData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createData.password, expect.any(Number));
      expect(usuariosRepositoryMock.create).toHaveBeenCalledWith({
        nome: createData.nome,
        email: createData.email,
        senhaHash: "senha_hasheada",
        perfil: createData.perfil,
        empresaId: createData.empresaId,
      });
      expect(result).toHaveProperty("id", "user-1");
    });

    it("deve lançar erro 400 se faltarem campos obrigatórios", async () => {
      const invalidData = { ...createData, email: "" };

      await expect(usuariosService.create(invalidData as any)).rejects.toMatchObject({
        statusCode: 400,
        errorCode: ErrorCode.BAD_REQUEST,
      });
    });

    it("deve lançar erro 409 se o email já estiver em uso", async () => {
      usuariosRepositoryMock.findByEmail.mockResolvedValue({ id: "existente", email: createData.email });

      await expect(usuariosService.create(createData)).rejects.toMatchObject({
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    });
  });

  describe("update", () => {
    it("deve atualizar os dados do usuário com sucesso", async () => {
      const existingUser = { id: "1", email: "antigo@teste.com", nome: "Nome Antigo" };
      usuariosRepositoryMock.findById.mockResolvedValue(existingUser);
      usuariosRepositoryMock.findByEmail.mockResolvedValue(null);
      usuariosRepositoryMock.update.mockResolvedValue({ ...existingUser, nome: "Novo Nome" });

      const result = await usuariosService.update("1", { nome: "Novo Nome" });

      expect(usuariosRepositoryMock.update).toHaveBeenCalledWith("1", { nome: "Novo Nome" });
      expect(result.nome).toBe("Novo Nome");
    });

    it("deve lançar erro 409 se tentar atualizar para um email já utilizado por outro usuário", async () => {
      const existingUser = { id: "1", email: "user1@teste.com" };
      usuariosRepositoryMock.findById.mockResolvedValue(existingUser);
      usuariosRepositoryMock.findByEmail.mockResolvedValue({ id: "2", email: "outro@teste.com" });

      await expect(
        usuariosService.update("1", { email: "outro@teste.com" })
      ).rejects.toMatchObject({
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    });
  });

  describe("resetPassword", () => {
    it("deve atualizar o hash da nova senha com sucesso", async () => {
      usuariosRepositoryMock.findById.mockResolvedValue({ id: "1", email: "admin@teste.com" });
      (bcrypt.hash as any).mockResolvedValue("nova_hash");
      usuariosRepositoryMock.updatePassword.mockResolvedValue(undefined);

      const result = await usuariosService.resetPassword("1", "novaSenha123");

      expect(bcrypt.hash).toHaveBeenCalledWith("novaSenha123", expect.any(Number));
      expect(usuariosRepositoryMock.updatePassword).toHaveBeenCalledWith("1", "nova_hash");
      expect(result).toEqual({ message: "Senha resetada com sucesso" });
    });
  });

  describe("delete", () => {
    it("deve remover o usuário caso ele exista", async () => {
      usuariosRepositoryMock.findById.mockResolvedValue({ id: "1" });
      usuariosRepositoryMock.delete.mockResolvedValue(undefined);

      await usuariosService.delete("1");

      expect(usuariosRepositoryMock.delete).toHaveBeenCalledWith("1");
    });
  });
});
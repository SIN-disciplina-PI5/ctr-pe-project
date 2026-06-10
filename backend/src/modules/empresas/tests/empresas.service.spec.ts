import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AppError } from "../../../common/errors/AppError.js";
import { EmpresasRepository } from "../empresas.repository.js";
import { EmpresasService } from "../empresas.service.js";

const adminActor = {
  id: "user-1",
  nome: "Admin",
  email: "admin@teste.com",
  perfil: "ADMIN" as const,
  empresaId: null,
};

const supervisorActor = {
  id: "user-2",
  nome: "Supervisor",
  email: "supervisor@teste.com",
  perfil: "SUPERVISOR" as const,
  empresaId: "empresa-1",
};

const gestorActor = {
  id: "user-3",
  nome: "Gestor",
  email: "gestor@teste.com",
  perfil: "GESTOR" as const,
  empresaId: "empresa-1",
};

describe("EmpresasService", () => {
  let service: EmpresasService;

  beforeEach(() => {
    jest.restoreAllMocks();
    service = new EmpresasService();
  });

  describe("findById", () => {
    it("deve retornar a empresa quando encontrada", async () => {
      const empresa = {
        id: "empresa-1",
        nome: "CTR-PE",
        codigo: "CTRPE",
        ativa: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(EmpresasRepository.prototype, "findById")
        .mockResolvedValue(empresa);

      const result = await service.findById("empresa-1");

      expect(result).toEqual(empresa);
    });

    it("deve lançar NOT_FOUND quando empresa não existe", async () => {
      jest
        .spyOn(EmpresasRepository.prototype, "findById")
        .mockResolvedValue(null);

      await expect(service.findById("inexistente")).rejects.toThrow(AppError);
    });
  });

  describe("create", () => {
    it("ADMIN pode criar empresa", async () => {
      jest
        .spyOn(EmpresasRepository.prototype, "findByCodigo")
        .mockResolvedValue(null);

      const createSpy = jest
        .spyOn(EmpresasRepository.prototype, "create")
        .mockResolvedValue({
          id: "nova",
          nome: "Nova Empresa",
          codigo: "NOVA",
          ativa: true,
          createdAt: new Date(),
        });

      const result = await service.create(
        { nome: "Nova Empresa", codigo: "NOVA" },
        adminActor,
      );

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result.nome).toBe("Nova Empresa");
    });

    it("SUPERVISOR não pode criar empresa", async () => {
      await expect(
        service.create({ nome: "Nova Empresa" }, supervisorActor),
      ).rejects.toThrow(AppError);
    });

    it("GESTOR não pode criar empresa", async () => {
      await expect(
        service.create({ nome: "Nova Empresa" }, gestorActor),
      ).rejects.toThrow(AppError);
    });

    it("deve lançar CONFLICT quando código já está em uso", async () => {
      jest
        .spyOn(EmpresasRepository.prototype, "findByCodigo")
        .mockResolvedValue({ id: "outro-id" });

      await expect(
        service.create({ nome: "Nova Empresa", codigo: "EXISTENTE" }, adminActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("ADMIN pode atualizar empresa", async () => {
      const empresa = {
        id: "empresa-1",
        nome: "CTR-PE",
        codigo: "CTRPE",
        ativa: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(EmpresasRepository.prototype, "findById")
        .mockResolvedValue(empresa);

      jest
        .spyOn(EmpresasRepository.prototype, "findByCodigo")
        .mockResolvedValue(null);

      jest
        .spyOn(EmpresasRepository.prototype, "update")
        .mockResolvedValue({ ...empresa, nome: "CTR-PE Atualizada" });

      const result = await service.update(
        "empresa-1",
        { nome: "CTR-PE Atualizada" },
        adminActor,
      );

      expect(result.nome).toBe("CTR-PE Atualizada");
    });

    it("SUPERVISOR não pode atualizar empresa", async () => {
      await expect(
        service.update("empresa-1", { nome: "Novo nome" }, supervisorActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("delete", () => {
    it("ADMIN pode inativar empresa", async () => {
      const empresa = {
        id: "empresa-1",
        nome: "CTR-PE",
        codigo: "CTRPE",
        ativa: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(EmpresasRepository.prototype, "findById")
        .mockResolvedValue(empresa);

      const deleteSpy = jest
        .spyOn(EmpresasRepository.prototype, "delete")
        .mockResolvedValue({
          id: "empresa-1",
          nome: "CTR-PE",
          codigo: "CTRPE",
          ativa: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      await service.delete("empresa-1", adminActor);

      expect(deleteSpy).toHaveBeenCalledWith("empresa-1");
    });

    it("SUPERVISOR não pode inativar empresa", async () => {
      await expect(
        service.delete("empresa-1", supervisorActor),
      ).rejects.toThrow(AppError);
    });
  });
});
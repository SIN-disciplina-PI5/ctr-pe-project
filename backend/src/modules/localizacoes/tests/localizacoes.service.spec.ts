import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AppError } from "../../../common/errors/AppError.js";
import { LocalizacoesRepository } from "../localizacoes.repository.js";
import { LocalizacoesService } from "../localizacoes.service.js";

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

const supervisorOutraEmpresa = {
  id: "user-3",
  nome: "Supervisor 2",
  email: "supervisor2@teste.com",
  perfil: "SUPERVISOR" as const,
  empresaId: "empresa-2",
};

const gestorActor = {
  id: "user-4",
  nome: "Gestor",
  email: "gestor@teste.com",
  perfil: "GESTOR" as const,
  empresaId: "empresa-1",
};

const tecnicoActor = {
  id: "user-5",
  nome: "Tecnico",
  email: "tecnico@teste.com",
  perfil: "TECNICO" as const,
  empresaId: "empresa-1",
};

const localizacaoMock = {
  id: "loc-1",
  empresaId: "empresa-1",
  codigo: "OFICINA",
  nome: "Oficina",
  tipo: "SETOR",
  ativa: true,
  createdAt: new Date(),
  empresa: { id: "empresa-1", nome: "CTR-PE" },
};

describe("LocalizacoesService", () => {
  let service: LocalizacoesService;

  beforeEach(() => {
    jest.restoreAllMocks();
    service = new LocalizacoesService();
  });

  describe("findAll - escopo por empresa", () => {
    it("ADMIN pode listar sem filtro de empresa", async () => {
      const findAllSpy = jest
        .spyOn(LocalizacoesRepository.prototype, "findAll")
        .mockResolvedValue([localizacaoMock]);

      await service.findAll({}, adminActor);

      expect(findAllSpy).toHaveBeenCalledWith({});
    });

    it("SUPERVISOR só vê localizações da própria empresa", async () => {
      const findAllSpy = jest
        .spyOn(LocalizacoesRepository.prototype, "findAll")
        .mockResolvedValue([localizacaoMock]);

      await service.findAll({}, supervisorActor);

      expect(findAllSpy).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: "empresa-1" }),
      );
    });

    it("GESTOR só vê localizações da própria empresa", async () => {
      const findAllSpy = jest
        .spyOn(LocalizacoesRepository.prototype, "findAll")
        .mockResolvedValue([localizacaoMock]);

      await service.findAll({}, gestorActor);

      expect(findAllSpy).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: "empresa-1" }),
      );
    });
  });

  describe("findById - escopo por empresa", () => {
    it("deve retornar localização quando existe e pertence à empresa", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(localizacaoMock);

      const result = await service.findById("loc-1", supervisorActor);

      expect(result.id).toBe("loc-1");
    });

    it("deve lançar FORBIDDEN quando localização pertence a outra empresa", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(localizacaoMock);

      await expect(
        service.findById("loc-1", supervisorOutraEmpresa),
      ).rejects.toThrow(AppError);
    });

    it("deve lançar NOT_FOUND quando localização não existe", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(null);

      await expect(service.findById("inexistente", adminActor)).rejects.toThrow(
        AppError,
      );
    });
  });

  describe("create", () => {
    it("SUPERVISOR pode criar localização", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findByCodigo")
        .mockResolvedValue(null);

      const createSpy = jest
        .spyOn(LocalizacoesRepository.prototype, "create")
        .mockResolvedValue(localizacaoMock);

      const result = await service.create(
        { nome: "Oficina", codigo: "OFICINA" },
        supervisorActor,
      );

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: "empresa-1", nome: "Oficina" }),
      );
      expect(result.nome).toBe("Oficina");
    });

    it("GESTOR não pode criar localização", async () => {
      await expect(
        service.create({ nome: "Oficina" }, gestorActor),
      ).rejects.toThrow(AppError);
    });

    it("TECNICO não pode criar localização", async () => {
      await expect(
        service.create({ nome: "Oficina" }, tecnicoActor),
      ).rejects.toThrow(AppError);
    });

    it("deve lançar CONFLICT quando código já está em uso na empresa", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findByCodigo")
        .mockResolvedValue({ id: "outro-id" });

      await expect(
        service.create({ nome: "Oficina", codigo: "OFICINA" }, supervisorActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("ADMIN pode atualizar localização", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(localizacaoMock);

      jest
        .spyOn(LocalizacoesRepository.prototype, "findByCodigo")
        .mockResolvedValue(null);

      jest
        .spyOn(LocalizacoesRepository.prototype, "update")
        .mockResolvedValue({ ...localizacaoMock, nome: "Oficina Central" });

      const result = await service.update(
        "loc-1",
        { nome: "Oficina Central" },
        adminActor,
      );

      expect(result.nome).toBe("Oficina Central");
    });

    it("SUPERVISOR pode atualizar localização da própria empresa", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(localizacaoMock);

      jest
        .spyOn(LocalizacoesRepository.prototype, "findByCodigo")
        .mockResolvedValue(null);

      jest
        .spyOn(LocalizacoesRepository.prototype, "update")
        .mockResolvedValue({ ...localizacaoMock, nome: "Oficina Nova" });

      const result = await service.update(
        "loc-1",
        { nome: "Oficina Nova" },
        supervisorActor,
      );

      expect(result.nome).toBe("Oficina Nova");
    });

    it("GESTOR não pode atualizar localização", async () => {
      await expect(
        service.update("loc-1", { nome: "Novo nome" }, gestorActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("delete", () => {
    it("ADMIN pode inativar localização", async () => {
      jest
        .spyOn(LocalizacoesRepository.prototype, "findById")
        .mockResolvedValue(localizacaoMock);

      const deleteSpy = jest
        .spyOn(LocalizacoesRepository.prototype, "delete")
        .mockResolvedValue({} as never);

      await service.delete("loc-1", adminActor);

      expect(deleteSpy).toHaveBeenCalledWith("loc-1");
    });

    it("GESTOR não pode inativar localização", async () => {
      await expect(
        service.delete("loc-1", gestorActor),
      ).rejects.toThrow(AppError);
    });
  });
});
import { EmpresasService } from "../empresas.service.js";
import { EmpresasRepository } from "../empresas.repository.js";
import { AppError } from "../../../common/errors/AppError.js";

jest.mock("../empresas.repository.js");

const MockedRepository = EmpresasRepository as jest.MockedClass<typeof EmpresasRepository>;

const adminActor = { userId: "user-1", perfil: "ADMIN" as const, empresaId: "empresa-1" };
const supervisorActor = { userId: "user-2", perfil: "SUPERVISOR" as const, empresaId: "empresa-1" };
const gestorActor = { userId: "user-3", perfil: "GESTOR" as const, empresaId: "empresa-1" };

describe("EmpresasService", () => {
  let service: EmpresasService;
  let repoMock: jest.Mocked<EmpresasRepository>;

  beforeEach(() => {
    MockedRepository.mockClear();
    service = new EmpresasService();
    repoMock = MockedRepository.mock.instances[0] as jest.Mocked<EmpresasRepository>;
  });

  describe("findById", () => {
    it("deve retornar a empresa quando encontrada", async () => {
      const empresa = { id: "empresa-1", nome: "CTR-PE", codigo: "CTRPE", ativa: true, createdAt: new Date() };
      repoMock.findById.mockResolvedValue(empresa);

      const result = await service.findById("empresa-1");

      expect(result).toEqual(empresa);
    });

    it("deve lançar NOT_FOUND quando empresa não existe", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findById("inexistente")).rejects.toThrow(AppError);
    });
  });

  describe("create", () => {
    it("ADMIN pode criar empresa", async () => {
      repoMock.findByCodigo.mockResolvedValue(null);
      repoMock.create.mockResolvedValue({ id: "nova", nome: "Nova Empresa", codigo: "NOVA", ativa: true, createdAt: new Date() });

      const result = await service.create({ nome: "Nova Empresa", codigo: "NOVA" }, adminActor);

      expect(repoMock.create).toHaveBeenCalledTimes(1);
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
      repoMock.findByCodigo.mockResolvedValue({ id: "outro-id" });

      await expect(
        service.create({ nome: "Nova Empresa", codigo: "EXISTENTE" }, adminActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("ADMIN pode atualizar empresa", async () => {
      const empresa = { id: "empresa-1", nome: "CTR-PE", codigo: "CTRPE", ativa: true, createdAt: new Date() };
      repoMock.findById.mockResolvedValue(empresa);
      repoMock.findByCodigo.mockResolvedValue(null);
      repoMock.update.mockResolvedValue({ ...empresa, nome: "CTR-PE Atualizada" });

      const result = await service.update("empresa-1", { nome: "CTR-PE Atualizada" }, adminActor);

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
      const empresa = { id: "empresa-1", nome: "CTR-PE", codigo: "CTRPE", ativa: true, createdAt: new Date() };
      repoMock.findById.mockResolvedValue(empresa);
      repoMock.delete.mockResolvedValue({ id: "empresa-1", nome: "CTR-PE", codigo: "CTRPE", ativa: false, createdAt: new Date(), updatedAt: new Date() });

      await service.delete("empresa-1", adminActor);

      expect(repoMock.delete).toHaveBeenCalledWith("empresa-1");
    });

    it("SUPERVISOR não pode inativar empresa", async () => {
      await expect(
        service.delete("empresa-1", supervisorActor),
      ).rejects.toThrow(AppError);
    });
  });
});

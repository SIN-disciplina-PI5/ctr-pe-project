import { LocalizacoesService } from "../localizacoes.service.js";
import { LocalizacoesRepository } from "../localizacoes.repository.js";
import { AppError } from "../../../common/errors/AppError.js";

jest.mock("../localizacoes.repository.js");

const MockedRepository = LocalizacoesRepository as jest.MockedClass<typeof LocalizacoesRepository>;

const adminActor = { userId: "user-1", perfil: "ADMIN" as const, empresaId: "empresa-1" };
const supervisorActor = { userId: "user-2", perfil: "SUPERVISOR" as const, empresaId: "empresa-1" };
const supervisorOutraEmpresa = { userId: "user-3", perfil: "SUPERVISOR" as const, empresaId: "empresa-2" };
const gestorActor = { userId: "user-4", perfil: "GESTOR" as const, empresaId: "empresa-1" };
const tecnicoActor = { userId: "user-5", perfil: "TECNICO" as const, empresaId: "empresa-1" };

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
  let repoMock: jest.Mocked<LocalizacoesRepository>;

  beforeEach(() => {
    MockedRepository.mockClear();
    service = new LocalizacoesService();
    repoMock = MockedRepository.mock.instances[0] as jest.Mocked<LocalizacoesRepository>;
  });

  describe("findAll - escopo por empresa", () => {
    it("ADMIN pode listar sem filtro de empresa", async () => {
      repoMock.findAll.mockResolvedValue([localizacaoMock]);

      await service.findAll({}, adminActor);

      expect(repoMock.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: undefined }),
      );
    });

    it("SUPERVISOR só vê localizações da própria empresa", async () => {
      repoMock.findAll.mockResolvedValue([localizacaoMock]);

      await service.findAll({}, supervisorActor);

      expect(repoMock.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: "empresa-1" }),
      );
    });

    it("GESTOR só vê localizações da própria empresa", async () => {
      repoMock.findAll.mockResolvedValue([localizacaoMock]);

      await service.findAll({}, gestorActor);

      expect(repoMock.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ empresaId: "empresa-1" }),
      );
    });
  });

  describe("findById - escopo por empresa", () => {
    it("deve retornar localização quando existe e pertence à empresa", async () => {
      repoMock.findById.mockResolvedValue(localizacaoMock);

      const result = await service.findById("loc-1", supervisorActor);

      expect(result.id).toBe("loc-1");
    });

    it("deve lançar FORBIDDEN quando localização pertence a outra empresa", async () => {
      repoMock.findById.mockResolvedValue(localizacaoMock); // empresa-1

      await expect(
        service.findById("loc-1", supervisorOutraEmpresa), // empresa-2
      ).rejects.toThrow(AppError);
    });

    it("deve lançar NOT_FOUND quando localização não existe", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findById("inexistente", adminActor)).rejects.toThrow(AppError);
    });
  });

  describe("create", () => {
    it("SUPERVISOR pode criar localização", async () => {
      repoMock.findByCodigo.mockResolvedValue(null);
      repoMock.create.mockResolvedValue(localizacaoMock);

      const result = await service.create(
        { nome: "Oficina", codigo: "OFICINA" },
        supervisorActor,
      );

      expect(repoMock.create).toHaveBeenCalledWith(
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
      repoMock.findByCodigo.mockResolvedValue({ id: "outro-id" });

      await expect(
        service.create({ nome: "Oficina", codigo: "OFICINA" }, adminActor),
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("ADMIN pode atualizar localização", async () => {
      repoMock.findById.mockResolvedValue(localizacaoMock);
      repoMock.findByCodigo.mockResolvedValue(null);
      repoMock.update.mockResolvedValue({ ...localizacaoMock, nome: "Oficina Central" });

      const result = await service.update(
        "loc-1",
        { nome: "Oficina Central" },
        adminActor,
      );

      expect(result.nome).toBe("Oficina Central");
    });

    it("SUPERVISOR pode atualizar localização da própria empresa", async () => {
      repoMock.findById.mockResolvedValue(localizacaoMock);
      repoMock.findByCodigo.mockResolvedValue(null);
      repoMock.update.mockResolvedValue({ ...localizacaoMock, nome: "Oficina Nova" });

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
      repoMock.findById.mockResolvedValue(localizacaoMock);
      repoMock.delete.mockResolvedValue({} as any);

      await service.delete("loc-1", adminActor);

      expect(repoMock.delete).toHaveBeenCalledWith("loc-1");
    });

    it("GESTOR não pode inativar localização", async () => {
      await expect(
        service.delete("loc-1", gestorActor),
      ).rejects.toThrow(AppError);
    });
  });
});

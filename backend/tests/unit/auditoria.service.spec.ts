import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRepo = {
  create: jest.fn() as jest.Mock,
  findAll: jest.fn() as jest.Mock,
  findById: jest.fn() as jest.Mock,
};

jest.unstable_mockModule("../../src/modules/auditoria/auditoria.repository.js", () => ({
  AuditoriaRepository: jest.fn(() => mockRepo),
}));

const { AuditoriaService } = await import(
  "../../src/modules/auditoria/auditoria.service.js"
);

describe("AuditoriaService (unit, repository mockado)", () => {
  let service: InstanceType<typeof AuditoriaService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuditoriaService();
  });

  it("registrar delega a gravação ao repositório", async () => {
    mockRepo.create.mockResolvedValue({ id: "log1" });
    const input = { entidade: "ativos", entidadeId: "a1", acao: "CRIACAO" } as never;

    await service.registrar(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
  });

  it("findAll repassa os filtros ao repositório", async () => {
    mockRepo.findAll.mockResolvedValue([{ id: "log1" }]);

    const result = await service.findAll({ entidade: "ativos", limit: 10 });

    expect(mockRepo.findAll).toHaveBeenCalledWith({ entidade: "ativos", limit: 10 });
    expect(result).toEqual([{ id: "log1" }]);
  });

  it("findById lança 404 quando o registro não existe", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById("x")).rejects.toMatchObject({ statusCode: 404 });
  });
});

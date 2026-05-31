import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRepo = {
  findById: jest.fn() as jest.Mock,
  findAll: jest.fn() as jest.Mock,
  updateStatus: jest.fn() as jest.Mock,
  verificarOsAtrasadas: jest.fn() as jest.Mock,
};

jest.unstable_mockModule("../../src/modules/alertas/alertas.repository.js", () => ({
  AlertasRepository: jest.fn(() => mockRepo),
}));

const { AlertasService } = await import(
  "../../src/modules/alertas/alertas.service.js"
);

describe("AlertasService (unit, repository mockado)", () => {
  let service: InstanceType<typeof AlertasService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AlertasService();
  });

  it("findById lança 404 quando não existe", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById("x")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("findAll roda o gatilho de O.S. atrasada antes de listar", async () => {
    mockRepo.verificarOsAtrasadas.mockResolvedValue([]);
    mockRepo.findAll.mockResolvedValue([{ id: "a1" }]);

    const result = await service.findAll({ empresaId: "e" });

    expect(mockRepo.verificarOsAtrasadas).toHaveBeenCalledWith("e");
    expect(result).toEqual([{ id: "a1" }]);
  });

  it("marcarComoLido atualiza status para LIDO com data de leitura", async () => {
    mockRepo.findById.mockResolvedValue({ id: "a1" });
    mockRepo.updateStatus.mockResolvedValue({ id: "a1", status: "LIDO" });

    await service.marcarComoLido("a1");

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(
      "a1",
      expect.objectContaining({ status: "LIDO", lidoEm: expect.any(Date) }),
    );
  });

  it("resolver atualiza status para RESOLVIDO", async () => {
    mockRepo.findById.mockResolvedValue({ id: "a1" });
    mockRepo.updateStatus.mockResolvedValue({ id: "a1", status: "RESOLVIDO" });

    await service.resolver("a1");

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(
      "a1",
      expect.objectContaining({ status: "RESOLVIDO" }),
    );
  });
});

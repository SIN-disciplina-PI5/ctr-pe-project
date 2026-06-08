import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { MateriaisRepository } from "../../src/modules/materiais/materiais.repository.js";
import type { AlertasRepository } from "../../src/modules/alertas/alertas.repository.js";

const mockRepo: Pick<
  jest.Mocked<MateriaisRepository>,
  "findById" | "findByCodigo" | "create" | "update" | "updateEstoque" | "delete"
> = {
  findById: jest.fn(),
  findByCodigo: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateEstoque: jest.fn(),
  delete: jest.fn(),
};

const mockAlertas: Pick<jest.Mocked<AlertasRepository>, "createEstoqueBaixo"> = {
  createEstoqueBaixo: jest.fn(),
};

jest.unstable_mockModule("../../src/modules/materiais/materiais.repository.js", () => ({
  MateriaisRepository: jest.fn(() => mockRepo),
}));
jest.unstable_mockModule("../../src/modules/alertas/alertas.repository.js", () => ({
  AlertasRepository: jest.fn(() => mockAlertas),
}));

const { MateriaisService } = await import(
  "../../src/modules/materiais/materiais.service.js"
);

describe("MateriaisService (unit, repository mockado)", () => {
  let service: InstanceType<typeof MateriaisService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MateriaisService();
  });

  it("findById lança 404 quando o repositório retorna null (stub)", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById("x")).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.findById).toHaveBeenCalledWith("x");
  });

  it("create lança 409 quando o código já existe", async () => {
    mockRepo.findByCodigo.mockResolvedValue({ id: "dup" });
    await expect(
      service.create({ empresaId: "e", codigo: "C", nome: "N" } as never),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("create dispara alerta de estoque baixo quando estoque <= mínimo", async () => {
    mockRepo.findByCodigo.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({
      id: "m1",
      empresaId: "e",
      codigo: "C",
      nome: "N",
      estoqueAtual: 0,
      estoqueMinimo: 5,
    });

    await service.create({
      empresaId: "e",
      codigo: "C",
      nome: "N",
      estoqueAtual: 0,
      estoqueMinimo: 5,
    } as never);

    expect(mockAlertas.createEstoqueBaixo).toHaveBeenCalledWith(
      expect.objectContaining({ materialId: "m1" }),
    );
  });

  it("updateEstoque SAIDA com estoque insuficiente lança 400", async () => {
    mockRepo.findById.mockResolvedValue({
      id: "m1",
      empresaId: "e",
      codigo: "C",
      nome: "N",
      estoqueAtual: 2,
      estoqueMinimo: 0,
    });

    await expect(
      service.updateEstoque("m1", { operacao: "SAIDA", quantidade: 5 }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

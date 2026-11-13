import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma.client.js";
import { OrdensServicoMateriaisRepository } from "./ordens-servico-materiais.repository.js";

function createTransactionMock() {
  return {
    ordemServicoMaterial: {
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    material: { update: jest.fn() },
    ordemServico: {
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
  };
}

function mockTransaction(tx: ReturnType<typeof createTransactionMock>) {
  type TransactionCallback = (transaction: typeof tx) => Promise<unknown>;
  jest
    .spyOn(prisma, "$transaction")
    .mockImplementation(((callback: TransactionCallback) =>
      callback(tx)) as never);
}

describe("OrdensServicoMateriaisRepository cost totals", () => {
  let repository: OrdensServicoMateriaisRepository;

  beforeEach(() => {
    jest.restoreAllMocks();
    repository = new OrdensServicoMateriaisRepository();
  });

  it("preserva o custo de mão de obra ao consumir material", async () => {
    const tx = createTransactionMock();
    tx.ordemServicoMaterial.findUniqueOrThrow.mockResolvedValue({
      materialId: "mat_000001",
      custoUnitario: new Prisma.Decimal(50),
      ordemServicoId: "os_000001",
    });
    tx.ordemServicoMaterial.update.mockResolvedValue({ id: "item_000001" });
    tx.ordemServicoMaterial.findMany.mockResolvedValue([
      { custoTotal: new Prisma.Decimal(100) },
    ]);
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      custoMaoObra: new Prisma.Decimal(250),
    });
    mockTransaction(tx);

    await repository.consumir("item_000001", 2);

    expect(tx.ordemServico.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: "os_000001" },
      select: { custoMaoObra: true },
    });
    const update = tx.ordemServico.update.mock.calls[0]?.[0];
    expect(Number(update?.data.custoMateriais)).toBe(100);
    expect(Number(update?.data.custoTotal)).toBe(350);
  });

  it("mantém somente a mão de obra no total após devolver todos os materiais", async () => {
    const tx = createTransactionMock();
    tx.ordemServicoMaterial.findUniqueOrThrow.mockResolvedValue({
      materialId: "mat_000001",
      custoUnitario: new Prisma.Decimal(50),
      ordemServicoId: "os_000001",
    });
    tx.ordemServicoMaterial.update.mockResolvedValue({ id: "item_000001" });
    tx.ordemServicoMaterial.findMany.mockResolvedValue([]);
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      custoMaoObra: new Prisma.Decimal(250),
    });
    mockTransaction(tx);

    await repository.devolver("item_000001", 2);

    const update = tx.ordemServico.update.mock.calls[0]?.[0];
    expect(Number(update?.data.custoMateriais)).toBe(0);
    expect(Number(update?.data.custoTotal)).toBe(250);
  });
});

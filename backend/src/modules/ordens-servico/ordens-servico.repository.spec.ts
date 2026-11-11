import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { prisma } from "../../prisma/prisma.client.js";
import { OrdensServicoRepository } from "./ordens-servico.repository.js";

function createTransactionMock() {
  return {
    ordemServico: {
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    ativo: {
      update: jest.fn(),
    },
    paradaAtivo: {
      updateMany: jest.fn(),
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

describe("OrdensServicoRepository domain transitions", () => {
  let repository: OrdensServicoRepository;

  beforeEach(() => {
    jest.restoreAllMocks();
    repository = new OrdensServicoRepository();
  });

  it("does not change asset availability when starting a non-impacting work order", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.update.mockResolvedValue({
      id: "os-1",
      impactaDisponibilidade: false,
      ativo: { id: "ativo-1" },
    });
    mockTransaction(tx);

    await repository.iniciar(
      "os-1",
      "empresa-1",
      new Date("2026-11-10T10:00:00.000Z"),
    );

    expect(tx.ativo.update).not.toHaveBeenCalled();
  });

  it("keeps changing asset availability for an impacting work order", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.update.mockResolvedValue({
      id: "os-1",
      impactaDisponibilidade: true,
      ativo: { id: "ativo-1" },
    });
    mockTransaction(tx);

    await repository.iniciar(
      "os-1",
      "empresa-1",
      new Date("2026-11-10T10:00:00.000Z"),
    );

    expect(tx.ativo.update).toHaveBeenCalledWith({
      where: { id: "ativo-1" },
      data: { status: "EM_MANUTENCAO" },
    });
  });

  it("does not change asset availability while a non-impacting work order waits for parts", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.update.mockResolvedValue({
      id: "os-1",
      impactaDisponibilidade: false,
      ativo: { id: "ativo-1" },
    });
    mockTransaction(tx);

    await repository.aguardarPeca(
      "os-1",
      "empresa-1",
      "Aguardando fornecedor",
    );

    expect(tx.ativo.update).not.toHaveBeenCalled();
  });

  it("accumulates waiting time when a work order is resumed more than once", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      ativoId: "ativo-1",
      impactaDisponibilidade: false,
      aguardandoPecaDesde: new Date("2026-11-10T10:00:00.000Z"),
      tempoAguardandoPecaMinutos: 35,
    });
    tx.ordemServico.update.mockResolvedValue({ id: "os-1" });
    jest
      .spyOn(Date, "now")
      .mockReturnValue(new Date("2026-11-10T10:25:00.000Z").getTime());
    mockTransaction(tx);

    await repository.retomar("os-1", "empresa-1", "Peça recebida");

    expect(tx.ordemServico.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "os-1" },
        data: {
          status: "EM_EXECUCAO",
          aguardandoPecaDesde: null,
          tempoAguardandoPecaMinutos: 60,
          observacao: "Peça recebida",
        },
      }),
    );
    expect(tx.ativo.update).not.toHaveBeenCalled();
  });

  it("does not release an asset when a non-impacting work order is closed", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      ativoId: "ativo-1",
      empresaId: "empresa-1",
      impactaDisponibilidade: false,
      iniciadaEm: new Date("2026-11-10T10:00:00.000Z"),
      abertaEm: new Date("2026-11-10T09:00:00.000Z"),
    });
    tx.ordemServico.update.mockResolvedValue({ id: "os-1" });
    tx.paradaAtivo.updateMany.mockResolvedValue({ count: 0 });
    mockTransaction(tx);

    await repository.encerrar("os-1", "empresa-1", {
      encerradaEm: new Date("2026-11-10T11:00:00.000Z"),
    });

    expect(tx.ordemServico.findFirst).not.toHaveBeenCalled();
    expect(tx.ativo.update).not.toHaveBeenCalled();
  });

  it("does not release an asset when a non-impacting work order is cancelled", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      ativoId: "ativo-1",
      empresaId: "empresa-1",
      impactaDisponibilidade: false,
    });
    tx.ordemServico.update.mockResolvedValue({ id: "os-1" });
    tx.paradaAtivo.updateMany.mockResolvedValue({ count: 0 });
    mockTransaction(tx);

    await repository.cancelar("os-1", "empresa-1", {
      motivo: "Solicitação cancelada",
      canceladaEm: new Date("2026-11-10T11:00:00.000Z"),
    });

    expect(tx.ordemServico.findFirst).not.toHaveBeenCalled();
    expect(tx.ativo.update).not.toHaveBeenCalled();
  });

  it("only releases an impacting work order asset when no other impacting order is open", async () => {
    const tx = createTransactionMock();
    tx.ordemServico.findUniqueOrThrow.mockResolvedValue({
      ativoId: "ativo-1",
      empresaId: "empresa-1",
      impactaDisponibilidade: true,
      iniciadaEm: new Date("2026-11-10T10:00:00.000Z"),
      abertaEm: new Date("2026-11-10T09:00:00.000Z"),
    });
    tx.ordemServico.update.mockResolvedValue({ id: "os-1" });
    tx.ordemServico.findFirst.mockResolvedValue(null);
    tx.paradaAtivo.updateMany.mockResolvedValue({ count: 1 });
    mockTransaction(tx);

    await repository.encerrar("os-1", "empresa-1", {
      encerradaEm: new Date("2026-11-10T11:00:00.000Z"),
    });

    expect(tx.ativo.update).toHaveBeenCalledWith({
      where: { id: "ativo-1" },
      data: { status: "DISPONIVEL" },
    });
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Prisma } from "@prisma/client";

import { ApontamentosOSService } from "./apontamentos-os.service.js";
import { ApontamentosOSRepository } from "./apontamentos-os.repository.js";
import { OrdensServicoRepository } from "../ordens-servico/ordens-servico.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("ApontamentosOSService", () => {
  let service: ApontamentosOSService;

  beforeEach(() => {
    service = new ApontamentosOSService();
    jest.restoreAllMocks();
  });

  it("should listar por ordem de serviço", async () => {
    jest
      .spyOn(ApontamentosOSRepository.prototype, "findByOrdemServico")
      .mockResolvedValue([{ id: "1" }] as never);

    const result = await service.findByOrdemServico("os-1");

    expect(result).toEqual([{ id: "1" }]);
  });

  it("should retornar por id", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.findById("1");

    expect(result).toEqual({ id: "1" });
  });

  it("should lançar 404 quando apontamento não existir", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findById("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should criar apontamento", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "os-1",
    } as never);
    jest
      .spyOn(ApontamentosOSRepository.prototype, "findAbertoPorUsuario")
      .mockResolvedValue(null);
    jest.spyOn(ApontamentosOSRepository.prototype, "create").mockResolvedValue({
      id: "1",
    } as never);

    const inicioEm = new Date("2026-06-11T10:00:00.000Z");

    const result = await service.create({
      ordemServicoId: "os-1",
      usuarioId: "user-1",
      inicioEm,
      descricao: "Teste",
      custoHora: 50,
    });

    expect(ApontamentosOSRepository.prototype.create).toHaveBeenCalledWith({
      ordemServicoId: "os-1",
      usuarioId: "user-1",
      inicioEm,
      descricao: "Teste",
      custoHora: 50,
    });
    expect(result).toEqual({ id: "1" });
  });

  it("should lançar 404 ao criar quando O.S. não existir", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue(null);

    await expect(
      service.create({
        ordemServicoId: "os-1",
        usuarioId: "user-1",
        inicioEm: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 ao criar quando usuário já tiver apontamento aberto", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "os-1",
    } as never);
    jest
      .spyOn(ApontamentosOSRepository.prototype, "findAbertoPorUsuario")
      .mockResolvedValue({ id: "aberto-1" } as never);

    await expect(
      service.create({
        ordemServicoId: "os-1",
        usuarioId: "user-1",
        inicioEm: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar apontamento", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: null,
    } as never);
    jest.spyOn(ApontamentosOSRepository.prototype, "update").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.update("1", {
      inicioEm: new Date("2026-06-11T11:00:00.000Z"),
      fimEm: new Date("2026-06-11T12:00:00.000Z"),
      descricao: "Atualizado",
      custoHora: 80,
    });

    expect(ApontamentosOSRepository.prototype.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        inicioEm: new Date("2026-06-11T11:00:00.000Z"),
        fimEm: new Date("2026-06-11T12:00:00.000Z"),
        descricao: "Atualizado",
        custoHora: new Prisma.Decimal(80),
      }),
    );
    expect(result).toEqual({ id: "1" });
  });

  it("should lançar 400 ao atualizar apontamento já encerrado", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: new Date("2026-06-11T11:00:00.000Z"),
    } as never);

    await expect(
      service.update("1", {
        descricao: "Atualizado",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 ao atualizar com fim anterior ao início", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: null,
    } as never);

    await expect(
      service.update("1", {
        fimEm: new Date("2026-06-11T09:00:00.000Z"),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should encerrar apontamento com custo", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: null,
      custoHora: 60,
    } as never);
    jest.spyOn(ApontamentosOSRepository.prototype, "encerrar").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.encerrar("1", {
      fimEm: new Date("2026-06-11T11:00:00.000Z"),
    });

    expect(ApontamentosOSRepository.prototype.encerrar).toHaveBeenCalledWith(
      "1",
      new Date("2026-06-11T11:00:00.000Z"),
      60,
      new Prisma.Decimal(60),
    );
    expect(result).toEqual({ id: "1" });
  });

  it("should encerrar apontamento sem custo", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: null,
      custoHora: null,
    } as never);
    jest.spyOn(ApontamentosOSRepository.prototype, "encerrar").mockResolvedValue({
      id: "1",
    } as never);

    await service.encerrar("1", {});

    expect(ApontamentosOSRepository.prototype.encerrar).toHaveBeenCalledWith(
      "1",
      expect.any(Date),
      expect.any(Number),
      null,
    );
  });

  it("should lançar 400 ao encerrar apontamento já encerrado", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: new Date("2026-06-11T11:00:00.000Z"),
    } as never);

    await expect(service.encerrar("1", {})).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 ao encerrar com fim anterior ao início", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      inicioEm: new Date("2026-06-11T10:00:00.000Z"),
      fimEm: null,
      custoHora: null,
    } as never);

    await expect(
      service.encerrar("1", {
        fimEm: new Date("2026-06-11T09:00:00.000Z"),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should deletar apontamento", async () => {
    jest.spyOn(ApontamentosOSRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      ordemServicoId: "os-1",
    } as never);
    jest.spyOn(ApontamentosOSRepository.prototype, "delete").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.delete("1");

    expect(ApontamentosOSRepository.prototype.delete).toHaveBeenCalledWith("1", "os-1");
    expect(result).toEqual({ id: "1" });
  });
});
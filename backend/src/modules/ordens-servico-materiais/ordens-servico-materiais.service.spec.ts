import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError.js";
import { EstoqueForecastService } from "../materiais/estoque-forecast.service.js";
import { OrdensServicoMateriaisRepository } from "./ordens-servico-materiais.repository.js";
import { OrdensServicoMateriaisService } from "./ordens-servico-materiais.service.js";

describe("OrdensServicoMateriaisService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("avalia a previsão da empresa após consumir material", async () => {
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "findByIdForEmpresa")
      .mockResolvedValue({
        id: "item-1",
        materialId: "mat-1",
        quantidade: new Prisma.Decimal(2),
        status: "SOLICITADO",
      } as never);
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "findMaterialById")
      .mockResolvedValue({
        id: "mat-1",
        estoqueAtual: new Prisma.Decimal(10),
        custoMedio: new Prisma.Decimal(5),
        ativo: true,
      });
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "consumir")
      .mockResolvedValue({ id: "item-1", status: "CONSUMIDO" } as never);
    const forecastSpy = jest
      .spyOn(EstoqueForecastService.prototype, "avaliarEDispararAlertaProativo")
      .mockResolvedValue({ disparado: false } as never);

    const service = new OrdensServicoMateriaisService();
    const result = await service.consumir("item-1", "empresa-1", 2);

    expect(result).toEqual(expect.objectContaining({ status: "CONSUMIDO" }));
    expect(forecastSpy).toHaveBeenCalledWith("empresa-1", "mat-1");
  });

  it("não consome item pertencente a outra empresa", async () => {
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "findByIdForEmpresa")
      .mockResolvedValue(null);
    const consumirSpy = jest.spyOn(
      OrdensServicoMateriaisRepository.prototype,
      "consumir",
    );

    const service = new OrdensServicoMateriaisService();

    await expect(
      service.consumir("item-1", "empresa-1", 2),
    ).rejects.toBeInstanceOf(AppError);
    expect(consumirSpy).not.toHaveBeenCalled();
  });

  it("mantém o consumo concluído quando somente a previsão falha", async () => {
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "findByIdForEmpresa")
      .mockResolvedValue({
        id: "item-1",
        materialId: "mat-1",
        quantidade: new Prisma.Decimal(2),
        status: "SOLICITADO",
      } as never);
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "findMaterialById")
      .mockResolvedValue({
        id: "mat-1",
        estoqueAtual: new Prisma.Decimal(10),
        custoMedio: new Prisma.Decimal(5),
        ativo: true,
      });
    jest
      .spyOn(OrdensServicoMateriaisRepository.prototype, "consumir")
      .mockResolvedValue({ id: "item-1", status: "CONSUMIDO" } as never);
    jest
      .spyOn(EstoqueForecastService.prototype, "avaliarEDispararAlertaProativo")
      .mockRejectedValue(new Error("forecast indisponível"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    const service = new OrdensServicoMateriaisService();

    await expect(
      service.consumir("item-1", "empresa-1", 2),
    ).resolves.toEqual(expect.objectContaining({ status: "CONSUMIDO" }));
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AtivosService } from "./ativos.service.js";
import { AtivosRepository } from "./ativos.repository.js";
import { AlertasRepository } from "../alertas/alertas.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("AtivosService", () => {
  let service: AtivosService;

  beforeEach(() => {
    service = new AtivosService();
    jest.restoreAllMocks();
  });

  it("should listar ativos", async () => {
    jest.spyOn(AtivosRepository.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const result = await service.findAll({ empresaId: "empresa-1" });

    expect(result).toEqual([{ id: "1" }]);
    expect(AtivosRepository.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
    });
  });

  it("should retornar ativo por id", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
      codigo: "AT-1",
    } as never);

    const result = await service.findById("1");

    expect(result).toEqual({
      id: "1",
      empresaId: "empresa-1",
      codigo: "AT-1",
    });
  });

  it("should lançar 404 quando ativo não existir", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findById("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should criar ativo", async () => {
    jest.spyOn(AtivosRepository.prototype, "findByCodigo").mockResolvedValue(null);
    jest.spyOn(AtivosRepository.prototype, "create").mockResolvedValue({
      id: "1",
      codigo: "AT-1",
    } as never);

    const result = await service.create({
      empresaId: "empresa-1",
      codigo: "AT-1",
      nome: "Motor",
      tipo: "MAQUINA",
    });

    expect(AtivosRepository.prototype.findByCodigo).toHaveBeenCalledWith("empresa-1", "AT-1");
    expect(AtivosRepository.prototype.create).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      codigo: "AT-1",
      nome: "Motor",
      tipo: "MAQUINA",
    });
    expect(result).toEqual({
      id: "1",
      codigo: "AT-1",
    });
  });

  it("should lançar 409 ao criar com código já em uso", async () => {
    jest.spyOn(AtivosRepository.prototype, "findByCodigo").mockResolvedValue({
      id: "1",
    } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        codigo: "AT-1",
        nome: "Motor",
        tipo: "MAQUINA",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar sem validar código quando ele não mudar", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
      codigo: "AT-1",
    } as never);
    const findByCodigoSpy = jest.spyOn(AtivosRepository.prototype, "findByCodigo");
    jest.spyOn(AtivosRepository.prototype, "update").mockResolvedValue({
      id: "1",
      nome: "Motor Atualizado",
    } as never);

    const result = await service.update("1", {
      codigo: "AT-1",
      nome: "Motor Atualizado",
    });

    expect(findByCodigoSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "1",
      nome: "Motor Atualizado",
    });
  });

  it("should lançar 409 ao atualizar para código já em uso", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
      codigo: "AT-1",
    } as never);
    jest.spyOn(AtivosRepository.prototype, "findByCodigo").mockResolvedValue({
      id: "2",
    } as never);

    await expect(
      service.update("1", {
        codigo: "AT-2",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar status sem criar alerta quando não for PARADO", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
    } as never);
    jest.spyOn(AtivosRepository.prototype, "updateStatus").mockResolvedValue({
      id: "1",
      status: "DISPONIVEL",
    } as never);
    const alertaSpy = jest.spyOn(AlertasRepository.prototype, "createAtivoParado");

    const result = await service.updateStatus("1", "DISPONIVEL");

    expect(alertaSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "1",
      status: "DISPONIVEL",
    });
  });

  it("should atualizar status e criar alerta quando ficar PARADO", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
    } as never);
    jest.spyOn(AtivosRepository.prototype, "updateStatus").mockResolvedValue({
      id: "1",
      status: "PARADO",
    } as never);
    const alertaSpy = jest
      .spyOn(AlertasRepository.prototype, "createAtivoParado")
      .mockResolvedValue({ id: "alerta-1" } as never);

    const result = await service.updateStatus("1", "PARADO");

    expect(alertaSpy).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "1",
    });
    expect(result).toEqual({
      id: "1",
      status: "PARADO",
    });
  });

  it("should inativar ativo", async () => {
    jest.spyOn(AtivosRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
    } as never);
    jest.spyOn(AtivosRepository.prototype, "delete").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.delete("1");

    expect(AtivosRepository.prototype.delete).toHaveBeenCalledWith("1");
    expect(result).toEqual({ id: "1" });
  });
});
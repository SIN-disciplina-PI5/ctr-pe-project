import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { ParadasAtivosService } from "./paradas-ativos.service.js";
import { ParadasAtivosRepository } from "./paradas-ativos.repository.js";
import { AlertasRepository } from "../alertas/alertas.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("ParadasAtivosService", () => {
  let service: ParadasAtivosService;

  beforeEach(() => {
    service = new ParadasAtivosService();
    jest.restoreAllMocks();
  });

  it("should listar convertendo from/to para Date", async () => {
    const findAllSpy = jest
      .spyOn(ParadasAtivosRepository.prototype, "findAll")
      .mockResolvedValue([{ id: "1" }] as never);

    const result = await service.findAll({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      status: "ABERTA",
      from: "2026-06-01T10:00:00.000Z",
      to: "2026-06-02T10:00:00.000Z",
    });

    expect(findAllSpy).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      status: "ABERTA",
      from: new Date("2026-06-01T10:00:00.000Z"),
      to: new Date("2026-06-02T10:00:00.000Z"),
    });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should retornar parada por id", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "ABERTA",
    } as never);

    const result = await service.findById("parada-1");

    expect(result).toEqual({
      id: "parada-1",
      status: "ABERTA",
    });
  });

  it("should lançar 404 quando parada não existir", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findById("parada-1")).rejects.toBeInstanceOf(AppError);
  });

  it("should criar parada e gerar alerta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findParadaAbertaByAtivo")
      .mockResolvedValue(null);
    jest.spyOn(ParadasAtivosRepository.prototype, "create").mockResolvedValue({
      id: "parada-1",
      ativoId: "ativo-1",
    } as never);
    const alertaSpy = jest
      .spyOn(AlertasRepository.prototype, "createAtivoParado")
      .mockResolvedValue({ id: "alerta-1" } as never);

    const result = await service.create({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      inicioEm: "2026-06-10T10:00:00.000Z",
      motivo: "Falha",
      programada: false,
      impactaDisponibilidade: true,
    });

    expect(ParadasAtivosRepository.prototype.create).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      inicioEm: new Date("2026-06-10T10:00:00.000Z"),
      motivo: "Falha",
      programada: false,
      impactaDisponibilidade: true,
    });
    expect(alertaSpy).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      motivo: "Falha",
    });
    expect(result).toEqual({
      id: "parada-1",
      ativoId: "ativo-1",
    });
  });

  it("should validar ordem de serviço quando informada", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    const ordemSpy = jest
      .spyOn(ParadasAtivosRepository.prototype, "findOrdemServicoById")
      .mockResolvedValue({
        id: "os-1",
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findParadaAbertaByAtivo")
      .mockResolvedValue(null);
    jest.spyOn(ParadasAtivosRepository.prototype, "create").mockResolvedValue({
      id: "parada-1",
    } as never);
    jest
      .spyOn(AlertasRepository.prototype, "createAtivoParado")
      .mockResolvedValue({ id: "alerta-1" } as never);

    await service.create({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      ordemServicoId: "os-1",
    });

    expect(ordemSpy).toHaveBeenCalledWith("os-1");
  });

  it("should lançar 404 quando ativo não existir ou estiver inativo", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue(null);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 quando ativo não pertencer à empresa", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-2",
      ativo: true,
    } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 404 quando ordem de serviço não existir", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findOrdemServicoById")
      .mockResolvedValue(null);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        ordemServicoId: "os-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 quando ordem de serviço for de outra empresa", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findOrdemServicoById")
      .mockResolvedValue({
        id: "os-1",
        empresaId: "empresa-2",
        ativoId: "ativo-1",
      } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        ordemServicoId: "os-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 quando ordem de serviço for de outro ativo", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findOrdemServicoById")
      .mockResolvedValue({
        id: "os-1",
        empresaId: "empresa-1",
        ativoId: "ativo-2",
      } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        ordemServicoId: "os-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 409 quando já existir parada aberta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest
      .spyOn(ParadasAtivosRepository.prototype, "findParadaAbertaByAtivo")
      .mockResolvedValue({ id: "parada-existente" } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar parada", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "ABERTA",
    } as never);
    jest.spyOn(ParadasAtivosRepository.prototype, "update").mockResolvedValue({
      id: "parada-1",
      motivo: "Novo motivo",
    } as never);

    const result = await service.update("parada-1", {
      motivo: "Novo motivo",
    });

    expect(ParadasAtivosRepository.prototype.update).toHaveBeenCalledWith("parada-1", {
      motivo: "Novo motivo",
    });
    expect(result).toEqual({
      id: "parada-1",
      motivo: "Novo motivo",
    });
  });

  it("should encerrar parada aberta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "ABERTA",
    } as never);
    jest.spyOn(ParadasAtivosRepository.prototype, "encerrar").mockResolvedValue({
      id: "parada-1",
      status: "ENCERRADA",
    } as never);

    const result = await service.encerrar("parada-1", "2026-06-10T11:00:00.000Z");

    expect(ParadasAtivosRepository.prototype.encerrar).toHaveBeenCalledWith(
      "parada-1",
      new Date("2026-06-10T11:00:00.000Z"),
    );
    expect(result).toEqual({
      id: "parada-1",
      status: "ENCERRADA",
    });
  });

  it("should bloquear encerramento de parada não aberta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "ENCERRADA",
    } as never);

    await expect(service.encerrar("parada-1")).rejects.toBeInstanceOf(AppError);
  });

  it("should cancelar parada aberta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "ABERTA",
    } as never);
    jest.spyOn(ParadasAtivosRepository.prototype, "cancelar").mockResolvedValue({
      id: "parada-1",
      status: "CANCELADA",
    } as never);

    const result = await service.cancelar("parada-1", "Cancelada");

    expect(ParadasAtivosRepository.prototype.cancelar).toHaveBeenCalledWith(
      "parada-1",
      "Cancelada",
    );
    expect(result).toEqual({
      id: "parada-1",
      status: "CANCELADA",
    });
  });

  it("should bloquear cancelamento de parada não aberta", async () => {
    jest.spyOn(ParadasAtivosRepository.prototype, "findById").mockResolvedValue({
      id: "parada-1",
      status: "CANCELADA",
    } as never);

    await expect(service.cancelar("parada-1")).rejects.toBeInstanceOf(AppError);
  });
});
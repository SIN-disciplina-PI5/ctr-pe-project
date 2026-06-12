import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { OrdensServicoService } from "./ordens-servico.service.js";
import { OrdensServicoRepository } from "./ordens-servico.repository.js";
import { AlertasRepository } from "../alertas/alertas.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("OrdensServicoService", () => {
  let service: OrdensServicoService;

  beforeEach(() => {
    service = new OrdensServicoService();
    jest.restoreAllMocks();
  });

  it("should listar O.S.", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

    const result = await service.findAll({ empresaId: "empresa-1" });

    expect(result).toEqual([{ id: "1" }]);
    expect(OrdensServicoRepository.prototype.findAll).toHaveBeenCalledWith({
      empresaId: "empresa-1",
    });
  });

  it("should retornar O.S. por id", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);

    const result = await service.findById("1");

    expect(result).toEqual({
      id: "1",
      status: "ABERTA",
    });
  });

  it("should lançar 404 quando O.S. não existir", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findById("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should criar O.S. com número informado e sem alerta quando não impacta disponibilidade", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "findByNumero").mockResolvedValue(null);
    jest.spyOn(OrdensServicoRepository.prototype, "create").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      numero: "OS-2026-0001",
      impactaDisponibilidade: false,
    } as never);
    const alertaSpy = jest.spyOn(AlertasRepository.prototype, "createAtivoParado");

    const result = await service.create({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      numero: "OS-2026-0001",
      titulo: "Troca de rolamento",
      descricao: "Teste",
      impactaDisponibilidade: false,
    });

    expect(OrdensServicoRepository.prototype.create).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      numero: "OS-2026-0001",
      titulo: "Troca de rolamento",
      descricao: "Teste",
      impactaDisponibilidade: false,
    });
    expect(alertaSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "1",
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      numero: "OS-2026-0001",
      impactaDisponibilidade: false,
    });
  });

  it("should criar O.S. gerando número automaticamente", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);

    const findByNumeroSpy = jest
      .spyOn(OrdensServicoRepository.prototype, "findByNumero")
      .mockResolvedValueOnce(null) // generateNumero
      .mockResolvedValueOnce(null); // validação final

    jest.spyOn(OrdensServicoRepository.prototype, "create").mockResolvedValue({
      id: "1",
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      numero: "OS-2026-0001",
      impactaDisponibilidade: true,
    } as never);

    const alertaSpy = jest
      .spyOn(AlertasRepository.prototype, "createAtivoParado")
      .mockResolvedValue({ id: "alerta-1" } as never);

    const result = await service.create({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      titulo: "Troca de rolamento",
      descricao: "Teste",
    });

    expect(findByNumeroSpy).toHaveBeenCalled();
    expect(OrdensServicoRepository.prototype.create).toHaveBeenCalledWith(
      expect.objectContaining({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        titulo: "Troca de rolamento",
        descricao: "Teste",
        impactaDisponibilidade: true,
      }),
    );
    expect(alertaSpy).toHaveBeenCalledWith({
      empresaId: "empresa-1",
      ativoId: "ativo-1",
      motivo: expect.stringContaining("O.S."),
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: "1",
        numero: "OS-2026-0001",
      }),
    );
  });

  it("should lançar 404 ao criar quando ativo não existir ou estiver inativo", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAtivoById").mockResolvedValue(null);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        titulo: "Teste",
        descricao: "Teste",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 400 ao criar quando ativo for de outra empresa", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-2",
      ativo: true,
    } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        titulo: "Teste",
        descricao: "Teste",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should lançar 409 ao criar quando número já estiver em uso", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findAtivoById").mockResolvedValue({
      id: "ativo-1",
      empresaId: "empresa-1",
      ativo: true,
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "findByNumero").mockResolvedValue({
      id: "os-existente",
    } as never);

    await expect(
      service.create({
        empresaId: "empresa-1",
        ativoId: "ativo-1",
        numero: "OS-2026-0001",
        titulo: "Teste",
        descricao: "Teste",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should iniciar O.S. aberta", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
      iniciadaEm: null,
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "iniciar").mockResolvedValue({
      id: "1",
      status: "EM_EXECUCAO",
    } as never);

    const result = await service.iniciar("1", "2026-06-11T10:00:00.000Z");

    expect(OrdensServicoRepository.prototype.iniciar).toHaveBeenCalledWith(
      "1",
      new Date("2026-06-11T10:00:00.000Z"),
    );
    expect(result).toEqual({
      id: "1",
      status: "EM_EXECUCAO",
    });
  });

  it("should lançar 400 ao iniciar O.S. não aberta", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ENCERRADA",
    } as never);

    await expect(service.iniciar("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should aguardar peça com O.S. em execução", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "EM_EXECUCAO",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "aguardarPeca").mockResolvedValue({
      id: "1",
      status: "AGUARDANDO_PECA",
    } as never);
    const alertaSpy = jest
      .spyOn(AlertasRepository.prototype, "createOSAguardandoPeca")
      .mockResolvedValue({ id: "alerta-1" } as never);

    const result = await service.aguardarPeca("1", "Falta peça");

    expect(OrdensServicoRepository.prototype.aguardarPeca).toHaveBeenCalledWith("1", "Falta peça");
    expect(alertaSpy).toHaveBeenCalledWith({
      ordemServicoId: "1",
      observacao: "Falta peça",
    });
    expect(result).toEqual({
      id: "1",
      status: "AGUARDANDO_PECA",
    });
  });

  it("should lançar 400 ao aguardar peça fora de EM_EXECUCAO", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);

    await expect(service.aguardarPeca("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should retomar O.S. aguardando peça", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "AGUARDANDO_PECA",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "retomar").mockResolvedValue({
      id: "1",
      status: "EM_EXECUCAO",
    } as never);

    const result = await service.retomar("1", "Peça chegou");

    expect(OrdensServicoRepository.prototype.retomar).toHaveBeenCalledWith("1", "Peça chegou");
    expect(result).toEqual({
      id: "1",
      status: "EM_EXECUCAO",
    });
  });

  it("should lançar 400 ao retomar fora de AGUARDANDO_PECA", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);

    await expect(service.retomar("1")).rejects.toBeInstanceOf(AppError);
  });

  it("should encerrar O.S. em execução", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "EM_EXECUCAO",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "encerrar").mockResolvedValue({
      id: "1",
      status: "ENCERRADA",
    } as never);

    const result = await service.encerrar("1", {
      diagnostico: "Falha elétrica",
      solucao: "Troca de cabo",
      observacao: "OK",
      encerradaEm: "2026-06-11T12:00:00.000Z",
    });

    expect(OrdensServicoRepository.prototype.encerrar).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        diagnostico: "Falha elétrica",
        solucao: "Troca de cabo",
        observacao: "OK",
        encerradaEm: new Date("2026-06-11T12:00:00.000Z"),
      }),
    );
    expect(result).toEqual({
      id: "1",
      status: "ENCERRADA",
    });
  });

  it("should lançar 400 ao encerrar fora de EM_EXECUCAO ou AGUARDANDO_PECA", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);

    await expect(service.encerrar("1", {})).rejects.toBeInstanceOf(AppError);
  });

  it("should cancelar O.S. válida", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "cancelar").mockResolvedValue({
      id: "1",
      status: "CANCELADA",
    } as never);

    const result = await service.cancelar("1", {
      motivo: "Aberta por engano",
      canceladaEm: "2026-06-11T12:00:00.000Z",
    });

    expect(OrdensServicoRepository.prototype.cancelar).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        motivo: "Aberta por engano",
        canceladaEm: new Date("2026-06-11T12:00:00.000Z"),
      }),
    );
    expect(result).toEqual({
      id: "1",
      status: "CANCELADA",
    });
  });

  it("should lançar 400 ao cancelar O.S. encerrada", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ENCERRADA",
    } as never);

    await expect(service.cancelar("1", {})).rejects.toBeInstanceOf(AppError);
  });

  it("should atualizar O.S. convertendo prazoEm", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "update").mockResolvedValue({
      id: "1",
    } as never);

    const result = await service.update("1", {
      titulo: "Atualizada",
      prazoEm: "2026-06-20T10:00:00.000Z",
    });

    expect(OrdensServicoRepository.prototype.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        titulo: "Atualizada",
        prazoEm: new Date("2026-06-20T10:00:00.000Z"),
      }),
    );
    expect(result).toEqual({ id: "1" });
  });

  it("should atualizar O.S. com prazoEm null", async () => {
    jest.spyOn(OrdensServicoRepository.prototype, "findById").mockResolvedValue({
      id: "1",
      status: "ABERTA",
    } as never);
    jest.spyOn(OrdensServicoRepository.prototype, "update").mockResolvedValue({
      id: "1",
    } as never);

    await service.update("1", {
      prazoEm: null,
    });

    expect(OrdensServicoRepository.prototype.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        prazoEm: null,
      }),
    );
  });
});
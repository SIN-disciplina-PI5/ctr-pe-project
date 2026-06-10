import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { DashboardService } from "./dashboard.service.js";
import { DashboardRepository } from "./dashboard.repository.js";

describe("DashboardService", () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
    jest.restoreAllMocks();
  });

  it("should montar resumo", async () => {
    jest
      .spyOn(DashboardRepository.prototype, "countOsAbertas")
      .mockResolvedValue(10);
    jest
      .spyOn(DashboardRepository.prototype, "countOsAguardandoPeca")
      .mockResolvedValue(3);
    jest
      .spyOn(DashboardRepository.prototype, "countOsAtrasadas")
      .mockResolvedValue(2);
    jest
      .spyOn(DashboardRepository.prototype, "countMaquinasParadas")
      .mockResolvedValue(4);
    jest.spyOn(DashboardRepository.prototype, "aggregateCustos").mockResolvedValue({
      custoMateriais: 100,
      custoMaoObra: 50,
      custoTotal: 150,
    });
    jest
      .spyOn(DashboardRepository.prototype, "aggregateTempoParado")
      .mockResolvedValue(120);

    const result = await service.getResumo("empresa-1");

    expect(result).toEqual({
      indicadores: {
        maquinasParadas: 4,
        osAbertas: 10,
        osAguardandoPeca: 3,
        osAtrasadas: 2,
        custoTotal: 150,
        tempoMedioParadoMinutos: 120,
      },
    });
  });

  it("should montar ativos agrupados", async () => {
    jest.spyOn(DashboardRepository.prototype, "getAtivosAgrupados").mockResolvedValue({
      porStatus: [
        { status: "DISPONIVEL", _count: 5 },
        { status: "PARADO", _count: 2 },
      ] as never[],
      porCriticidade: [
        { criticidade: "ALTA", _count: 3 },
        { criticidade: "MEDIA", _count: 4 },
      ] as never[],
    });

    const result = await service.getAtivos("empresa-1");

    expect(result).toEqual({
      ativosPorStatus: [
        { status: "DISPONIVEL", quantidade: 5 },
        { status: "PARADO", quantidade: 2 },
      ],
      ativosPorCriticidade: [
        { criticidade: "ALTA", quantidade: 3 },
        { criticidade: "MEDIA", quantidade: 4 },
      ],
    });
  });

  it("should montar ordens de serviço agrupadas", async () => {
    jest.spyOn(DashboardRepository.prototype, "getOsAgrupadas").mockResolvedValue({
      porTipo: [
        { tipo: "CORRETIVA", _count: 6 },
        { tipo: "PREVENTIVA", _count: 1 },
      ] as never[],
      porPrioridade: [
        { prioridade: "ALTA", _count: 2 },
        { prioridade: "CRITICA", _count: 1 },
      ] as never[],
    });

    const result = await service.getOrdensServico("empresa-1");

    expect(result).toEqual({
      osPorTipo: [
        { tipo: "CORRETIVA", quantidade: 6 },
        { tipo: "PREVENTIVA", quantidade: 1 },
      ],
      osPorPrioridade: [
        { prioridade: "ALTA", quantidade: 2 },
        { prioridade: "CRITICA", quantidade: 1 },
      ],
    });
  });

  it("should montar materiais críticos convertendo números", async () => {
    jest.spyOn(DashboardRepository.prototype, "getMateriaisCriticos").mockResolvedValue([
      {
        id: "mat-1",
        codigo: "MAT-1",
        nome: "Rolamento",
        estoqueAtual: "2",
        estoqueMinimo: "5",
      },
    ] as never[]);

    const result = await service.getMateriais("empresa-1");

    expect(result).toEqual({
      materiaisCriticos: [
        {
          id: "mat-1",
          codigo: "MAT-1",
          nome: "Rolamento",
          estoqueAtual: 2,
          estoqueMinimo: 5,
        },
      ],
    });
  });

  it("should retornar custos", async () => {
    jest.spyOn(DashboardRepository.prototype, "aggregateCustos").mockResolvedValue({
      custoMateriais: 300,
      custoMaoObra: 200,
      custoTotal: 500,
    });

    const result = await service.getCustos("empresa-1");

    expect(result).toEqual({
      custoMateriais: 300,
      custoMaoObra: 200,
      custoTotal: 500,
    });
  });
});
import { describe, expect, it, jest } from "@jest/globals";
import { EstoqueForecastService } from "./estoque-forecast.service.js";

describe("EstoqueForecastService", () => {
  it("calcula consumo médio mensal e dias até ruptura mesmo acima do estoque mínimo estático", () => {
    const previsao = EstoqueForecastService.calcularMetricasRuptura({
      materialId: "mat-1",
      codigo: "ROL-6205",
      nome: "Rolamento 6205 ZZ",
      unidade: "UN",
      estoqueAtual: 20,
      estoqueMinimo: 5,
      consumoTotalPeriodo: 180,
      janelaDias: 90,
      horizonteAlertaDias: 15,
      referenciaAgora: new Date("2026-11-15T00:00:00.000Z"),
    });

    expect(previsao.consumoMedioDiario).toBe(2);
    expect(previsao.consumoMedioMensal).toBe(60);
    expect(previsao.diasParaRuptura).toBe(10);
    expect(previsao.risco).toBe("ATENCAO_RUPTURA");
    expect(previsao.sugestaoReposicao).toBe(105);
  });

  it("dispara alerta proativo quando ruptura prevista está dentro do horizonte mesmo com estoque > mínimo", async () => {
    const service = new EstoqueForecastService();
    jest.spyOn(service, "calcularPrevisaoMaterial").mockResolvedValue({
      materialId: "mat-2",
      codigo: "COR-B52",
      nome: "Correia Industrial B52",
      unidade: "UN",
      estoqueAtual: 12,
      estoqueMinimo: 4,
      consumoTotalPeriodo: 180,
      janelaDias: 90,
      consumoMedioMensal: 60,
      consumoMedioDiario: 2,
      diasParaRuptura: 6,
      dataRupturaPrevista: "2026-11-21T00:00:00.000Z",
      risco: "RUPTURA_IMINENTE",
      sugestaoReposicao: 112,
    });

    const alertaSpy = jest
      .spyOn(
        (service as unknown as {
          alertasRepository: { createPrevisaoRupturaEstoque: (d: unknown) => Promise<unknown> };
        }).alertasRepository,
        "createPrevisaoRupturaEstoque",
      )
      .mockResolvedValue({ id: "alerta-ruptura-1" });

    const resultado = await service.avaliarEDispararAlertaProativo("emp-1", "mat-2");

    expect(resultado.disparado).toBe(true);
    expect(alertaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        empresaId: "emp-1",
        materialId: "mat-2",
        diasParaRuptura: 6,
      }),
    );
  });
});

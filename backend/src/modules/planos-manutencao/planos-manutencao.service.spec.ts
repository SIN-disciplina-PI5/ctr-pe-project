import { describe, expect, it, jest } from "@jest/globals";
import { PlanosManutencaoService } from "./planos-manutencao.service.js";

describe("PlanosManutencaoService", () => {
  it("gera OS preventiva com checklist formatado, avança próxima execução e alerta falta de material", async () => {
    const referenceDate = new Date("2026-11-15T10:00:00.000Z");

    const osCreateMock = jest.fn(async () => ({
      id: "os-prev-1",
      numero: "OS-2026-0011-123",
      titulo: "[Preventiva] Lubrificação e inspeção trimestral",
      tipo: "PREVENTIVA",
    }));
    const planoUpdateMock = jest.fn(async () => ({}));
    const alertaCreateMock = jest.fn(async () => ({}));

    const mockDb = {
      planoManutencao: {
        findFirst: jest.fn(async () => ({
          id: "plano-1",
          empresaId: "emp-1",
          ativoId: "ativo-1",
          responsavelId: "tec-1",
          titulo: "Lubrificação e inspeção trimestral",
          descricao: "Manutenção preventiva padrão do redutor",
          prioridade: "ALTA",
          periodicidadeDias: 90,
          antecedenciaAlertaDias: 5,
          checklist: ["Verificar nível de óleo", "Reapertar mancais"],
          ultimaExecucaoEm: null,
          proximaExecucaoEm: referenceDate,
          ativo: true,
          createdAt: referenceDate,
          updatedAt: referenceDate,
          ativoRef: {
            id: "ativo-1",
            codigo: "RED-01",
            nome: "Redutor Principal",
            localizacaoId: "loc-1",
          },
          responsavel: { id: "tec-1", nome: "Carlos" },
          materiais: [
            {
              id: "pm-1",
              planoManutencaoId: "plano-1",
              materialId: "mat-1",
              quantidade: 5,
              createdAt: referenceDate,
              updatedAt: referenceDate,
              material: {
                id: "mat-1",
                codigo: "OLE-320",
                nome: "Óleo ISO VG 320",
                unidade: "L",
                estoqueAtual: 2,
                custoMedio: 40,
              },
            },
          ],
        })),
      },
      ordemServico: {
        count: jest.fn(async () => 10),
      },
      $transaction: jest.fn(
        async (callback: (tx: unknown) => Promise<unknown>) =>
          callback({
            ordemServico: { create: osCreateMock },
            planoManutencao: { update: planoUpdateMock },
            alerta: { create: alertaCreateMock },
          }),
      ),
    };

    const service = new PlanosManutencaoService(mockDb as never);

    const result = await service.gerarOrdemServico(
      "plano-1",
      "emp-1",
      "sup-1",
      referenceDate,
    );

    expect(result.ordemServico.tipo).toBe("PREVENTIVA");
    expect(result.materiaisInsuficientes).toEqual([
      "OLE-320 (Óleo ISO VG 320)",
    ]);
    expect(osCreateMock).toHaveBeenCalledTimes(1);
    expect(planoUpdateMock).toHaveBeenCalledWith({
      where: { id: "plano-1" },
      data: {
        ultimaExecucaoEm: referenceDate,
        proximaExecucaoEm: new Date("2027-02-13T10:00:00.000Z"),
      },
    });
    expect(alertaCreateMock).toHaveBeenCalledTimes(1);
  });

  it("processa planos vencidos gerando OS e dispara alerta para planos próximos do vencimento", async () => {
    const referenceDate = new Date("2026-11-15T10:00:00.000Z");
    const alertaCreateMock = jest.fn(async () => ({}));

    const mockDb = {
      planoManutencao: {
        findMany: jest.fn(async () => [
          {
            id: "plano-vencido",
            empresaId: "emp-1",
            ativoId: "ativo-1",
            titulo: "Troca de filtros",
            periodicidadeDias: 30,
            antecedenciaAlertaDias: 3,
            proximaExecucaoEm: new Date("2026-11-14T10:00:00.000Z"),
            ativo: true,
            ativoRef: { id: "ativo-1", codigo: "CMP-01", nome: "Compressor" },
          },
          {
            id: "plano-proximo",
            empresaId: "emp-1",
            ativoId: "ativo-2",
            titulo: "Inspeção elétrica",
            periodicidadeDias: 60,
            antecedenciaAlertaDias: 5,
            proximaExecucaoEm: new Date("2026-11-18T10:00:00.000Z"),
            ativo: true,
            ativoRef: { id: "ativo-2", codigo: "QDG-01", nome: "Quadro Geral" },
          },
        ]),
      },
      alerta: {
        findFirst: jest.fn(async () => null),
        create: alertaCreateMock,
      },
    };

    const service = new PlanosManutencaoService(mockDb as never);
    const gerarSpy = jest
      .spyOn(service, "gerarOrdemServico")
      .mockResolvedValue({ ordemServico: {} as never, materiaisInsuficientes: [] });

    const summary = await service.processarPlanosVencidos("emp-1", referenceDate);

    expect(summary).toEqual({
      planosAvaliados: 2,
      osGeradas: 1,
      alertasCriados: 1,
    });
    expect(gerarSpy).toHaveBeenCalledWith(
      "plano-vencido",
      "emp-1",
      undefined,
      referenceDate,
    );
    expect(alertaCreateMock).toHaveBeenCalledTimes(1);
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import type { LlmProvider } from "./llm-provider.js";
import {
  TroubleshootAgentService,
  type TroubleshootDataSource,
} from "./troubleshoot-agent.service.js";

function createMockLlm(data: unknown): LlmProvider {
  return {
    generateStructured: jest.fn(async () => ({
      data: data as never,
      provider: "groq",
      model: "openai/gpt-oss-20b",
      latencyMs: 120,
      inputTokens: 250,
      outputTokens: 140,
      totalTokens: 390,
    })),
  };
}

describe("TroubleshootAgentService", () => {
  it("gera diagnóstico estruturado cruzando histórico de OS, MTTR e disponibilidade de estoque", async () => {
    const dataSource: TroubleshootDataSource = {
      findOrdemServico: jest.fn(async () => ({
        id: "os-atual-1",
        ativoId: "ativo-1",
        numero: "OS-2026-099",
        titulo: "Superaquecimento no redutor principal",
        descricao: "Temperatura acima de 95°C após 2h de operação",
        tipo: "CORRETIVA",
      })),
      findAtivo: jest.fn(async () => ({
        id: "ativo-1",
        codigo: "EXT-01",
        nome: "Extrusora Linha 1",
        tipo: "MAQUINA",
        marca: "Battenfeld",
        modelo: "EX-90",
      })),
      findHistoricalClosedOS: jest.fn(async () => [
        {
          id: "os-hist-1",
          ativoId: "ativo-1",
          numero: "OS-2026-012",
          titulo: "Aquecimento excessivo no redutor",
          descricao: "Ruído e alta temperatura",
          tipo: "CORRETIVA",
          diagnostico: "Rolamento autocompensador desgastado e óleo degradado",
          solucao: "Substituição do rolamento e troca de óleo sintético",
          tempoExecucaoMinutos: 180,
          tempoParadoMinutos: 240,
          materiais: [
            {
              materialId: "mat-1",
              quantidade: 1,
              material: {
                id: "mat-1",
                codigo: "ROL-22215",
                nome: "Rolamento Autocompensador 22215",
                unidade: "UN",
                estoqueAtual: 3,
              },
            },
            {
              materialId: "mat-2",
              quantidade: 10,
              material: {
                id: "mat-2",
                codigo: "OLE-ISO320",
                nome: "Óleo Sintético ISO VG 320",
                unidade: "L",
                estoqueAtual: 0,
              },
            },
          ],
        },
        {
          id: "os-hist-2",
          ativoId: "ativo-2",
          numero: "OS-2026-030",
          titulo: "Vazamento e aquecimento redutor EX-90",
          descricao: "Retentor ressecado",
          tipo: "CORRETIVA",
          diagnostico: "Falha no retentor do eixo de entrada",
          solucao: "Troca do retentor e rolamento",
          tempoExecucaoMinutos: 120,
          tempoParadoMinutos: 180,
          materiais: [
            {
              materialId: "mat-1",
              quantidade: 1,
              material: {
                id: "mat-1",
                codigo: "ROL-22215",
                nome: "Rolamento Autocompensador 22215",
                unidade: "UN",
                estoqueAtual: 3,
              },
            },
          ],
        },
      ]),
    };

    const llm = createMockLlm({
      resumoDiagnostico:
        "O histórico aponta desgaste no rolamento do redutor e degradação do lubrificante como causas principais.",
      causasProvaveis: [
        {
          causa: "Desgaste do rolamento autocompensador do redutor",
          probabilidade: "ALTA",
          justificativa:
            "Ocorreu na OS-2026-012 deste mesmo ativo com sintoma idêntico de superaquecimento.",
        },
      ],
      acoesRecomendadas: [
        "Verificar nível e viscosidade do óleo do redutor",
        "Medir vibração e folga axial no eixo de entrada",
      ],
      codigosMateriaisRelevantes: [
        "ROL-22215",
        "OLE-ISO320",
        "CODIGO-ALUCINADO",
      ],
    });

    const service = new TroubleshootAgentService(llm, dataSource);
    const result = await service.troubleshoot({
      empresaId: "empresa-1",
      ordemServicoId: "os-atual-1",
    });

    expect(result.ativo.codigo).toBe("EXT-01");
    expect(result.metricasHistoricas).toEqual({
      totalOsAnalisadas: 2,
      osDoMesmoAtivo: 1,
      mttrMinutos: 150,
      tempoMedioParadaMinutos: 210,
    });
    expect(result.materiaisSugeridos).toEqual([
      {
        materialId: "mat-1",
        codigo: "ROL-22215",
        nome: "Rolamento Autocompensador 22215",
        unidade: "UN",
        frequenciaHistorica: 2,
        estoqueAtual: 3,
        disponivelEmEstoque: true,
      },
      {
        materialId: "mat-2",
        codigo: "OLE-ISO320",
        nome: "Óleo Sintético ISO VG 320",
        unidade: "L",
        frequenciaHistorica: 1,
        estoqueAtual: 0,
        disponivelEmEstoque: false,
      },
    ]);
  });

  it("lança NOT_FOUND quando a OS não pertence à empresa do usuário", async () => {
    const dataSource: TroubleshootDataSource = {
      findOrdemServico: jest.fn(async () => null),
      findAtivo: jest.fn(async () => null),
      findHistoricalClosedOS: jest.fn(async () => []),
    };

    const service = new TroubleshootAgentService(
      createMockLlm({}),
      dataSource,
    );

    await expect(
      service.troubleshoot({
        empresaId: "empresa-1",
        ordemServicoId: "os-outra-empresa",
      }),
    ).rejects.toMatchObject<Partial<AppError>>({
      statusCode: 404,
      errorCode: "NOT_FOUND",
    });
  });
});

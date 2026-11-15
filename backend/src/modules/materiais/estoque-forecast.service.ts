import { prisma } from "../../prisma/prisma.client.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { AlertasRepository } from "../alertas/alertas.repository.js";

export type NivelRiscoRuptura =
  | "RUPTURA_IMINENTE"
  | "ATENCAO_RUPTURA"
  | "ABAIXO_MINIMO"
  | "SAUDAVEL"
  | "SEM_CONSUMO_RECENTE";

export interface PrevisaoRupturaMaterial {
  materialId: string;
  codigo: string;
  nome: string;
  unidade: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  consumoTotalPeriodo: number;
  janelaDias: number;
  consumoMedioMensal: number;
  consumoMedioDiario: number;
  diasParaRuptura: number | null;
  dataRupturaPrevista: string | null;
  risco: NivelRiscoRuptura;
  sugestaoReposicao: number;
}

interface ForecastOptions {
  janelaDias?: number;
  horizonteAlertaDias?: number;
}

export class EstoqueForecastService {
  private alertasRepository = new AlertasRepository();

  static calcularMetricasRuptura(params: {
    materialId: string;
    codigo: string;
    nome: string;
    unidade: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    consumoTotalPeriodo: number;
    janelaDias: number;
    horizonteAlertaDias: number;
    referenciaAgora?: Date;
  }): PrevisaoRupturaMaterial {
    const agora = params.referenciaAgora ?? new Date();
    const janela = Math.max(1, params.janelaDias);
    const consumoDiarioRaw = params.consumoTotalPeriodo / janela;
    const consumoMensalRaw = consumoDiarioRaw * 30;

    const consumoMedioDiario = Number(consumoDiarioRaw.toFixed(3));
    const consumoMedioMensal = Number(consumoMensalRaw.toFixed(2));

    let diasParaRuptura: number | null = null;
    let dataRupturaPrevista: string | null = null;

    if (consumoDiarioRaw > 0) {
      diasParaRuptura = Math.max(0, Math.floor(params.estoqueAtual / consumoDiarioRaw));
      const dataPrevista = new Date(agora.getTime() + diasParaRuptura * 24 * 60 * 60 * 1000);
      dataRupturaPrevista = dataPrevista.toISOString();
    }

    let risco: NivelRiscoRuptura = "SAUDAVEL";
    if (diasParaRuptura !== null && diasParaRuptura <= 7) {
      risco = "RUPTURA_IMINENTE";
    } else if (diasParaRuptura !== null && diasParaRuptura <= params.horizonteAlertaDias) {
      risco = "ATENCAO_RUPTURA";
    } else if (params.estoqueAtual <= params.estoqueMinimo) {
      risco = "ABAIXO_MINIMO";
    } else if (consumoDiarioRaw === 0) {
      risco = "SEM_CONSUMO_RECENTE";
    }

    const alvoCobertura60Dias = consumoMensalRaw * 2 + params.estoqueMinimo;
    const sugestaoReposicao = Math.max(0, Math.ceil(alvoCobertura60Dias - params.estoqueAtual));

    return {
      materialId: params.materialId,
      codigo: params.codigo,
      nome: params.nome,
      unidade: params.unidade,
      estoqueAtual: params.estoqueAtual,
      estoqueMinimo: params.estoqueMinimo,
      consumoTotalPeriodo: Number(params.consumoTotalPeriodo.toFixed(3)),
      janelaDias: janela,
      consumoMedioMensal,
      consumoMedioDiario,
      diasParaRuptura,
      dataRupturaPrevista,
      risco,
      sugestaoReposicao,
    };
  }

  async calcularPrevisaoEmpresa(empresaId: string, options: ForecastOptions = {}) {
    const janelaDias = options.janelaDias ?? 90;
    const horizonteAlertaDias = options.horizonteAlertaDias ?? 15;
    const dataInicio = new Date(Date.now() - janelaDias * 24 * 60 * 60 * 1000);

    const [materiais, consumos] = await Promise.all([
      prisma.material.findMany({
        where: { empresaId, ativo: true },
        select: {
          id: true,
          codigo: true,
          nome: true,
          unidade: true,
          estoqueAtual: true,
          estoqueMinimo: true,
        },
      }),
      prisma.ordemServicoMaterial.groupBy({
        by: ["materialId"],
        where: {
          createdAt: { gte: dataInicio },
          ordemServico: { empresaId },
        },
        _sum: { quantidade: true },
      }),
    ]);

    const consumoPorMaterial = new Map<string, number>();
    for (const item of consumos) {
      consumoPorMaterial.set(item.materialId, Number(item._sum.quantidade ?? 0));
    }

    const previsoes = materiais.map((material) =>
      EstoqueForecastService.calcularMetricasRuptura({
        materialId: material.id,
        codigo: material.codigo,
        nome: material.nome,
        unidade: material.unidade,
        estoqueAtual: Number(material.estoqueAtual ?? 0),
        estoqueMinimo: Number(material.estoqueMinimo ?? 0),
        consumoTotalPeriodo: consumoPorMaterial.get(material.id) ?? 0,
        janelaDias,
        horizonteAlertaDias,
      }),
    );

    previsoes.sort((a, b) => {
      if (a.diasParaRuptura === null && b.diasParaRuptura === null) return 0;
      if (a.diasParaRuptura === null) return 1;
      if (b.diasParaRuptura === null) return -1;
      return a.diasParaRuptura - b.diasParaRuptura;
    });

    return {
      janelaDias,
      horizonteAlertaDias,
      resumo: {
        totalAnalisados: previsoes.length,
        rupturaIminente: previsoes.filter((p) => p.risco === "RUPTURA_IMINENTE").length,
        atencaoRuptura: previsoes.filter((p) => p.risco === "ATENCAO_RUPTURA").length,
        abaixoMinimo: previsoes.filter((p) => p.risco === "ABAIXO_MINIMO").length,
      },
      itens: previsoes,
    };
  }

  async calcularPrevisaoMaterial(
    empresaId: string,
    materialId: string,
    options: ForecastOptions = {},
  ) {
    const janelaDias = options.janelaDias ?? 90;
    const horizonteAlertaDias = options.horizonteAlertaDias ?? 15;
    const dataInicio = new Date(Date.now() - janelaDias * 24 * 60 * 60 * 1000);

    const material = await prisma.material.findFirst({
      where: { id: materialId, empresaId },
      select: {
        id: true,
        codigo: true,
        nome: true,
        unidade: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
    });

    if (!material) {
      throw new AppError({
        message: "Material não encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const agregado = await prisma.ordemServicoMaterial.aggregate({
      where: {
        materialId: material.id,
        createdAt: { gte: dataInicio },
        ordemServico: { empresaId },
      },
      _sum: { quantidade: true },
    });

    return EstoqueForecastService.calcularMetricasRuptura({
      materialId: material.id,
      codigo: material.codigo,
      nome: material.nome,
      unidade: material.unidade,
      estoqueAtual: Number(material.estoqueAtual ?? 0),
      estoqueMinimo: Number(material.estoqueMinimo ?? 0),
      consumoTotalPeriodo: Number(agregado._sum.quantidade ?? 0),
      janelaDias,
      horizonteAlertaDias,
    });
  }

  async avaliarEDispararAlertaProativo(
    empresaId: string,
    materialId: string,
    options: ForecastOptions = {},
  ) {
    const horizonteAlertaDias = options.horizonteAlertaDias ?? 15;
    const previsao = await this.calcularPrevisaoMaterial(empresaId, materialId, options);

    if (
      previsao.diasParaRuptura !== null &&
      previsao.diasParaRuptura <= horizonteAlertaDias
    ) {
      const alerta = await this.alertasRepository.createPrevisaoRupturaEstoque({
        empresaId,
        materialId: previsao.materialId,
        materialCodigo: previsao.codigo,
        materialNome: previsao.nome,
        unidade: previsao.unidade,
        estoqueAtual: String(previsao.estoqueAtual),
        estoqueMinimo: String(previsao.estoqueMinimo),
        consumoMedioMensal: String(previsao.consumoMedioMensal),
        diasParaRuptura: previsao.diasParaRuptura,
      });

      return { disparado: true, previsao, alerta };
    }

    return { disparado: false, previsao, alerta: null };
  }

  async processarAlertasRupturaEmpresa(empresaId: string, options: ForecastOptions = {}) {
    const horizonteAlertaDias = options.horizonteAlertaDias ?? 15;
    const analise = await this.calcularPrevisaoEmpresa(empresaId, options);
    let alertasDisparados = 0;

    for (const item of analise.itens) {
      if (item.diasParaRuptura !== null && item.diasParaRuptura <= horizonteAlertaDias) {
        await this.alertasRepository.createPrevisaoRupturaEstoque({
          empresaId,
          materialId: item.materialId,
          materialCodigo: item.codigo,
          materialNome: item.nome,
          unidade: item.unidade,
          estoqueAtual: String(item.estoqueAtual),
          estoqueMinimo: String(item.estoqueMinimo),
          consumoMedioMensal: String(item.consumoMedioMensal),
          diasParaRuptura: item.diasParaRuptura,
        });
        alertasDisparados += 1;
      }
    }

    return {
      ...analise.resumo,
      alertasDisparados,
    };
  }
}

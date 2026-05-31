import { DashboardRepository } from "./dashboard.repository";

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  async getResumo(empresaId: string) {
    const agora = new Date();

    // Executa as queries em paralelo para melhorar a performance da API
    const [
      osAbertas,
      osAguardandoPeca,
      osAtrasadas,
      maquinasParadas,
      custos,
      tempoMedioParadoMinutos,
    ] = await Promise.all([
      dashboardRepository.countOsAbertas(empresaId),
      dashboardRepository.countOsAguardandoPeca(empresaId),
      dashboardRepository.countOsAtrasadas(empresaId, agora),
      dashboardRepository.countMaquinasParadas(empresaId),
      dashboardRepository.aggregateCustos(empresaId),
      dashboardRepository.aggregateTempoParado(empresaId),
    ]);

    return {
      indicadores: {
        maquinasParadas,
        osAbertas,
        osAguardandoPeca,
        osAtrasadas,
        custoTotal: custos.custoTotal,
        tempoMedioParadoMinutos,
      },
    };
  }

  async getAtivos(empresaId: string) {
    const { porStatus, porCriticidade } = await dashboardRepository.getAtivosAgrupados(empresaId);

    // Formata o retorno para o padrão que os gráficos do front costumam pedir (rótulo e valor)
    const ativosPorStatus = porStatus.map((item) => ({
      status: item.status,
      quantidade: item._count,
    }));

    const ativosPorCriticidade = porCriticidade.map((item) => ({
      criticidade: item.criticidade,
      quantidade: item._count,
    }));

    return { ativosPorStatus, ativosPorCriticidade };
  }

  async getOrdensServico(empresaId: string) {
    const { porTipo, porPrioridade } = await dashboardRepository.getOsAgrupadas(empresaId);

    const osPorTipo = porTipo.map((item) => ({
      tipo: item.tipo,
      quantidade: item._count,
    }));

    const osPorPrioridade = porPrioridade.map((item) => ({
      prioridade: item.prioridade,
      quantidade: item._count,
    }));

    return { osPorTipo, osPorPrioridade };
  }

  async getMateriais(empresaId: string) {
    const materiaisCriticos = await dashboardRepository.getMateriaisCriticos(empresaId);

    // Converte os valores decimais do Prisma para números normais no JS
    return {
      materiaisCriticos: materiaisCriticos.map((mat) => ({
        id: mat.id,
        codigo: mat.codigo,
        nome: mat.nome,
        estoqueAtual: Number(mat.estoqueAtual),
        estoqueMinimo: Number(mat.estoqueMinimo),
      })),
    };
  }

  async getCustos(empresaId: string) {
    const custos = await dashboardRepository.aggregateCustos(empresaId);
    return custos;
  }
}
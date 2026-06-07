export type DashboardResumo = {
  indicadores: {
    maquinasParadas: number;
    osAbertas: number;
    osAguardandoPeca: number;
    osAtrasadas: number;
    custoTotal: number;
    tempoMedioParadoMinutos: number;
  };
};

export type DashboardAtivos = {
  ativosPorStatus: Array<{
    status: string;
    quantidade: number;
  }>;
  ativosPorCriticidade: Array<{
    criticidade: string;
    quantidade: number;
  }>;
};

export type DashboardOrdensServico = {
  osPorTipo: Array<{
    tipo: string;
    quantidade: number;
  }>;
  osPorPrioridade: Array<{
    prioridade: string;
    quantidade: number;
  }>;
};

export type DashboardMateriais = {
  materiaisCriticos: Array<{
    id: string;
    codigo: string;
    nome: string;
    estoqueAtual: number;
    estoqueMinimo: number;
  }>;
};

export type DashboardCustos = {
  custoMateriais: number;
  custoMaoObra: number;
  custoTotal: number;
};
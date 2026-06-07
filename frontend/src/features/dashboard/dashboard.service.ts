import { apiClient } from "@/infrastructure/api/api-client";

import type {
  DashboardAtivos,
  DashboardCustos,
  DashboardMateriais,
  DashboardOrdensServico,
  DashboardResumo,
} from "./dashboard.types";

type DashboardParams = {
  empresaId?: string;
};

export const dashboardService = {
  async getResumo(params?: DashboardParams): Promise<DashboardResumo> {
    const { data } = await apiClient.get("/dashboard/resumo", { params });
    return data;
  },

  async getAtivos(params?: DashboardParams): Promise<DashboardAtivos> {
    const { data } = await apiClient.get("/dashboard/ativos", { params });
    return data;
  },

  async getOrdensServico(params?: DashboardParams): Promise<DashboardOrdensServico> {
    const { data } = await apiClient.get("/dashboard/ordens-servico", { params });
    return data;
  },

  async getMateriais(params?: DashboardParams): Promise<DashboardMateriais> {
    const { data } = await apiClient.get("/dashboard/materiais", { params });
    return data;
  },

  async getCustos(params?: DashboardParams): Promise<DashboardCustos> {
    const { data } = await apiClient.get("/dashboard/custos", { params });
    return data;
  },
};
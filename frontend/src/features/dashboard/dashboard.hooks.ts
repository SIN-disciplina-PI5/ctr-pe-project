import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "./dashboard.service";

type DashboardParams = {
  empresaId?: string;
};

const DASHBOARD_QUERY_KEY = ["dashboard"];

export function useDashboardResumo(params?: DashboardParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "resumo", params],
    queryFn: () => dashboardService.getResumo(params),
  });
}

export function useDashboardAtivos(params?: DashboardParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "ativos", params],
    queryFn: () => dashboardService.getAtivos(params),
  });
}

export function useDashboardOrdensServico(params?: DashboardParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "ordens-servico", params],
    queryFn: () => dashboardService.getOrdensServico(params),
  });
}

export function useDashboardMateriais(params?: DashboardParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "materiais", params],
    queryFn: () => dashboardService.getMateriais(params),
  });
}

export function useDashboardCustos(params?: DashboardParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "custos", params],
    queryFn: () => dashboardService.getCustos(params),
  });
}
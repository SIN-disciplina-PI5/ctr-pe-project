import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "./dashboard.service";

type DashboardParams = {
  empresaId?: string;
};

type DashboardQueryOptions = {
  refetchInterval?: number;
};

const DASHBOARD_QUERY_KEY = ["dashboard"];

export function useDashboardResumo(
  params?: DashboardParams,
  options?: DashboardQueryOptions,
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "resumo", params],
    queryFn: () => dashboardService.getResumo(params),
    ...(options ?? {}),
  });
}

export function useDashboardAtivos(
  params?: DashboardParams,
  options?: DashboardQueryOptions,
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "ativos", params],
    queryFn: () => dashboardService.getAtivos(params),
    ...(options ?? {}),
  });
}

export function useDashboardOrdensServico(
  params?: DashboardParams,
  options?: DashboardQueryOptions,
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "ordens-servico", params],
    queryFn: () => dashboardService.getOrdensServico(params),
    ...(options ?? {}),
  });
}

export function useDashboardMateriais(
  params?: DashboardParams,
  options?: DashboardQueryOptions,
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "materiais", params],
    queryFn: () => dashboardService.getMateriais(params),
    ...(options ?? {}),
  });
}

export function useDashboardCustos(
  params?: DashboardParams,
  options?: DashboardQueryOptions,
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "custos", params],
    queryFn: () => dashboardService.getCustos(params),
    ...(options ?? {}),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { StatusAlerta, TipoAlerta } from "@/types/alerta";

import {
  alertasService,
  type ListAlertasParams,
  type ListMeusAlertasParams,
} from "./alertas.service";

const ALERTAS_QUERY_KEY = ["alertas"];
const MEUS_ALERTAS_QUERY_KEY = ["meus-alertas"];

type AlertasQueryOptions = {
  refetchInterval?: number;
};

export function useAlertas(
  params?: ListAlertasParams,
  options?: AlertasQueryOptions,
) {
  return useQuery({
    queryKey: [...ALERTAS_QUERY_KEY, params],
    queryFn: () => alertasService.list(params),
    ...(options ?? {}),
  });
}

export function useMeusAlertas(params?: ListMeusAlertasParams) {
  return useQuery({
    queryKey: [...MEUS_ALERTAS_QUERY_KEY, params],
    queryFn: () => alertasService.listMe(params),
  });
}

export function useMarcarAlertaLido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertasService.marcarLido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEUS_ALERTAS_QUERY_KEY });
    },
  });
}

export function useResolverAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertasService.resolver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEUS_ALERTAS_QUERY_KEY });
    },
  });
}

export function useIgnorarAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertasService.ignorar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEUS_ALERTAS_QUERY_KEY });
    },
  });
}

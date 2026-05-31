import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAtivo,
  deleteAtivo,
  getAtivoById,
  listAtivos,
  updateAtivo,
  updateAtivoStatus,
} from "./ativos.service";
import type {
  CreateAtivoInput,
  ListAtivosParams,
  UpdateAtivoInput,
  UpdateStatusAtivoInput,
} from "./ativos.types";

const ATIVOS_QUERY_KEY = ["ativos"];

export function useAtivos(params?: ListAtivosParams) {
  return useQuery({
    queryKey: [...ATIVOS_QUERY_KEY, params],
    queryFn: () => listAtivos(params),
  });
}

export function useAtivo(id: string) {
  return useQuery({
    queryKey: [...ATIVOS_QUERY_KEY, id],
    queryFn: () => getAtivoById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAtivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAtivoInput) => createAtivo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATIVOS_QUERY_KEY });
    },
  });
}

export function useUpdateAtivo(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAtivoInput) => updateAtivo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATIVOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ATIVOS_QUERY_KEY, id] });
    },
  });
}

export function useUpdateAtivoStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStatusAtivoInput) => updateAtivoStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATIVOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ATIVOS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteAtivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAtivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATIVOS_QUERY_KEY });
    },
  });
}

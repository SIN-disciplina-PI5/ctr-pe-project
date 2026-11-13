import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paradasService,
  type CancelarParadaDto,
  type CreateParadaDto,
  type EncerrarParadaDto,
  type ListParadasParams,
  type UpdateParadaDto,
} from "./paradas.service";

export const PARADAS_QUERY_KEY = "paradas";

type ParadasQueryOptions = {
  refetchInterval?: number;
};

export function useParadas(
  params?: ListParadasParams,
  options?: ParadasQueryOptions,
) {
  return useQuery({
    queryKey: [PARADAS_QUERY_KEY, params],
    queryFn: () => paradasService.list(params),
    ...(options ?? {}),
  });
}

export function useParada(id: string) {
  return useQuery({
    queryKey: [PARADAS_QUERY_KEY, id],
    queryFn: () => paradasService.getById(id),
    enabled: !!id,
  });
}

export function useCreateParada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateParadaDto) => paradasService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARADAS_QUERY_KEY] });
    },
  });
}

export function useUpdateParada(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateParadaDto) => paradasService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARADAS_QUERY_KEY] });
    },
  });
}

export function useEncerrarParada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: EncerrarParadaDto }) =>
      paradasService.encerrar(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARADAS_QUERY_KEY] });
    },
  });
}

export function useCancelarParada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CancelarParadaDto }) =>
      paradasService.cancelar(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARADAS_QUERY_KEY] });
    },
  });
}

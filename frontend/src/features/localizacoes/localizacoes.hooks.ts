import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  localizacoesService,
  type CreateLocalizacaoDto,
  type ListLocalizacoesParams,
  type UpdateLocalizacaoDto,
} from "./localizacoes.service";

export const LOCALIZACOES_QUERY_KEY = "localizacoes";

export function useLocalizacoes(params?: ListLocalizacoesParams) {
  return useQuery({
    queryKey: [LOCALIZACOES_QUERY_KEY, params],
    queryFn: () => localizacoesService.list(params),
  });
}

export function useLocalizacao(id: string) {
  return useQuery({
    queryKey: [LOCALIZACOES_QUERY_KEY, id],
    queryFn: () => localizacoesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLocalizacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLocalizacaoDto) => localizacoesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCALIZACOES_QUERY_KEY] });
    },
  });
}

export function useUpdateLocalizacao(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateLocalizacaoDto) => localizacoesService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCALIZACOES_QUERY_KEY] });
    },
  });
}

export function useDeleteLocalizacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => localizacoesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCALIZACOES_QUERY_KEY] });
    },
  });
}
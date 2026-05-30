import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  empresasService,
  type CreateEmpresaDto,
  type ListEmpresasParams,
  type UpdateEmpresaDto,
} from "./empresas.service";

export const EMPRESAS_QUERY_KEY = "empresas";

export function useEmpresas(params?: ListEmpresasParams) {
  return useQuery({
    queryKey: [EMPRESAS_QUERY_KEY, params],
    queryFn: () => empresasService.list(params),
  });
}

export function useEmpresa(id: string) {
  return useQuery({
    queryKey: [EMPRESAS_QUERY_KEY, id],
    queryFn: () => empresasService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEmpresaDto) => empresasService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPRESAS_QUERY_KEY] });
    },
  });
}

export function useUpdateEmpresa(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateEmpresaDto) => empresasService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPRESAS_QUERY_KEY] });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => empresasService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPRESAS_QUERY_KEY] });
    },
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { osApontamentosService } from "./os-apontamentos.service";
import type {
  CreateApontamentoOSInput,
  EncerrarApontamentoOSInput,
  UpdateApontamentoOSInput,
} from "./os-apontamentos.types";

const OS_APONTAMENTOS_QUERY_KEY = ["os-apontamentos"];

export function useOSApontamentos(ordemServicoId: string) {
  return useQuery({
    queryKey: [...OS_APONTAMENTOS_QUERY_KEY, ordemServicoId],
    queryFn: () => osApontamentosService.listByOS(ordemServicoId),
    enabled: Boolean(ordemServicoId),
  });
}

export function useAddApontamentoOS(ordemServicoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateApontamentoOSInput) =>
      osApontamentosService.add(ordemServicoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...OS_APONTAMENTOS_QUERY_KEY, ordemServicoId],
      });
    },
  });
}

export function useUpdateApontamentoOS(ordemServicoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateApontamentoOSInput }) =>
      osApontamentosService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...OS_APONTAMENTOS_QUERY_KEY, ordemServicoId],
      });
    },
  });
}

export function useEncerrarApontamentoOS(ordemServicoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto?: EncerrarApontamentoOSInput }) =>
      osApontamentosService.encerrar(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...OS_APONTAMENTOS_QUERY_KEY, ordemServicoId],
      });
    },
  });
}

export function useDeleteApontamentoOS(ordemServicoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => osApontamentosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...OS_APONTAMENTOS_QUERY_KEY, ordemServicoId],
      });
    },
  });
}
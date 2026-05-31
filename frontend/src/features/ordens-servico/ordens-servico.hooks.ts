import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ordensServicoKeys } from "@/constants/query-keys";

import * as service from "./ordens-servico.service";
import type {
  CancelarOrdemServicoInput,
  CreateOrdemServicoInput,
  EncerrarOrdemServicoInput,
  ObservacaoInput,
  OrdensServicoFilters,
  UpdateOrdemServicoInput,
} from "./ordens-servico.schemas";

export function useOrdensServico(filters: OrdensServicoFilters = {}) {
  return useQuery({
    queryKey: ordensServicoKeys.list(filters),
    queryFn: () => service.listOrdensServico(filters),
  });
}

export function useOrdemServico(id: string) {
  return useQuery({
    queryKey: ordensServicoKeys.detail(id),
    queryFn: () => service.getOrdemServico(id),
    enabled: !!id,
  });
}

export function useCreateOrdemServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrdemServicoInput) =>
      service.createOrdemServico(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordensServicoKeys.lists() });
    },
  });
}

export function useUpdateOrdemServico(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrdemServicoInput) =>
      service.updateOrdemServico(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordensServicoKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ordensServicoKeys.lists() });
    },
  });
}

function useInvalidateOrdemServico(id: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ordensServicoKeys.detail(id) });
    queryClient.invalidateQueries({ queryKey: ordensServicoKeys.lists() });
  };
}

export function useIniciarOrdemServico(id: string) {
  const invalidate = useInvalidateOrdemServico(id);
  return useMutation({
    mutationFn: () => service.iniciarOrdemServico(id),
    onSuccess: invalidate,
  });
}

export function useAguardarPecaOrdemServico(id: string) {
  const invalidate = useInvalidateOrdemServico(id);
  return useMutation({
    mutationFn: (input: ObservacaoInput = {}) =>
      service.aguardarPecaOrdemServico(id, input),
    onSuccess: invalidate,
  });
}

export function useRetomarOrdemServico(id: string) {
  const invalidate = useInvalidateOrdemServico(id);
  return useMutation({
    mutationFn: (input: ObservacaoInput = {}) =>
      service.retomarOrdemServico(id, input),
    onSuccess: invalidate,
  });
}

export function useEncerrarOrdemServico(id: string) {
  const invalidate = useInvalidateOrdemServico(id);
  return useMutation({
    mutationFn: (input: EncerrarOrdemServicoInput = {}) =>
      service.encerrarOrdemServico(id, input),
    onSuccess: invalidate,
  });
}

export function useCancelarOrdemServico(id: string) {
  const invalidate = useInvalidateOrdemServico(id);
  return useMutation({
    mutationFn: (input: CancelarOrdemServicoInput = {}) =>
      service.cancelarOrdemServico(id, input),
    onSuccess: invalidate,
  });
}

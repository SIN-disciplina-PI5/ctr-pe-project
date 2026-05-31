import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  osMateriaisService,
  type AddMaterialDto,
  type CancelarMaterialOSDto,
  type UpdateMaterialOSDto,
} from "./os-materiais.service";

export const OS_MATERIAIS_QUERY_KEY = "os-materiais";

export function useOSMateriais(ordemServicoId: string) {
  return useQuery({
    queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId],
    queryFn: () => osMateriaisService.listByOS(ordemServicoId),
    enabled: !!ordemServicoId,
  });
}

export function useAddMaterialOS(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddMaterialDto) => osMateriaisService.add(ordemServicoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId] });
    },
  });
}

export function useUpdateMaterialOS(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMaterialOSDto }) =>
      osMateriaisService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId] });
    },
  });
}

export function useConsumirMaterialOS(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantidade }: { id: string; quantidade?: number }) =>
      osMateriaisService.consumir(id, quantidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId] });
    },
  });
}

export function useDevolverMaterialOS(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantidade }: { id: string; quantidade?: number }) =>
      osMateriaisService.devolver(id, quantidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId] });
    },
  });
}

export function useCancelarMaterialOS(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto?: CancelarMaterialOSDto }) =>
      osMateriaisService.cancelar(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OS_MATERIAIS_QUERY_KEY, ordemServicoId] });
    },
  });
}
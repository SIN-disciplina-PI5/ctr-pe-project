import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  listMateriais,
  updateMaterial,
  updateMaterialEstoque,
} from "./materiais.service";
import type {
  CreateMaterialInput,
  ListMateriaisParams,
  UpdateEstoqueMaterialInput,
  UpdateMaterialInput,
} from "./materiais.types";

const MATERIAIS_QUERY_KEY = ["materiais"];

export function useMateriais(params?: ListMateriaisParams) {
  return useQuery({
    queryKey: [...MATERIAIS_QUERY_KEY, params],
    queryFn: () => listMateriais(params),
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: [...MATERIAIS_QUERY_KEY, id],
    queryFn: () => getMaterialById(id),
    enabled: Boolean(id),
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialInput) => createMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIAIS_QUERY_KEY });
    },
  });
}

export function useUpdateMaterial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMaterialInput) => updateMaterial(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIAIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...MATERIAIS_QUERY_KEY, id] });
    },
  });
}

export function useUpdateMaterialEstoque(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEstoqueMaterialInput) =>
      updateMaterialEstoque(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIAIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...MATERIAIS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIAIS_QUERY_KEY });
    },
  });
}

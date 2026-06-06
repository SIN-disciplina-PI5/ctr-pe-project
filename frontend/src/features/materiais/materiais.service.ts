import { apiClient } from "@/infrastructure/api/api-client";

import type {
  CreateMaterialInput,
  ListMateriaisParams,
  Material,
  UpdateEstoqueMaterialInput,
  UpdateMaterialInput,
} from "./materiais.types";

const BASE_URL = "/materiais";

function mapParams(params?: ListMateriaisParams) {
  if (!params) return undefined;

  return {
    ...params,
    ativo: params.ativo === undefined ? undefined : String(params.ativo),
    estoqueBaixo:
      params.estoqueBaixo === undefined ? undefined : String(params.estoqueBaixo),
  };
}

export async function listMateriais(params?: ListMateriaisParams): Promise<Material[]> {
  const { data } = await apiClient.get<Material[]>(BASE_URL, {
    params: mapParams(params),
  });

  return data;
}

export async function getMaterialById(id: string): Promise<Material> {
  const { data } = await apiClient.get<Material>(`${BASE_URL}/${id}`);
  return data;
}

export async function createMaterial(payload: CreateMaterialInput): Promise<Material> {
  const { data } = await apiClient.post<Material>(BASE_URL, payload);
  return data;
}

export async function updateMaterial(
  id: string,
  payload: UpdateMaterialInput,
): Promise<Material> {
  const { data } = await apiClient.patch<Material>(`${BASE_URL}/${id}`, payload);
  return data;
}

export async function updateMaterialEstoque(
  id: string,
  payload: UpdateEstoqueMaterialInput,
): Promise<Material> {
  const { data } = await apiClient.patch<Material>(
    `${BASE_URL}/${id}/estoque`,
    payload,
  );

  return data;
}

export async function deleteMaterial(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}

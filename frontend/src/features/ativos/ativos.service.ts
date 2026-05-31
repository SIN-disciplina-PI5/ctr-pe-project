import { apiClient } from "@/infrastructure/api/api-client";

import type {
  Ativo,
  CreateAtivoInput,
  ListAtivosParams,
  UpdateAtivoInput,
  UpdateStatusAtivoInput,
} from "./ativos.types";

const BASE_URL = "/ativos";

export async function listAtivos(params?: ListAtivosParams): Promise<Ativo[]> {
  const { data } = await apiClient.get<Ativo[]>(BASE_URL, { params });
  return data;
}

export async function getAtivoById(id: string): Promise<Ativo> {
  const { data } = await apiClient.get<Ativo>(`${BASE_URL}/${id}`);
  return data;
}

export async function createAtivo(payload: CreateAtivoInput): Promise<Ativo> {
  const { data } = await apiClient.post<Ativo>(BASE_URL, payload);
  return data;
}

export async function updateAtivo(id: string, payload: UpdateAtivoInput): Promise<Ativo> {
  const { data } = await apiClient.patch<Ativo>(`${BASE_URL}/${id}`, payload);
  return data;
}

export async function updateAtivoStatus(
  id: string,
  payload: UpdateStatusAtivoInput,
): Promise<Ativo> {
  const { data } = await apiClient.patch<Ativo>(`${BASE_URL}/${id}/status`, payload);
  return data;
}

export async function deleteAtivo(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}

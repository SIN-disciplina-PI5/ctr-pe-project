import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";
import type { OrdemServico } from "@/types/ordem-servico";

import type {
  CancelarOrdemServicoInput,
  CreateOrdemServicoInput,
  EncerrarOrdemServicoInput,
  ObservacaoInput,
  OrdensServicoFilters,
  UpdateOrdemServicoInput,
} from "./ordens-servico.schemas";

export async function listOrdensServico(filters: OrdensServicoFilters = {}) {
  const { data } = await apiClient.get<OrdemServico[]>(
    endpoints.ordensServico.list,
    { params: filters },
  );
  return data;
}

export async function getOrdemServico(id: string) {
  const { data } = await apiClient.get<OrdemServico>(
    endpoints.ordensServico.byId(id),
  );
  return data;
}

export async function createOrdemServico(input: CreateOrdemServicoInput) {
  const { data } = await apiClient.post<OrdemServico>(
    endpoints.ordensServico.create,
    input,
  );
  return data;
}

export async function updateOrdemServico(
  id: string,
  input: UpdateOrdemServicoInput,
) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.byId(id),
    input,
  );
  return data;
}

export async function iniciarOrdemServico(id: string) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.iniciar(id),
  );
  return data;
}

export async function aguardarPecaOrdemServico(
  id: string,
  input: ObservacaoInput = {},
) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.aguardarPeca(id),
    input,
  );
  return data;
}

export async function retomarOrdemServico(
  id: string,
  input: ObservacaoInput = {},
) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.retomar(id),
    input,
  );
  return data;
}

export async function encerrarOrdemServico(
  id: string,
  input: EncerrarOrdemServicoInput = {},
) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.encerrar(id),
    input,
  );
  return data;
}

export async function cancelarOrdemServico(
  id: string,
  input: CancelarOrdemServicoInput = {},
) {
  const { data } = await apiClient.patch<OrdemServico>(
    endpoints.ordensServico.cancelar(id),
    input,
  );
  return data;
}

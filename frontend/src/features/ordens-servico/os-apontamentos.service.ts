import { apiClient } from "@/infrastructure/api/api-client";
import type {
  ApontamentoOS,
  CreateApontamentoOSInput,
  UpdateApontamentoOSInput,
  EncerrarApontamentoOSInput,
} from "./os-apontamentos.types";

export const osApontamentosService = {
  async listByOS(ordemServicoId: string): Promise<ApontamentoOS[]> {
    const { data } = await apiClient.get(`/ordens-servico/${ordemServicoId}/apontamentos`);
    return data;
  },

  async add(ordemServicoId: string, dto: CreateApontamentoOSInput): Promise<ApontamentoOS> {
    const { data } = await apiClient.post(`/ordens-servico/${ordemServicoId}/apontamentos`, dto);
    return data;
  },

  async update(id: string, dto: UpdateApontamentoOSInput): Promise<ApontamentoOS> {
    const { data } = await apiClient.patch(`/apontamentos-os/${id}`, dto);
    return data;
  },

  async encerrar(id: string, dto?: EncerrarApontamentoOSInput): Promise<ApontamentoOS> {
    const { data } = await apiClient.patch(`/apontamentos-os/${id}/encerrar`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/apontamentos-os/${id}`);
  },
};
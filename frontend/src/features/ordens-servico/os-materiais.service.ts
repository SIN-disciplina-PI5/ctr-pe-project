import { apiClient } from "@/infrastructure/api/api-client";
import type { OrdemServicoMaterial } from "./os-materiais.types";

export type AddMaterialDto = {
  materialId: string;
  quantidade: number;
  custoUnitario?: number;
};

export type UpdateMaterialOSDto = {
  quantidade?: number;
  custoUnitario?: number;
};

export type CancelarMaterialOSDto = {
  motivo?: string;
};

export const osMateriaisService = {
  async listByOS(ordemServicoId: string): Promise<OrdemServicoMaterial[]> {
    const { data } = await apiClient.get(`/ordens-servico/${ordemServicoId}/materiais`);
    return data;
  },

  async add(ordemServicoId: string, dto: AddMaterialDto): Promise<OrdemServicoMaterial> {
    const { data } = await apiClient.post(`/ordens-servico/${ordemServicoId}/materiais`, dto);
    return data;
  },

  async update(id: string, dto: UpdateMaterialOSDto): Promise<OrdemServicoMaterial> {
    const { data } = await apiClient.patch(`/ordens-servico-materiais/${id}`, dto);
    return data;
  },

  async consumir(id: string, quantidade?: number): Promise<OrdemServicoMaterial> {
    const { data } = await apiClient.patch(`/ordens-servico-materiais/${id}/consumir`, { quantidade });
    return data;
  },

  async devolver(id: string, quantidade?: number): Promise<OrdemServicoMaterial> {
    const { data } = await apiClient.patch(`/ordens-servico-materiais/${id}/devolver`, { quantidade });
    return data;
  },

  async cancelar(id: string, dto?: CancelarMaterialOSDto): Promise<OrdemServicoMaterial> {
    const { data } = await apiClient.patch(`/ordens-servico-materiais/${id}/cancelar`, dto);
    return data;
  },
};
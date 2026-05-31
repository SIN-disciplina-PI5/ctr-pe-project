import { apiClient } from "@/infrastructure/api/api-client";
import type { ParadaAtivo, StatusParada } from "./paradas.types";

export type ListParadasParams = {
  empresaId?: string;
  ativoId?: string;
  status?: StatusParada;
  from?: string;
  to?: string;
};

export type CreateParadaDto = {
  empresaId: string;
  ativoId: string;
  ordemServicoId?: string;
  inicioEm: string;
  motivo?: string;
  programada: boolean;
  impactaDisponibilidade: boolean;
};

export type UpdateParadaDto = {
  motivo?: string;
  programada?: boolean;
  impactaDisponibilidade?: boolean;
};

export type EncerrarParadaDto = {
  fimEm?: string;
};

export type CancelarParadaDto = {
  motivo: string;
};

export const paradasService = {
  async list(params?: ListParadasParams): Promise<ParadaAtivo[]> {
    const { data } = await apiClient.get("/paradas-ativos", { params });
    return data;
  },

  async getById(id: string): Promise<ParadaAtivo> {
    const { data } = await apiClient.get(`/paradas-ativos/${id}`);
    return data;
  },

  async create(dto: CreateParadaDto): Promise<ParadaAtivo> {
    const { data } = await apiClient.post("/paradas-ativos", dto);
    return data;
  },

  async update(id: string, dto: UpdateParadaDto): Promise<ParadaAtivo> {
    const { data } = await apiClient.patch(`/paradas-ativos/${id}`, dto);
    return data;
  },

  async encerrar(id: string, dto: EncerrarParadaDto): Promise<ParadaAtivo> {
    const { data } = await apiClient.patch(`/paradas-ativos/${id}/encerrar`, dto);
    return data;
  },

  async cancelar(id: string, dto: CancelarParadaDto): Promise<ParadaAtivo> {
    const { data } = await apiClient.patch(`/paradas-ativos/${id}/cancelar`, dto);
    return data;
  },
};
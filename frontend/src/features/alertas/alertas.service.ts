import { apiClient } from "@/infrastructure/api/api-client";
import type { Alerta, StatusAlerta, TipoAlerta } from "@/types/alerta";

export type ListAlertasParams = {
  empresaId?: string;
  status?: StatusAlerta;
  tipo?: TipoAlerta;
  usuarioId?: string;
};

export type ListMeusAlertasParams = {
  status?: StatusAlerta;
  tipo?: TipoAlerta;
};

export const alertasService = {
  async list(params?: ListAlertasParams): Promise<Alerta[]> {
    const { data } = await apiClient.get("/alertas", { params });
    return data;
  },

  async listMe(params?: ListMeusAlertasParams): Promise<Alerta[]> {
    const { data } = await apiClient.get("/alertas/me", { params });
    return data;
  },

  async getById(id: string): Promise<Alerta> {
    const { data } = await apiClient.get(`/alertas/${id}`);
    return data;
  },

  async marcarLido(id: string): Promise<Alerta> {
    const { data } = await apiClient.patch(`/alertas/${id}/lido`);
    return data;
  },

  async resolver(id: string): Promise<Alerta> {
    const { data } = await apiClient.patch(`/alertas/${id}/resolver`);
    return data;
  },

  async ignorar(id: string): Promise<Alerta> {
    const { data } = await apiClient.patch(`/alertas/${id}/ignorar`);
    return data;
  },
};
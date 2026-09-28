import { apiClient } from "@/infrastructure/api/api-client";
import type {
  LogAuditoria,
  TipoAcaoAuditoria,
} from "./auditoria.types";

export type ListAuditoriasParams = {
  empresaId?: string;
  usuarioId?: string;
  entidade?: string;
  entidadeId?: string;
  acao?: TipoAcaoAuditoria;
  limit?: number;
};

export const auditoriaService = {
  async list(params?: ListAuditoriasParams): Promise<LogAuditoria[]> {
    const { data } = await apiClient.get("/auditoria", { params });
    return data;
  },

  async getById(id: string): Promise<LogAuditoria> {
    const { data } = await apiClient.get(`/auditoria/${id}`);
    return data;
  },
};
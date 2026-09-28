import { useQuery } from "@tanstack/react-query";
import {
  auditoriaService,
  type ListAuditoriasParams,
} from "./auditoria.service";

export const AUDITORIA_QUERY_KEY = "auditoria";

export function useAuditorias(params?: ListAuditoriasParams) {
  return useQuery({
    queryKey: [AUDITORIA_QUERY_KEY, "list", params],
    queryFn: () => auditoriaService.list(params),
  });
}

export function useAuditoria(id: string) {
  return useQuery({
    queryKey: [AUDITORIA_QUERY_KEY, "detail", id],
    queryFn: () => auditoriaService.getById(id),
    enabled: !!id,
  });
}
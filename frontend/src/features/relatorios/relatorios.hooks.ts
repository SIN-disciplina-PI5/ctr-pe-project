import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as service from "./relatorios.service";
import type { CreateReportInput, ListReportsParams, ReportJob } from "./relatorios.types";
import { reportsPollingInterval } from "./relatorios.utils";

export const relatoriosKeys = {
  all: ["relatorios"] as const,
  lists: () => [...relatoriosKeys.all, "list"] as const,
  list: (params: ListReportsParams) => [...relatoriosKeys.lists(), params] as const,
};

/** Lista com polling automático enquanto houver relatório na fila ou gerando. */
export function useRelatorios(params: ListReportsParams) {
  return useQuery({
    queryKey: relatoriosKeys.list(params),
    queryFn: () => service.listReports(params),
    refetchInterval: (query) => reportsPollingInterval(query.state.data),
  });
}

export function useSolicitarRelatorio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      input,
      idempotencyKey,
    }: {
      input: CreateReportInput;
      idempotencyKey: string;
    }) => service.createReport(input, idempotencyKey),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: relatoriosKeys.lists() }),
  });
}

export function useBaixarRelatorio() {
  return useMutation({
    mutationFn: (job: Pick<ReportJob, "id">) => service.downloadReport(job),
  });
}

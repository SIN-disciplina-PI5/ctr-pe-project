export const ordensServicoKeys = {
  all: ["ordens-servico"] as const,
  lists: () => [...ordensServicoKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...ordensServicoKeys.lists(), filters] as const,
  details: () => [...ordensServicoKeys.all, "detail"] as const,
  detail: (id: string) => [...ordensServicoKeys.details(), id] as const,
};

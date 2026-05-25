import { z } from "zod";

export const listOrdensServicoDto = z.object({
  empresaId: z.string().cuid().optional(),
  ativoId: z.string().cuid().optional(),
  responsavelId: z.string().cuid().optional(),

  status: z
    .enum(["ABERTA", "EM_EXECUCAO", "AGUARDANDO_PECA", "ENCERRADA", "CANCELADA"])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),

  search: z.string().optional(),
});

export type ListOrdensServicoDto = z.infer<typeof listOrdensServicoDto>;
import { z } from "zod";

export const updateOrdemServicoDto = z.object({
  localizacaoId: z.string().cuid().nullable().optional(),
  solicitanteId: z.string().cuid().nullable().optional(),
  responsavelId: z.string().cuid().nullable().optional(),

  titulo: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),

  tipo: z.enum(["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"]).optional(),
  status: z
    .enum(["ABERTA", "EM_EXECUCAO", "AGUARDANDO_PECA", "ENCERRADA", "CANCELADA"])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),

  impactaDisponibilidade: z.boolean().optional(),

  prazoEm: z.string().datetime().nullable().optional(),

  diagnostico: z.string().nullable().optional(),
  solucao: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
});

export type UpdateOrdemServicoDto = z.infer<typeof updateOrdemServicoDto>;
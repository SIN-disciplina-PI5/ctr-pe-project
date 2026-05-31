import { z } from "zod";

export const createOrdemServicoDto = z.object({
  empresaId: z.string().cuid(),
  localizacaoId: z.string().cuid().optional(),
  ativoId: z.string().cuid(),

  solicitanteId: z.string().cuid().optional(),
  responsavelId: z.string().cuid().optional(),

  numero: z.string().min(1).optional(),
  titulo: z.string().min(1),
  descricao: z.string().min(1),

  tipo: z.enum(["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"]).optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),

  impactaDisponibilidade: z.boolean().optional(),

  prazoEm: z.string().datetime().optional(),

  diagnostico: z.string().optional(),
  solucao: z.string().optional(),
  observacao: z.string().optional(),
});

export type CreateOrdemServicoDto = z.infer<typeof createOrdemServicoDto>;
import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const updateOrdemServicoDto = z.object({
  localizacaoId: entityIdSchema.nullable().optional(),
  solicitanteId: entityIdSchema.nullable().optional(),
  responsavelId: entityIdSchema.nullable().optional(),

  titulo: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),

  tipo: z.enum(["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"]).optional(),
  status: z
    .enum([
      "ABERTA",
      "EM_EXECUCAO",
      "AGUARDANDO_PECA",
      "ENCERRADA",
      "CANCELADA",
    ])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),

  impactaDisponibilidade: z.boolean().optional(),

  prazoEm: z.string().datetime().nullable().optional(),

  diagnostico: z.string().nullable().optional(),
  solucao: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
});

export type UpdateOrdemServicoDto = z.infer<typeof updateOrdemServicoDto>;

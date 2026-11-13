import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const createOrdemServicoDto = z.object({
  empresaId: entityIdSchema,
  localizacaoId: entityIdSchema.optional(),
  ativoId: entityIdSchema,

  solicitanteId: entityIdSchema.optional(),
  responsavelId: entityIdSchema.optional(),

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

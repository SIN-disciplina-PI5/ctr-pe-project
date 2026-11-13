import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const createAlertaDto = z.object({
  empresaId: entityIdSchema,
  tipo: z.enum([
    "ATIVO_PARADO",
    "OS_ATRASADA",
    "AGUARDANDO_PECA",
    "ESTOQUE_BAIXO",
    "CUSTO_ALTO",
    "OUTRO",
  ]),
  severidade: z.enum(["INFO", "BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  titulo: z.string().min(1),
  mensagem: z.string().min(1),
  ativoId: entityIdSchema.optional(),
  ordemServicoId: entityIdSchema.optional(),
  usuarioId: entityIdSchema.optional(),
});

export type CreateAlertaDto = z.infer<typeof createAlertaDto>;

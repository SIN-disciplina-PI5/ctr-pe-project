import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listAlertasDto = z.object({
  empresaId: entityIdSchema.optional(),
  status: z.enum(["ABERTO", "LIDO", "RESOLVIDO", "IGNORADO"]).optional(),
  tipo: z
    .enum([
      "ATIVO_PARADO",
      "OS_ATRASADA",
      "AGUARDANDO_PECA",
      "ESTOQUE_BAIXO",
      "CUSTO_ALTO",
      "OUTRO",
    ])
    .optional(),
  usuarioId: entityIdSchema.optional(),
});

export type ListAlertasDto = z.infer<typeof listAlertasDto>;

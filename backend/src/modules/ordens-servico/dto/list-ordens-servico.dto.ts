import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listOrdensServicoDto = z.object({
  empresaId: entityIdSchema.optional(),
  ativoId: entityIdSchema.optional(),
  responsavelId: entityIdSchema.optional(),

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

  search: z.string().optional(),
});

export type ListOrdensServicoDto = z.infer<typeof listOrdensServicoDto>;

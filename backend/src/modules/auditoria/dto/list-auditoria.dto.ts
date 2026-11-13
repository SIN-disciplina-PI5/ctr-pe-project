import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listAuditoriaDto = z.object({
  empresaId: entityIdSchema.optional(),
  usuarioId: entityIdSchema.optional(),
  entidade: z.string().min(1).optional(),
  entidadeId: z.string().min(1).optional(),
  acao: z
    .enum([
      "CRIACAO",
      "ALTERACAO",
      "EXCLUSAO",
      "LOGIN",
      "LOGOUT",
      "ENCERRAMENTO_OS",
      "CANCELAMENTO_OS",
    ])
    .optional(),
  limit: z.coerce.number().int().positive().max(500).optional(),
});

export type ListAuditoriaDto = z.infer<typeof listAuditoriaDto>;

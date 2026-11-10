import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listLocalizacoesDto = z.object({
  empresaId: entityIdSchema.optional(),
  search: z.string().optional(),
  ativa: z.enum(["true", "false"]).optional(),
});

export type ListLocalizacoesDto = z.infer<typeof listLocalizacoesDto>;

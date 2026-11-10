import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listMateriaisDto = z.object({
  empresaId: entityIdSchema.optional(),
  search: z.string().optional(),
  ativo: z.enum(["true", "false"]).optional(),
  estoqueBaixo: z.enum(["true", "false"]).optional(),
});

export type ListMateriaisDto = z.infer<typeof listMateriaisDto>;

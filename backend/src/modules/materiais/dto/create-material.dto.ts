import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const createMaterialDto = z.object({
  empresaId: entityIdSchema,
  codigo: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  unidade: z.string().min(1).default("UN"),
  estoqueAtual: z.number().nonnegative().optional(),
  estoqueMinimo: z.number().nonnegative().optional(),
  custoMedio: z.number().nonnegative().optional(),
  ativo: z.boolean().optional(),
});

export type CreateMaterialDto = z.infer<typeof createMaterialDto>;

import { z } from "zod";

export const listMateriaisDto = z.object({
  empresaId: z.string().cuid().optional(),
  search: z.string().optional(),
  ativo: z.enum(["true", "false"]).optional(),
  estoqueBaixo: z.enum(["true", "false"]).optional(),
});

export type ListMateriaisDto = z.infer<typeof listMateriaisDto>;
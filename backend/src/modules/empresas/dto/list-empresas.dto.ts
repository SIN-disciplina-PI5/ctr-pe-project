import { z } from "zod";

export const listEmpresasDto = z.object({
  search: z.string().optional(),
  ativa: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type ListEmpresasDto = z.infer<typeof listEmpresasDto>;

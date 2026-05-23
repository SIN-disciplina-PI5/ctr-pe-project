import { z } from "zod";

export const listLocalizacoesDto = z.object({
  empresaId: z.string().optional(),
  search: z.string().optional(),
  ativa: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type ListLocalizacoesDto = z.infer<typeof listLocalizacoesDto>;

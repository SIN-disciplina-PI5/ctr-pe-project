import { z } from "zod";

export const listLocalizacoesDto = z.object({
  empresaId: z.string().cuid().optional(),
  search: z.string().optional(),
  ativa: z.enum(["true", "false"]).optional(),
});

export type ListLocalizacoesDto = z.infer<typeof listLocalizacoesDto>;
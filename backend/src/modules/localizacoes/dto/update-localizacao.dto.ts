import { z } from "zod";

export const updateLocalizacaoDto = z.object({
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  tipo: z.string().min(1).optional(),
  ativa: z.boolean().optional(),
});

export type UpdateLocalizacaoDto = z.infer<typeof updateLocalizacaoDto>;
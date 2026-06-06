import { z } from "zod";

export const createLocalizacaoDto = z.object({
  empresaId: z.string().cuid(),
  codigo: z.string().min(1),
  nome: z.string().min(1),
  tipo: z.string().min(1),
  ativa: z.boolean().optional(),
});

export type CreateLocalizacaoDto = z.infer<typeof createLocalizacaoDto>;
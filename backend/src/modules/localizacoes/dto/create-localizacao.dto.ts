import { z } from "zod";

export const createLocalizacaoDto = z.object({
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1).optional(),
  ativa: z.boolean().optional().default(true),
});

export type CreateLocalizacaoDto = z.infer<typeof createLocalizacaoDto>;

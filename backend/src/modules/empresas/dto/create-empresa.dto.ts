import { z } from "zod";

export const createEmpresaDto = z.object({
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  ativa: z.boolean().optional().default(true),
});

export type CreateEmpresaDto = z.infer<typeof createEmpresaDto>;

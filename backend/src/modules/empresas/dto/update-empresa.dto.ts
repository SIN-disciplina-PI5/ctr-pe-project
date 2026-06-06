import { z } from "zod";

export const updateEmpresaDto = z.object({
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  ativa: z.boolean().optional(),
});

export type UpdateEmpresaDto = z.infer<typeof updateEmpresaDto>;

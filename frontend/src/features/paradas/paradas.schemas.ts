import { z } from "zod";

export const createParadaSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória"),
  ativoId: z.string().min(1, "Ativo é obrigatório"),
  ordemServicoId: z.string().optional(),
  inicioEm: z.string().min(1, "Início é obrigatório"),
  motivo: z.string().optional(),
  programada: z.boolean(),
  impactaDisponibilidade: z.boolean(),
});

export const updateParadaSchema = z.object({
  motivo: z.string().optional(),
  programada: z.boolean(),
  impactaDisponibilidade: z.boolean(),
});

export const encerrarParadaSchema = z.object({
  fimEm: z.string().optional(),
});

export const cancelarParadaSchema = z.object({
  motivo: z.string().min(1, "Motivo é obrigatório"),
});

export type CreateParadaFormData = z.infer<typeof createParadaSchema>;
export type UpdateParadaFormData = z.infer<typeof updateParadaSchema>;
export type EncerrarParadaFormData = z.infer<typeof encerrarParadaSchema>;
export type CancelarParadaFormData = z.infer<typeof cancelarParadaSchema>;
import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

const materialPlanoItemSchema = z.object({
  materialId: entityIdSchema,
  quantidade: z.coerce.number().positive(),
});

export const createPlanoManutencaoDto = z.object({
  ativoId: entityIdSchema,
  responsavelId: entityIdSchema.optional(),
  titulo: z.string().trim().min(3).max(160),
  descricao: z.string().trim().min(3).max(2000),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).default("MEDIA"),
  periodicidadeDias: z.coerce.number().int().min(1).max(3650),
  antecedenciaAlertaDias: z.coerce.number().int().min(0).max(90).default(3),
  checklist: z.array(z.string().trim().min(1).max(300)).max(30).optional(),
  proximaExecucaoEm: z.string().datetime().optional(),
  materiais: z.array(materialPlanoItemSchema).max(30).optional(),
});

export const updatePlanoManutencaoDto = z.object({
  responsavelId: entityIdSchema.nullable().optional(),
  titulo: z.string().trim().min(3).max(160).optional(),
  descricao: z.string().trim().min(3).max(2000).optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  periodicidadeDias: z.coerce.number().int().min(1).max(3650).optional(),
  antecedenciaAlertaDias: z.coerce.number().int().min(0).max(90).optional(),
  checklist: z.array(z.string().trim().min(1).max(300)).max(30).optional(),
  proximaExecucaoEm: z.string().datetime().optional(),
  ativo: z.boolean().optional(),
});

export const listPlanosManutencaoDto = z.object({
  ativoId: entityIdSchema.optional(),
  ativo: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type CreatePlanoManutencaoDto = z.infer<typeof createPlanoManutencaoDto>;
export type UpdatePlanoManutencaoDto = z.infer<typeof updatePlanoManutencaoDto>;
export type ListPlanosManutencaoDto = z.infer<typeof listPlanosManutencaoDto>;

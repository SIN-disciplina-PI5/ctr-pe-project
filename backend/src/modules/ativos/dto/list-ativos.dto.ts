import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const listAtivosDto = z.object({
  empresaId: entityIdSchema.optional(),
  localizacaoId: entityIdSchema.optional(),
  status: z
    .enum([
      "DISPONIVEL",
      "EM_USO",
      "PARADO",
      "EM_MANUTENCAO",
      "AGUARDANDO_PECA",
      "DESATIVADO",
    ])
    .optional(),
  tipo: z
    .enum(["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"])
    .optional(),
  criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  search: z.string().optional(),
});

export type ListAtivosDto = z.infer<typeof listAtivosDto>;

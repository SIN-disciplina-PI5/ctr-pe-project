import { z } from "zod";

export const listAtivosDto = z.object({
  empresaId: z.string().cuid().optional(),
  localizacaoId: z.string().cuid().optional(),
  status: z.enum(["DISPONIVEL", "EM_USO", "PARADO", "EM_MANUTENCAO", "AGUARDANDO_PECA", "DESATIVADO"]).optional(),
  tipo: z.enum(["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"]).optional(),
  criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  search: z.string().optional(),
});

export type ListAtivosDto = z.infer<typeof listAtivosDto>;
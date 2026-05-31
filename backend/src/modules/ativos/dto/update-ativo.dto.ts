import { z } from "zod";

export const updateAtivoDto = z.object({
  localizacaoId: z.string().cuid().optional(),
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  tipo: z.enum(["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"]).optional(),
  criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  placa: z.string().optional(),
  horimetroAtual: z.number().optional(),
  odometroAtual: z.number().optional(),
  ativo: z.boolean().optional(),
});

export type UpdateAtivoDto = z.infer<typeof updateAtivoDto>;

export const updateStatusAtivoDto = z.object({
  status: z.enum(["DISPONIVEL", "EM_USO", "PARADO", "EM_MANUTENCAO", "AGUARDANDO_PECA", "DESATIVADO"]),
  motivo: z.string().optional(),
});

export type UpdateStatusAtivoDto = z.infer<typeof updateStatusAtivoDto>;
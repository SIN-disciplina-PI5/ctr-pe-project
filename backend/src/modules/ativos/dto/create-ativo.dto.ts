import { z } from "zod";

export const createAtivoDto = z.object({
  empresaId: z.string().cuid(),
  localizacaoId: z.string().cuid().optional(),
  codigo: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  tipo: z.enum(["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"]),
  status: z.enum(["DISPONIVEL", "EM_USO", "PARADO", "EM_MANUTENCAO", "AGUARDANDO_PECA", "DESATIVADO"]).optional(),
  criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  placa: z.string().optional(),
  horimetroAtual: z.number().optional(),
  odometroAtual: z.number().optional(),
  ativo: z.boolean().optional(),
});

export type CreateAtivoDto = z.infer<typeof createAtivoDto>;
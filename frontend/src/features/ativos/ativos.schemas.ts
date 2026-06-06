import { z } from "zod";

export const ativoSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória."),
  localizacaoId: z.string().optional(),
  codigo: z.string().min(1, "Código é obrigatório."),
  nome: z.string().min(1, "Nome é obrigatório."),
  descricao: z.string().optional(),
  tipo: z.enum(["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"]),
  status: z
    .enum(["DISPONIVEL", "EM_USO", "PARADO", "EM_MANUTENCAO", "AGUARDANDO_PECA", "DESATIVADO"])
    .optional(),
  criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  placa: z.string().optional(),
  horimetroAtual: z.coerce.number().nonnegative().optional(),
  odometroAtual: z.coerce.number().nonnegative().optional(),
  ativo: z.boolean().optional(),
});

export const ativoStatusSchema = z.object({
  status: z.enum(["DISPONIVEL", "EM_USO", "PARADO", "EM_MANUTENCAO", "AGUARDANDO_PECA", "DESATIVADO"]),
  motivo: z.string().optional(),
});

export type AtivoFormData = z.infer<typeof ativoSchema>;
export type AtivoStatusFormData = z.infer<typeof ativoStatusSchema>;

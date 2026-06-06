import { z } from "zod";

export const materialSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória."),
  codigo: z.string().min(1, "Código é obrigatório."),
  nome: z.string().min(1, "Nome é obrigatório."),
  descricao: z.string().optional(),
  unidade: z.string().min(1, "Unidade é obrigatória.").default("UN"),
  estoqueAtual: z.coerce.number().nonnegative().optional(),
  estoqueMinimo: z.coerce.number().nonnegative().optional(),
  custoMedio: z.coerce.number().nonnegative().optional(),
  ativo: z.boolean().optional(),
});

export const updateEstoqueMaterialSchema = z.object({
  operacao: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
  quantidade: z.coerce.number().positive().optional(),
  novoEstoque: z.coerce.number().nonnegative().optional(),
  motivo: z.string().optional(),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
export type UpdateEstoqueMaterialFormData = z.infer<typeof updateEstoqueMaterialSchema>;

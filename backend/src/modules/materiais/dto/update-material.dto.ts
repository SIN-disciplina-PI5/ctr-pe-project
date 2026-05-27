import { z } from "zod";

export const updateMaterialDto = z.object({
  codigo: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  unidade: z.string().min(1).optional(),
  estoqueMinimo: z.number().nonnegative().optional(),
  custoMedio: z.number().nonnegative().optional(),
  ativo: z.boolean().optional(),
});

export const updateEstoqueMaterialDto = z.object({
  operacao: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
  quantidade: z.number().positive().optional(),
  novoEstoque: z.number().nonnegative().optional(),
  motivo: z.string().optional(),
});

export type UpdateMaterialDto = z.infer<typeof updateMaterialDto>;
export type UpdateEstoqueMaterialDto = z.infer<typeof updateEstoqueMaterialDto>;
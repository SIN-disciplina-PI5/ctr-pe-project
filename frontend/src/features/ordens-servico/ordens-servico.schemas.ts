import { z } from "zod";

export const statusOSEnum = z.enum([
  "ABERTA",
  "EM_EXECUCAO",
  "AGUARDANDO_PECA",
  "ENCERRADA",
  "CANCELADA",
]);

export const prioridadeOSEnum = z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]);

export const tipoOSEnum = z.enum(["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"]);

export const createOrdemServicoSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória"),
  ativoId: z.string().min(1, "Ativo é obrigatório"),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: tipoOSEnum.optional(),
  prioridade: prioridadeOSEnum.optional(),
  responsavelId: z.string().optional(),
  prazoEm: z.string().optional(),
  impactaDisponibilidade: z.boolean().optional(),
});
export type CreateOrdemServicoInput = z.infer<typeof createOrdemServicoSchema>;

export const updateOrdemServicoSchema = z.object({
  titulo: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  tipo: tipoOSEnum.optional(),
  prioridade: prioridadeOSEnum.optional(),
  responsavelId: z.string().optional(),
  prazoEm: z.string().optional(),
  observacao: z.string().optional(),
});
export type UpdateOrdemServicoInput = z.infer<typeof updateOrdemServicoSchema>;

export const ordensServicoFiltersSchema = z.object({
  empresaId: z.string().optional(),
  status: statusOSEnum.optional(),
  prioridade: prioridadeOSEnum.optional(),
  ativoId: z.string().optional(),
  responsavelId: z.string().optional(),
  search: z.string().optional(),
});
export type OrdensServicoFilters = z.infer<typeof ordensServicoFiltersSchema>;

export const encerrarOrdemServicoSchema = z.object({
  diagnostico: z.string().optional(),
  solucao: z.string().optional(),
  observacao: z.string().optional(),
});
export type EncerrarOrdemServicoInput = z.infer<typeof encerrarOrdemServicoSchema>;

export const cancelarOrdemServicoSchema = z.object({
  motivo: z.string().optional(),
});
export type CancelarOrdemServicoInput = z.infer<typeof cancelarOrdemServicoSchema>;

export const observacaoSchema = z.object({
  observacao: z.string().optional(),
});
export type ObservacaoInput = z.infer<typeof observacaoSchema>;

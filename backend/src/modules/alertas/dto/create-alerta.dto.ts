import { z } from "zod";

export const createAlertaDto = z.object({
  empresaId: z.string().cuid(),
  tipo: z.enum([
    "ATIVO_PARADO",
    "OS_ATRASADA",
    "AGUARDANDO_PECA",
    "ESTOQUE_BAIXO",
    "CUSTO_ALTO",
    "OUTRO",
  ]),
  severidade: z.enum(["INFO", "BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  titulo: z.string().min(1),
  mensagem: z.string().min(1),
  ativoId: z.string().cuid().optional(),
  ordemServicoId: z.string().cuid().optional(),
  usuarioId: z.string().cuid().optional(),
});

export type CreateAlertaDto = z.infer<typeof createAlertaDto>;

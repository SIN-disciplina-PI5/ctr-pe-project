import { z } from "zod";

export const listAlertasDto = z.object({
  empresaId: z.string().cuid().optional(),
  status: z.enum(["ABERTO", "LIDO", "RESOLVIDO", "IGNORADO"]).optional(),
  tipo: z
    .enum([
      "ATIVO_PARADO",
      "OS_ATRASADA",
      "AGUARDANDO_PECA",
      "ESTOQUE_BAIXO",
      "CUSTO_ALTO",
      "OUTRO",
    ])
    .optional(),
  usuarioId: z.string().cuid().optional(),
});

export type ListAlertasDto = z.infer<typeof listAlertasDto>;

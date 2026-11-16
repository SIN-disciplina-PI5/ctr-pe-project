import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

export const troubleshootDto = z
  .object({
    ordemServicoId: entityIdSchema.optional(),
    ativoId: entityIdSchema.optional(),
    sintoma: z.string().trim().min(3).max(1000).optional(),
  })
  .refine((data) => Boolean(data.ordemServicoId || data.ativoId), {
    message: "Informe ordemServicoId ou ativoId para diagnóstico.",
    path: ["ordemServicoId"],
  });

export type TroubleshootDto = z.infer<typeof troubleshootDto>;

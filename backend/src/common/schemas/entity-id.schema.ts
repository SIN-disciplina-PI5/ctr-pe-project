import { z } from "zod";

export const entityIdSchema = z
  .string({ error: "Identificador inválido." })
  .trim()
  .min(1, "Identificador inválido.")
  .max(64, "Identificador inválido.");

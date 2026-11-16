import { z } from "zod";

export const forecastMaterialQueryDto = z.object({
  janelaDias: z.coerce.number().int().min(1).max(365).optional(),
  horizonteAlertaDias: z.coerce.number().int().min(1).max(365).optional(),
});

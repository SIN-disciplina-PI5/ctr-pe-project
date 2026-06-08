import { z } from "zod";

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ error: "O refresh token é obrigatório." })
    .trim()
    .min(1, "O refresh token é obrigatório."),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
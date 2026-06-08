import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório." })
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória."),
});

export type SignInInput = z.infer<typeof signInSchema>;
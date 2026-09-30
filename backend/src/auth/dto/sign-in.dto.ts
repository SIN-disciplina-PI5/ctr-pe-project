import { z } from "zod";

export const recaptchaPlatformSchema = z.enum(["web", "android", "ios"]);

export type RecaptchaPlatform = z.infer<typeof recaptchaPlatformSchema>;

export const signInSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório." })
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória."),
  recaptchaToken: z.string().optional(),
  recaptchaPlatform: recaptchaPlatformSchema.optional().default("web"),
});

export type SignInInput = z.infer<typeof signInSchema>;
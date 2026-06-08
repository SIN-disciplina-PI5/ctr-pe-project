import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "A senha atual é obrigatória." })
      .min(1, "A senha atual é obrigatória."),
    newPassword: z
      .string({ error: "A nova senha é obrigatória." })
      .min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    confirmNewPassword: z
      .string({ error: "A confirmação da senha é obrigatória." })
      .min(6, "A confirmação da senha deve ter pelo menos 6 caracteres."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
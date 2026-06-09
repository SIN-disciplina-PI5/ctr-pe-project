import { z } from "zod";

export const signUpTestingSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório." })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z
    .string({ error: "O e-mail é obrigatório." })
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
  empresaId: z
    .string({ error: "A empresa é obrigatória." })
    .trim()
    .min(1, "A empresa é obrigatória."),
  perfil: z.enum(["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"], {
    error: "Perfil inválido.",
  }),
});

export type SignUpTestingInput = z.infer<typeof signUpTestingSchema>;
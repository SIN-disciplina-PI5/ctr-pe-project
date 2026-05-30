import { z } from "zod";

export const PERFIS: string[] = ["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"];

export const createUsuarioSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  perfil: z.enum(["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"]),
  ativo: z.boolean(),
});

export const updateUsuarioSchema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  perfil: z.enum(["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"]),
  ativo: z.boolean(),
});

export const resetSenhaSchema = z
  .object({
    novaSenha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    confirmacao: z.string().min(6, "Confirmação obrigatória"),
  })
  .refine((d) => d.novaSenha === d.confirmacao, {
    message: "As senhas não coincidem",
    path: ["confirmacao"],
  });

export type CreateUsuarioFormData = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;
export type ResetSenhaFormData = z.infer<typeof resetSenhaSchema>;
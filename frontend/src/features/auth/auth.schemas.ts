import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("Insira um e-mail válido"),
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(6, "A senha deve conter pelo menos 6 caracteres"),
});

export const changePasswordSchema = z.object({
  senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
  novaSenha: z.string().min(6, "A nova senha deve conter pelo menos 6 caracteres"),
  confirmarNovaSenha: z.string().min(6, "A confirmação de senha é obrigatória"),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarNovaSenha"],
});


export const signupSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve conter pelo menos 3 caracteres"),
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("Insira um e-mail válido"),
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(6, "A senha deve conter pelo menos 6 caracteres"),
  confirmarSenha: z
    .string({ error: "A confirmação de senha é obrigatória" })
    .min(6, "A confirmação deve conter pelo menos 6 caracteres"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});
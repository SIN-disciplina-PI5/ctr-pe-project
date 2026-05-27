import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .email("Insira um e-mail válido"),
  senha: z
    .string({ required_error: "A senha é obrigatória" })
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
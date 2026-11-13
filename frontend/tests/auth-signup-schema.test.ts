import { signupSchema } from "@/features/auth/auth.schemas";

const validInput = {
  nome: "Usuário",
  email: "usuario@empresa.com",
  empresaId: "emp_000001",
  senha: "senha-segura",
  confirmarSenha: "senha-segura",
};

describe("signupSchema", () => {
  it("não inclui seleção pública de perfil", () => {
    const parsed = signupSchema.parse({ ...validInput, perfil: "ADMIN" });

    expect(parsed).toEqual(validInput);
    expect(parsed).not.toHaveProperty("perfil");
  });

  it("exige confirmação igual à senha", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      confirmarSenha: "outra-senha",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["confirmarSenha"] }),
        ]),
      );
    }
  });
});

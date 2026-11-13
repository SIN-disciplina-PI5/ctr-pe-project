import { describe, expect, it } from "@jest/globals";

import { signUpSchema } from "./sign-up.dto.js";

const validInput = {
  nome: "Usuário",
  email: "usuario@empresa.com",
  password: "senha-segura",
  empresaId: "emp_000001",
};

describe("signUpSchema", () => {
  it("não aceita perfil escolhido pelo cadastro público", () => {
    const parsed = signUpSchema.parse({
      ...validInput,
      perfil: "ADMIN",
      ativo: true,
    });

    expect(parsed).toEqual(validInput);
    expect(parsed).not.toHaveProperty("perfil");
    expect(parsed).not.toHaveProperty("ativo");
  });

  it.each([
    ["nome curto", { ...validInput, nome: "A" }],
    ["e-mail inválido", { ...validInput, email: "invalido" }],
    ["senha curta", { ...validInput, password: "12345" }],
    ["empresa vazia", { ...validInput, empresaId: " " }],
  ])("recusa %s", (_description, input) => {
    expect(signUpSchema.safeParse(input).success).toBe(false);
  });
});

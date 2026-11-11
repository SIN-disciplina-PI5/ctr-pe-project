import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { prisma } from "../prisma/prisma.client.js";
import { AuthRepository } from "./auth.repository.js";

describe("AuthRepository.createInactiveSignupUser", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("define perfil CONSULTA e mantém a conta inativa", async () => {
    const create = jest
      .spyOn(prisma.usuario, "create")
      .mockResolvedValue({ id: "usr_000001" } as never);

    await new AuthRepository().createInactiveSignupUser({
      nome: "Usuário",
      email: "usuario@empresa.com",
      senhaHash: "senha-hash",
      empresaId: "emp_000001",
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          nome: "Usuário",
          email: "usuario@empresa.com",
          senhaHash: "senha-hash",
          empresaId: "emp_000001",
          perfil: "CONSULTA",
          ativo: false,
        },
      }),
    );
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcrypt";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { TokenService } from "./token.service.js";

const user = {
  id: "usr_000001",
  empresaId: "emp_000001",
  nome: "Usuário",
  email: "usuario@empresa.com",
  senhaHash: "$2b$10$hash-do-usuario",
  perfil: "CONSULTA" as const,
  ativo: true,
};

const invalidCredentials = {
  statusCode: 401,
  errorCode: "UNAUTHORIZED",
  message: "Credenciais inválidas.",
};

describe("AuthService.signIn", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("usa bcrypt e retorna o mesmo erro quando o e-mail não existe", async () => {
    jest.spyOn(AuthRepository.prototype, "findByEmail").mockResolvedValue(null);
    const compare = jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValue(false as never);

    await expect(
      new AuthService().signIn("inexistente@empresa.com", "senha"),
    ).rejects.toMatchObject(invalidCredentials);

    expect(compare).toHaveBeenCalledTimes(1);
    expect(compare.mock.calls[0]?.[1]).toMatch(/^\$2[aby]\$/);
  });

  it("não revela que a conta está inativa", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findByEmail")
      .mockResolvedValue({ ...user, ativo: false } as never);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    await expect(
      new AuthService().signIn(user.email, "senha-correta"),
    ).rejects.toMatchObject(invalidCredentials);
  });

  it("não distingue senha incorreta de e-mail inexistente", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findByEmail")
      .mockResolvedValue(user as never);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    await expect(
      new AuthService().signIn(user.email, "senha-incorreta"),
    ).rejects.toMatchObject(invalidCredentials);
  });

  it("mantém o login válido e atualiza o último acesso", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findByEmail")
      .mockResolvedValue(user as never);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest
      .spyOn(TokenService.prototype, "generateToken")
      .mockReturnValue("access-token");
    jest
      .spyOn(TokenService.prototype, "generateRefreshToken")
      .mockReturnValue("refresh-token");
    jest
      .spyOn(TokenService.prototype, "hashRefreshToken")
      .mockReturnValue("refresh-hash");
    jest
      .spyOn(TokenService.prototype, "getRefreshTokenExpiresAt")
      .mockReturnValue(new Date("2026-11-18T00:00:00.000Z"));
    const createRefreshToken = jest
      .spyOn(AuthRepository.prototype, "createRefreshToken")
      .mockResolvedValue({} as never);
    const updateLastLogin = jest
      .spyOn(AuthRepository.prototype, "updateLastLogin")
      .mockResolvedValue({} as never);

    await expect(
      new AuthService().signIn(user.email, "senha-correta"),
    ).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(createRefreshToken).toHaveBeenCalledWith({
      usuarioId: user.id,
      tokenHash: "refresh-hash",
      expiresAt: new Date("2026-11-18T00:00:00.000Z"),
    });
    expect(updateLastLogin).toHaveBeenCalledWith(user.id);
  });
});

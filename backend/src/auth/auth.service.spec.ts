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

describe("AuthService.signUp", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("encaminha o cadastro público para criação inativa", async () => {
    jest.spyOn(AuthRepository.prototype, "findByEmail").mockResolvedValue(null);
    jest
      .spyOn(AuthRepository.prototype, "findEmpresaById")
      .mockResolvedValue({ id: user.empresaId, ativa: true } as never);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("senha-hash" as never);
    const createInactiveSignupUser = jest
      .spyOn(AuthRepository.prototype, "createInactiveSignupUser")
      .mockResolvedValue({ ...user, ativo: false } as never);

    await expect(
      new AuthService().signUp({
        nome: user.nome,
        email: user.email,
        password: "senha-segura",
        empresaId: user.empresaId,
      }),
    ).resolves.toMatchObject({
      message:
        "Cadastro realizado. Aguarde a ativação do usuário por um administrador.",
      user: { ativo: false },
    });
    expect(createInactiveSignupUser).toHaveBeenCalledWith({
      nome: user.nome,
      email: user.email,
      senhaHash: "senha-hash",
      empresaId: user.empresaId,
    });
  });

  it("recusa e-mail já cadastrado antes de consultar a empresa", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findByEmail")
      .mockResolvedValue(user as never);
    const findEmpresaById = jest.spyOn(
      AuthRepository.prototype,
      "findEmpresaById",
    );
    const createInactiveSignupUser = jest.spyOn(
      AuthRepository.prototype,
      "createInactiveSignupUser",
    );

    await expect(
      new AuthService().signUp({
        nome: user.nome,
        email: user.email,
        password: "senha-segura",
        empresaId: user.empresaId,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      errorCode: "CONFLICT",
      message: "Email já está em uso",
    });
    expect(findEmpresaById).not.toHaveBeenCalled();
    expect(createInactiveSignupUser).not.toHaveBeenCalled();
  });

  it("recusa empresa inexistente sem gerar hash de senha", async () => {
    jest.spyOn(AuthRepository.prototype, "findByEmail").mockResolvedValue(null);
    jest
      .spyOn(AuthRepository.prototype, "findEmpresaById")
      .mockResolvedValue(null);
    const hash = jest.spyOn(bcrypt, "hash");

    await expect(
      new AuthService().signUp({
        nome: user.nome,
        email: user.email,
        password: "senha-segura",
        empresaId: "empresa-inexistente",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      errorCode: "NOT_FOUND",
      message: "Empresa não encontrada",
    });
    expect(hash).not.toHaveBeenCalled();
  });

  it("recusa empresa inativa sem criar o usuário", async () => {
    jest.spyOn(AuthRepository.prototype, "findByEmail").mockResolvedValue(null);
    jest
      .spyOn(AuthRepository.prototype, "findEmpresaById")
      .mockResolvedValue({ id: user.empresaId, ativa: false } as never);
    const createInactiveSignupUser = jest.spyOn(
      AuthRepository.prototype,
      "createInactiveSignupUser",
    );

    await expect(
      new AuthService().signUp({
        nome: user.nome,
        email: user.email,
        password: "senha-segura",
        empresaId: user.empresaId,
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      errorCode: "FORBIDDEN",
      message: "Empresa inativa",
    });
    expect(createInactiveSignupUser).not.toHaveBeenCalled();
  });
});

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

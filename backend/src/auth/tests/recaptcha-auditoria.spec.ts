import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { RecaptchaService } from "../../common/services/recaptcha.service.js";
import { AuditoriaService } from "../../modules/auditoria/auditoria.service.js";
import { AuthRepository } from "../auth.repository.js";
import { AuthService } from "../auth.service.js";

const originalIosSiteKey = process.env.RECAPTCHA_IOS_SITE_KEY;
const originalNodeEnv = process.env.NODE_ENV;
const originalRecaptchaRequired = process.env.RECAPTCHA_REQUIRED;

describe("AuthService reCAPTCHA e auditoria", () => {
  afterEach(() => {
    jest.restoreAllMocks();

    if (originalIosSiteKey === undefined) {
      delete process.env.RECAPTCHA_IOS_SITE_KEY;
    } else {
      process.env.RECAPTCHA_IOS_SITE_KEY = originalIosSiteKey;
    }

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalRecaptchaRequired === undefined) {
      delete process.env.RECAPTCHA_REQUIRED;
    } else {
      process.env.RECAPTCHA_REQUIRED = originalRecaptchaRequired;
    }
  });

  it("exige o token quando o reCAPTCHA estiver configurado como obrigatório", async () => {
    process.env.NODE_ENV = "development";
    process.env.RECAPTCHA_REQUIRED = "true";
    const findByEmail = jest.spyOn(AuthRepository.prototype, "findByEmail");

    await expect(
      new AuthService().signIn("usuario@empresa.com", "qualquer-senha"),
    ).rejects.toMatchObject({
      statusCode: 400,
      errorCode: "VALIDATION_ERROR",
    });
    expect(findByEmail).not.toHaveBeenCalled();
  });

  it("bloqueia o login recusado pelo reCAPTCHA antes de consultar credenciais", async () => {
    process.env.RECAPTCHA_IOS_SITE_KEY = "ios-site-key";
    jest
      .spyOn(RecaptchaService.prototype, "validateToken")
      .mockResolvedValue(false);
    const findByEmail = jest.spyOn(AuthRepository.prototype, "findByEmail");
    const registrar = jest
      .spyOn(AuditoriaService.prototype, "registrar")
      .mockResolvedValue({ id: "audit-id" });

    await expect(
      new AuthService().signIn("usuario@empresa.com", "qualquer-senha", {
        recaptchaToken: "token-recusado",
        recaptchaPlatform: "ios",
        userAgent: "Mozilla/5.0",
        userIpAddress: "192.168.1.100",
      }),
    ).rejects.toMatchObject({
      message: "Validação de segurança recusada.",
      statusCode: 403,
      errorCode: "FORBIDDEN",
    });
    expect(findByEmail).not.toHaveBeenCalled();
    expect(registrar).toHaveBeenCalledWith({
      entidade: "AUTH",
      entidadeId: "usuario@empresa.com",
      acao: "LOGIN",
      empresaId: undefined,
      usuarioId: undefined,
      depois: {
        sucesso: false,
        motivo: "Bloqueado pelo reCAPTCHA Enterprise",
        plataforma: "ios",
        ip: "192.168.1.100",
        userAgent: "Mozilla/5.0",
      },
    });
  });
});

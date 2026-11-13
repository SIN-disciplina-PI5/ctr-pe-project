import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { RecaptchaService } from "../../src/common/services/recaptcha.service.js";

const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const originalMinScore = process.env.RECAPTCHA_MIN_SCORE;

function createClient(response: unknown) {
  return {
    projectPath: jest.fn(() => "projects/project-id"),
    createAssessment: jest.fn(async () => [response]),
  };
}

describe("RecaptchaService", () => {
  beforeEach(() => {
    process.env.GOOGLE_CLOUD_PROJECT_ID = "project-id";
    process.env.RECAPTCHA_MIN_SCORE = "0.5";
  });

  afterEach(() => {
    jest.restoreAllMocks();

    if (originalProjectId === undefined) {
      delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    } else {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }

    if (originalMinScore === undefined) {
      delete process.env.RECAPTCHA_MIN_SCORE;
    } else {
      process.env.RECAPTCHA_MIN_SCORE = originalMinScore;
    }
  });

  it("aceita token válido com ação e pontuação esperadas", async () => {
    const client = createClient({
      tokenProperties: { valid: true, action: "login" },
      riskAnalysis: { score: 0.9 },
    });
    const service = new RecaptchaService(client as never);

    await expect(
      service.validateToken(
        "token-valido",
        "site-key",
        "login",
        "user-agent",
        "127.0.0.1",
      ),
    ).resolves.toBe(true);
    expect(client.projectPath).toHaveBeenCalledWith("project-id");
    expect(client.createAssessment).toHaveBeenCalledWith({
      parent: "projects/project-id",
      assessment: {
        event: {
          token: "token-valido",
          siteKey: "site-key",
          expectedAction: "login",
          userAgent: "user-agent",
          userIpAddress: "127.0.0.1",
        },
      },
    });
  });

  it("rejeita token considerado inválido pelo provedor", async () => {
    const service = new RecaptchaService(
      createClient({
        tokenProperties: { valid: false, action: "login" },
        riskAnalysis: { score: 0.9 },
      }) as never,
    );

    await expect(
      service.validateToken("token-invalido", "site-key", "login"),
    ).resolves.toBe(false);
  });

  it("rejeita token emitido para outra ação", async () => {
    const service = new RecaptchaService(
      createClient({
        tokenProperties: { valid: true, action: "CADASTRO" },
        riskAnalysis: { score: 0.9 },
      }) as never,
    );

    await expect(
      service.validateToken("token-valido", "site-key", "login"),
    ).resolves.toBe(false);
  });

  it("rejeita pontuação abaixo do limite configurado", async () => {
    const service = new RecaptchaService(
      createClient({
        tokenProperties: { valid: true, action: "login" },
        riskAnalysis: { score: 0.4 },
      }) as never,
    );

    await expect(
      service.validateToken("token-valido", "site-key", "login"),
    ).resolves.toBe(false);
  });

  it("falha de modo fechado quando o provedor fica indisponível", async () => {
    const client = {
      projectPath: jest.fn(() => "projects/project-id"),
      createAssessment: jest.fn(async () => {
        throw new Error("indisponível");
      }),
    };
    const service = new RecaptchaService(client as never);

    await expect(
      service.validateToken("token-valido", "site-key", "login"),
    ).resolves.toBe(false);
  });

  it("não consulta o provedor quando a configuração está incompleta", async () => {
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    const client = createClient({});
    const service = new RecaptchaService(client as never);

    await expect(
      service.validateToken("token-valido", "site-key", "login"),
    ).resolves.toBe(false);
    expect(client.createAssessment).not.toHaveBeenCalled();
  });
});

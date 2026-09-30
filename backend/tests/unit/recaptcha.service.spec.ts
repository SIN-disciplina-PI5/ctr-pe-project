import { RecaptchaService } from "../../src/common/services/recaptcha.service.js";

describe("RecaptchaService", () => {
  const service = new RecaptchaService();

  it("deve validar token com sucesso em ambiente de teste", async () => {
    const isValid = await service.validateToken("token_valido", "site_key", "LOGIN");
    expect(isValid).toBe(true);
  });

  it("deve rejeitar token de bot", async () => {
    const isValid = await service.validateToken("token_invalido_de_bot", "site_key", "LOGIN");
    expect(isValid).toBe(false);
  });
});
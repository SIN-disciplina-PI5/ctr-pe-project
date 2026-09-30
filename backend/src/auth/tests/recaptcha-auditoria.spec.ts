import { AuthService } from "../auth.service.js";

describe("Segurança reCAPTCHA Enterprise e Auditoria", () => {
  const authService = new AuthService();

  it("deve bloquear a tentativa de login de bot e disparar erro de segurança", async () => {
    await expect(
      authService.signIn(
        "admin@ctrpe.com",
        "qualquer_senha",
        "token_invalido_de_bot",
        "ios",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        "192.168.1.100",
      ),
    ).rejects.toThrow("Validação do reCAPTCHA falhou");
  });
});
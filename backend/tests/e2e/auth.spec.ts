import { api } from "../test-server.js";

describe("Auth routes", () => {
  describe("POST /api/auth/sign-up-testing", () => {
    it("should not expose the privileged testing signup", async () => {
      const response = await api.post("/api/auth/sign-up-testing").send({
        nome: "Administrador externo",
        email: "admin-externo@teste.com",
        password: "123456",
        empresaId: "emp_000001",
        perfil: "ADMIN",
      });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Rota não encontrada.",
        errorCode: "NOT_FOUND",
      });
    });
  });

  describe("POST /api/auth/sign-in", () => {
    it("should return token for valid credentials", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "admin@teste.com",
        password: "novaSenha123",
      });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
    });

    it("should not reveal that the user does not exist", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "naoexiste@teste.com",
        password: "123456",
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Credenciais inválidas.",
        errorCode: "UNAUTHORIZED",
        statusCode: 401,
      });
    });

    it("should return 401 for wrong password", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "admin@teste.com",
        password: "senhaerrada",
      });

      expect(response.status).toBe(401);
    });

    it("should not reveal that the user is inactive", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "tecnico@teste.com",
        password: "123456",
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Credenciais inválidas.",
        errorCode: "UNAUTHORIZED",
        statusCode: 401,
      });
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user data with valid token", async () => {
      const signIn = await api.post("/api/auth/sign-in").send({
        email: "admin@teste.com",
        password: "novaSenha123",
      });

      const token = signIn.body.accessToken as string;

      const response = await api
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("admin@teste.com");
      expect(response.body.perfil).toBe("ADMIN");
    });

    it("should return 401 without token", async () => {
      const response = await api.get("/api/auth/me");

      expect(response.status).toBe(401);
    });

    it("should return 401 with invalid token", async () => {
      const response = await api
        .get("/api/auth/me")
        .set("Authorization", "Bearer tokeninvalido");

      expect(response.status).toBe(401);
    });
  });
});

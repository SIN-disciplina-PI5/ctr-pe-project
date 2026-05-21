import { api } from "../test-server.js";

describe("Auth routes", () => {
  describe("POST /api/auth/sign-in", () => {
    it("should return token for valid credentials", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "admin@teste.com",
        password: "novaSenha123",
      });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
    });

    it("should return 404 for non-existent user", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "naoexiste@teste.com",
        password: "123456",
      });

      expect(response.status).toBe(404);
    });

    it("should return 401 for wrong password", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "admin@teste.com",
        password: "senhaerrada",
      });

      expect(response.status).toBe(401);
    });

    it("should return 403 for inactive user", async () => {
      const response = await api.post("/api/auth/sign-in").send({
        email: "tecnico@teste.com",
        password: "123456",
      });

      expect(response.status).toBe(403);
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
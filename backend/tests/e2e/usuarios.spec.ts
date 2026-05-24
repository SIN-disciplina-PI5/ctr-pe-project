import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const uniqueEmail = `novo.tecnico.${Date.now()}@teste.com`;

describe("Usuarios routes", () => {
  describe("POST /api/usuarios — ADMIN criando usuário", () => {
    it("should create a user as ADMIN", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Novo Tecnico",
          email: uniqueEmail,
          password: "123456",
          perfil: "TECNICO",
        });

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(uniqueEmail);
      expect(response.body.perfil).toBe("TECNICO");
    });

    it("should return 409 for duplicate email", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      await api
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Duplicado",
          email: uniqueEmail,
          password: "123456",
          perfil: "TECNICO",
        });

      const response = await api
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Duplicado",
          email: uniqueEmail,
          password: "123456",
          perfil: "TECNICO",
        });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /api/usuarios — perfil sem permissão", () => {
    it("should return 403 when TECNICO tries to create a user", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await api
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Tentativa",
          email: "tentativa@teste.com",
          password: "123456",
          perfil: "TECNICO",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/usuarios — acesso a dados permitidos", () => {
    it("should return 403 when TECNICO tries to list all users", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await api
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it("should allow TECNICO to access own profile", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const meResponse = await api
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      const userId = meResponse.body.id as string;

      const response = await api
        .get(`/api/usuarios/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("tecnico.ativo@teste.com");
    });

    it("should return 403 when TECNICO tries to access another user profile", async () => {
      const adminToken = await getToken("admin@teste.com", "novaSenha123");
      const tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");

      const adminMe = await api
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${adminToken}`);

      const adminId = adminMe.body.id as string;

      const response = await api
        .get(`/api/usuarios/${adminId}`)
        .set("Authorization", `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(403);
    });
  });
});
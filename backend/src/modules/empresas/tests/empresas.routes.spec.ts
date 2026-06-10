import { api } from "../../../../tests/test-server.js";
import { prisma } from "../../../prisma/prisma.client.js";
import jwt from "jsonwebtoken";

function makeToken(
  perfil: string,
  empresaId: string | null = "empresa-teste-id",
  id = "user-teste-id",
) {
  const secret = process.env["JWT_SECRET"] ?? "test-secret";

  return jwt.sign(
    {
      id,
      nome: "Usuário Teste",
      email: `${perfil.toLowerCase()}@teste.com`,
      perfil,
      empresaId,
    },
    secret,
    { subject: id, expiresIn: "1h" },
  );
}

const adminToken = makeToken("ADMIN");
const supervisorToken = makeToken("SUPERVISOR");
const gestorToken = makeToken("GESTOR");

describe("Empresas Routes", () => {
  let empresaId: string;

  beforeAll(async () => {
    const empresa = await prisma.empresa.create({
      data: { nome: "Empresa Teste Routes", codigo: "TEST-ROUTES" },
    });
    empresaId = empresa.id;
  });

  afterAll(async () => {
    await prisma.empresa.deleteMany({ where: { codigo: { startsWith: "TEST" } } });
  });

  describe("GET /api/empresas", () => {
    it("deve retornar 200 com lista de empresas para usuário autenticado", async () => {
      const res = await api
        .get("/api/empresas")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await api.get("/api/empresas");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/empresas/:id", () => {
    it("deve retornar 200 com empresa existente", async () => {
      const res = await api
        .get(`/api/empresas/${empresaId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(empresaId);
    });

    it("deve retornar 404 para empresa inexistente", async () => {
      const res = await api
        .get("/api/empresas/id-inexistente")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/empresas", () => {
    it("ADMIN pode criar empresa", async () => {
      const res = await api
        .post("/api/empresas")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ nome: "Nova Empresa Teste", codigo: "TEST-NEW" });

      expect(res.status).toBe(201);
      expect(res.body.nome).toBe("Nova Empresa Teste");
    });

    it("SUPERVISOR não pode criar empresa (403)", async () => {
      const res = await api
        .post("/api/empresas")
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({ nome: "Empresa Supervisor" });

      expect(res.status).toBe(403);
    });

    it("GESTOR não pode criar empresa (403)", async () => {
      const res = await api
        .post("/api/empresas")
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({ nome: "Empresa Gestor" });

      expect(res.status).toBe(403);
    });

    it("deve retornar 400 com payload inválido (nome ausente)", async () => {
      const res = await api
        .post("/api/empresas")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ codigo: "SEM-NOME" });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/empresas/:id", () => {
    it("ADMIN pode atualizar empresa", async () => {
      const res = await api
        .patch(`/api/empresas/${empresaId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ nome: "Empresa Atualizada" });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("Empresa Atualizada");
    });

    it("SUPERVISOR não pode atualizar empresa (403)", async () => {
      const res = await api
        .patch(`/api/empresas/${empresaId}`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({ nome: "Tentativa Supervisor" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/empresas/:id", () => {
    it("ADMIN pode inativar empresa", async () => {
      const empresa = await prisma.empresa.create({
        data: { nome: "Empresa Para Inativar", codigo: "TEST-DEL" },
      });

      const res = await api
        .delete(`/api/empresas/${empresa.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it("SUPERVISOR não pode inativar empresa (403)", async () => {
      const res = await api
        .delete(`/api/empresas/${empresaId}`)
        .set("Authorization", `Bearer ${supervisorToken}`);

      expect(res.status).toBe(403);
    });
  });
});

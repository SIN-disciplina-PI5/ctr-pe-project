import { api } from "../../../../tests/test-server.js";
import { prisma } from "../../../prisma/prisma.client.js";
import jwt from "jsonwebtoken";

function makeToken(
  perfil: string,
  empresaId: string | null = "empresa-loc-test",
  id = "user-loc-test",
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
const tecnicoToken = makeToken("TECNICO");

describe("Localizacoes Routes", () => {
  let empresaId: string;
  let localizacaoId: string;

  beforeAll(async () => {
    const empresa = await prisma.empresa.create({
      data: { nome: "Empresa Loc Routes", codigo: "LOC-TEST-ROUTES" },
    });
    empresaId = empresa.id;

    // Recria os tokens com o empresaId real do banco
    const loc = await prisma.localizacao.create({
      data: { nome: "Localização Teste", codigo: "LOC-001", empresaId },
    });
    localizacaoId = loc.id;
  });

  afterAll(async () => {
    await prisma.localizacao.deleteMany({ where: { empresaId } });
    await prisma.empresa.deleteMany({ where: { codigo: { startsWith: "LOC-TEST" } } });
  });

  describe("GET /api/localizacoes", () => {
    it("deve retornar 200 com lista de localizações", async () => {
      const res = await api
        .get("/api/localizacoes")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await api.get("/api/localizacoes");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/localizacoes/:id", () => {
    it("deve retornar 200 com localização existente para ADMIN", async () => {
      // ADMIN usa token com empresaId diferente mas pode ver qualquer
      const adminTokenReal = makeToken("ADMIN", empresaId);
      const res = await api
        .get(`/api/localizacoes/${localizacaoId}`)
        .set("Authorization", `Bearer ${adminTokenReal}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(localizacaoId);
    });

    it("deve retornar 404 para localização inexistente", async () => {
      const res = await api
        .get("/api/localizacoes/id-inexistente")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/localizacoes", () => {
    it("SUPERVISOR pode criar localização na própria empresa", async () => {
      const supervisorTokenReal = makeToken("SUPERVISOR", empresaId);

      const res = await api
        .post("/api/localizacoes")
        .set("Authorization", `Bearer ${supervisorTokenReal}`)
        .send({ nome: "Pátio", codigo: "PATIO-01" });

      expect(res.status).toBe(201);
      expect(res.body.nome).toBe("Pátio");
      expect(res.body.empresaId).toBe(empresaId);
    });

    it("ADMIN pode criar localização", async () => {
      const adminTokenReal = makeToken("ADMIN", empresaId);

      const res = await api
        .post("/api/localizacoes")
        .set("Authorization", `Bearer ${adminTokenReal}`)
        .send({ nome: "Galpão A", codigo: "GALPAO-A" });

      expect(res.status).toBe(201);
    });

    it("GESTOR não pode criar localização (403)", async () => {
      const gestorTokenReal = makeToken("GESTOR", empresaId);

      const res = await api
        .post("/api/localizacoes")
        .set("Authorization", `Bearer ${gestorTokenReal}`)
        .send({ nome: "Galpão B" });

      expect(res.status).toBe(403);
    });

    it("TECNICO não pode criar localização (403)", async () => {
      const tecnicoTokenReal = makeToken("TECNICO", empresaId);

      const res = await api
        .post("/api/localizacoes")
        .set("Authorization", `Bearer ${tecnicoTokenReal}`)
        .send({ nome: "Galpão C" });

      expect(res.status).toBe(403);
    });

    it("deve retornar 400 com payload inválido (nome ausente)", async () => {
      const supervisorTokenReal = makeToken("SUPERVISOR", empresaId);

      const res = await api
        .post("/api/localizacoes")
        .set("Authorization", `Bearer ${supervisorTokenReal}`)
        .send({ codigo: "SEM-NOME" });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/localizacoes/:id", () => {
    it("SUPERVISOR pode atualizar localização da própria empresa", async () => {
      const supervisorTokenReal = makeToken("SUPERVISOR", empresaId);

      const res = await api
        .patch(`/api/localizacoes/${localizacaoId}`)
        .set("Authorization", `Bearer ${supervisorTokenReal}`)
        .send({ nome: "Localização Atualizada" });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("Localização Atualizada");
    });

    it("GESTOR não pode atualizar localização (403)", async () => {
      const gestorTokenReal = makeToken("GESTOR", empresaId);

      const res = await api
        .patch(`/api/localizacoes/${localizacaoId}`)
        .set("Authorization", `Bearer ${gestorTokenReal}`)
        .send({ nome: "Tentativa Gestor" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/localizacoes/:id", () => {
    it("ADMIN pode inativar localização", async () => {
      const adminTokenReal = makeToken("ADMIN", empresaId);
      const loc = await prisma.localizacao.create({
        data: { nome: "Para Inativar", codigo: "DEL-01", empresaId },
      });

      const res = await api
        .delete(`/api/localizacoes/${loc.id}`)
        .set("Authorization", `Bearer ${adminTokenReal}`);

      expect(res.status).toBe(204);
    });

    it("GESTOR não pode inativar localização (403)", async () => {
      const gestorTokenReal = makeToken("GESTOR", empresaId);

      const res = await api
        .delete(`/api/localizacoes/${localizacaoId}`)
        .set("Authorization", `Bearer ${gestorTokenReal}`);

      expect(res.status).toBe(403);
    });
  });
});

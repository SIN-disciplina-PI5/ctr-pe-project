import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ts = Date.now();

describe("Ativos routes", () => {
  describe("[TEST] Testar criação de ativo", () => {
    it("should create an ativo as ADMIN", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-001-${ts}`,
          nome: "Máquina Teste",
          tipo: "MAQUINA",
          criticidade: "ALTA",
          status: "DISPONIVEL",
        });

      expect(response.status).toBe(201);
      expect(response.body.tipo).toBe("MAQUINA");
    });

    it("should return 400 for invalid payload", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return 409 for duplicate codigo", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-DUP-${ts}`,
          nome: "Máquina Duplicada",
          tipo: "MAQUINA",
        });

      const response = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-DUP-${ts}`,
          nome: "Máquina Duplicada 2",
          tipo: "MAQUINA",
        });

      expect(response.status).toBe(409);
    });
  });

  describe("[TEST] Testar edição de ativo", () => {
    it("should update an ativo as ADMIN", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-UPD-${ts}`,
          nome: "Máquina Update",
          tipo: "MAQUINA",
        });

      const id = created.body.id as string;

      const response = await api
        .patch(`/api/ativos/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Máquina Update Editada", marca: "Caterpillar" });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Máquina Update Editada");
      expect(response.body.marca).toBe("Caterpillar");
    });

    it("should return 403 when TECNICO tries to update", async () => {
      const adminToken = await getToken("admin@teste.com", "novaSenha123");
      const tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");

      const created = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-PERM-${ts}`,
          nome: "Máquina Permissão",
          tipo: "MAQUINA",
        });

      const id = created.body.id as string;

      const response = await api
        .patch(`/api/ativos/${id}`)
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({ nome: "Tentativa" });

      expect(response.status).toBe(403);
    });
  });

  describe("[TEST] Testar escopo por empresa", () => {
    it("should list ativos filtered by empresaId", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .get(`/api/ativos?empresaId=${EMPRESA_ID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((ativo: { empresaId: string }) => {
        expect(ativo.empresaId).toBe(EMPRESA_ID);
      });
    });
  });

  describe("[TEST] Testar permissões", () => {
    it("should return 403 when TECNICO tries to create ativo", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TECNICO-${ts}`,
          nome: "Máquina Tecnico",
          tipo: "MAQUINA",
        });

      expect(response.status).toBe(403);
    });

    it("should allow TECNICO to read ativos", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await api
        .get("/api/ativos")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it("should return 403 when TECNICO tries to delete ativo", async () => {
      const adminToken = await getToken("admin@teste.com", "novaSenha123");
      const tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");

      const created = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-TEST-DEL-${ts}`,
          nome: "Máquina Delete",
          tipo: "MAQUINA",
        });

      const id = created.body.id as string;

      const response = await api
        .delete(`/api/ativos/${id}`)
        .set("Authorization", `Bearer ${tecnicoToken}`);

      expect(response.status).toBe(403);
    });
  });
});
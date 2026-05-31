import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ts = Date.now();

function aguardarAuditoria(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Auditoria routes", () => {
  describe("[TEST] Testar gravação de auditoria", () => {
    it("should record a CRIACAO log when a resource is created", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-AUDIT-CRIA-${ts}`,
          nome: "Máquina Auditoria",
          tipo: "MAQUINA",
        });

      expect(created.status).toBe(201);
      const ativoId = created.body.id as string;

      await aguardarAuditoria();

      const response = await api
        .get(`/api/auditoria?entidade=ativos&entidadeId=${ativoId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      const log = response.body[0];
      expect(log.entidade).toBe("ativos");
      expect(log.entidadeId).toBe(ativoId);
      expect(log.acao).toBe("CRIACAO");
      expect(log.usuarioId).toEqual(expect.any(String));
    });

    it("should record an ALTERACAO log when a resource is updated", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-AUDIT-ALT-${ts}`,
          nome: "Máquina Auditoria Alteração",
          tipo: "MAQUINA",
        });

      const ativoId = created.body.id as string;

      await api
        .patch(`/api/ativos/${ativoId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Máquina Auditoria Editada" });

      await aguardarAuditoria();

      const response = await api
        .get(`/api/auditoria?entidade=ativos&entidadeId=${ativoId}&acao=ALTERACAO`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0].acao).toBe("ALTERACAO");
    });
  });

  describe("[TEST] Testar consulta por ADMIN/GESTOR", () => {
    it("should allow ADMIN to query audit logs", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .get("/api/auditoria")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 403 when TECNICO tries to query audit logs", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await api
        .get("/api/auditoria")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it("should return 401 without token", async () => {
      const response = await api.get("/api/auditoria");

      expect(response.status).toBe(401);
    });
  });
});

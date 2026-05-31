import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ts = Date.now();

async function criarAlerta(token: string, overrides: Record<string, unknown> = {}) {
  return api
    .post("/api/alertas")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empresaId: EMPRESA_ID,
      tipo: "OUTRO",
      titulo: "Alerta de teste",
      mensagem: "Mensagem de teste",
      ...overrides,
    });
}

describe("Alertas routes", () => {
  describe("[TEST] Testar criação automática de alerta", () => {
    it("should auto-create an ESTOQUE_BAIXO alert when material stock is low", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const material = await api
        .post("/api/materiais")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAT-ALERTA-${ts}`,
          nome: "Material Alerta",
          estoqueAtual: 0,
          estoqueMinimo: 5,
        });

      expect(material.status).toBe(201);

      const response = await api
        .get(`/api/alertas?empresaId=${EMPRESA_ID}&tipo=ESTOQUE_BAIXO`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const alerta = response.body.find((a: { mensagem: string }) =>
        a.mensagem.includes(material.body.id),
      );
      expect(alerta).toBeDefined();
      expect(alerta.tipo).toBe("ESTOQUE_BAIXO");
    });

    it("should auto-create an OS_ATRASADA alert when an OS is past its prazo", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const ativo = await api
        .post("/api/ativos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          codigo: `MAQ-ALERTA-OS-${ts}`,
          nome: "Máquina Alerta OS",
          tipo: "MAQUINA",
        });

      const prazoPassado = new Date(ts - 24 * 60 * 60 * 1000).toISOString();

      const os = await api
        .post("/api/ordens-servico")
        .set("Authorization", `Bearer ${token}`)
        .send({
          empresaId: EMPRESA_ID,
          ativoId: ativo.body.id,
          titulo: "OS atrasada teste",
          descricao: "OS que já passou do prazo",
          impactaDisponibilidade: false,
          prazoEm: prazoPassado,
        });

      expect(os.status).toBe(201);

      const response = await api
        .get(`/api/alertas?empresaId=${EMPRESA_ID}&tipo=OS_ATRASADA`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const alerta = response.body.find(
        (a: { ordemServicoId: string }) => a.ordemServicoId === os.body.id,
      );
      expect(alerta).toBeDefined();
      expect(alerta.severidade).toBe("ALTA");
    });
  });

  describe("[TEST] Testar marcar como lido", () => {
    it("should mark an alert as LIDO", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await criarAlerta(token);
      expect(created.status).toBe(201);

      const response = await api
        .patch(`/api/alertas/${created.body.id}/lido`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("LIDO");
      expect(response.body.lidoEm).not.toBeNull();
    });
  });

  describe("[TEST] Testar resolver alerta", () => {
    it("should resolve an alert", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await criarAlerta(token);

      const response = await api
        .patch(`/api/alertas/${created.body.id}/resolver`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("RESOLVIDO");
      expect(response.body.resolvidoEm).not.toBeNull();
    });
  });

  describe("[TEST] Testar ignorar alerta", () => {
    it("should ignore an alert", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const created = await criarAlerta(token);

      const response = await api
        .patch(`/api/alertas/${created.body.id}/ignorar`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("IGNORADO");
    });
  });

  describe("[TEST] Testar permissões e consultas", () => {
    it("should return 403 when TECNICO tries to create an alert", async () => {
      const token = await getToken("tecnico.ativo@teste.com", "123456");

      const response = await criarAlerta(token);

      expect(response.status).toBe(403);
    });

    it("should return 401 without token on list", async () => {
      const response = await api.get("/api/alertas");

      expect(response.status).toBe(401);
    });

    it("should return 200 and an array on GET /api/alertas/me", async () => {
      const token = await getToken("admin@teste.com", "novaSenha123");

      const response = await api
        .get("/api/alertas/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

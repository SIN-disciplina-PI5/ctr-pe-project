import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ATIVO_ID = "cmplnper80000ek8mr30wm4w3";
const ts = Date.now();

let adminToken: string;
let tecnicoToken: string;
let tecnicoId: string;
let consultaToken: string;
let materialId: string;

beforeAll(async () => {
  adminToken = await getToken("admin@teste.com", "novaSenha123");
  tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");
  consultaToken = await getToken("consulta@teste.com", "123456");

  const meResponse = await api
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${tecnicoToken}`);
  tecnicoId = meResponse.body.id as string;

  const materialResponse = await api
    .post("/api/materiais")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      empresaId: EMPRESA_ID,
      codigo: `MAT-TEST-${ts}`,
      nome: `Material Teste ${ts}`,
      unidade: "UN",
      estoqueAtual: 100,
      estoqueMinimo: 5,
      custoMedio: 50,
      ativo: true,
    });
  materialId = materialResponse.body.id as string;
});

// ─── helpers ────────────────────────────────────────────────────────────────

async function criarOS(token: string, extra = {}) {
  const response = await api
    .post("/api/ordens-servico")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empresaId: EMPRESA_ID,
      ativoId: ATIVO_ID,
      titulo: `OS Teste Material ${ts}`,
      descricao: "Descrição de teste",
      tipo: "CORRETIVA",
      prioridade: "MEDIA",
      impactaDisponibilidade: false,
      ...extra,
    });
  return response.body as { id: string };
}

async function adicionarMaterial(
  token: string,
  osId: string,
  extra: Record<string, unknown> = {}
) {
  const response = await api
    .post(`/api/ordens-servico/${osId}/materiais`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      materialId,
      quantidade: 2,
      ...extra,
    });
  return response;
}

// ─── Adicionar material ──────────────────────────────────────────────────────

describe("OS Materiais - Adicionar material", () => {
  it("should adicionar material como ADMIN", async () => {
    const os = await criarOS(adminToken);

    const response = await adicionarMaterial(adminToken, os.id);

    expect(response.status).toBe(201);
    expect(response.body.ordemServicoId).toBe(os.id);
    expect(response.body.materialId).toBe(materialId);
    expect(response.body.quantidade).toBe(2);
    expect(response.body.status).toBe("SOLICITADO");
  });

  it("should usar custoMedio do material quando custoUnitario nao for enviado", async () => {
    const os = await criarOS(adminToken);

    const response = await adicionarMaterial(adminToken, os.id);

    expect(response.status).toBe(201);
    expect(Number(response.body.custoUnitario)).toBe(50);
    expect(Number(response.body.custoTotal)).toBe(100);
  });

  it("should usar custoUnitario enviado quando informado", async () => {
    const os = await criarOS(adminToken);

    const response = await adicionarMaterial(adminToken, os.id, {
      custoUnitario: 99.99,
    });

    expect(response.status).toBe(201);
    expect(Number(response.body.custoUnitario)).toBe(99.99);
    expect(Number(response.body.custoTotal)).toBe(2 * 99.99);
  });

  it("should return 403 quando CONSULTA tenta adicionar material", async () => {
    const os = await criarOS(adminToken);

    const response = await adicionarMaterial(consultaToken, os.id);

    expect(response.status).toBe(403);
  });

  it("should return 404 quando materialId nao existe", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .post(`/api/ordens-servico/${os.id}/materiais`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ materialId: "id-inexistente", quantidade: 1 });

    expect(response.status).toBe(404);
  });

  it("should return 400 quando quantidade for zero ou negativa", async () => {
    const os = await criarOS(adminToken);

    const response = await adicionarMaterial(adminToken, os.id, {
      quantidade: 0,
    });

    expect(response.status).toBe(400);
  });

  it("should return 404 quando OS nao existe", async () => {
    const response = await api
      .post("/api/ordens-servico/os-inexistente/materiais")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ materialId, quantidade: 1 });

    expect(response.status).toBe(404);
  });
});

// ─── Consumir material ───────────────────────────────────────────────────────

describe("OS Materiais - Consumir material", () => {
  it("should consumir material como ADMIN", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("CONSUMIDO");
  });

  it("should consumir com quantidade parcial informada", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id, { quantidade: 4 });

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantidade: 2 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("CONSUMIDO");
  });

  it("should return 400 quando item ja foi consumido", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 400 quando estoque e insuficiente", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id, {
      quantidade: 999999,
    });

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 403 quando CONSULTA tenta consumir", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${consultaToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it("should return 404 quando item nao existe", async () => {
    const response = await api
      .patch("/api/ordens-servico-materiais/id-inexistente/consumir")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(404);
  });
});

// ─── Devolver material ───────────────────────────────────────────────────────

describe("OS Materiais - Devolver material", () => {
  it("should devolver material como ADMIN", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("DEVOLVIDO");
  });

  it("should devolver com quantidade parcial informada", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id, { quantidade: 4 });

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantidade: 2 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("DEVOLVIDO");
  });

  it("should return 400 quando item ainda e SOLICITADO (nao consumido)", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 400 quando tentar devolver item ja devolvido", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 403 quando CONSULTA tenta devolver", async () => {
    const os = await criarOS(adminToken);
    const item = await adicionarMaterial(adminToken, os.id);

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${consultaToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it("should return 404 quando item nao existe", async () => {
    const response = await api
      .patch("/api/ordens-servico-materiais/id-inexistente/devolver")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(404);
  });
});

// ─── Custo da O.S. ──────────────────────────────────────────────────────────

describe("OS Materiais - Custo da O.S.", () => {
  it("should recalcular custoMateriais da OS apos consumir material", async () => {
    const os = await criarOS(adminToken);

    const item = await adicionarMaterial(adminToken, os.id, {
      quantidade: 2,
      custoUnitario: 50,
    });

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    expect(Number(osResponse.body.custoMateriais)).toBe(100);
    expect(Number(osResponse.body.custoTotal)).toBeGreaterThanOrEqual(100);
  });

  it("should reduzir custoMateriais da OS apos devolver material", async () => {
    const os = await criarOS(adminToken);

    const item = await adicionarMaterial(adminToken, os.id, {
      quantidade: 2,
      custoUnitario: 50,
    });

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/devolver`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    expect(Number(osResponse.body.custoMateriais)).toBe(0);
  });

  it("should nao alterar custoMateriais quando item for cancelado sem ter sido consumido", async () => {
    const os = await criarOS(adminToken);

    const item = await adicionarMaterial(adminToken, os.id, {
      quantidade: 2,
      custoUnitario: 50,
    });

    await api
      .patch(`/api/ordens-servico-materiais/${item.body.id}/cancelar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    expect(Number(osResponse.body.custoMateriais)).toBe(0);
  });

  it("should acumular custoMateriais de multiplos materiais consumidos", async () => {
    const os = await criarOS(adminToken);

    const item1 = await adicionarMaterial(adminToken, os.id, {
      quantidade: 1,
      custoUnitario: 30,
    });
    const item2 = await adicionarMaterial(adminToken, os.id, {
      quantidade: 2,
      custoUnitario: 20,
    });

    await api
      .patch(`/api/ordens-servico-materiais/${item1.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    await api
      .patch(`/api/ordens-servico-materiais/${item2.body.id}/consumir`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    // 1*30 + 2*20 = 70
    expect(Number(osResponse.body.custoMateriais)).toBe(70);
  });
});
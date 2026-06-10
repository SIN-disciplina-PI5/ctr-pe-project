import { api } from "../../../tests/test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ts = Date.now();

let adminToken: string;
let supervisorToken: string;
let consultaToken: string;

beforeAll(async () => {
  adminToken = await getToken("admin@teste.com", "novaSenha123");
  supervisorToken = await getToken("supervisor@teste.com", "123456");
  consultaToken = await getToken("consulta@teste.com", "123456");
});

// ─── helpers ─────────────────────────────────────────────────────────────────

async function criarMaterial(token: string, extra: Record<string, unknown> = {}) {
  return api
    .post("/api/materiais")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empresaId: EMPRESA_ID,
      codigo: `MAT-${ts}-${Math.random().toString(36).slice(2, 7)}`,
      nome: `Material Teste ${ts}`,
      unidade: "UN",
      estoqueAtual: 50,
      estoqueMinimo: 5,
      custoMedio: 10,
      ativo: true,
      ...extra,
    });
}

// ─── Adicionar material ───────────────────────────────────────────────────────

describe("[TEST] Testar adicionar material", () => {
  it("should criar material como ADMIN", async () => {
    const response = await criarMaterial(adminToken);

    expect(response.status).toBe(201);
    expect(response.body.empresaId).toBe(EMPRESA_ID);
    expect(response.body.unidade).toBe("UN");
    expect(Number(response.body.estoqueAtual)).toBe(50);
    expect(response.body.ativo).toBe(true);
  });

  it("should criar material como SUPERVISOR", async () => {
    const response = await criarMaterial(supervisorToken);

    expect(response.status).toBe(201);
    expect(response.body.nome).toContain("Material Teste");
  });

  it("should return 403 quando CONSULTA tenta criar material", async () => {
    const response = await criarMaterial(consultaToken);

    expect(response.status).toBe(403);
  });

  it("should return 409 quando código já existe na empresa", async () => {
    const codigoFixo = `MAT-DUP-${ts}`;

    await api
      .post("/api/materiais")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        codigo: codigoFixo,
        nome: "Material Original",
        unidade: "UN",
      });

    const response = await api
      .post("/api/materiais")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        codigo: codigoFixo,
        nome: "Material Duplicado",
        unidade: "UN",
      });

    expect(response.status).toBe(409);
  });

  it("should return 400 com payload inválido (sem código)", async () => {
    const response = await api
      .post("/api/materiais")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        nome: "Sem Código",
        unidade: "UN",
      });

    expect(response.status).toBe(400);
  });

  it("should return 401 sem token", async () => {
    const response = await api.post("/api/materiais").send({
      empresaId: EMPRESA_ID,
      codigo: `MAT-NOAUTH-${ts}`,
      nome: "Sem Auth",
      unidade: "UN",
    });

    expect(response.status).toBe(401);
  });
});

// ─── Consumir material (baixa de estoque manual via /estoque) ─────────────────

describe("[TEST] Testar consumir material", () => {
  it("should registrar saída de estoque como ADMIN", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 20 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "SAIDA", quantidade: 5 });

    expect(response.status).toBe(200);
    expect(Number(response.body.estoqueAtual)).toBe(15);
  });

  it("should registrar saída de estoque como SUPERVISOR", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 10 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${supervisorToken}`)
      .send({ operacao: "SAIDA", quantidade: 3 });

    expect(response.status).toBe(200);
    expect(Number(response.body.estoqueAtual)).toBe(7);
  });

  it("should return 400 quando estoque for insuficiente", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 2 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "SAIDA", quantidade: 999 });

    expect(response.status).toBe(400);
  });

  it("should return 400 quando quantidade for zero", async () => {
    const mat = await criarMaterial(adminToken);
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "SAIDA", quantidade: 0 });

    expect(response.status).toBe(400);
  });

  it("should return 403 quando CONSULTA tenta movimentar estoque", async () => {
    const mat = await criarMaterial(adminToken);
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${consultaToken}`)
      .send({ operacao: "SAIDA", quantidade: 1 });

    expect(response.status).toBe(403);
  });
});

// ─── Devolver material (entrada de estoque manual via /estoque) ───────────────

describe("[TEST] Testar devolver material", () => {
  it("should registrar entrada de estoque como ADMIN", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 10 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "ENTRADA", quantidade: 5 });

    expect(response.status).toBe(200);
    expect(Number(response.body.estoqueAtual)).toBe(15);
  });

  it("should registrar entrada de estoque como SUPERVISOR", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 3 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${supervisorToken}`)
      .send({ operacao: "ENTRADA", quantidade: 7 });

    expect(response.status).toBe(200);
    expect(Number(response.body.estoqueAtual)).toBe(10);
  });

  it("should return 400 quando quantidade de entrada for zero", async () => {
    const mat = await criarMaterial(adminToken);
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "ENTRADA", quantidade: 0 });

    expect(response.status).toBe(400);
  });

  it("should return 403 quando CONSULTA tenta registrar entrada", async () => {
    const mat = await criarMaterial(adminToken);
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${consultaToken}`)
      .send({ operacao: "ENTRADA", quantidade: 5 });

    expect(response.status).toBe(403);
  });

  it("should return 404 quando material não existe", async () => {
    const response = await api
      .patch("/api/materiais/id-inexistente/estoque")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "ENTRADA", quantidade: 5 });

    expect(response.status).toBe(404);
  });
});

// ─── Custo da O.S. (via consumo no módulo ordens-servico-materiais) ───────────

describe("[TEST] Testar custo da O.S.", () => {
  it("should custoMedio ser usado no cálculo do custoTotal do material", async () => {
    const response = await criarMaterial(adminToken, {
      estoqueAtual: 100,
      custoMedio: 25,
    });

    expect(response.status).toBe(201);
    expect(Number(response.body.custoMedio)).toBe(25);
  });

  it("should atualizar custoMedio via PATCH", async () => {
    const mat = await criarMaterial(adminToken, { custoMedio: 10 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ custoMedio: 99.99 });

    expect(response.status).toBe(200);
    expect(Number(response.body.custoMedio)).toBe(99.99);
  });

  it("should ajustar estoque via operação AJUSTE", async () => {
    const mat = await criarMaterial(adminToken, { estoqueAtual: 30 });
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "AJUSTE", novoEstoque: 42 });

    expect(response.status).toBe(200);
    expect(Number(response.body.estoqueAtual)).toBe(42);
  });

  it("should return 400 quando AJUSTE não informar novoEstoque", async () => {
    const mat = await criarMaterial(adminToken);
    const materialId = mat.body.id as string;

    const response = await api
      .patch(`/api/materiais/${materialId}/estoque`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ operacao: "AJUSTE" });

    expect(response.status).toBe(400);
  });
});

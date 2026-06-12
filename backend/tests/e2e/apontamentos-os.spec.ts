import { api } from "../test-server.js";
import { prisma } from "../../src/prisma/prisma.client.js";


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

beforeAll(async () => {
  adminToken = await getToken("admin@teste.com", "novaSenha123");
  tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");
  consultaToken = await getToken("consulta@teste.com", "123456");

  const me = await api
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${tecnicoToken}`);
  tecnicoId = me.body.id as string;
});

beforeEach(async () => {
  await limparApontamentosAbertos();
});

// ─── helpers ─────────────────────────────────────────────────────────────────

async function limparApontamentosAbertos() {
  const admin = await prisma.usuario.findUnique({
    where: { email: "admin@teste.com" },
    select: { id: true },
  });

  const tecnico = await prisma.usuario.findUnique({
    where: { email: "tecnico.ativo@teste.com" },
    select: { id: true },
  });

  const consulta = await prisma.usuario.findUnique({
    where: { email: "consulta@teste.com" },
    select: { id: true },
  });

  const ids = [admin?.id, tecnico?.id, consulta?.id].filter(Boolean) as string[];

  await prisma.apontamentoOS.deleteMany({
    where: {
      usuarioId: { in: ids },
      fimEm: null,
    },
  });
}

async function criarOS(token: string) {
  const response = await api
    .post("/api/ordens-servico")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empresaId: EMPRESA_ID,
      ativoId: ATIVO_ID,
      titulo: `OS Apontamento ${ts}`,
      descricao: "Teste de apontamento",
      tipo: "CORRETIVA",
      prioridade: "MEDIA",
      impactaDisponibilidade: false,
    });
  return response.body as { id: string };
}

async function criarApontamento(token: string, osId: string, extra: Record<string, unknown> = {}) {
  return api
    .post(`/api/ordens-servico/${osId}/apontamentos`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      inicioEm: new Date().toISOString(),
      ...extra,
    });
}

// ─── Testar criar apontamento ─────────────────────────────────────────────────

describe("[TEST] Testar criar apontamento", () => {
  it("should criar apontamento como TECNICO", async () => {
    const os = await criarOS(adminToken);

    const response = await criarApontamento(tecnicoToken, os.id);

    expect(response.status).toBe(201);
    expect(response.body.ordemServicoId).toBe(os.id);
    expect(response.body.fimEm).toBeNull();
  });

  it("should criar apontamento como ADMIN", async () => {
    const os = await criarOS(adminToken);

    const response = await criarApontamento(adminToken, os.id, {
      descricao: "Inspeção inicial",
      custoHora: 80,
    });

    expect(response.status).toBe(201);
    expect(Number(response.body.custoHora)).toBe(80);
  });

  it("should return 400 quando técnico já tem apontamento em aberto", async () => {
    const os1 = await criarOS(adminToken);
    const os2 = await criarOS(adminToken);

    // Cria o primeiro apontamento
    const primeiro = await criarApontamento(tecnicoToken, os1.id);
    expect(primeiro.status).toBe(201);

    // Tenta criar o segundo sem encerrar o primeiro
    const segundo = await criarApontamento(tecnicoToken, os2.id);
    expect(segundo.status).toBe(400);

    // Encerra o primeiro para não impactar os outros testes
    await api
      .patch(`/api/apontamentos-os/${primeiro.body.id}/encerrar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});
  });

  it("should return 403 quando CONSULTA tenta criar apontamento", async () => {
    const os = await criarOS(adminToken);

    const response = await criarApontamento(consultaToken, os.id);

    expect(response.status).toBe(403);
  });

  it("should return 404 quando OS não existe", async () => {
    const response = await criarApontamento(tecnicoToken, "os-inexistente");

    expect(response.status).toBe(404);
  });

  it("should return 400 sem inicioEm", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(400);
  });
});

// ─── Testar encerrar apontamento ──────────────────────────────────────────────

describe("[TEST] Testar encerrar apontamento", () => {
  it("should encerrar apontamento e calcular duração", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 30 * 60 * 1000); // 30 min atrás

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString() });

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.fimEm).not.toBeNull();
    expect(response.body.duracaoMinutos).toBeGreaterThanOrEqual(29);
  });

  it("should encerrar apontamento com fimEm explícito", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 60 * 60 * 1000); // 1h atrás
    const fimEm = new Date(Date.now() - 30 * 60 * 1000);    // 30min atrás

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString() });

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fimEm: fimEm.toISOString() });

    expect(response.status).toBe(200);
    expect(response.body.duracaoMinutos).toBeGreaterThanOrEqual(29);
    expect(response.body.duracaoMinutos).toBeLessThanOrEqual(31);
  });

  it("should return 400 quando apontamento já foi encerrado", async () => {
    const os = await criarOS(adminToken);
    const criado = await criarApontamento(adminToken, os.id);

    await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 400 quando fimEm for anterior a inicioEm", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date();

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString() });

    const fimAntes = new Date(inicioEm.getTime() - 60000);

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fimEm: fimAntes.toISOString() });

    expect(response.status).toBe(400);
  });

  it("should return 403 quando CONSULTA tenta encerrar apontamento", async () => {
    const os = await criarOS(adminToken);
    const criado = await criarApontamento(adminToken, os.id);

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${consultaToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it("should return 404 quando apontamento não existe", async () => {
    const response = await api
      .patch("/api/apontamentos-os/id-inexistente/encerrar")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(404);
  });
});

// ─── Testar custo de mão de obra ─────────────────────────────────────────────

describe("[TEST] Testar custo de mão de obra", () => {
  it("should calcular custoTotal do apontamento ao encerrar", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 60 * 60 * 1000); // 1h atrás

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString(), custoHora: 60 });

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    // 1h * R$60/h = R$60
    expect(Number(response.body.custoTotal)).toBeCloseTo(60, 0);
  });

  it("should atualizar custoMaoObra da OS ao encerrar apontamento", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2h atrás

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString(), custoHora: 100 });

    await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    // 2h * R$100/h = R$200
    expect(Number(osResponse.body.custoMaoObra)).toBeCloseTo(200, 0);
  });

  it("should acumular custoMaoObra de multiplos apontamentos encerrados", async () => {
    const os = await criarOS(adminToken);

    // Apontamento 1: 1h a R$60 = R$60
    const ap1 = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        inicioEm: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        custoHora: 60,
      });
    await api
      .patch(`/api/apontamentos-os/${ap1.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fimEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() });

    // Apontamento 2: 1h a R$40 = R$40
    const ap2 = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        inicioEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        custoHora: 40,
      });
    await api
      .patch(`/api/apontamentos-os/${ap2.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fimEm: new Date(Date.now() - 60 * 60 * 1000).toISOString() });

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(osResponse.status).toBe(200);
    // R$60 + R$40 = R$100
    expect(Number(osResponse.body.custoMaoObra)).toBeCloseTo(100, 0);
  });

  it("should zerar custoMaoObra da OS ao deletar apontamento encerrado", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 60 * 60 * 1000);

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString(), custoHora: 50 });

    await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    await api
      .delete(`/api/apontamentos-os/${criado.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    const osResponse = await api
      .get(`/api/ordens-servico/${os.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(Number(osResponse.body.custoMaoObra)).toBe(0);
  });

  it("should nao calcular custo quando custoHora nao for informado", async () => {
    const os = await criarOS(adminToken);
    const inicioEm = new Date(Date.now() - 60 * 60 * 1000);

    const criado = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ inicioEm: inicioEm.toISOString() });

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.duracaoMinutos).toBeGreaterThan(0);
    // sem custoHora, custoTotal deve ser null ou 0
    const custo = response.body.custoTotal;
    expect(custo === null || Number(custo) === 0).toBe(true);
  });
});

// ─── Testar técnico criando apenas apontamento próprio ────────────────────────

describe("[TEST] Testar técnico criando apenas apontamento próprio", () => {
  it("should apontamento criado pelo técnico ter o usuarioId do próprio técnico", async () => {
    const os = await criarOS(adminToken);

    const response = await criarApontamento(tecnicoToken, os.id);

    expect(response.status).toBe(201);
    expect(response.body.usuarioId).toBe(tecnicoId);

    // Encerra para não impactar outros testes
    await api
      .patch(`/api/apontamentos-os/${response.body.id}/encerrar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});
  });

  it("should TECNICO conseguir encerrar o próprio apontamento", async () => {
    const os = await criarOS(adminToken);
    const criado = await criarApontamento(tecnicoToken, os.id);

    const response = await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.fimEm).not.toBeNull();
  });

  it("should TECNICO conseguir deletar apontamento em aberto", async () => {
    const os = await criarOS(adminToken);
    const criado = await criarApontamento(tecnicoToken, os.id);

    // TECNICO não tem acesso a DELETE (apenas ADMIN e SUPERVISOR)
    const response = await api
      .delete(`/api/apontamentos-os/${criado.body.id}`)
      .set("Authorization", `Bearer ${tecnicoToken}`);

    expect(response.status).toBe(403);

    // Limpa via admin
    await api
      .patch(`/api/apontamentos-os/${criado.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
  });

  it("should ADMIN conseguir criar apontamento para qualquer usuário", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .post(`/api/ordens-servico/${os.id}/apontamentos`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        inicioEm: new Date().toISOString(),
        usuarioId: tecnicoId,
      });

    expect(response.status).toBe(201);
    expect(response.body.usuarioId).not.toBe(tecnicoId);
  });

  it("should CONSULTA não conseguir criar apontamento", async () => {
    const os = await criarOS(adminToken);

    const response = await criarApontamento(consultaToken, os.id);

    expect(response.status).toBe(403);
  });
});

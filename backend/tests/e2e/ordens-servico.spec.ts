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

beforeAll(async () => {
  adminToken = await getToken("admin@teste.com", "novaSenha123");
  tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");
  const meResponse = await api.get("/api/auth/me").set("Authorization", `Bearer ${tecnicoToken}`);
  tecnicoId = meResponse.body.id as string;
});
 

async function criarOS(token: string, extra = {}) {
  const response = await api
    .post("/api/ordens-servico")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empresaId: EMPRESA_ID,
      ativoId: ATIVO_ID,
      titulo: `OS Teste ${ts}`,
      descricao: "Descrição de teste",
      tipo: "CORRETIVA",
      prioridade: "MEDIA",
      impactaDisponibilidade: false,
      ...extra,
    });
  return response.body as { id: string; status: string; responsavelId: string | null };
}

describe("Ordens de Serviço - Iniciar", () => {
  it("should iniciar OS as ADMIN", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/iniciar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EM_EXECUCAO");
    expect(response.body.iniciadaEm).toBeTruthy();
  });

  it("should return 403 when TECNICO is not responsavel", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/iniciar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it("should allow TECNICO responsavel to iniciar OS", async () => {
    const os = await criarOS(adminToken, { responsavelId: tecnicoId });

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/iniciar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EM_EXECUCAO");
  });

  it("should return 400 when OS is not ABERTA", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/iniciar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });
});

describe("Ordens de Serviço - Aguardar Peça", () => {
  it("should aguardar peca as ADMIN", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/aguardar-peca`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ observacao: "Aguardando chegada da peça" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("AGUARDANDO_PECA");
    expect(response.body.observacao).toBe("Aguardando chegada da peça");
  });

  it("should return 400 when OS is not EM_EXECUCAO", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/aguardar-peca`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 403 when TECNICO is not responsavel", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/aguardar-peca`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(403);
  });
});

describe("Ordens de Serviço - Retomar", () => {
  it("should retomar OS as ADMIN", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});
    await api.patch(`/api/ordens-servico/${os.id}/aguardar-peca`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/retomar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ observacao: "Peça recebida" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EM_EXECUCAO");
  });

  it("should return 400 when OS is not AGUARDANDO_PECA", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/retomar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });
});

describe("Ordens de Serviço - Encerrar", () => {
  it("should encerrar OS as ADMIN", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ diagnostico: "Problema identificado", solucao: "Problema resolvido" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ENCERRADA");
    expect(response.body.encerradaEm).toBeTruthy();
    expect(response.body.diagnostico).toBe("Problema identificado");
  });

  it("should return 400 when OS is ABERTA", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ diagnostico: "Teste", solucao: "Teste" });

    expect(response.status).toBe(400);
  });

  it("should return 403 when TECNICO is not responsavel", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/encerrar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({ diagnostico: "Teste", solucao: "Teste" });

    expect(response.status).toBe(403);
  });
});

describe("Ordens de Serviço - Cancelar", () => {
  it("should cancelar OS as ADMIN", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/cancelar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ motivo: "OS duplicada" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("CANCELADA");
    expect(response.body.canceladaEm).toBeTruthy();
  });

  it("should return 400 when OS is already ENCERRADA", async () => {
    const os = await criarOS(adminToken);

    await api.patch(`/api/ordens-servico/${os.id}/iniciar`).set("Authorization", `Bearer ${adminToken}`).send({});
    await api.patch(`/api/ordens-servico/${os.id}/encerrar`).set("Authorization", `Bearer ${adminToken}`).send({ diagnostico: "Teste", solucao: "Teste" });

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/cancelar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ motivo: "Teste" });

    expect(response.status).toBe(400);
  });

  it("should return 403 when TECNICO tries to cancelar", async () => {
    const os = await criarOS(adminToken);

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/cancelar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({ motivo: "Teste" });

    expect(response.status).toBe(403);
  });
});

describe("Ordens de Serviço - Técnico tentando alterar OS de outro técnico", () => {
  it("should return 403 when TECNICO tries to iniciar OS of another tecnico", async () => {
    const adminMe = await api.get("/api/auth/me").set("Authorization", `Bearer ${adminToken}`);
    const adminId = adminMe.body.id as string;

    const os = await criarOS(adminToken, { responsavelId: adminId });

    const response = await api
      .patch(`/api/ordens-servico/${os.id}/iniciar`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({});

    expect(response.status).toBe(403);
  });
});
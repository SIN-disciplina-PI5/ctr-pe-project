import { api } from "../test-server.js";

async function getToken(email: string, password: string): Promise<string> {
  const response = await api.post("/api/auth/sign-in").send({ email, password });
  return response.body.accessToken as string;
}

const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
const ATIVO_ID = "cmplnper80000ek8mr30wm4w3";

let adminToken: string;
let tecnicoToken: string;

beforeAll(async () => {
  adminToken = await getToken("admin@teste.com", "novaSenha123");
  tecnicoToken = await getToken("tecnico.ativo@teste.com", "123456");
});

describe("[TEST] Testar parada manual", () => {
  it("should create a manual parada as ADMIN", async () => {
    const response = await api
      .post("/api/paradas-ativos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        ativoId: ATIVO_ID,
        motivo: "Parada manual para inspeção",
        programada: true,
        impactaDisponibilidade: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("ABERTA");
    expect(response.body.motivo).toBe("Parada manual para inspeção");

    // cancelar para não bloquear outros testes
    await api
      .patch(`/api/paradas-ativos/${response.body.id}/cancelar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ motivo: "Cancelado após teste" });
  });

  it("should return 403 when TECNICO tries to create a parada", async () => {
    const response = await api
      .post("/api/paradas-ativos")
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({
        empresaId: EMPRESA_ID,
        ativoId: ATIVO_ID,
        motivo: "Tentativa",
        programada: false,
        impactaDisponibilidade: false,
      });

    expect(response.status).toBe(403);
  });
});

describe("[TEST] Testar bloqueio de parada duplicada", () => {
  it("should return 409 when ativo already has an open parada", async () => {
    const first = await api
      .post("/api/paradas-ativos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        ativoId: ATIVO_ID,
        motivo: "Primeira parada",
        programada: false,
        impactaDisponibilidade: false,
      });

    expect(first.status).toBe(201);

    const second = await api
      .post("/api/paradas-ativos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        ativoId: ATIVO_ID,
        motivo: "Segunda parada",
        programada: false,
        impactaDisponibilidade: false,
      });

    expect(second.status).toBe(409);

    // cancelar para não bloquear outros testes
    await api
      .patch(`/api/paradas-ativos/${first.body.id}/cancelar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ motivo: "Cancelado após teste" });
  });
});

describe("[TEST] Testar cálculo de duração", () => {
  it("should calculate duracaoMinutos when encerrar", async () => {
    const created = await api
      .post("/api/paradas-ativos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        empresaId: EMPRESA_ID,
        ativoId: ATIVO_ID,
        motivo: "Parada para testar duração",
        programada: false,
        impactaDisponibilidade: false,
        inicioEm: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hora atrás
      });

    expect(created.status).toBe(201);

    const response = await api
      .patch(`/api/paradas-ativos/${created.body.id}/encerrar`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ENCERRADA");
    expect(response.body.duracaoMinutos).toBeGreaterThan(0);
    expect(response.body.fimEm).toBeTruthy();
  });
});
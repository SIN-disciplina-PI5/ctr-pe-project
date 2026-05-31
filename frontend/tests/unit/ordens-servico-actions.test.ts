import { getOrdemServicoActions } from "@/features/ordens-servico/ordens-servico.actions";

describe("getOrdemServicoActions (regras por status e perfil)", () => {
  it("O.S. encerrada ou cancelada não tem ações", () => {
    expect(getOrdemServicoActions("ENCERRADA", "ADMIN")).toEqual([]);
    expect(getOrdemServicoActions("CANCELADA", "ADMIN")).toEqual([]);
  });

  it("ABERTA com ADMIN permite iniciar e cancelar", () => {
    const actions = getOrdemServicoActions("ABERTA", "ADMIN");
    expect(actions).toContain("iniciar");
    expect(actions).toContain("cancelar");
  });

  it("EM_EXECUCAO com TECNICO permite aguardar/encerrar, mas não cancelar", () => {
    const actions = getOrdemServicoActions("EM_EXECUCAO", "TECNICO");
    expect(actions).toContain("aguardarPeca");
    expect(actions).toContain("encerrar");
    expect(actions).not.toContain("cancelar");
  });

  it("AGUARDANDO_PECA permite retomar e encerrar", () => {
    const actions = getOrdemServicoActions("AGUARDANDO_PECA", "SUPERVISOR");
    expect(actions).toContain("retomar");
    expect(actions).toContain("encerrar");
  });

  it("CONSULTA não tem nenhuma ação", () => {
    expect(getOrdemServicoActions("ABERTA", "CONSULTA")).toEqual([]);
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRepo = {
  findById: jest.fn() as jest.Mock,
  aguardarPeca: jest.fn() as jest.Mock,
  encerrar: jest.fn() as jest.Mock,
  cancelar: jest.fn() as jest.Mock,
};
const mockAlertas = {
  createAtivoParado: jest.fn() as jest.Mock,
  createOSAguardandoPeca: jest.fn() as jest.Mock,
};

jest.unstable_mockModule(
  "../../src/modules/ordens-servico/ordens-servico.repository.js",
  () => ({ OrdensServicoRepository: jest.fn(() => mockRepo) }),
);
jest.unstable_mockModule("../../src/modules/alertas/alertas.repository.js", () => ({
  AlertasRepository: jest.fn(() => mockAlertas),
}));

const { OrdensServicoService } = await import(
  "../../src/modules/ordens-servico/ordens-servico.service.js"
);

function osComStatus(status: string) {
  return { id: "os1", status };
}

describe("OrdensServicoService (unit, repository mockado)", () => {
  let service: InstanceType<typeof OrdensServicoService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrdensServicoService();
  });

  it("findById lança 404 quando não existe", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById("x")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("iniciar exige status ABERTA (400 caso contrário)", async () => {
    mockRepo.findById.mockResolvedValue(osComStatus("EM_EXECUCAO"));
    await expect(service.iniciar("os1")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("aguardarPeca a partir de EM_EXECUCAO dispara o gatilho de alerta", async () => {
    mockRepo.findById.mockResolvedValue(osComStatus("EM_EXECUCAO"));
    mockRepo.aguardarPeca.mockResolvedValue(osComStatus("AGUARDANDO_PECA"));

    await service.aguardarPeca("os1", "faltou peça");

    expect(mockRepo.aguardarPeca).toHaveBeenCalledWith("os1", "faltou peça");
    expect(mockAlertas.createOSAguardandoPeca).toHaveBeenCalledWith(
      expect.objectContaining({ ordemServicoId: "os1" }),
    );
  });

  it("encerrar só é permitido em EM_EXECUCAO ou AGUARDANDO_PECA", async () => {
    mockRepo.findById.mockResolvedValue(osComStatus("ABERTA"));
    await expect(service.encerrar("os1", {})).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepo.encerrar).not.toHaveBeenCalled();
  });

  it("cancelar não é permitido em O.S. já encerrada", async () => {
    mockRepo.findById.mockResolvedValue(osComStatus("ENCERRADA"));
    await expect(service.cancelar("os1", {})).rejects.toMatchObject({ statusCode: 400 });
  });
});

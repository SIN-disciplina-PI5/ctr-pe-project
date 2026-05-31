jest.mock("@/infrastructure/api/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

import { apiClient } from "@/infrastructure/api/api-client";
import {
  createOrdemServico,
  iniciarOrdemServico,
  listOrdensServico,
} from "@/features/ordens-servico/ordens-servico.service";

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

describe("ordens-servico.service (apiClient mockado)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listOrdensServico chama GET /ordens-servico com os filtros", async () => {
    mockGet.mockResolvedValue({ data: [{ id: "os1" }] });

    const result = await listOrdensServico({ status: "ABERTA" });

    expect(mockGet).toHaveBeenCalledWith("/ordens-servico", {
      params: { status: "ABERTA" },
    });
    expect(result).toEqual([{ id: "os1" }]);
  });

  it("createOrdemServico chama POST /ordens-servico com o corpo", async () => {
    mockPost.mockResolvedValue({ data: { id: "os2" } });

    const input = { empresaId: "e", ativoId: "a", titulo: "T", descricao: "D" };
    const result = await createOrdemServico(input as never);

    expect(mockPost).toHaveBeenCalledWith("/ordens-servico", input);
    expect(result).toEqual({ id: "os2" });
  });

  it("iniciarOrdemServico chama PATCH /ordens-servico/:id/iniciar", async () => {
    mockPatch.mockResolvedValue({ data: { id: "os3", status: "EM_EXECUCAO" } });

    await iniciarOrdemServico("os3");

    expect(mockPatch).toHaveBeenCalledWith("/ordens-servico/os3/iniciar");
  });
});

jest.mock("@/infrastructure/api/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

import { apiClient } from "@/infrastructure/api/api-client";
import {
  createReport,
  DownloadUnavailableError,
  downloadReport,
  listReports,
} from "@/features/relatorios/relatorios.service";

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

describe("relatorios.service (apiClient mockado)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createReport envia o corpo e a Idempotency-Key", async () => {
    mockPost.mockResolvedValue({ data: { id: "job-1", status: "queued" } });

    const result = await createReport({ reportType: "availability" }, "rel-chave-0001");

    expect(mockPost).toHaveBeenCalledWith(
      "/ai/reports",
      { reportType: "availability" },
      { headers: { "Idempotency-Key": "rel-chave-0001" } },
    );
    expect(result).toEqual({ id: "job-1", status: "queued" });
  });

  it("listReports envia paginação e filtro", async () => {
    mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

    await listReports({ status: "done", page: 2, pageSize: 10 });

    expect(mockGet).toHaveBeenCalledWith("/ai/reports", {
      params: { status: "done", page: 2, pageSize: 10 },
    });
  });

  it("downloadReport não tenta baixar fora da web", async () => {
    await expect(downloadReport({ id: "job-1" }, "ios")).rejects.toBeInstanceOf(
      DownloadUnavailableError,
    );
    expect(mockGet).not.toHaveBeenCalled();
  });

  describe("na web", () => {
    const originalDocument = (globalThis as { document?: unknown }).document;
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    const link = { click: jest.fn(), remove: jest.fn(), href: "", download: "", rel: "" };

    beforeEach(() => {
      jest.useFakeTimers();
      (globalThis as { document?: unknown }).document = {
        createElement: jest.fn(() => link),
        body: { appendChild: jest.fn() },
      };
      URL.createObjectURL = jest.fn(() => "blob:relatorio");
      URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      jest.useRealTimers();
      (globalThis as { document?: unknown }).document = originalDocument;
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    });

    it("baixa com o token da sessão e usa o nome enviado pelo servidor", async () => {
      const blob = { size: 4 };
      mockGet.mockResolvedValue({
        data: blob,
        headers: { "content-disposition": 'attachment; filename="relatorio-mensal.pdf"' },
      });

      await downloadReport({ id: "job-1" }, "web");

      expect(mockGet).toHaveBeenCalledWith("/ai/reports/job-1/download", {
        responseType: "blob",
      });
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(link.download).toBe("relatorio-mensal.pdf");
      expect(link.click).toHaveBeenCalled();

      jest.runAllTimers();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:relatorio");
    });
  });
});

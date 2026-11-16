import { describe, expect, it, jest } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import { createReportStorage, VercelBlobReportStorage } from "./report-storage.js";

function sdk() {
  return {
    put: jest.fn(async (pathname: string, _body: unknown, _options: unknown) => ({
      pathname,
      contentType: "application/pdf",
    })),
    get: jest.fn(async (_pathname: string, _options: unknown) => ({
      statusCode: 200,
      stream: new ReadableStream<Uint8Array>(),
      blob: { contentType: "application/pdf", size: 5, etag: "etag-1" },
    })),
    del: jest.fn(async (_pathname: string, _options: unknown) => undefined),
  };
}

async function rejection(promise: Promise<unknown>): Promise<AppError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof AppError) return error;
    throw error;
  }
  throw new Error("A promise deveria ter sido rejeitada.");
}

describe("VercelBlobReportStorage", () => {
  it("envia o PDF como blob privado, sem sufixo aleatório e com o token", async () => {
    const fake = sdk();
    const storage = new VercelBlobReportStorage("token-teste", fake as never);

    const result = await storage.upload({
      pathname: "reports/empresa-a/usuario-a/id/relatorio.pdf",
      bytes: new Uint8Array([37, 80, 68, 70]),
      contentType: "application/pdf",
    });

    expect(result).toEqual({
      pathname: "reports/empresa-a/usuario-a/id/relatorio.pdf",
      contentType: "application/pdf",
    });
    expect(fake.put).toHaveBeenCalledWith(
      "reports/empresa-a/usuario-a/id/relatorio.pdf",
      expect.any(Buffer),
      {
        access: "private",
        addRandomSuffix: false,
        contentType: "application/pdf",
        token: "token-teste",
      },
    );
  });

  it("lê o blob privado e devolve null quando ele não existe", async () => {
    const fake = sdk();
    const storage = new VercelBlobReportStorage("token-teste", fake as never);

    expect(await storage.get("reports/x.pdf")).toMatchObject({ size: 5, etag: "etag-1" });
    expect(fake.get).toHaveBeenCalledWith("reports/x.pdf", {
      access: "private",
      token: "token-teste",
    });

    fake.get.mockResolvedValueOnce({ statusCode: 404, stream: null, blob: null } as never);
    expect(await storage.get("reports/ausente.pdf")).toBeNull();
  });

  it.each([
    ["upload", "Não foi possível armazenar o relatório."],
    ["get", "Não foi possível recuperar o relatório."],
    ["delete", "Não foi possível remover o relatório."],
  ] as const)("converte falha do SDK em 502 sem expor detalhes: %s", async (operation: "upload" | "get" | "delete", message: string) => {
    const fake = sdk();
    const failure = new Error("token inválido: vercel_blob_rw_segredo");
    fake.put.mockRejectedValueOnce(failure);
    fake.get.mockRejectedValueOnce(failure);
    fake.del.mockRejectedValueOnce(failure);
    const storage = new VercelBlobReportStorage("token-teste", fake as never);

    const call =
      operation === "upload"
        ? storage.upload({ pathname: "p.pdf", bytes: new Uint8Array(1), contentType: "application/pdf" })
        : operation === "get"
          ? storage.get("p.pdf")
          : storage.delete("p.pdf");
    const error = await rejection(call);

    expect(error.statusCode).toBe(502);
    expect(error.message).toBe(message);
    expect(JSON.stringify(error)).not.toContain("segredo");
  });

  it("exige o token do Vercel Blob", () => {
    expect(() => new VercelBlobReportStorage(" ")).toThrow("BLOB_READ_WRITE_TOKEN");
    expect(() => createReportStorage({})).toThrow("BLOB_READ_WRITE_TOKEN");
    expect(createReportStorage({ BLOB_READ_WRITE_TOKEN: "token" })).toBeInstanceOf(
      VercelBlobReportStorage,
    );
  });
});

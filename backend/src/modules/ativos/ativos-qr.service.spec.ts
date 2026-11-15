import { describe, expect, it, jest } from "@jest/globals";
import { AtivosService } from "./ativos.service.js";

describe("AtivosService QR Code resolution", () => {
  it("extrai o código do ativo a partir de payloads QR e códigos diretos", () => {
    expect(AtivosService.extractCodigoFromQrPayload("CTRPE:ATIVO:BOM-001")).toBe("BOM-001");
    expect(AtivosService.extractCodigoFromQrPayload("ctrpe://ativos/qr/COMP-04")).toBe("COMP-04");
    expect(AtivosService.extractCodigoFromQrPayload("https://app.ctrpe.com/ativos/qr/TRN-09")).toBe("TRN-09");
    expect(AtivosService.extractCodigoFromQrPayload("  MTR-12  ")).toBe("MTR-12");
  });

  it("busca o ativo da empresa pelo payload QR decodificado", async () => {
    const service = new AtivosService();
    const repoSpy = jest
      .spyOn((service as unknown as { ativosRepository: { findByCodigo: (e: string, c: string) => Promise<unknown> } }).ativosRepository, "findByCodigo")
      .mockResolvedValue({
        id: "ativo-99",
        empresaId: "emp-1",
        codigo: "BOM-001",
        nome: "Bomba Centrífuga 01",
      });

    const ativo = await service.findByCodigo("CTRPE:ATIVO:BOM-001", "emp-1");

    expect(repoSpy).toHaveBeenCalledWith("emp-1", "BOM-001");
    expect(ativo).toMatchObject({ id: "ativo-99", codigo: "BOM-001" });
  });
});

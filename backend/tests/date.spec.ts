import { formatDateToBR } from "../src/common/utils/date";

describe("Utils: Date", () => {
  it("deve formatar uma data corretamente para o padrão brasileiro", () => {
    const dataInput = "2026-05-27T12:00:00Z";
    const resultado = formatDateToBR(dataInput);
    expect(resultado).toBe("27/05/2026");
  });

  it("deve retornar 'Data inválida' se receber um formato incorreto", () => {
    const resultado = formatDateToBR("data-errada");
    expect(resultado).toBe("Data inválida");
  });
});
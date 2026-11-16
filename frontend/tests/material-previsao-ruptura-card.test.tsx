import { screen } from "@testing-library/react-native";

import { MaterialPrevisaoRupturaCard } from "@/features/materiais/material-previsao-ruptura-card";
import { renderWithProviders } from "./utils/render-with-providers";

const mockUsePrevisaoRupturaMaterial = jest.fn();

jest.mock("@/features/materiais/materiais.hooks", () => ({
  usePrevisaoRupturaMaterial: (...args: unknown[]) =>
    mockUsePrevisaoRupturaMaterial(...args),
}));

describe("MaterialPrevisaoRupturaCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a previsão calculada para o material", () => {
    mockUsePrevisaoRupturaMaterial.mockReturnValue({
      data: {
        materialId: "mat-1",
        unidade: "UN",
        estoqueAtual: 12,
        estoqueMinimo: 4,
        consumoMedioMensal: 60,
        consumoMedioDiario: 2,
        diasParaRuptura: 6,
        dataRupturaPrevista: "2026-11-22T00:00:00.000Z",
        risco: "RUPTURA_IMINENTE",
        sugestaoReposicao: 112,
      },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<MaterialPrevisaoRupturaCard materialId="mat-1" />);

    expect(mockUsePrevisaoRupturaMaterial).toHaveBeenCalledWith("mat-1");
    expect(screen.getByText("Previsão de Ruptura de Estoque")).toBeTruthy();
    expect(screen.getByText("Ruptura prevista em 6 dia(s)")).toBeTruthy();
    expect(screen.getByText(/\+112 UN/)).toBeTruthy();
  });

  it("informa quando a previsão não pode ser calculada", () => {
    mockUsePrevisaoRupturaMaterial.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<MaterialPrevisaoRupturaCard materialId="mat-1" />);

    expect(
      screen.getByText(
        "Não foi possível calcular a previsão de ruptura deste material.",
      ),
    ).toBeTruthy();
  });
});

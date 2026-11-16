import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import MaterialDetailScreen from "../app/(protected)/materiais/[id]";
import { notify } from "@/store/toast-store";
import { renderWithProviders } from "./utils/render-with-providers";

const mockMutateAsync = jest.fn();

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useLocalSearchParams: () => ({ id: "mat-1" }),
}));

jest.mock("@/components/domain/permission-gate", () => ({
  PermissionGate: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("@/features/materiais/materiais.hooks", () => ({
  useMaterial: () => ({
    data: {
      id: "mat-1",
      codigo: "MAT-1",
      nome: "Rolamento",
      unidade: "UN",
      estoqueAtual: 5,
      estoqueMinimo: 2,
      custoMedio: 10,
      descricao: null,
      ativo: true,
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
  useUpdateMaterialEstoque: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  usePrevisaoRupturaMaterial: () => ({
    data: undefined,
    isLoading: false,
    isError: true,
  }),
}));

describe("MaterialDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra o erro do backend sem deixar a rejeição escapar", async () => {
    jest.spyOn(notify, "error").mockImplementation(() => undefined);
    mockMutateAsync.mockRejectedValue({
      response: { data: { error: "Estoque insuficiente" } },
    });
    renderWithProviders(<MaterialDetailScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Ex: 5"), "10");
    fireEvent.press(screen.getByText("Saída"));

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith(
        "Erro ao atualizar estoque",
        "Estoque insuficiente",
      ),
    );
    expect(screen.getByDisplayValue("10")).toBeTruthy();
  });
});

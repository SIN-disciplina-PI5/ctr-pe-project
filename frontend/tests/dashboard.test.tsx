import DashboardScreen from "../app/(protected)/(tabs)/dashboard";
import { screen } from "@testing-library/react-native";

import { renderWithProviders } from "./utils/render-with-providers";

jest.mock("@/hooks/use-selected-empresa", () => ({
  useSelectedEmpresaId: () => "empresa-1",
}));

jest.mock("@/features/dashboard/dashboard.hooks", () => ({
  useDashboardResumo: () => ({
    isLoading: false,
    isError: false,
    data: {
      indicadores: {
        maquinasParadas: 1,
        osAbertas: 2,
        osAguardandoPeca: 3,
      },
    },
  }),
  useDashboardAtivos: () => ({
    isLoading: false,
    isError: false,
    data: { ativosPorStatus: [{ status: "DISPONIVEL", quantidade: 4 }] },
  }),
  useDashboardOrdensServico: () => ({
    isLoading: false,
    isError: false,
    data: { osPorPrioridade: [] },
  }),
  useDashboardMateriais: () => ({
    isLoading: false,
    isError: false,
    data: { materiaisCriticos: [] },
  }),
}));

jest.mock("@/features/ativos/ativos.hooks", () => ({
  useAtivos: () => ({ isLoading: false, isError: false, data: [] }),
}));

jest.mock("@/features/ordens-servico/ordens-servico.hooks", () => ({
  useOrdensServico: () => ({ isLoading: false, isError: false, data: [] }),
}));

jest.mock("@/features/alertas/alertas.hooks", () => ({
  useAlertas: () => ({ isLoading: false, isError: false, data: [] }),
}));

jest.mock("@/features/paradas/paradas.hooks", () => ({
  useParadas: () => ({ isLoading: false, isError: false, data: [] }),
}));

describe("DashboardScreen", () => {
  it("renderiza os indicadores principais", () => {
    renderWithProviders(<DashboardScreen />);

    expect(screen.getByText("Ativos totais")).toBeTruthy();
    expect(screen.getByText("Máquinas paradas")).toBeTruthy();
    expect(screen.getByText("O.S. abertas")).toBeTruthy();
    expect(screen.getByText("O.S. aguardando peça")).toBeTruthy();
  });
});

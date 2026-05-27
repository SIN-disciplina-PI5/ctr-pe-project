import DashboardScreen from "../app/(protected)/(tabs)/dashboard";
import { screen } from "@testing-library/react-native";

import { renderWithProviders } from "./utils/render-with-providers";

describe("DashboardScreen", () => {
  it("renderiza os indicadores principais", () => {
    renderWithProviders(<DashboardScreen />);

    expect(screen.getByText("Ativos totais")).toBeTruthy();
    expect(screen.getByText("Maquinas paradas")).toBeTruthy();
    expect(screen.getByText("O.S. abertas")).toBeTruthy();
    expect(screen.getByText("O.S. aguardando peca")).toBeTruthy();
  });
});

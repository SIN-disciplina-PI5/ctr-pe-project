import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react-native";
import type { PropsWithChildren, ReactElement } from "react";

import { NAV_THEME } from "@/lib/theme";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type ProviderProps = PropsWithChildren;

function TestProviders({ children }: ProviderProps) {
  const queryClient = createTestQueryClient();

  return (
    <ThemeProvider value={NAV_THEME.light}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
}

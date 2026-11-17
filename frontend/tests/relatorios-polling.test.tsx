import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";

import { useRelatorios } from "@/features/relatorios/relatorios.hooks";
import { listReports } from "@/features/relatorios/relatorios.service";
import type { ListReportsResponse } from "@/features/relatorios/relatorios.types";

jest.mock("@/features/relatorios/relatorios.service", () => ({
  listReports: jest.fn(),
  createReport: jest.fn(),
  downloadReport: jest.fn(),
}));

const mockList = listReports as jest.Mock;

function page(hasActiveJobs: boolean): ListReportsResponse {
  return { items: [], total: 1, page: 1, pageSize: 10, hasActiveJobs };
}

function createWrapper() {
  // Um client por teste: recriá-lo a cada render apagaria o cache do polling.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("useRelatorios (polling)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockList.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("consulta de novo a cada 5 s enquanto há job ativo e para quando todos terminam", async () => {
    mockList
      .mockResolvedValueOnce(page(true))
      .mockResolvedValueOnce(page(true))
      .mockResolvedValue(page(false));

    const { result } = await renderHook(() => useRelatorios({ page: 1, pageSize: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.hasActiveJobs).toBe(true));
    expect(mockList).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    await waitFor(() => expect(result.current.data?.hasActiveJobs).toBe(false));
    expect(mockList).toHaveBeenCalledTimes(3);

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });
    expect(mockList).toHaveBeenCalledTimes(3);
  });

  it("não faz polling quando a primeira resposta não tem job ativo", async () => {
    mockList.mockResolvedValue(page(false));

    const { result } = await renderHook(() => useRelatorios({ page: 1, pageSize: 10 }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });
    expect(mockList).toHaveBeenCalledTimes(1);
  });
});

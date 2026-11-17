import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import RelatoriosScreen from "../app/(protected)/relatorios";
import type { ReportJob } from "@/features/relatorios/relatorios.types";
import { presetPeriod } from "@/features/relatorios/relatorios.utils";
import { useAuthStore } from "@/store/auth-store";
import { renderWithProviders } from "./utils/render-with-providers";

const mockSolicitar = jest.fn();
const mockBaixar = jest.fn();
const mockRefetch = jest.fn();
let mockLista: Record<string, unknown>;

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  Redirect: () => null,
}));

jest.mock("@/features/relatorios/relatorios.hooks", () => ({
  useRelatorios: () => mockLista,
  useSolicitarRelatorio: () => ({ mutate: mockSolicitar, isPending: false }),
  useBaixarRelatorio: () => ({ mutate: mockBaixar, isPending: false, variables: undefined }),
}));

function job(overrides: Partial<ReportJob>): ReportJob {
  return {
    id: "job-1",
    status: "queued",
    request: "Tipo de relatório: Relatório mensal de manutenção.",
    attempts: 0,
    maxAttempts: 3,
    createdAt: "2026-11-15T12:00:00.000Z",
    startedAt: null,
    finishedAt: null,
    nextAttemptAt: null,
    error: null,
    reportFileId: null,
    report: null,
    expired: false,
    downloadUrl: null,
    ...overrides,
  };
}

const jobs: ReportJob[] = [
  job({ id: "job-fila" }),
  job({
    id: "job-retry",
    attempts: 1,
    nextAttemptAt: "2026-11-15T12:01:00.000Z",
    error: { code: "INTERNAL_SERVER_ERROR", message: "Falha temporária." },
  }),
  job({ id: "job-gerando", status: "running", attempts: 1 }),
  job({
    id: "job-pronto",
    status: "done",
    attempts: 1,
    reportFileId: "arquivo-1",
    downloadUrl: "/api/ai/reports/job-pronto/download",
    report: {
      title: "Manutenção de outubro",
      type: "monthly_maintenance",
      sizeBytes: 204_800,
      expiresAt: "2026-12-15T12:00:00.000Z",
    },
  }),
  job({
    id: "job-falhou",
    status: "failed",
    attempts: 3,
    error: { code: "VALIDATION_ERROR", message: "O arquivo do relatório excede o tamanho permitido." },
  }),
  job({ id: "job-expirado", status: "done", expired: true }),
];

function setUser(empresaId: string | null) {
  useAuthStore.setState({
    user: { id: "usuario-1", nome: "Gestora", perfil: "GESTOR", empresaId } as never,
  });
}

describe("RelatoriosScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUser("empresa-1");
    mockLista = {
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: mockRefetch,
      data: { items: jobs, total: jobs.length, page: 1, pageSize: 10, hasActiveJobs: true },
    };
  });

  it("solicita o relatório padrão com período do mês anterior e chave de idempotência", async () => {
    renderWithProviders(<RelatoriosScreen />);

    fireEvent.press(screen.getByLabelText("Solicitar relatório"));

    await waitFor(() => expect(mockSolicitar).toHaveBeenCalledTimes(1));
    const [variables] = mockSolicitar.mock.calls[0];
    expect(variables.input).toEqual({
      reportType: "monthly_maintenance",
      period: presetPeriod("last_month", new Date()),
    });
    expect(variables.idempotencyKey).toMatch(/^[A-Za-z0-9._:-]{8,128}$/);
  });

  it("reaproveita a chave ao repetir o mesmo pedido após uma falha", async () => {
    renderWithProviders(<RelatoriosScreen />);

    fireEvent.press(screen.getByLabelText("Solicitar relatório"));
    await waitFor(() => expect(mockSolicitar).toHaveBeenCalledTimes(1));
    fireEvent.press(screen.getByLabelText("Solicitar relatório"));
    await waitFor(() => expect(mockSolicitar).toHaveBeenCalledTimes(2));

    expect(mockSolicitar.mock.calls[1][0].idempotencyKey).toBe(
      mockSolicitar.mock.calls[0][0].idempotencyKey,
    );
  });

  it("exige descrição no relatório personalizado", async () => {
    renderWithProviders(<RelatoriosScreen />);

    fireEvent.press(screen.getAllByText("Personalizado")[0]!);
    fireEvent.press(screen.getByLabelText("Solicitar relatório"));

    expect(await screen.findByText("Descreva o relatório que você precisa.")).toBeTruthy();
    expect(mockSolicitar).not.toHaveBeenCalled();
  });

  it("mostra cada estado do processamento", () => {
    renderWithProviders(<RelatoriosScreen />);

    expect(screen.getByText("Aguardando processamento.")).toBeTruthy();
    expect(screen.getByText(/A tentativa anterior falhou\. Nova tentativa às .* \(2 de 3\)\./)).toBeTruthy();
    expect(screen.getByText("Gerando o relatório. Isso pode levar alguns minutos.")).toBeTruthy();
    expect(screen.getByText("Manutenção de outubro")).toBeTruthy();
    expect(screen.getByText(/PDF de 200 KB/)).toBeTruthy();
    expect(screen.getByText(/O arquivo do relatório excede o tamanho permitido\./)).toBeTruthy();
    expect(screen.getByText(/expirou após 30 dias/)).toBeTruthy();
    expect(screen.getByText(/Atualizando a cada 5 s/)).toBeTruthy();
  });

  it("baixa somente o relatório pronto", () => {
    renderWithProviders(<RelatoriosScreen />);

    const botoes = screen.getAllByText("Baixar PDF");
    expect(botoes).toHaveLength(1);

    fireEvent.press(screen.getByLabelText("Baixar PDF de Manutenção de outubro"));

    expect(mockBaixar).toHaveBeenCalledWith(
      expect.objectContaining({ id: "job-pronto" }),
      expect.anything(),
    );
  });

  it("não mostra o aviso de atualização sem jobs ativos", () => {
    mockLista = {
      ...mockLista,
      data: { items: [jobs[3]], total: 1, page: 1, pageSize: 10, hasActiveJobs: false },
    };
    renderWithProviders(<RelatoriosScreen />);

    expect(screen.queryByText(/Atualizando a cada/)).toBeNull();
  });

  it("mostra estado vazio e erro com nova tentativa", () => {
    mockLista = { ...mockLista, data: { items: [], total: 0, page: 1, pageSize: 10, hasActiveJobs: false } };
    const { unmount } = renderWithProviders(<RelatoriosScreen />);
    expect(screen.getByText("Nenhum relatório encontrado")).toBeTruthy();
    unmount();

    mockLista = { ...mockLista, data: undefined, isError: true, error: new Error("rede") };
    renderWithProviders(<RelatoriosScreen />);
    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("explica a indisponibilidade para usuário sem empresa", () => {
    setUser(null);
    renderWithProviders(<RelatoriosScreen />);

    expect(screen.getByText("Relatórios indisponíveis para este usuário")).toBeTruthy();
    expect(screen.queryByLabelText("Solicitar relatório")).toBeNull();
  });
});

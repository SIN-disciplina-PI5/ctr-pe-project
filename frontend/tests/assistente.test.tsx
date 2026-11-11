import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AssistenteScreen from "../app/(protected)/assistente";
import { renderWithProviders } from "./utils/render-with-providers";

const mockMutateAsync = jest.fn();
const mockReset = jest.fn();

jest.mock("@/hooks/use-selected-empresa", () => ({
  useSelectedEmpresaId: () => "empresa-1",
}));

jest.mock("@/features/assistente/assistente.hooks", () => ({
  useSendChatMessage: () => ({
    mutateAsync: mockMutateAsync,
    reset: mockReset,
    isPending: false,
  }),
}));

describe("AssistenteScreen", () => {
  const answeredResponse = {
    id: "conversa-1",
    conversationId: "conversa-1",
    message: "Há 3 ordens abertas.",
    status: "answered",
    intent: "data_question",
    result: {
      status: "answered",
      intent: "data_question",
      result: {
        status: "answered",
        mode: "single",
        answer: "Há 3 ordens abertas.",
        sql: 'SELECT numero, status FROM ai."ordens_servico" LIMIT 100',
        rowsUsed: [{ numero: "OS-001", status: "ABERTA" }],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue(answeredResponse);
  });

  it("envia uma pergunta e exibe resposta, tabela e SQL sob demanda", async () => {
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(
      screen.getByLabelText("Mensagem"),
      "Quantas ordens estão abertas?",
    );
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      message: "Quantas ordens estão abertas?",
    });
    expect(screen.getByText("Quantas ordens estão abertas?")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Há 3 ordens abertas.")).toBeTruthy();
    });
    expect(screen.getByText("OS-001")).toBeTruthy();
    expect(screen.getByText("ABERTA")).toBeTruthy();

    fireEvent.press(screen.getByText("Visualizar SQL"));
    expect(
      screen.getByText(
        'SELECT numero, status FROM ai."ordens_servico" LIMIT 100',
      ),
    ).toBeTruthy();
  });

  it("inicia uma nova conversa limpando o histórico", async () => {
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(screen.getByLabelText("Mensagem"), "Pergunta inicial");
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));
    await waitFor(() =>
      expect(screen.getByText("Há 3 ordens abertas.")).toBeTruthy(),
    );

    fireEvent.press(screen.getByText("Nova conversa"));

    expect(screen.queryByText("Pergunta inicial")).toBeNull();
    expect(
      screen.getByText("Como posso ajudar com a manutenção?"),
    ).toBeTruthy();
  });

  it("envia o identificador no follow-up da mesma conversa", async () => {
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(screen.getByLabelText("Mensagem"), "Pergunta inicial");
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));
    await waitFor(() =>
      expect(screen.getByText("Há 3 ordens abertas.")).toBeTruthy(),
    );

    fireEvent.changeText(
      screen.getByLabelText("Mensagem"),
      "E no mês passado?",
    );
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));

    expect(mockMutateAsync).toHaveBeenLastCalledWith({
      message: "E no mês passado?",
      conversationId: "conversa-1",
    });
    await waitFor(() => {
      expect(screen.getAllByText("Há 3 ordens abertas.")).toHaveLength(2);
    });
  });

  it("exibe recusas sem inventar tabela ou SQL", async () => {
    mockMutateAsync.mockResolvedValue({
      id: "conversa-2",
      conversationId: "conversa-2",
      message: "Não posso alterar ou excluir registros.",
      status: "refused",
      intent: "write_request",
      result: {
        status: "refused",
        intent: "write_request",
        message: "Não posso alterar ou excluir registros.",
      },
    });
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(
      screen.getByLabelText("Mensagem"),
      "Exclua as ordens antigas",
    );
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));

    await waitFor(() => {
      expect(
        screen.getByText("Não posso alterar ou excluir registros."),
      ).toBeTruthy();
    });
    expect(screen.queryByText("Visualizar SQL")).toBeNull();
  });

  it("exibe o conteúdo estruturado de um relatório gerado", async () => {
    mockMutateAsync.mockResolvedValue({
      id: "conversa-relatorio",
      conversationId: "conversa-relatorio",
      message: 'Relatório "Custos por ativo" gerado com sucesso.',
      status: "report_generated",
      intent: "report_request",
      result: {
        status: "report_generated",
        intent: "report_request",
        message: 'Relatório "Custos por ativo" gerado com sucesso.',
        report: {
          status: "generated",
          reportType: "asset_costs",
          title: "Custos por ativo",
          sections: [
            {
              id: "custos",
              title: "Resumo de custos",
              status: "ready",
              narrative: "O ativo AT-001 concentrou o maior custo.",
              table: {
                columns: ["ativo", "custo"],
                rows: [{ ativo: "AT-001", custo: 1250 }],
              },
              chart: {
                type: "bar",
                series: [
                  {
                    name: "Custo total",
                    data: [{ label: "AT-001", value: 1250 }],
                  },
                ],
              },
            },
          ],
        },
      },
    });
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(
      screen.getByLabelText("Mensagem"),
      "Gere um relatório de custos por ativo",
    );
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));

    await waitFor(() => {
      expect(screen.getByText("Custos por ativo")).toBeTruthy();
    });
    expect(screen.getByText("Resumo de custos")).toBeTruthy();
    expect(
      screen.getByText("O ativo AT-001 concentrou o maior custo."),
    ).toBeTruthy();
    expect(screen.getAllByText("AT-001")).toHaveLength(2);
    expect(screen.getAllByText("1250")).toHaveLength(2);
    expect(screen.getByText("Custo total")).toBeTruthy();
    expect(screen.queryByText("Visualizar SQL")).toBeNull();
  });

  it("mostra a mensagem segura devolvida pela API", async () => {
    mockMutateAsync.mockRejectedValue({
      response: {
        data: {
          error: "Limite de mensagens excedido. Tente novamente em instantes.",
        },
      },
    });
    renderWithProviders(<AssistenteScreen />);

    fireEvent.changeText(
      screen.getByLabelText("Mensagem"),
      "Mais uma pergunta",
    );
    fireEvent.press(screen.getByLabelText("Enviar mensagem"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Limite de mensagens excedido. Tente novamente em instantes.",
        ),
      ).toBeTruthy();
    });
  });
});

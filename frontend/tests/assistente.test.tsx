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
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue({
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
    });
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
    await waitFor(() => expect(screen.getByText("Há 3 ordens abertas.")).toBeTruthy());

    fireEvent.press(screen.getByText("Nova conversa"));

    expect(screen.queryByText("Pergunta inicial")).toBeNull();
    expect(
      screen.getByText("Como posso ajudar com a manutenção?"),
    ).toBeTruthy();
  });
});

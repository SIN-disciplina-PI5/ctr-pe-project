export type TipoAlerta =
  | "ATIVO_PARADO"
  | "OS_ATRASADA"
  | "AGUARDANDO_PECA"
  | "ESTOQUE_BAIXO"
  | "CUSTO_ALTO"
  | "OUTRO";

export type StatusAlerta = "ABERTO" | "LIDO" | "RESOLVIDO" | "IGNORADO";

export type Severidade = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export type Alerta = {
  id: string;
  empresaId: string;
  ativoId: string | null;
  ordemServicoId: string | null;
  usuarioId: string | null;
  tipo: TipoAlerta;
  severidade: Severidade;
  status: StatusAlerta;
  titulo: string;
  mensagem: string;
  geradoEm: string;
  lidoEm: string | null;
  resolvidoEm: string | null;
  createdAt: string;
};
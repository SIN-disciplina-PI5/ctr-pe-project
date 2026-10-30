export const SCHEMA_CONTEXT = `
Banco PostgreSQL. Todos os identificadores com letras maiúsculas exigem aspas duplas.

"Empresa": id text, codigo text, nome text, ativa boolean.
"Ativo": id text, "empresaId" text, codigo text, nome text, tipo text,
status text, criticidade text, ativo boolean.
"OrdemServico": id text, "empresaId" text, "ativoId" text, numero text,
titulo text, tipo text, status text, prioridade text, "abertaEm" timestamp,
"iniciadaEm" timestamp, "encerradaEm" timestamp, "prazoEm" timestamp,
"tempoAguardandoPecaMinutos" integer, "tempoExecucaoMinutos" integer,
"custoMateriais" numeric, "custoMaoObra" numeric, "custoTotal" numeric.
"ParadaAtivo": id text, "empresaId" text, "ativoId" text,
"ordemServicoId" text, status text, "inicioEm" timestamp, "fimEm" timestamp,
"duracaoMinutos" integer, programada boolean, "impactaDisponibilidade" boolean.
"Material": id text, "empresaId" text, codigo text, nome text,
"estoqueAtual" numeric, "estoqueMinimo" numeric, "custoMedio" numeric,
ativo boolean.
"OrdemServicoMaterial": id text, "ordemServicoId" text, "materialId" text,
quantidade numeric, "custoTotal" numeric, status text.
"Alerta": id text, "empresaId" text, "ativoId" text, "ordemServicoId" text,
tipo text, severidade text, status text, titulo text, mensagem text,
"geradoEm" timestamp.

Relacionamentos:
"Ativo"."empresaId" -> "Empresa".id.
"OrdemServico"."empresaId" -> "Empresa".id.
"OrdemServico"."ativoId" -> "Ativo".id.
"ParadaAtivo"."ativoId" -> "Ativo".id.
"ParadaAtivo"."ordemServicoId" -> "OrdemServico".id.
"Material"."empresaId" -> "Empresa".id.
"OrdemServicoMaterial"."ordemServicoId" -> "OrdemServico".id.
"OrdemServicoMaterial"."materialId" -> "Material".id.
"Alerta"."empresaId" -> "Empresa".id.

StatusAtivo: DISPONIVEL, EM_USO, PARADO, EM_MANUTENCAO,
AGUARDANDO_PECA, DESATIVADO.
StatusOS: ABERTA, EM_EXECUCAO, AGUARDANDO_PECA, ENCERRADA, CANCELADA.
TipoOS: CORRETIVA, PREVENTIVA, INSPECAO, OUTRA.
StatusParada: ABERTA, ENCERRADA, CANCELADA.
StatusMaterialOS: SOLICITADO, CONSUMIDO, DEVOLVIDO, CANCELADO.
StatusAlerta: ABERTO, LIDO, RESOLVIDO, IGNORADO.
Severidade: INFO, BAIXA, MEDIA, ALTA, CRITICA.

Empresas conhecidas:
Nome "Alpha International" -> codigo "alpha-international".
Nome "Alpha Brazilian" -> codigo "alpha-brazilian".

Regras de negócio:
Ativo indisponível é um ativo com ativo = true e status PARADO,
EM_MANUTENCAO ou AGUARDANDO_PECA.
O.S. aberta possui status ABERTA, EM_EXECUCAO ou AGUARDANDO_PECA.
O.S. atrasada é uma O.S. aberta cujo prazoEm é anterior à data de referência.
Material com estoque baixo possui ativo = true e estoqueAtual menor ou igual a estoqueMinimo.
Média de parada considera somente paradas ENCERRADAS com duracaoMinutos.

Regras de escrita SQL:
Use aspas duplas em todos os nomes reais de tabelas e colunas.
Não use barras invertidas antes das aspas no SQL.
Aliases podem permanecer sem aspas.
Exemplo correto: SELECT a."codigo" FROM "Ativo" AS a.

Toda consulta deve limitar os dados à empresa indicada por meio de "Empresa".codigo.
A data de referência dos dados sintéticos é 2026-10-27T12:00:00Z.
`.trim();
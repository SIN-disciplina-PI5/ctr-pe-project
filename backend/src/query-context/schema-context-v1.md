# CTR-PE Query Schema Context v1

Sistema de gestão de manutenção de ativos.

Entidades principais:

- Empresa
- Localizacao
- Usuario
- Ativo
- OrdemServico
- ParadaAtivo
- Material
- OrdemServicoMaterial
- ApontamentoOS
- Alerta
- LogAuditoria

Todos os valores monetários utilizam BRL.

---

# Business Rules

## Open Stop

Uma parada é considerada aberta quando:

- status = ABERTA
- ou fimEm IS NULL

Consultas sobre "paradas abertas", "equipamentos parados atualmente" ou "downtime em aberto" devem considerar essa regra.

## Closed Stop

Uma parada é considerada encerrada quando:

- status = ENCERRADA
- e fimEm IS NOT NULL

## Critical Work Order

Uma ordem de serviço é considerada crítica quando:

- prioridade = CRITICA

## Waiting For Parts

Uma ordem de serviço está aguardando peças quando:

- status = AGUARDANDO_PECA

## Asset Downtime

Um ativo é considerado parado quando:

- status = PARADO

## Availability

Indicadores de disponibilidade devem utilizar registros da tabela ParadaAtivo.

Apenas registros com:

- impactaDisponibilidade = true

devem ser considerados nos cálculos.

Paradas programadas podem ser excluídas de determinados indicadores de disponibilidade.

## Costs

Os seguintes campos representam valores monetários em BRL:

- custoMateriais
- custoMaoObra
- custoTotal
- custoMedio
- custoUnitario

---

# Enums

## PerfilUsuario

ADMIN
- Controle total do sistema.

GESTOR
- Gestão operacional e acompanhamento de indicadores.

SUPERVISOR
- Supervisão das atividades de manutenção.

TECNICO
- Execução das atividades de manutenção.

CONSULTA
- Acesso apenas para consulta.

## TipoAtivo

MAQUINA
CAMINHAO
EQUIPAMENTO
COMPONENTE
OUTRO

## StatusAtivo

DISPONIVEL
- Ativo apto para operação.

EM_USO
- Ativo em utilização.

PARADO
- Ativo indisponível para operação.

EM_MANUTENCAO
- Ativo em manutenção.

AGUARDANDO_PECA
- Aguardando material para retorno à operação.

DESATIVADO
- Fora de operação permanentemente.

## Criticidade

BAIXA
MEDIA
ALTA
CRITICA

Quanto maior a criticidade, maior o impacto operacional da indisponibilidade do ativo.

## TipoOS

CORRETIVA
- Corrige uma falha existente.

PREVENTIVA
- Atividade planejada para evitar falhas.

INSPECAO
- Verificação ou avaliação técnica.

OUTRA
- Demais tipos de serviço.

## StatusOS

ABERTA
- Ordem criada e ainda não iniciada.

EM_EXECUCAO
- Trabalho em andamento.

AGUARDANDO_PECA
- Execução interrompida por falta de material.

ENCERRADA
- Serviço concluído.

CANCELADA
- Ordem cancelada.

## Prioridade

BAIXA
MEDIA
ALTA
CRITICA

Utilizada para definir urgência e impacto da manutenção.

## StatusParada

ABERTA
ENCERRADA
CANCELADA

## StatusMaterialOS

SOLICITADO
CONSUMIDO
DEVOLVIDO
CANCELADO

## TipoAlerta

ATIVO_PARADO
OS_ATRASADA
AGUARDANDO_PECA
ESTOQUE_BAIXO
CUSTO_ALTO
OUTRO

## Severidade

INFO
BAIXA
MEDIA
ALTA
CRITICA

## StatusAlerta

ABERTO
LIDO
RESOLVIDO
IGNORADO

---

# Entities

## Empresa

Representa uma unidade empresarial ou organização.

Campos principais:

- id: identificador único.
- codigo: código de negócio da empresa.
- nome: nome da empresa.
- ativa: indica se a empresa está ativa.

Relacionamentos:

- Possui usuários.
- Possui ativos.
- Possui ordens de serviço.
- Possui materiais.
- Possui alertas.

## Localizacao

Representa o local físico onde um ativo está instalado ou operando.

Exemplos:

- Oficina
- Galpão
- Linha de produção
- Pátio

Campos principais:

- codigo
- nome
- tipo
- ativa

## Usuario

Representa um usuário do sistema.

Campos principais:

- nome
- email
- perfil
- ativo
- ultimoLoginEm

## Ativo

Representa equipamentos monitorados e mantidos pelo sistema.

Campos principais:

- codigo
- nome
- descricao
- tipo
- status
- criticidade
- marca
- modelo
- numeroSerie
- placa
- horimetroAtual
- odometroAtual

Relacionamentos:

- Possui ordens de serviço.
- Possui paradas.
- Possui alertas.

## OrdemServico

Representa uma atividade de manutenção.

Campos principais:

- numero
- titulo
- descricao
- tipo
- status
- prioridade
- abertaEm
- iniciadaEm
- encerradaEm
- prazoEm
- custoMateriais
- custoMaoObra
- custoTotal

Campos de duração:

- tempoAguardandoPecaMinutos
- tempoParadoMinutos
- tempoExecucaoMinutos

Relacionamentos:

- Pertence a um ativo.
- Possui materiais.
- Possui apontamentos.
- Pode gerar paradas.
- Pode gerar alertas.

## ParadaAtivo

Representa períodos de indisponibilidade de um ativo.

Campos principais:

- status
- inicioEm
- fimEm
- duracaoMinutos
- motivo
- programada
- impactaDisponibilidade

Relacionamentos:

- Pertence a um ativo.
- Pode estar vinculada a uma ordem de serviço.

## Material

Representa peças, componentes ou insumos utilizados na manutenção.

Campos principais:

- codigo
- nome
- descricao
- unidade
- estoqueAtual
- estoqueMinimo
- custoMedio

Regra importante:

Materiais com:

estoqueAtual < estoqueMinimo

podem ser considerados itens com estoque baixo.

## OrdemServicoMaterial

Tabela de associação entre OrdemServico e Material.

Campos principais:

- quantidade
- custoUnitario
- custoTotal
- status

## ApontamentoOS

Representa trabalho realizado por um técnico em uma ordem de serviço.

Campos principais:

- inicioEm
- fimEm
- duracaoMinutos
- custoHora
- custoTotal

Utilizado para cálculo de mão de obra.

## Alerta

Representa notificações operacionais geradas pelo sistema.

Exemplos:

- Ativo parado.
- Ordem atrasada.
- Estoque baixo.
- Custo elevado.

Campos principais:

- tipo
- severidade
- status
- titulo
- mensagem
- geradoEm

## LogAuditoria

Representa eventos auditáveis realizados no sistema.

Campos principais:

- entidade
- entidadeId
- acao
- antes
- depois
- createdAt

Permite rastrear alterações realizadas pelos usuários.
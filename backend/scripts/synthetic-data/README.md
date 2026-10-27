# Dados sintéticos

Script que **apaga todo o banco** e o preenche com dados sintéticos reproduzíveis: 2 empresas, usuários, ativos, materiais e cerca de 380 ordens de serviço simuladas de abril a outubro de 2026. Serve para testar a camada de IA, o dashboard e os testes.

> Use somente na branch de dev do Neon (`dev-synthetic`). O script apaga todas as tabelas de negócio e **todos os usuários**.

## Como rodar

A partir de `backend/`:

```bash
npm run db:reset-synthetic -- --force
```

O script `db:reset-synthetic` precisa estar no `package.json`:

```json
"db:reset-synthetic": "tsx scripts/synthetic-data/reset-and-seed.ts"
```

Se for rodar os testes e2e depois, recrie os usuários de teste:

```bash
npm run db:reset-synthetic -- --force && npm run prisma:seed
```

O reset apaga os usuários de `prisma/seed.ts` (`admin@teste.com` e os outros), e os specs e2e dependem deles. O `prisma:seed` é idempotente e não conflita com o script: usa outra empresa (`EMP-TESTE-FIXA`) e outros e-mails.

Os e2e escrevem no banco apontado pelo `.env`. Rodá-los na `dev-synthetic` mistura dados de teste com os sintéticos. O ideal é uma branch do Neon só para os testes.

**Travas:** recusa `NODE_ENV=production`, exige `--force`, mostra o host do banco e espera 3 segundos antes de apagar.

**Reprodutível:** duas execuções geram os mesmos dados (semente do faker, ids sequenciais e data de referência fixa em 27/10/2026, tudo em `config.ts`).

## Isto não é teste

A pasta é um **gerador de dados**, não um conjunto de testes:

- Não tem arquivos `*.spec.ts`, então o `npm test` (Jest) não a executa.
- Não entra no build, porque o `tsconfig.build.json` compila só `src/`.
- Roda apenas quando alguém digita `npm run db:reset-synthetic -- --force`.

O `verificacoes.ts` não é um teste unitário. Ele consulta o banco depois de gerar os dados e falha o script se algo estiver incoerente.

Os imports usam a extensão `.js`, como o resto do projeto (`"type": "module"` com `nodenext`).

## Logins

| E-mail | Empresa | Perfil |
| --- | --- | --- |
| `international-admin@alpha-international.com` | alpha-international | ADMIN |
| `brazilian-admin@alpha-brazilian.com` | alpha-brazilian | ADMIN |

Senha: `@ChangeMe12345!` (ou o valor de `SEED_ADMIN_PASSWORD`). Os demais usuários seguem `perfil + número @ código-da-empresa .com`, por exemplo `tecnico1@alpha-brazilian.com`, com a mesma senha.

O admin do script pertence a uma empresa. O admin do `prisma/seed.ts` tem `empresaId: null` (admin global). Vale lembrar disso nos testes de isolamento entre empresas.

## Por onde ler

Leia nesta ordem. Cada passo só depende dos anteriores.

| # | Arquivo | O que faz |
| --- | --- | --- |
| 1 | `reset-and-seed.ts` | Ponto de entrada. Valida o ambiente, apaga, roda os seeders na ordem das dependências, roda as verificações e mostra os logins. |
| 2 | `config.ts` | Todas as constantes: empresas, volumes, chances, prazos, mensagens. É o primeiro lugar para mudar algo. |
| 3 | `types.ts` | O contexto compartilhado e o que cada seeder devolve para o próximo. |
| 4 | `guards.ts`, `database.ts`, `reset.ts` | Trava de segurança, cliente do Prisma com o adapter, e o `TRUNCATE` de todas as tabelas. |
| 5 | `utils/` | `aleatorio.ts` (faker com semente), `gerador-id.ts` (ids previsíveis), `senha.ts` (bcrypt), `tempo.ts` e `moeda.ts`. |
| 6 | `data/catalogo-ativos.ts`, `data/catalogo-materiais.ts` | Os 4 modelos de ativo e os 22 materiais. |
| 7 | `seeders/empresas.ts`, `usuarios.ts`, `localizacoes.ts`, `ativos.ts`, `materiais.ts` | Um seeder por entidade. O de materiais também cria os alertas de estoque baixo. |
| 8 | `data/catalogo-falhas.ts` | Textos de `descricao`, `diagnostico` e `solucao` por tipo de ativo, com 3 variações de redação cada. |
| 9 | `data/padroes-plantados.ts` | Os padrões que a IA deve descobrir (ver abaixo). |
| 10 | `simulacao/gerador-ordem-servico.ts` | O núcleo: gera uma OS completa (parada, apontamentos, materiais, alertas e auditoria) seguindo as regras do app. |
| 11 | `seeders/ordens-servico.ts` | Monta a linha do tempo de cada ativo, numera as OS e grava tudo em lotes. |
| 12 | `verificacoes.ts` | Confere a consistência no final. Se algo falhar, o script termina com erro. |

## Como a simulação funciona

Para cada ativo, o script percorre os 6 meses gerando uma OS depois da outra, com intervalos que dependem da criticidade (de 6 a 35 dias). As OS de um mesmo ativo nunca se sobrepõem.

Cada OS passa por: abertura, início, espera de peça (se houver), encerramento. O estado no dia 27/10/2026 vem de onde essa linha do tempo "cai":

- terminou antes: `ENCERRADA` (ou `CANCELADA`, 3% das corretivas);
- ainda não começou: `ABERTA`;
- começou e não terminou: `EM_EXECUCAO` ou `AGUARDANDO_PECA`.

Cerca de 30% dos ativos (e sempre o `CT-07`) recebem uma OS em andamento hoje, para o dashboard ter ativos parados, em manutenção, aguardando peça e OS atrasadas.

## Regras do projeto que o script reproduz

| Regra | Onde está no código | No seed |
| --- | --- | --- |
| OS impactante cria parada `ABERTA` e põe o ativo em `PARADO` | `ordens-servico.workflow.ts` | Igual. `programada` é verdadeiro só para preventiva. |
| Iniciar: ativo vai para `EM_MANUTENCAO` | `repository.iniciar` | Igual. |
| Aguardar peça: ativo vai para `AGUARDANDO_PECA` | `repository.aguardarPeca` | Igual. |
| Retomar: calcula `tempoAguardandoPecaMinutos` e zera `aguardandoPecaDesde` | `repository.retomar` | Igual. |
| Encerrar: `tempoExecucaoMinutos` = encerramento menos início da execução; parada recebe essa mesma duração | `repository.encerrar` | Igual. |
| Encerrar ou cancelar: o ativo só volta a `DISPONIVEL` se não houver outra OS impactante aberta | `encerrar`, `cancelar` | Igual. Cada ativo tem no máximo uma OS impactante aberta. |
| Cancelar: parada vira `CANCELADA`, só com `fimEm` (sem duração) | `repository.cancelar` | Igual. |
| Material devolvido tem `custoTotal` zero; custo da OS soma só os `CONSUMIDO` | `ordens-servico-materiais.repository` | Igual. |
| Apontamento: custo = duração em horas × custo/hora | `apontamentos-os.service` | Igual. |
| Número da OS: `OS-ANO-0001`, sequencial por empresa | `service.generateNumero` | Igual. |
| Alertas de parada, aguardando peça, OS atrasada e estoque baixo | `alertas.repository` | Mesmos títulos, mensagens e severidades. Estoque baixo dispara com `<=`. |
| Auditoria: entidade `ordens-servico`, ações de criação, encerramento e cancelamento | `audit.middleware` | Igual. |

## Pontos do código que valem revisão

Achados ao comparar o script com o código. O script reproduz o que o app faz hoje, salvo onde indicado.

| Ponto | Efeito | No seed |
| --- | --- | --- |
| `recalcularCustoOS` grava `custoTotal: custoMateriais`, sem somar a mão de obra (o recálculo dos apontamentos soma certo) | Depois de consumir ou devolver material, o custo total da OS perde a mão de obra | **Não reproduz.** O seed grava `custoTotal` = materiais + mão de obra. |
| A duração da parada (`duracaoMinutos`) conta a partir do início da execução, não da abertura | O "tempo médio de parada" do dashboard subestima a parada real | Reproduz. |
| `tempoExecucaoMinutos` inclui o tempo de espera de peça | "Execução" fica inflada nas OS que esperaram | Reproduz. |
| `tempoParadoMinutos` existe no schema, mas nenhum código o preenche | Coluna sempre nula | Deixa nula. |
| `iniciar` põe o ativo em `EM_MANUTENCAO` mesmo se a OS não for impactante (sem parada) | Ativo "em manutenção" sem parada aberta | Evita: OS não impactantes nunca ficam em execução. |
| `retomar` sobrescreve `tempoAguardandoPecaMinutos` em vez de somar | Só vale para uma espera por OS | Gera uma espera por OS. |
| O tipo de alerta `CUSTO_ALTO` existe no enum, mas nada o cria | Tipo morto | Não cria. |

## Padrões plantados

Definidos em `data/padroes-plantados.ts`. São o que a IA deve conseguir descobrir.

| Padrão | Onde procurar | Pergunta de exemplo |
| --- | --- | --- |
| Ativo problemático | `CT-07` em cada empresa: cerca de 4 vezes mais corretivas que a média dos outros ativos e execução mais longa | "Qual ativo mais para?" |
| Peça que sempre atrasa | `MAT-007` (mangueira hidráulica): estoque zerado, cerca de 80% das OS que a usam passam por `AGUARDANDO_PECA`, em média 6 dias. As outras peças raramente atrasam. | "Qual peça mais atrasa as manutenções?" |
| Pico de custo | Agosto de 2026: custo médio por OS cerca do dobro dos outros meses | "Por que os custos subiram em agosto?" |
| Parada longa | `CT-07`, a partir de 11/08/2026: falha na caixa de transmissão, 14 dias esperando o kit `MAT-022` | "Por que o CT-07 ficou tanto tempo parado em agosto?" |

## Verificações de consistência

Rodam ao final (`verificacoes.ts`). Se uma falhar, o script termina com erro:

- datas em ordem (abertura, início, encerramento);
- paradas abertas batem com o status dos ativos, nos dois sentidos;
- no máximo uma OS impactante aberta por ativo;
- duração da parada e tempo de execução calculados como o repository;
- parada cancelada sem duração; material devolvido com custo zero;
- custo total = materiais + mão de obra, e cada parcela bate com os itens e os apontamentos;
- nenhum marcador de número de OS ficou sem substituir;
- OS e ativo pertencem à mesma empresa.

## Como acrescentar algo

1. Crie `seeders/nome.ts` com uma classe, copiando a forma de `localizacoes.ts`.
2. Chame o seeder no `reset-and-seed.ts`, depois dos que ele usa.
3. Se criar uma tabela nova no `schema.prisma`, acrescente o nome dela em `TABELAS`, no `config.ts`. Sem isso o reset não a apaga.
4. Para mudar volumes, chances, empresas ou a data de referência, edite só o `config.ts`.

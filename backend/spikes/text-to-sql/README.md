# Spike text-to-SQL: decisões técnicas

## Situação

Este documento consolida as decisões das tasks F3-C01.2 a F3-C01.6. Os experimentos mediram geração de SQL, isolamento entre empresas, validação estática, execução somente leitura, modelos, contexto e retries sobre os dados sintéticos do CTR-PE.

O spike valida a abordagem, mas seus scripts não devem ser copiados diretamente para produção. A implementação definitiva deve incorporar as decisões abaixo nas camadas próprias da aplicação.

## Resumo das decisões

| Tema | Decisão | Situação |
| --- | --- | --- |
| Provedor | Usar Groq por meio da interface `LlmProvider`, sem acoplar o agente diretamente ao SDK | Aceita |
| Modelo inicial | `openai/gpt-oss-120b` | Aceita, sujeita a reavaliação periódica |
| Contexto | Enviar apenas as tabelas relevantes para a pergunta | Aceita |
| Nomenclatura | Manter os nomes das tabelas e colunas Prisma | Aceita |
| Isolamento | Aplicar RLS no PostgreSQL com empresa definida na sessão e role dedicada sem privilégios de escrita | Obrigatória antes da produção |
| Validação | Validar a AST e aceitar somente um `SELECT`, relações permitidas e `LIMIT` entre 1 e 100 | Obrigatória, mas não substitui RLS |
| Execução | Usar transação `READ ONLY`, timeouts e `ROLLBACK` | Obrigatória |
| Retry | Não repetir consultas incondicionalmente; permitir no máximo uma correção quando houver falha detectável | Aceita, pendente de validação na implementação definitiva |
| Falha final | Retornar erro seguro e não executar SQL que falhou em qualquer barreira | Obrigatória |

## Ambiente de avaliação

- Banco: branch isolada do Neon destinada aos dados sintéticos.
- Data de referência dos dados: 27 de outubro de 2026.
- Corpus: 10 perguntas em português, cobrindo ativos, ordens de serviço, materiais, paradas, custos e alertas.
- Empresas avaliadas: Alpha Brazilian e Alpha International.
- Temperatura: `0`.
- Resposta do modelo: JSON estruturado validado por Zod.
- Limite máximo: 100 linhas por consulta.

O reset dos dados sintéticos é destrutivo e deve continuar restrito a uma branch de desenvolvimento. As travas e instruções estão em [`scripts/synthetic-data/README.md`](../../scripts/synthetic-data/README.md).

## Modelo e contexto

### Comparação principal

| Modelo | Contexto | Geração | Validação | Execução | Precisão semântica | Latência média | Tokens | Custo estimado |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| GPT-OSS 120B | Relevante | 100% | 100% | 100% | **88,89%** | 2.577,6 ms | 12.722 | US$ 0,004584 |
| GPT-OSS 120B | Completo | 90% | 90% | 80% | 77,78% | 6.488,33 ms | 17.160 | US$ 0,005459 |
| GPT-OSS 20B | Relevante | 100% | 100% | 100% | 77,78% | 5.459,8 ms | 15.985 | US$ 0,003271 |
| GPT-OSS 20B | Completo | 70% | 60% | 60% | 44,44% | 2.722,86 ms | 16.639 | US$ 0,003112 |

O GPT-OSS 120B com contexto relevante obteve a maior precisão e também consumiu menos tokens que as duas variantes com contexto completo. Essa combinação será a configuração inicial do agente.

Os preços representam o snapshot de 30 de outubro de 2026 registrado nos artefatos. Eles não constituem garantia de preço futuro.

### Nomenclatura do schema

| Nomenclatura | Precisão semântica | Tokens | Custo estimado |
| --- | ---: | ---: | ---: |
| Prisma | **88,89%** | 12.722 | US$ 0,004584 |
| Views `snake_case` | 66,67% | 12.660 | US$ 0,004658 |

As views `snake_case` não melhoraram custo nem precisão. Portanto, o contexto inicial seguirá os nomes Prisma e não dependerá das views experimentais do schema `ai`.

O mapeamento de tabelas relevantes usado no spike é fixo por caso de avaliação. Em produção, ele deverá ser substituído por seleção baseada na intenção da pergunta, mantendo uma lista fechada de tabelas autorizadas.

## Isolamento entre empresas

Foram comparadas duas estratégias:

| Estratégia | Casos seguros | Falsas aceitações | Vazamento observado |
| --- | ---: | ---: | ---: |
| Procurar o código da empresa no SQL | 20% | 4 de 5 | A validação aceitaria consultas maliciosas |
| RLS com empresa na sessão | **100%** | 0 de 5 | 0 linhas de outra empresa |

A presença textual do código da empresa não comprova que todas as linhas consultadas estão relacionadas a ela. Os casos com `OR`, `CROSS JOIN`, `EXISTS` desconectado e `UNION ALL` passaram pelo validador textual.

O isolamento deve ser imposto pelo banco:

1. O backend autentica o usuário e determina a empresa autorizada.
2. A conexão define o identificador da empresa em uma variável de sessão local à transação.
3. Uma role dedicada, sem escrita e sem `BYPASSRLS`, executa a consulta.
4. Policies RLS filtram cada relação permitida pela empresa da sessão.
5. A transação é sempre encerrada com `ROLLBACK`.

O sandbox criou roles e policies temporárias dentro de uma transação revertida. Para produção ainda são necessárias migrations permanentes, policies para todas as relações consultáveis e uma estratégia segura de conexão ou troca de role.

## Validação e execução do SQL

O parser `pgsql-parser` é a primeira barreira. O SQL somente pode prosseguir quando:

- é sintaticamente válido;
- contém exatamente uma instrução;
- a instrução é um `SELECT`;
- não contém comandos de escrita, DDL, transação, `COPY`, `CALL`, `DO` ou `EXECUTE`;
- não utiliza CTE, enquanto esse recurso não tiver validação específica;
- referencia apenas relações da lista permitida;
- utiliza o schema exigido, quando configurado;
- contém `LIMIT` entre 1 e 100;
- contém o identificador de empresa esperado.

A verificação do identificador da empresa ajuda a detectar omissões do modelo, mas não é uma barreira de isolamento. RLS permanece obrigatória mesmo quando a validação estática é aprovada.

A execução deve ocorrer com:

- `BEGIN TRANSACTION READ ONLY`;
- `statement_timeout` de 3 segundos;
- `lock_timeout` de 1 segundo;
- `idle_in_transaction_session_timeout` de 5 segundos;
- `ROLLBACK` no bloco de finalização, inclusive após sucesso.

Antes da produção, o validador deve receber uma política explícita para funções PostgreSQL permitidas. Um `SELECT` pode invocar funções, portanto a restrição apenas por tipo de instrução não encerra essa superfície de risco.

## Política de retry

As tentativas adicionais receberam o SQL anterior e feedback de geração, validação e execução.

| Tentativa | Precisão semântica | Regressões sobre a anterior | Tokens da tentativa | Tokens acumulados | Custo acumulado |
| --- | ---: | ---: | ---: | ---: | ---: |
| 0 | **88,89%** | 0 | 12.722 | 12.722 | US$ 0,004584 |
| 1 | 77,78% | 1 | 14.009 | 26.731 | US$ 0,009153 |
| 2 | 66,67% | 1 | 14.478 | 41.209 | US$ 0,013977 |

Retries incondicionais aumentaram o custo acumulado em aproximadamente três vezes e reduziram a precisão. A política escolhida é:

- não repetir uma consulta que passou pelas barreiras e foi executada;
- permitir no máximo uma correção quando não houver SQL, a validação estática falhar ou o PostgreSQL rejeitar a consulta;
- fornecer somente feedback técnico seguro, sem dados sensíveis;
- validar novamente toda consulta corrigida;
- após nova falha, encerrar o fluxo com erro controlado.

A eficácia do retry condicional ainda deverá ser medida dentro do agente definitivo. O spike comprovou apenas que repetir indiscriminadamente não é vantajoso.

## Riscos e limitações

1. O corpus possui somente 10 perguntas e não representa toda a linguagem possível dos usuários.
2. Um dos casos foi inconclusivo para comparação semântica; percentuais semânticos usam 9 casos como denominador.
3. O comparador semântico possui regras específicas para o corpus e não valida respostas arbitrárias em produção.
4. A seleção de tabelas relevantes está manualmente associada aos casos do spike.
5. Preços, disponibilidade e comportamento dos modelos podem mudar.
6. O modelo pode produzir SQL válido e executável que responda incorretamente à pergunta.
7. RLS deve cobrir todas as tabelas e caminhos de relacionamento expostos ao agente.
8. A role usada pela aplicação não pode ser proprietária das tabelas, superusuária nem possuir `BYPASSRLS`.
9. Logs não devem armazenar credenciais, dados pessoais ou resultados completos sem política de retenção.

## Configuração conhecida

Os scripts reconhecem apenas nomes de variáveis; valores e credenciais não devem ser documentados ou versionados.

| Variável | Finalidade |
| --- | --- |
| `GROQ_API_KEY` | Credencial do provedor |
| `GROQ_MODEL` | Modelo avaliado |
| `SPIKE_CONTEXT_VARIANT` | `full` ou `relevant` |
| `SPIKE_CONTEXT_NAMING` | `prisma` ou `snake_case` |
| `SPIKE_CASE_ID` | Restringe a execução a um caso |
| `SPIKE_RETRY_ATTEMPT` | Identifica a tentativa 1 ou 2 |
| `DATABASE_URL` | Banco usado pela execução experimental |
| `SYNTHETIC_DATABASE_ALLOWED_HOST` | Host autorizado para operações destrutivas e sandboxes |

## Requisitos para a implementação definitiva

- manter `LlmProvider` como fronteira de adaptação do provedor;
- criar migrations e roles permanentes para RLS somente leitura;
- selecionar contexto relevante a partir da intenção, sem aceitar nomes arbitrários do usuário;
- manter o parser e a execução read-only como barreiras independentes;
- implementar a política de retry condicional e sua observabilidade;
- registrar modelo, latência, tokens, decisão das barreiras e motivo de falha;
- não registrar a chave do provedor nem resultados sensíveis;
- criar testes de isolamento, validação, execução, retry e contrato do provedor;
- reexecutar o corpus ao trocar modelo, prompt, schema ou regras de negócio.

## Evidências

- Casos e SQLs de referência: [`evaluation-cases.ts`](./evaluation-cases.ts)
- Contexto do schema: [`schema-context.ts`](./schema-context.ts)
- Validador estático: [`sql-validator.ts`](./sql-validator.ts)
- Executor somente leitura: [`read-only-query-executor.ts`](./read-only-query-executor.ts)
- Avaliação de filtro por empresa: [`tenant-filter-evaluation.ts`](./tenant-filter-evaluation.ts)
- Sandbox RLS: [`rls-tenant-isolation.ts`](./rls-tenant-isolation.ts)
- Comparação de modelos e contextos: [`model-comparison-results.json`](./model-comparison-results.json)
- Comparação Prisma x `snake_case`: [`model-comparison-prisma-vs-snake-case.json`](./model-comparison-prisma-vs-snake-case.json)
- Comparação de retries: [`retry-comparison-results.json`](./retry-comparison-results.json)
- Implementação do prompt de correção: [`sql-retry.ts`](./sql-retry.ts)

## Decisão final do spike

A estratégia text-to-SQL é viável para o CTR-PE desde que seja tratada como uma execução não confiável e atravesse barreiras independentes.

A configuração inicial será Groq com GPT-OSS 120B, contexto relevante e nomenclatura Prisma. O SQL será validado por AST e executado por uma role somente leitura sob RLS, dentro de transação com timeouts e rollback. Não haverá retry incondicional. Qualquer falha não recuperada impedirá a execução e produzirá uma resposta segura ao usuário.

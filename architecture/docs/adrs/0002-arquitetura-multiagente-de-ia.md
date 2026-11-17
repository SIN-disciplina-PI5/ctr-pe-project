# 2. Arquitetura multiagente de IA

## Status

Accepted

Data: 2026-11-16

Relaciona-se com [ADR-0003](0003-text-to-sql-seguro.md)

Relaciona-se com [ADR-0004](0004-camada-de-ia-dentro-do-backend.md)

Relaciona-se com [ADR-0006](0006-infraestrutura-gerenciada-da-ia.md)

## Contexto

O assistente precisa responder perguntas, gerar relatórios e apoiar diagnósticos, reaproveitando a lógica de acesso aos dados.

## Decisão

Um orquestrador classifica a intenção e delega a agentes especializados: consulta (RAG e text-to-SQL), relatórios (assíncrono) e troubleshooting. O agente de consulta concentra o acesso aos dados; o de relatórios o reaproveita.

## Consequências

- A lógica de acesso aos dados fica concentrada.
- O orquestrador pode usar um modelo menor.
- Cada pedido passa por pelo menos duas chamadas ao LLM; relatórios rodam fora da requisição.

# 2. Arquitetura multiagente de IA

- Status: Aceito
- Data: 2026-11-16

## Contexto
O assistente precisa responder perguntas, gerar relatórios e apoiar diagnósticos, reaproveitando a lógica de acesso aos dados.

## Decisão
Um orquestrador classifica a intenção e delega a agentes especializados: consulta (RAG e text-to-SQL), relatórios (assíncrono) e troubleshooting. O agente de consulta concentra o acesso aos dados; o de relatórios o reaproveita.

## Consequências
- A lógica de acesso aos dados fica concentrada.
- O orquestrador pode usar um modelo menor.
- Cada pedido passa por pelo menos duas chamadas ao LLM; relatórios rodam fora da requisição.

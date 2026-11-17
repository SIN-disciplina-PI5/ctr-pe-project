# 3. Text-to-SQL seguro

- Status: Aceito
- Data: 2026-11-16

## Contexto
A IA executa SQL gerado por um LLM. Esse SQL não pode escrever dados, alcançar tabelas sensíveis nem vazar dados entre empresas. A abordagem foi validada em um spike (`backend/spikes/text-to-sql`).

## Decisão
O SQL roda em uma conexão somente leitura, preferencialmente sobre views preparadas. Um validador aceita apenas SELECT e limita linhas e tempo. O filtro por empresa é aplicado pelo backend, não confiado ao LLM. A seleção das views relevantes e o contexto de schema guiam a geração.

## Consequências
- A superfície de risco do text-to-SQL fica contida.
- É preciso manter as views e a role em migrations.

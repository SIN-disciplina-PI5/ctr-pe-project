# 6. Infraestrutura gerenciada da IA

## Status

Accepted

Data: 2026-11-16

Relaciona-se com [ADR-0002](0002-arquitetura-multiagente-de-ia.md)

Relaciona-se com [ADR-0004](0004-camada-de-ia-dentro-do-backend.md)

## Contexto

A camada de IA precisa de um provedor de LLM, de uma forma de rodar relatórios de forma assíncrona e de um lugar para guardar os PDFs, sem operar infraestrutura própria, dado o deploy serverless na Vercel.

## Decisão

Usar serviços gerenciados: Groq como provedor de LLM, Upstash QStash como fila de jobs (que chama o backend de volta por callback HTTP, adequado a serverless) e Vercel Blob para os relatórios. A renderização do PDF usa pdf-lib.

## Consequências

- Sem servidores de fila ou de modelo para manter.
- A fila por callback encaixa no modelo serverless, sem processos de longa duração.
- Dependência de serviços externos; as credenciais ficam em variáveis de ambiente.

# 4. Camada de IA dentro do backend

## Status

Accepted

Data: 2026-11-16

Relaciona-se com [ADR-0002](0002-arquitetura-multiagente-de-ia.md)

Relaciona-se com [ADR-0006](0006-infraestrutura-gerenciada-da-ia.md)

## Contexto

A equipe é fluente em TypeScript e o backend é um único serviço Express. A IA poderia ser um serviço separado ou rodar dentro do Express.

## Decisão

Os agentes de IA rodam dentro do backend Express, no mesmo processo, no módulo `ai`. Não há um segundo serviço. A geração de relatórios é desacoplada por uma fila gerenciada externa, que chama o backend de volta por callback.

## Consequências

- Um único deploy e uma única stack.
- Os agentes aparecem como componentes do Serviço de Aplicação, não como um container separado.
- O trabalho pesado (relatórios) sai do ciclo da requisição via fila.

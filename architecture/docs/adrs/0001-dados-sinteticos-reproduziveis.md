# 1. Dados sintéticos reproduzíveis

- Status: Aceito
- Data: 2026-11-16

## Contexto
O projeto não tinha dados. A IA, o dashboard e os testes precisam de dados realistas e coerentes.

## Decisão
Um script apaga o banco e o popula com dados sintéticos reproduzíveis (semente fixa, ids sequenciais, data de referência fixa), simulando cerca de seis meses do ciclo de vida das ordens de serviço, com padrões plantados e verificações de consistência.

## Consequências
- As respostas da IA podem ser validadas contra dados conhecidos.
- Duas execuções geram os mesmos dados.
- Roda apenas em branch de desenvolvimento e exige confirmação explícita.

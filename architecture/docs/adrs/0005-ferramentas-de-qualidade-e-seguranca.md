# 5. Ferramentas de qualidade e segurança em dev-tools

## Status

Accepted

Data: 2026-11-16

## Contexto

O projeto precisa de análise estática e de testes de segurança, sem misturar essas ferramentas com o código.

## Decisão

As ferramentas ficam em `dev-tools/`, cada uma isolada em Docker: SonarQube (análise estática) e BeEF (teste de segurança client-side). A documentação de arquitetura (C4 e ADRs) fica em `architecture/`, por ser design e não ferramenta.

## Consequências

- Ferramentas agrupadas e rodadas sob demanda.
- Documentação de arquitetura visível na raiz, útil para o relatório acadêmico.

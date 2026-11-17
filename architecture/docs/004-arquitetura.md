# 4. Arquitetura (C4)

A arquitetura segue o modelo C4. Os diagramas vêm dos arquivos DSL em `c4_layers/` e são vistos no Structurizr (ver README).

## C1 — Contexto
Perfis de usuário (Gestão, Operação, Consulta), o MaqControl e três sistemas externos: provedor de LLM, fila de jobs gerenciada e (no C2) o armazenamento de arquivos.

## C2 — Containers
Aplicativo Web e Mobile, Serviço de Aplicação (API REST + agentes de IA), Banco de Dados Relacional e Armazenamento de Arquivos. A camada de IA roda dentro do Serviço de Aplicação, no mesmo processo Node (ver [ADR 0004](adrs/0004-camada-de-ia-dentro-do-backend.md)).

## C3 — Componentes
- Frontend: roteamento, telas (incluindo assistente e relatórios), hooks de dados, cliente de API e armazenamento de token.
- Backend (domínio): segurança, middlewares, o núcleo de ordens de serviço e os módulos (ativos, materiais, planos de manutenção, alertas, dashboard, auditoria, and others), sobre o cliente Prisma.
- Camada de IA: chat e orquestrador. agente de consulta (RAG, geração e validação de SQL, execução somente leitura, redação), agente de relatórios com jobs assíncronos (fila gerenciada, renderização em PDF, armazenamento), agente de troubleshooting, e o provedor de LLM.

A cor roxa destaca os componentes da camada de IA.

## C4 — Deploy
Dois ambientes: local (desenvolvimento) e produção (Vercel, Neon, Vercel Blob, com LLM e fila externos).

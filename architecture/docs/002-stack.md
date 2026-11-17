# 2. Stack Tecnológica

## Aplicativo (web e mobile)
- React Native com Expo e expo-router.
- TanStack Query, Zustand, react-hook-form com Zod, NativeWind.

## Serviço de aplicação (backend)
- Node.js com Express e TypeScript.
- Prisma (driver adapter com pg) sobre PostgreSQL.
- Autenticação com JWT e refresh tokens.
- Middlewares: autenticação, perfil (RBAC), validação, auditoria, rate limit da IA e tratamento de erros.
- Agentes de IA no mesmo processo.

## Camada de IA
- Provedor de LLM: Groq (groq-sdk).
- Consulta: seleção de views relevantes (RAG), contexto de schema, geração de SQL, validação (apenas SELECT) e execução em conexão somente leitura (pg).
- Relatórios: geração assíncrona via fila gerenciada (Upstash QStash), renderização em PDF (pdf-lib) e armazenamento (Vercel Blob).
- Troubleshooting: diagnóstico a partir do histórico de falhas.
- Conversas e metadados de relatórios persistidos no banco.

## Dados e armazenamento
- PostgreSQL (Neon), com role somente leitura para a IA.
- Vercel Blob para os relatórios.

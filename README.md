# MaqControl

Sistema de gestão de manutenção de ativos com assistente de IA. Guia de instalação e execução em ambiente local.

## Estrutura

- `backend`: API em Node.js, Express e Prisma, incluindo a camada de IA (assistente, relatórios e troubleshooting)
- `frontend`: aplicação em Expo e React Native
- `dev-tools`: ferramentas de qualidade e segurança (SonarQube e BeEF), isoladas em Docker — ver `dev-tools/README.md`
- `architecture`: modelo C4 (Structurizr) e decisões de arquitetura (ADRs) — ver `architecture/README.md`

## Requisitos

- Node.js 20 ou superior
- npm

## Banco de dados

O projeto usa **NeonDB**. O `.env` com as credenciais não é versionado: use os arquivos `.env.example` como referência e obtenha o `.env` real com o responsável pelo ambiente.

## Backend

```bash
cd backend
npm install
# configure o .env a partir do .env.example (DATABASE_URL do NeonDB)
npm run prisma:generate
npm run dev      # inicia em modo desenvolvimento
npm test         # testes automatizados
```

Para a camada de IA, o `.env` também precisa de `GROQ_API_KEY`, `AI_READONLY_DATABASE_URL` e `BLOB_READ_WRITE_TOKEN` (ver `.env.example`).

Migrations só são necessárias ao aplicar mudanças de schema ou ao preparar um banco novo.

Verificar a API (Postman ou navegador), com o backend rodando:

```text
GET http://localhost:3333/health   → status 200 e JSON indicando API ativa
Base da API: http://localhost:3333/api
```

## Frontend

```bash
cd frontend
npm install
# configure o .env: EXPO_PUBLIC_API_URL apontando para a API, com o prefixo /api
npm run start    # inicia o Expo
npm run web      # abre no navegador (http://localhost:8081)
npm test         # testes automatizados
```

Exemplo de `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3333/api
```

**Autenticação:** a tela de login chama `POST /auth/sign-in`, guarda os tokens e carrega o usuário por `GET /auth/me`. O perfil e a empresa vêm do usuário autenticado — use uma conta ativa existente. Na web a sessão fica no `localStorage`; no mobile, no `expo-secure-store`.

**No celular (Expo Go):** rode `npm run start` e leia o QR Code. Em celular físico, `EXPO_PUBLIC_API_URL` não pode usar `localhost` (apontaria para o próprio celular); use o IP local da máquina que roda o backend, por exemplo `http://192.168.0.10:3333/api`.

## Ordem recomendada

1. `.env` do backend → 2. instalar backend → 3. `prisma:generate` → 4. iniciar backend → 5. `.env` do frontend → 6. instalar frontend → 7. iniciar frontend → 8. login com conta ativa.

## Ferramentas e arquitetura

- **Qualidade e segurança:** `dev-tools/` (SonarQube e BeEF). Ver `dev-tools/README.md`.
- **Arquitetura (C4):** na pasta `architecture/`, rode `docker compose up` e abra `http://localhost:8080`. Ver `architecture/README.md`.

## Equipe

André Luís Gomes da Silva Filho — RA: 00000855160
Arthur Azevedo Costa de Paula — RA: 00000016457
Dayvson da Conceicao de Moura — RA: 00000855171
Hallason Matias da Silva — RA: 00000855277
José Heitor Felix Guimarães — RA: 00000855161
Vinícius de Almeida Silva — RA: 00000855166

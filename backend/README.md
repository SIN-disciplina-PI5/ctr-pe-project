# CTR-PE — Backend API

API REST do sistema de gestão de manutenção do CTR Pernambuco, desenvolvida em Node.js + Express + TypeScript + Prisma.

---

## Tecnologias

- **Node.js** + **TypeScript** (ESM/NodeNext)
- **Express** — framework HTTP
- **Prisma** — ORM com PostgreSQL
- **Zod** — validação de schemas
- **JWT** — autenticação stateless
- **bcrypt** — hash de senhas
- **Jest** + **Supertest** — testes

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm 9+

---

## Configuração

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com as suas credenciais:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ctrpe?schema=public"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=10
```

### 3. Criar o banco e rodar as migrations

```bash
npx prisma migrate dev
```

### 4. Gerar o Prisma Client

```bash
npx prisma generate --schema=prisma/schema.prisma
```

### 5. Popular o banco com dados de demonstração

```bash
npx prisma db seed
```

Usuários criados pelo seed:

| Email | Perfil | Senha |
|---|---|---|
| admin@teste.com | ADMIN | novaSenha123 |
| supervisor@teste.com | SUPERVISOR | 123456 |
| gestor@teste.com | GESTOR | 123456 |
| tecnico.ativo@teste.com | TECNICO | 123456 |
| consulta@teste.com | CONSULTA | 123456 |

---

## Rodando o servidor

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor sobe em `http://localhost:3333`.

---

## Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch
```

> Os testes e2e requerem banco ativo com seed aplicado.

---

## Rotas da API

Todas as rotas (exceto `/api/auth/sign-in`) exigem o header:

```
Authorization: Bearer <token>
```

### Auth

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/api/auth/sign-in` | Público | Login — retorna `accessToken` |
| GET | `/api/auth/me` | Autenticado | Dados do usuário logado |
| PATCH | `/api/auth/me/password` | Autenticado | Troca a própria senha |

### Usuários

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/usuarios` | ADMIN, GESTOR, SUPERVISOR | Lista usuários |
| GET | `/api/usuarios/:id` | Autenticado | Busca por ID |
| POST | `/api/usuarios` | ADMIN | Cria usuário |
| PATCH | `/api/usuarios/:id` | ADMIN | Atualiza usuário |
| PATCH | `/api/usuarios/:id/password` | ADMIN | Redefine senha |
| DELETE | `/api/usuarios/:id` | ADMIN | Inativa usuário |

### Empresas

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/empresas` | Autenticado | Lista empresas |
| GET | `/api/empresas/:id` | Autenticado | Busca por ID |
| POST | `/api/empresas` | ADMIN | Cria empresa |
| PATCH | `/api/empresas/:id` | ADMIN | Atualiza empresa |
| DELETE | `/api/empresas/:id` | ADMIN | Inativa empresa |

### Localizações

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/localizacoes` | Autenticado | Lista localizações (escopo por empresa) |
| GET | `/api/localizacoes/:id` | Autenticado | Busca por ID |
| POST | `/api/localizacoes` | ADMIN, SUPERVISOR | Cria localização |
| PATCH | `/api/localizacoes/:id` | ADMIN, SUPERVISOR | Atualiza localização |
| DELETE | `/api/localizacoes/:id` | ADMIN, SUPERVISOR | Inativa localização |

### Ativos

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/ativos` | Autenticado | Lista ativos |
| GET | `/api/ativos/:id` | Autenticado | Busca por ID |
| POST | `/api/ativos` | ADMIN, SUPERVISOR | Cria ativo |
| PATCH | `/api/ativos/:id` | ADMIN, SUPERVISOR | Atualiza ativo |
| PATCH | `/api/ativos/:id/status` | ADMIN, SUPERVISOR | Atualiza status |
| DELETE | `/api/ativos/:id` | ADMIN | Inativa ativo |

### Materiais

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/materiais` | Autenticado | Lista materiais |
| GET | `/api/materiais/:id` | Autenticado | Busca por ID |
| POST | `/api/materiais` | ADMIN, SUPERVISOR | Cria material |
| PATCH | `/api/materiais/:id` | ADMIN, SUPERVISOR | Atualiza material |
| PATCH | `/api/materiais/:id/estoque` | ADMIN, SUPERVISOR | Movimenta estoque (ENTRADA / SAIDA / AJUSTE) |
| DELETE | `/api/materiais/:id` | ADMIN | Inativa material |

### Alertas

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/alertas` | Autenticado | Lista alertas |
| GET | `/api/alertas/me` | Autenticado | Alertas do usuário logado |
| GET | `/api/alertas/:id` | Autenticado | Busca por ID |
| POST | `/api/alertas` | ADMIN, GESTOR, SUPERVISOR | Cria alerta manualmente |
| PATCH | `/api/alertas/:id/lido` | Autenticado | Marca como lido |
| PATCH | `/api/alertas/:id/resolver` | ADMIN, GESTOR, SUPERVISOR | Resolve alerta |
| PATCH | `/api/alertas/:id/ignorar` | ADMIN, GESTOR, SUPERVISOR | Ignora alerta |

### Ordens de Serviço

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/ordens-servico` | Autenticado | Lista OS |
| GET | `/api/ordens-servico/:id` | Autenticado | Busca OS por ID |
| POST | `/api/ordens-servico` | ADMIN, SUPERVISOR, TECNICO | Cria OS |
| PATCH | `/api/ordens-servico/:id` | ADMIN, SUPERVISOR, TECNICO | Atualiza OS |
| PATCH | `/api/ordens-servico/:id/iniciar` | ADMIN, SUPERVISOR, TECNICO | Inicia OS |
| PATCH | `/api/ordens-servico/:id/aguardar-peca` | ADMIN, SUPERVISOR, TECNICO | Coloca OS em aguardo de peça |
| PATCH | `/api/ordens-servico/:id/retomar` | ADMIN, SUPERVISOR, TECNICO | Retoma OS |
| PATCH | `/api/ordens-servico/:id/encerrar` | ADMIN, SUPERVISOR, TECNICO | Encerra OS |
| PATCH | `/api/ordens-servico/:id/cancelar` | ADMIN, SUPERVISOR | Cancela OS |
| GET | `/api/ordens-servico/:id/materiais` | Autenticado | Lista materiais da OS |
| POST | `/api/ordens-servico/:id/materiais` | ADMIN, SUPERVISOR, TECNICO | Adiciona material à OS |
| GET | `/api/ordens-servico/:id/apontamentos` | Autenticado | Lista apontamentos da OS |
| POST | `/api/ordens-servico/:id/apontamentos` | ADMIN, SUPERVISOR, TECNICO | Cria apontamento na OS |

### Materiais de OS

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/ordens-servico-materiais/:id` | Autenticado | Busca item por ID |
| PATCH | `/api/ordens-servico-materiais/:id` | ADMIN, SUPERVISOR, TECNICO | Atualiza item |
| PATCH | `/api/ordens-servico-materiais/:id/consumir` | ADMIN, SUPERVISOR, TECNICO | Consome material (baixa estoque) |
| PATCH | `/api/ordens-servico-materiais/:id/devolver` | ADMIN, SUPERVISOR, TECNICO | Devolve material (repõe estoque) |
| PATCH | `/api/ordens-servico-materiais/:id/cancelar` | ADMIN, SUPERVISOR, TECNICO | Cancela item |

### Apontamentos de OS

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/apontamentos-os/:id` | Autenticado | Busca apontamento por ID |
| PATCH | `/api/apontamentos-os/:id` | ADMIN, SUPERVISOR, TECNICO | Atualiza apontamento |
| PATCH | `/api/apontamentos-os/:id/encerrar` | ADMIN, SUPERVISOR, TECNICO | Encerra (calcula duração e custo) |
| DELETE | `/api/apontamentos-os/:id` | ADMIN, SUPERVISOR | Remove apontamento |

### Paradas de Ativos

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/paradas-ativos` | Autenticado | Lista paradas |
| GET | `/api/paradas-ativos/:id` | Autenticado | Busca por ID |
| POST | `/api/paradas-ativos` | ADMIN, SUPERVISOR | Registra parada |
| PATCH | `/api/paradas-ativos/:id` | ADMIN, SUPERVISOR | Atualiza parada |
| PATCH | `/api/paradas-ativos/:id/encerrar` | ADMIN, SUPERVISOR | Encerra parada |
| PATCH | `/api/paradas-ativos/:id/cancelar` | ADMIN, SUPERVISOR | Cancela parada |

### Dashboard

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/dashboard/resumo` | ADMIN, GESTOR, SUPERVISOR | Indicadores gerais |
| GET | `/api/dashboard/ativos` | ADMIN, GESTOR, SUPERVISOR | Ativos agrupados por status/criticidade |
| GET | `/api/dashboard/ordens-servico` | ADMIN, GESTOR, SUPERVISOR | OS agrupadas por tipo/prioridade |
| GET | `/api/dashboard/materiais` | ADMIN, GESTOR, SUPERVISOR | Materiais com estoque crítico |
| GET | `/api/dashboard/custos` | ADMIN, GESTOR, SUPERVISOR | Resumo de custos |

### Auditoria

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/auditoria` | ADMIN, GESTOR | Lista registros de auditoria |
| GET | `/api/auditoria/:id` | ADMIN, GESTOR | Busca registro por ID |

### Health check

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status da API |

---

## Perfis e permissões

| Perfil | Descrição |
|--------|-----------|
| **ADMIN** | Acesso total ao sistema |
| **SUPERVISOR** | Gerencia ativos, materiais, OS e equipe da própria empresa |
| **GESTOR** | Visualiza relatórios, dashboard e auditoria |
| **TECNICO** | Cria e executa OS, registra apontamentos e movimenta materiais |
| **CONSULTA** | Somente leitura |

---

## Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma       # Modelo de dados
│   ├── seed.ts             # Dados de demonstração
│   └── migrations/         # Histórico de migrations
├── src/
│   ├── app.ts              # Configuração do Express e rotas
│   ├── server.ts           # Ponto de entrada
│   ├── auth/               # Autenticação (sign-in, me, troca de senha)
│   ├── common/
│   │   ├── errors/         # AppError e ErrorCode
│   │   └── middlewares/    # auth, requireRole, validate, error-handler, audit
│   ├── modules/
│   │   ├── alertas/
│   │   ├── apontamentos-os/
│   │   ├── ativos/
│   │   ├── auditoria/
│   │   ├── dashboard/
│   │   ├── empresas/
│   │   ├── localizacoes/
│   │   ├── materiais/
│   │   ├── ordens-servico/
│   │   ├── ordens-servico-materiais/
│   │   ├── paradas-ativos/
│   │   └── usuarios/
│   └── prisma/             # PrismaClient singleton
└── tests/
    ├── e2e/                # Testes de integração por módulo
    └── test-server.ts      # Setup do Supertest
```

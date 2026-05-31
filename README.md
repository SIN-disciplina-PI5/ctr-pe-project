# CTR-PE Project

Guia básico de instalação e execução do projeto em ambiente local.

## Estrutura do projeto

- `backend`: API em Node.js, Express e Prisma
- `frontend`: aplicação em Expo e React Native

## Requisitos

- Node.js 20 ou superior
- npm

## Observação importante sobre o banco de dados

Existe um `Dockerfile` no backend, mas este projeto foi concebido para utilizar **NeonDB**.

Por esse motivo, a configuração correta do arquivo `.env` do backend é indispensável. O arquivo com as credenciais válidas não está versionado no repositório. No momento, apenas o responsável atual pelo projeto possui esse `.env`.

Para configurar o projeto em outra máquina:

1. utilizar os arquivos `.env.example` como referência;
2. obter o `.env` real com quem estiver responsável pelas credenciais do ambiente.

## Instalação do backend

Entrar na pasta do backend:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Configurar o ambiente:

1. verificar o arquivo `.env.example`;
2. criar ou ajustar o arquivo `.env`;
3. informar a `DATABASE_URL` correta do NeonDB.

Gerar o Prisma Client:

```bash
npm run prisma:generate
```

Observação: não é necessário executar migration em toda instalação. Esse procedimento só deve ser realizado quando houver necessidade real de aplicar migrations existentes em um banco novo ou quando houver alterações no schema do banco de dados.

Executar o backend em modo de desenvolvimento:

```bash
npm run dev
```

Executar os testes automatizados do backend:

```bash
npm test
```

## Como testar a API manualmente

Com o backend em execução, a API pode ser testada pelo Postman.

Base local padrão:

```text
http://localhost:3333/api
```

Endpoint de verificação da aplicação:

```text
GET http://localhost:3333/health
```

Resultado esperado:

- status HTTP `200`
- resposta JSON indicando que a API está ativa

## Instalação do frontend

Entrar na pasta do frontend:

```bash
cd frontend
```

Instalar as dependências:

```bash
npm install
```

Configurar o ambiente:

1. verificar o arquivo `.env.example`;
2. criar ou ajustar o arquivo `.env`;
3. definir `EXPO_PUBLIC_API_URL` apontando para a API.

Exemplo local:

```env
EXPO_PUBLIC_API_URL=http://localhost:3333/api
```

### Variáveis de desenvolvimento

Enquanto a tela de login não está implementada, o frontend autentica as requisições com um token de desenvolvimento. Para exercitar as telas que dependem de autenticação (ex.: Ordens de Serviço), preencha no `.env`:

```env
# token de acesso válido, obtido em POST /api/auth/sign-in
EXPO_PUBLIC_DEV_TOKEN=
# empresa usada por padrão nas telas
EXPO_PUBLIC_DEV_EMPRESA_ID=
# perfil simulado para exibir ações conforme permissão
# (ADMIN, GESTOR, SUPERVISOR, TECNICO ou CONSULTA)
EXPO_PUBLIC_DEV_PERFIL=ADMIN
```

Para obter um token, faça login na API e copie o `accessToken` da resposta:

```bash
curl -X POST http://localhost:3333/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"<email>","password":"<senha>"}'
```

Essas variáveis são embutidas no bundle no momento do start do Expo; após alterá-las, reinicie o `npm run web`.

## Execução do frontend

Iniciar o projeto:

```bash
npm run start
```

Executar no navegador:

```bash
npm run web
```

Executar os testes automatizados do frontend:

```bash
npm test
```

## Como testar o frontend manualmente

### No computador

Com o frontend em execução, abrir a versão web:

```bash
npm run web
```

Em seguida, acessar no navegador:

```text
http://localhost:8081
```

### No celular

1. iniciar o projeto com:

```bash
npm run start
```

2. abrir o aplicativo **Expo Go** no celular;
3. ler o QR Code exibido no terminal ou na interface do Expo.

Para testes em celular físico, o valor de `EXPO_PUBLIC_API_URL` não deve usar `localhost`, porque nesse caso `localhost` aponta para o próprio celular, e não para o computador que está executando a API.

Nesse cenário, deve ser utilizado o IP local da máquina onde o backend está em execução. Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333/api
```

## Ordem recomendada de configuração

1. configurar o `.env` do backend;
2. instalar as dependências do backend;
3. gerar o Prisma Client;
4. iniciar o backend;
5. configurar o `.env` do frontend;
6. instalar as dependências do frontend;
7. iniciar o frontend;
8. testar a API no Postman;
9. testar o frontend no navegador ou no Expo Go.

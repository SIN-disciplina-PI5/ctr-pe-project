# Frontend CTR-PE

Aplicativo Expo/React Native com execução para web, Android e iOS.

## Requisitos

- Node.js 20 ou superior;
- npm;
- backend do CTR-PE configurado e em execução;
- uma conta ativa no banco usado pelo backend.

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir de `.env.example` e informe a URL base da API com o prefixo `/api`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3333/api
```

Essa é a única variável pública necessária para o fluxo atual. Tokens, empresa e perfil não devem ser configurados manualmente no `.env`.

Em um celular físico, `localhost` aponta para o próprio aparelho. Use o IP da máquina que executa o backend, por exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333/api
```

Reinicie o Expo depois de alterar o `.env`.

## Execução

```bash
# servidor do Expo e QR Code
npm run start

# navegador
npm run web

# Android
npm run android

# iOS
npm run ios
```

A versão web normalmente fica disponível em `http://localhost:8081`.

## Login e sessão

O login é realizado pela própria tela do aplicativo:

1. o frontend envia email e senha para `POST /auth/sign-in`;
2. armazena `accessToken` e `refreshToken`;
3. consulta `GET /auth/me` para carregar usuário, empresa e perfil;
4. redireciona para o dashboard.

Na web, os tokens são armazenados no `localStorage`. No Android e no iOS, o armazenamento usa `expo-secure-store`.

Não copie tokens para arquivos de ambiente e não versione credenciais.

## Testes

```bash
npm test
```

Para a validação manual, inicie backend e frontend, faça login com uma conta ativa e confirme o acesso ao dashboard e às rotas permitidas pelo perfil do usuário.

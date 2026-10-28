@'
# CTR-PE API - Postman Collection & Automated Security Tests

Este diretório contém a coleção de testes de integração, segurança (RBAC, Multi-tenancy, Sanitização) e regras de negócio para as 63 rotas e 13 roteadores da API do CTR-PE.

## Estrutura dos Ficheiros

- `ctr-pe.environment.json`: Variáveis de ambiente (`baseUrl` e tokens de autenticação por perfil).
- `ctr-pe.collection.json`: Suíte completa de requisições, testes de contrato e validações de segurança.

## Perfis de Acesso Suportados
- **ADMIN**: Acesso total administrativo.
- **GESTOR**: Gestão de empresas, utilizadores e ordens.
- **SUPERVISOR**: Alocação de recursos e aprovação de fluxo.
- **TECNICO**: Execução de ordens de serviço e apontamentos.
- **CONSULTA**: Leitura restrita sem permissão de mutação.

## Como Executar

### 1. Pelo Postman Desktop
1. Importa os ficheiros `ctr-pe.collection.json` e `ctr-pe.environment.json`.
2. Seleciona o ambiente **CTR-PE Local Environment**.
3. Executa a pasta **00. Auth & Token Generation** para preencher automaticamente as variáveis de token.
4. Abre o **Collection Runner**, seleciona o ambiente e executa a suíte completa.

### 2. Via CLI (Newman)
```bash
npx newman run backend/postman/ctr-pe.collection.json \
  -e backend/postman/ctr-pe.environment.json \
  --reporters cli
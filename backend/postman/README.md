# CTR-PE API - Postman Collection & Automated Security Tests

Este diretório contém a suíte completa de testes de contrato, isolamento multi-inquilino (Multi-Tenancy), controle de acesso baseado em papéis (RBAC) e regras de transição de status para a API CTR-PE.

## Arquivos Disponíveis

- `ctr-pe.environment.json`: Variáveis locais (`baseUrl`, IDs de inquilinos e variáveis de tokens secretas para `ADMIN`, `GESTOR`, `SUPERVISOR`, `TECNICO` e `CONSULTA`).
- `ctr-pe.collection.json`: Coleção estruturada por roteadores e cenários de segurança e erro.

## Cobertura e Casos de Teste

1. **Health Check & Contrato**: Validação de integridade e respostas 200/404 da raiz de serviços.
2. **Autenticação & Tokens**: Login para cada perfil suportado, sanitização de senhas/hashes e verificação do endpoint vulnerável público `POST /api/auth/sign-up-testing`.
3. **Controle de Acesso (RBAC)**:
   - Rotas protegidas rejeitam requisições sem token (401) e com token inválido (401).
   - Perfis sem permissão recebem 403 Forbidden (ex.: `TECNICO` e `CONSULTA` tentando listar/alterar usuários).
4. **Isolamento de Dados (Multi-Tenancy)**:
   - Validação de que usuários associados à Empresa A não têm autorização para ler (`GET`), alterar (`PATCH`) ou remover (`DELETE`) recursos da Empresa B.
5. **Regras de Negócio e Workflows (Ordens de Serviço)**:
   - Proibição de alteração direta do campo `status` via endpoint genérico `PATCH /ordens-servico/:id`.
   - Garantia de que transições de estado operem exclusivamente pelos endpoints dedicados (`/iniciar`, `/aguardar-peca`, `/retomar`, `/encerrar`, `/cancelar`).
6. **Tratamento de Erros e Rate Limiting**:
   - Rejeição de payloads inválidos (400 Bad Request).
   - Bloqueio de duplicidade de registros (409 Conflict).
   - Respostas de rotas e IDs inexistentes (404 Not Found).
   - Prevenção contra vazamento de stack traces e informações de depuração interna.
   - Validação do retorno 429 (Too Many Requests) nos endpoints de autenticação.

## Execução via Postman Collection Runner

1. Importe a coleção e o environment no Postman Desktop.
2. Selecione o ambiente **CTR-PE Local Environment**.
3. Abra a ferramenta **Collection Runner**.
4. Marque a coleção **CTR-PE API - Test & Security Suite**.
5. Clique em **Run CTR-PE API - Test & Security Suite**.
6. Quaisquer falhas de contrato ou vulnerabilidades detectadas (ex.: endpoints de teste públicos ou falha de escopo multi-tenant) devem ser registradas como tarefas de correção de bugs individuais no quadro do projeto.
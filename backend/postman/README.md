# Contratos da API no Postman

A coleção `ctr-pe.collection.json` cobre todas as rotas Express atuais, autenticação, RBAC, isolamento entre duas empresas, validações da IA e um workflow controlado de ordem de serviço. Tokens e IDs são capturados durante a execução; nenhum segredo é versionado.

## Preparação

1. Use uma base local já preenchida pelo gerador sintético. O reset sintético apaga os dados atuais, portanto só deve ser executado deliberadamente em uma base descartável.
2. Inicie o backend em `http://localhost:3000`.
3. Importe a coleção e `ctr-pe.environment.json` no Postman.
4. Preencha apenas `auth_password` no ambiente com o mesmo valor usado em `SEED_ADMIN_PASSWORD` (o padrão local do gerador é `@ChangeMe12345!`).

Execute as pastas na ordem apresentada. A coleção autentica usuários das duas empresas, captura os recursos existentes, verifica o isolamento e cria dados identificados por `PM-*` para o workflow final.

## Verificação estática

Após alterar rotas ou a coleção:

```bash
npm run postman:generate
npm run test:postman-contract
```

O teste compara o manifesto com os arquivos `*.routes.ts`, exige asserções em todas as requisições e falha caso senha ou tokens sejam versionados. Edite o gerador, não o JSON gerado manualmente.

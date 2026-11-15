# Feat 7 — Roteiro de teste manual dos relatórios

Roteiro da Task 08 para validar o fluxo completo num ambiente com banco
(branch de teste da Neon ou ambiente publicado). Marque cada item e anote
data, ambiente e responsável no final.

## Pré-requisitos
- Migrations aplicadas, incluindo `20261115120000_report_jobs`.
- Base sintética com as empresas **Alpha Brazilian** e **Alpha International**,
  e um usuário ativo em cada uma.
- Backend com `GROQ_API_KEY`, `AI_READONLY_DATABASE_URL` e
  `BLOB_READ_WRITE_TOKEN` configurados.
- Gatilho: com `REPORT_JOB_DISPATCHER=trigger`, as tasks do Trigger.dev
  processam os pedidos sozinhas (`npm run trigger:dev` em desenvolvimento ou
  tasks publicadas com `npm run trigger:deploy`). No modo manual, rode
  `npm run reports:jobs:run` no backend após cada pedido.

## 1. Solicitação e processamento (usuário da empresa A)
- [ ] Na tela **Relatórios**, solicitar "Manutenção mensal", período "Mês anterior".
- [ ] O pedido aparece na lista como **Na fila**, com o aviso "Atualizando a cada 5 s".
- [ ] Aguardar o processamento (ou rodar `npm run reports:jobs:run` no modo manual). O status muda para **Gerando** e depois **Pronto** sem recarregar a página.
- [ ] No painel do Trigger.dev, conferir a execução da task `generate-report` com o `jobId` do pedido.
- [ ] O aviso de atualização some quando não há mais pedidos ativos.

## 2. Download e conteúdo do PDF
- [ ] Clicar em **Baixar PDF**. O arquivo baixa com nome `relatorio-...-AAAA-MM-DD.pdf`.
- [ ] O PDF abre e mostra título, nome da empresa A, data de geração, seções, tabelas e gráficos.
- [ ] Conferir pelo menos um número do PDF com o dado correspondente na base (ex.: total de ordens no mês).
- [ ] Acentos aparecem corretamente.

## 3. Os outros dois tipos
- [ ] Repetir com "Custos por ativo" e "Disponibilidade". Os dois chegam a **Pronto** e baixam.
- [ ] Solicitar um "Personalizado" sem descrição: a tela pede a descrição e não envia.

## 4. Isolamento entre empresas (usuário da empresa B)
- [ ] Entrar com o usuário da empresa B. A lista **não** mostra os relatórios da empresa A.
- [ ] Copiar o ID de um relatório da empresa A e chamar
      `GET /api/ai/reports/<id>` e `GET /api/ai/reports/<id>/download` com o token de B
      (Postman). As duas respostas devem ser **404**.

## 5. Falhas e limites
- [ ] Com o `GROQ_API_KEY` inválido no backend, solicitar e processar um relatório:
      ele fica **Na fila** com "A tentativa anterior falhou..." e, após as tentativas, **Falhou** com mensagem.
- [ ] Solicitar 6 relatórios em menos de 10 minutos: o sexto mostra o aviso de limite.
- [ ] Antes de processar, chamar o download pelo Postman: resposta **409**.

## 6. Recuperação pelo Trigger.dev
- [ ] Com `REPORT_JOB_DISPATCHER=trigger`, parar o `trigger:dev` logo após uma task iniciar (simula queda do worker).
- [ ] Religar e aguardar até 16 min (lease) + 5 min (varredura): o pedido volta a ser processado e chega a **Pronto**.

## 7. Auditoria
- [ ] Na tela **Auditoria** (ADMIN ou GESTOR), há um registro de criação para cada pedido,
      sem o texto do pedido.

## Registro
| Data | Ambiente | Responsável | Resultado | Observações |
|---|---|---|---|---|
|  |  |  |  |  |

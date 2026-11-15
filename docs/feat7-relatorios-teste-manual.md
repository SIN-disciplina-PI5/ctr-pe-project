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
- Enquanto o gatilho de produção não existir, alguém roda
  `npm run reports:jobs:run` no backend para processar os pedidos.

## 1. Solicitação e processamento (usuário da empresa A)
- [ ] Na tela **Relatórios**, solicitar "Manutenção mensal", período "Mês anterior".
- [ ] O pedido aparece na lista como **Na fila**, com o aviso "Atualizando a cada 5 s".
- [ ] Rodar `npm run reports:jobs:run`. O status muda para **Gerando** e depois **Pronto** sem recarregar a página.
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

## 6. Auditoria
- [ ] Na tela **Auditoria** (ADMIN ou GESTOR), há um registro de criação para cada pedido,
      sem o texto do pedido.

## Registro
| Data | Ambiente | Responsável | Resultado | Observações |
|---|---|---|---|---|
|  |  |  |  |  |

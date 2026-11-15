# Tela: Relatórios (`/relatorios`)

Solicitação, acompanhamento e download dos relatórios em PDF gerados pela IA
(Feat 7, Task 07). Usa as rotas `/api/ai/reports` do backend.

## Fluxo
1. O usuário escolhe o **tipo** (manutenção mensal, custos por ativo,
   disponibilidade ou personalizado), o **período** (mês anterior, mês atual,
   últimos 90 dias, sem período ou datas personalizadas) e, se quiser, escreve
   **detalhes**. No tipo personalizado, a descrição é obrigatória.
2. `POST /api/ai/reports` com o cabeçalho `Idempotency-Key`. Repetir o mesmo
   pedido (ex.: após erro de rede) reaproveita a chave e não duplica o job.
3. A lista "Meus relatórios" mostra cada pedido com o status: na fila, gerando,
   pronto ou falhou, incluindo novas tentativas e mensagens de erro.
4. Enquanto houver relatório na fila ou gerando, a lista é consultada de novo
   a cada 5 s (`hasActiveJobs`). Sem jobs ativos, o polling para.
5. Com o status "pronto", o botão **Baixar PDF** busca o arquivo com o token
   da sessão e entrega ao navegador. Relatórios com mais de 30 dias aparecem
   como expirados.

## Observações
- O download está disponível na versão **web**. No celular, a tela informa
  que o PDF deve ser baixado pela web.
- Os relatórios são da empresa vinculada ao usuário. Um ADMIN sem empresa vê
  uma mensagem explicando que não pode solicitar relatórios.
- Limite do backend: 5 solicitações a cada 10 minutos; a tela traduz o erro 429.

## Código
| Arquivo | Conteúdo |
|---|---|
| `app/(protected)/relatorios.tsx` | Tela, filtro por status, lista e paginação |
| `src/features/relatorios/relatorio-form.tsx` | Formulário (react-hook-form + zod) |
| `src/features/relatorios/relatorio-card.tsx` | Card com status, erro e download |
| `src/features/relatorios/relatorios.service.ts` | Chamadas à API e download autenticado |
| `src/features/relatorios/relatorios.hooks.ts` | Queries com polling e mutations |
| `src/features/relatorios/relatorios.utils.ts` | Períodos, rótulos, chave de idempotência |

## Testes
`tests/relatorios.test.tsx` (tela), `tests/unit/relatorios-utils.test.ts` e
`tests/unit/relatorios-service.test.ts`.

# Telas: Assistente, Indicadores e Desempenho

Três telas do frontend (Expo / React Native), disponíveis em web e mobile
a partir do mesmo código.

## Assistente (`/assistente`)
Chat em linguagem natural sobre os dados da operação.
- Usa `POST /api/ai/query` (agente de IA do backend).
- Sugestões de perguntas, indicador de carregamento e tratamento de recusa.
- Histórico mantido durante a sessão (Zustand) e botão "Nova conversa".

## Indicadores (`/indicadores`)
Distribuição dos dados da operação.
- Ativos por status (rosca) e por criticidade (colunas).
- Ordens de serviço por tipo (rosca) e por prioridade (colunas).
- Endpoints: `GET /dashboard/ativos` e `GET /dashboard/ordens-servico`.

## Desempenho e custos (`/desempenho`)
Visão financeira e de disponibilidade.
- KPIs: custo total, O.S. atrasadas, tempo médio parado, materiais críticos.
- Composição de custos (rosca) e lista de materiais com estoque crítico.
- Endpoints: `GET /dashboard/resumo`, `/custos` e `/materiais`.

## Recursos comuns
- Botão "Atualizar", puxar para atualizar e atualização automática a cada 60 s.
- Esqueleto de carregamento e estado de erro com "Tentar novamente".
- Cores com significado (verde = bom, âmbar = atenção, tons escuros = crítico).
- Gráficos feitos com `react-native-svg` e `View`, sem biblioteca extra.

## Organização do código
| Pasta | Conteúdo |
|---|---|
| `frontend/app/(protected)/` | Telas (`assistente`, `indicadores`, `desempenho`) |
| `frontend/src/components/charts/` | ChartCard, StatCard, BarChart, DonutChart, ColumnChart, BotaoAtualizar, ChartSkeleton |
| `frontend/src/components/brand/` | Logo MaqControl |
| `frontend/src/features/ai/` | Tipos, service e hook do assistente |
| `frontend/src/store/assistente-store.ts` | Histórico da conversa |
| `frontend/src/lib/` | `formatters.ts` e `chart-colors.ts` |

## Como executar
    cd frontend
    npm install
    npx expo start --web

Defina `EXPO_PUBLIC_API_URL` no `frontend/.env`, apontando para a API.

## Capturas de tela
Adicione as imagens em `docs/img/` e referencie aqui.
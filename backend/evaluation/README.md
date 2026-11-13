# Avaliação da IA

Este diretório mantém artefatos de avaliação fora do código de produção.

`query-evaluation-dataset.ts` contém 41 casos versionados do domínio CTR-PE:

- 25 perguntas diretas ligadas aos SQLs de referência executáveis;
- 6 perguntas multi-etapas, cada uma com duas consultas verificáveis;
- 4 perguntas textuais em linguagem mais coloquial;
- 3 perguntas ambíguas que exigem esclarecimento;
- 3 pedidos que devem ser recusados por envolver credenciais, outra empresa ou escrita no banco.

Os casos de consulta apontam para `src/modules/ai/query-examples.ts`, que permanece como fonte única dos SQLs e dos
resultados esperados da base sintética. Assim, o dataset mede formulações e comportamento sem duplicar consultas.

Para validar o schema, a unicidade e todas as referências:

```bash
npm run test:ai-evaluation-dataset
```

## Runner real

O runner usa o mesmo `QueryAgentService`, provedor e executor read-only da API. A ordem dos casos é fixa e não há
latência aleatória simulada. Cada linha registra data, modelo, categoria, acerto, precisão, latência e tokens.

Configure:

- `GROQ_API_KEY` e, opcionalmente, `GROQ_MODEL`;
- `AI_READONLY_DATABASE_URL` com a role exclusiva da IA;
- `AI_EVALUATION_EMPRESA_ID` com o UUID da empresa usada no teste;
- `AI_EVALUATION_TENANT_CODE` com `alpha-international` ou `alpha-brazilian` (o padrão é `alpha-international`).

Execute:

```bash
npm run evaluate:ai
```

O CSV é salvo em `evaluation/results/`, diretório ignorado pelo Git. O runner continua após falhas isoladas, marca o
caso como incorreto e agrega precisão, latência média e tokens por categoria.

Os testes determinísticos do dataset, runner, agregações e CSV podem ser executados sem provedor externo:

```bash
npm run test:ai-evaluation
```


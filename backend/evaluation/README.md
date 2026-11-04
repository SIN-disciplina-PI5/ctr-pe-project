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


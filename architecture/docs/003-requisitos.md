# 3. Requisitos

## Funcionais
- Cadastro de ativos, localizações, materiais, planos de manutenção e usuários.
- Ciclo de vida das ordens de serviço: abertura, execução, espera de peça, encerramento e cancelamento.
- Paradas de ativo, apontamentos e consumo de materiais.
- Alertas (ativo parado, OS atrasada, aguardando peça, estoque baixo).
- Dashboard e log de auditoria.
- Assistente: perguntas sobre os dados, relatórios em PDF e troubleshooting.

## Não funcionais
- Isolamento de dados por empresa.
- A IA acessa o banco apenas por uma conexão somente leitura.
- O SQL gerado é validado (apenas SELECT) e limitado.
- O filtro por empresa é aplicado pelo backend, não confiado ao LLM.
- Rate limit nas chamadas de chat e de relatórios.
- Geração de relatórios assíncrona, fora do ciclo da requisição.

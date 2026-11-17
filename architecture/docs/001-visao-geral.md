# 1. Visão Geral

O MaqControl é um sistema de gestão de manutenção de ativos. Ele controla ativos, ordens de serviço, paradas, materiais, apontamentos, planos de manutenção, alertas e auditoria, com isolamento por empresa.

Sobre essa base, o sistema tem um assistente de IA com três agentes:

- consulta: responde perguntas sobre os dados de manutenção (RAG e text-to-SQL);
- relatórios: gera relatórios inteligentes em PDF de forma assíncrona;
- troubleshooting: sugere diagnósticos a partir do histórico de falhas.

## Perfis de usuário
- Gestão (Admin e Gestor): administram cadastros e planos, acompanham indicadores e solicitam relatórios.
- Operação (Supervisor e Técnico): abrem e executam ordens de serviço e registram apontamentos.
- Consulta: perfil somente leitura, consulta dados e conversa com o assistente.

## Fronteira do sistema
Um único serviço de aplicação (backend) atende um aplicativo web e mobile e integra três sistemas externos: o provedor de LLM, a fila de jobs gerenciada e o armazenamento de arquivos. Os dados ficam em um banco relacional.

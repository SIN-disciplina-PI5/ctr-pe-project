# C3 COMPONENTES: SERVIÇO DE APLICAÇÃO — CAMADA DE IA

# Chat e orquestração
chatController = component "Controller de Chat" "REST /api/ai/chat." "Express Controller" "Component,IA"
chatService = component "Serviço de Chat" "Orquestra a conversa e registra o histórico." "Service" "Component,IA"
conversationRepo = component "Repositório de Conversas" "Persiste conversas e turnos." "Prisma" "Component,IA"
orchestrator = component "Agente Orquestrador" "Entende a intenção e delega ao agente certo." "Agente LLM" "Component,IA"
intentClassifier = component "Classificador de Intenção" "data_question, report_request ou indefinido." "LLM" "Component,IA"

# Agente de consulta (RAG + text-to-SQL)
queryAgent = component "Agente de Consulta" "Responde perguntas de dados com RAG e text-to-SQL." "Agente LLM" "Component,IA"
relevantViews = component "Seleção de Views (RAG)" "Escolhe as views relevantes para a pergunta." "Retrieval" "Component,IA"
schemaContext = component "Contexto do Schema" "Descrições de negócio das views para o LLM." "Prompt Context" "Component,IA"
queryGeneration = component "Geração de SQL" "Gera o SELECT a partir da pergunta." "LLM" "Component,IA"
sqlValidator = component "Validador de SQL" "Aceita apenas SELECT; valida e limita." "Parser SQL" "Component,IA"
queryExecutor = component "Executor Somente Leitura" "Executa o SELECT em conexão read-only." "pg" "Component,IA"
queryAnswer = component "Redação da Resposta" "Compõe a resposta em linguagem natural." "LLM" "Component,IA"

# Agente de relatórios e jobs assíncronos
reportController = component "Controller de Relatórios" "REST /api/ai/reports." "Express Controller" "Component,IA"
reportAgent = component "Agente de Relatórios" "Planeja as seções, analisa os números e redige." "Agente LLM" "Component,IA"
reportJobService = component "Serviço de Jobs de Relatório" "Cria e acompanha o job assíncrono." "Service" "Component,IA"
qstashDispatcher = component "Despachante de Jobs" "Publica o job na fila gerenciada." "Upstash QStash" "Component,IA"
qstashCallback = component "Callback de Jobs" "Recebe o callback da fila e dispara o processamento." "Express Router" "Component,IA"
reportProcessor = component "Processador de Relatório" "Executa a geração quando o callback chega." "Service" "Component,IA"
reportRenderer = component "Renderizador de PDF" "Monta o PDF do relatório." "pdf-lib" "Component,IA"
reportStorageAdapter = component "Adaptador de Armazenamento" "Grava e recupera o PDF do relatório." "Vercel Blob" "Component,IA"
reportRepo = component "Repositório de Relatórios" "Metadados e status dos relatórios e jobs." "Prisma" "Component,IA"

# Agente de troubleshooting
troubleshootController = component "Controller de Troubleshooting" "REST /api/ai/troubleshoot." "Express Controller" "Component,IA"
troubleshootAgent = component "Agente de Troubleshooting" "Sugere diagnósticos a partir do histórico de falhas." "Agente LLM" "Component,IA"

# Provedor de LLM
groqProvider = component "Provedor de LLM" "Implementa a porta de LLM e observa métricas das chamadas." "groq-sdk" "Component,IA"

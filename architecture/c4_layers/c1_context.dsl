# ATORES
gestao = person "Gestão" "Admin e Gestor: administram cadastros e planos, acompanham indicadores e solicitam relatórios." "User"
operacao = person "Operação" "Supervisor e Técnico: abrem e executam ordens de serviço e registram apontamentos." "User"
consulta = person "Consulta" "Perfil somente leitura: consulta dados e conversa com o assistente de IA." "User"

# SISTEMAS EXTERNOS
llmProvider = softwareSystem "Provedor de LLM" "Modelo de linguagem usado pelos agentes de IA." "External System"
jobQueueService = softwareSystem "Fila de Jobs Gerenciada" "Fila externa que agenda e entrega os jobs de relatório via callback HTTP." "External System"

# SISTEMA MAQCONTROL
maqControl = softwareSystem "MaqControl" "Sistema de gestão de manutenção de ativos com assistente de IA (chatbot, relatórios e troubleshooting)." {
    !include c2_containers.dsl
}

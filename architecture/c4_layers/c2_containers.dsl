# CONTAINERS
app = container "Aplicativo Web e Mobile" "Interface para gestão, operação e consulta: ativos, ordens de serviço, dashboard, alertas, assistente e relatórios." "React Native · Expo" "Web Browser" {
    !include c3_components/c3_frontend.dsl
}

backend = container "Serviço de Aplicação" "API REST de manutenção, agentes de IA e processamento de relatórios, no mesmo processo Node." "Node.js · Express · TypeScript" "API" {
    !include c3_components/c3_backend.dsl
    !include c3_components/c3_ai_agents.dsl
}

db = container "Banco de Dados Relacional" "Dados do sistema, conversas e metadados de relatórios; role somente leitura para a camada de IA." "PostgreSQL · Neon" "Database"

reportStorage = container "Armazenamento de Arquivos" "Relatórios em PDF gerados pelos agentes de IA." "Vercel Blob · S3-compatível" "Storage"

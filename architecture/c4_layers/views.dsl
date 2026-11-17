# C1 — CONTEXTO
systemContext maqControl "Contexto" "Contexto do sistema MaqControl" {
    include *
    autoLayout lr
}

# C2 — CONTAINERS
container maqControl "Containers" "Containers do MaqControl" {
    include *
    autoLayout tb
}

# C3 — FRONTEND
component maqControl.app "Componentes_Frontend" "Componentes do Aplicativo Web e Mobile" {
    include *
    autoLayout tb
}

# C3 — BACKEND (DOMÍNIO)
component maqControl.backend "Componentes_Backend" "Componentes de domínio do Serviço de Aplicação" {
    include *
    exclude maqControl.backend.chatController
    exclude maqControl.backend.chatService
    exclude maqControl.backend.conversationRepo
    exclude maqControl.backend.orchestrator
    exclude maqControl.backend.intentClassifier
    exclude maqControl.backend.queryAgent
    exclude maqControl.backend.relevantViews
    exclude maqControl.backend.schemaContext
    exclude maqControl.backend.queryGeneration
    exclude maqControl.backend.sqlValidator
    exclude maqControl.backend.queryExecutor
    exclude maqControl.backend.queryAnswer
    exclude maqControl.backend.reportController
    exclude maqControl.backend.reportAgent
    exclude maqControl.backend.reportJobService
    exclude maqControl.backend.qstashDispatcher
    exclude maqControl.backend.qstashCallback
    exclude maqControl.backend.reportProcessor
    exclude maqControl.backend.reportRenderer
    exclude maqControl.backend.reportStorageAdapter
    exclude maqControl.backend.reportRepo
    exclude maqControl.backend.troubleshootController
    exclude maqControl.backend.troubleshootAgent
    exclude maqControl.backend.groqProvider
    autoLayout tb
}

# C3 — CAMADA DE IA
component maqControl.backend "Componentes_IA" "Componentes da camada de IA (multiagente)" {
    include maqControl.backend.chatController maqControl.backend.chatService maqControl.backend.conversationRepo maqControl.backend.orchestrator maqControl.backend.intentClassifier maqControl.backend.queryAgent maqControl.backend.relevantViews maqControl.backend.schemaContext maqControl.backend.queryGeneration maqControl.backend.sqlValidator maqControl.backend.queryExecutor maqControl.backend.queryAnswer maqControl.backend.reportController maqControl.backend.reportAgent maqControl.backend.reportJobService maqControl.backend.qstashDispatcher maqControl.backend.qstashCallback maqControl.backend.reportProcessor maqControl.backend.reportRenderer maqControl.backend.reportStorageAdapter maqControl.backend.reportRepo maqControl.backend.troubleshootController maqControl.backend.troubleshootAgent maqControl.backend.groqProvider maqControl.db maqControl.reportStorage llmProvider jobQueueService
    autoLayout tb
}

# DEPLOYMENTS
deployment maqControl "Local" "Deployment_Local" {
    include *
    autoLayout lr
}
deployment maqControl "Producao" "Deployment_Producao" {
    include *
    autoLayout lr
}

# AMBIENTE DE PRODUÇÃO
deploymentEnvironment "Producao" {
    deploymentNode "Vercel" "Hospedagem do backend e do app web" "Serverless" {
        deploymentNode "Função Serverless" "API REST e agentes de IA" "Node.js" {
            containerInstance maqControl.backend
        }
        deploymentNode "Web Estático" "Build web do Expo" "Expo Web" {
            containerInstance maqControl.app
        }
        deploymentNode "Vercel Blob" "Armazenamento de relatórios" "Blob Storage" {
            containerInstance maqControl.reportStorage
        }
    }
    deploymentNode "Neon" "Banco de dados gerenciado" "PostgreSQL" {
        containerInstance maqControl.db
    }
}

# AMBIENTE LOCAL (desenvolvimento)
deploymentEnvironment "Local" {
    deploymentNode "Máquina do Desenvolvedor" "Estação de desenvolvimento" "Linux / macOS / Windows" {
        deploymentNode "Expo Dev Server" "Serve o app web e mobile" "Node.js" {
            containerInstance maqControl.app
        }
        deploymentNode "Runtime Node.js" "Processo do backend com API e IA" "Node.js" {
            containerInstance maqControl.backend
        }
    }
    deploymentNode "Neon (branch dev-synthetic)" "Banco em nuvem, branch de desenvolvimento" "PostgreSQL" {
        containerInstance maqControl.db
    }
    deploymentNode "Vercel Blob" "Armazenamento de relatórios" "S3-compatível" {
        containerInstance maqControl.reportStorage
    }
}

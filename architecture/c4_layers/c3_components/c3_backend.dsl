# C3 COMPONENTES: SERVIÇO DE APLICAÇÃO — DOMÍNIO (Express + Prisma)

# Segurança e acesso
authController = component "Controller de Autenticação" "REST /api/auth: sign-in, sign-up, refresh e change-password." "Express Controller" "Component"
authService = component "Serviço de Autenticação" "Fluxos de login, cadastro e troca de senha." "Service" "Component"
tokenService = component "Serviço de Tokens" "Gera e valida JWT e refresh tokens." "JWT" "Security"
authRepository = component "Repositório de Autenticação" "Persistência de usuários e refresh tokens." "Prisma" "Component"

# Middlewares comuns
authMiddleware = component "Middleware de Autenticação" "Valida o JWT a cada requisição." "Express Middleware" "Security"
requireRole = component "Middleware de Perfil (RBAC)" "Autoriza por perfil: ADMIN, GESTOR, SUPERVISOR, TECNICO, CONSULTA." "Express Middleware" "Security"
validateMiddleware = component "Middleware de Validação" "Valida o corpo das requisições com Zod." "Zod" "Component"
auditMiddleware = component "Middleware de Auditoria" "Registra POST, PATCH e DELETE bem-sucedidos." "Express Middleware" "Component"
aiRateLimit = component "Rate Limit da IA" "Limita as chamadas de chat e de relatórios." "Express Middleware" "Security"
errorHandler = component "Tratador de Erros" "Mapeia exceções para respostas HTTP padronizadas." "Express Middleware" "Component"

# Núcleo do domínio: Ordens de Serviço
osController = component "Controller de Ordens de Serviço" "REST /api/ordens-servico." "Express Controller" "Component"
osService = component "Serviço de Ordens de Serviço" "Regras de criação, numeração e transições de estado." "Service" "Component"
osWorkflow = component "Workflow da OS" "Máquina de estados: parada, status do ativo e tempos." "Domain Logic" "Component"
osRepository = component "Repositório de Ordens de Serviço" "Persistência transacional da OS." "Prisma" "Component"

# Demais módulos de domínio (controller + service + repository)
ativosModule = component "Módulo de Ativos" "Cadastro e status de ativos." "Express Module" "Component"
localizacoesModule = component "Módulo de Localizações" "Locais onde os ativos ficam." "Express Module" "Component"
paradasModule = component "Módulo de Paradas de Ativo" "Registra o tempo de máquina parada." "Express Module" "Component"
apontamentosModule = component "Módulo de Apontamentos" "Tempo trabalhado e custo de mão de obra." "Express Module" "Component"
osMateriaisModule = component "Módulo de Materiais da OS" "Consumo e devolução de materiais na OS." "Express Module" "Component"
materiaisModule = component "Módulo de Materiais" "Estoque de peças e materiais." "Express Module" "Component"
planosModule = component "Módulo de Planos de Manutenção" "Planos preventivos dos ativos." "Express Module" "Component"
alertasModule = component "Módulo de Alertas" "Gera alertas de parada, atraso e estoque baixo." "Express Module" "Component"
dashboardModule = component "Módulo de Dashboard" "Agrega indicadores de manutenção." "Express Module" "Component"
auditoriaModule = component "Módulo de Auditoria" "Consulta o log de auditoria." "Express Module" "Component"
empresasModule = component "Módulo de Empresas" "Cadastro de empresas e isolamento por empresa." "Express Module" "Component"
usuariosModule = component "Módulo de Usuários" "Cadastro e perfis de usuários." "Express Module" "Component"

# Infraestrutura
prismaClient = component "Cliente Prisma" "Acesso ao PostgreSQL via driver adapter." "Prisma · pg" "Component"

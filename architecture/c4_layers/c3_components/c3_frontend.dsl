# C3 COMPONENTES: APLICATIVO WEB E MOBILE (Expo + expo-router)

# Roteamento e sessão
rootLayout = component "Layout Raiz" "Providers globais (React Query, Portal) e guarda de rotas." "expo-router _layout" "Component"
protectedGuard = component "Rota Protegida" "Protege o grupo de rotas autenticadas." "expo-router (protected)" "Component"
authStore = component "Auth Store" "Estado de sessão: token e usuário logado." "Zustand" "Component"
empresaStore = component "Empresa Store" "Empresa selecionada no contexto de trabalho." "Zustand" "Component"

# Telas por domínio
loginScreen = component "Tela de Login" "Autentica o usuário e inicia a sessão." "expo-router Screen" "Component"
dashboardScreen = component "Tela de Dashboard" "Indicadores de manutenção e disponibilidade." "expo-router Screen" "Component"
osScreen = component "Telas de Ordens de Serviço" "Lista, detalhe, criação e edição de OS." "expo-router Screen" "Component"
ativosScreen = component "Telas de Ativos e Paradas" "Cadastro e acompanhamento de ativos e paradas." "expo-router Screen" "Component"
cadastrosScreen = component "Telas de Cadastros" "Empresas, localizações, usuários, materiais e planos." "expo-router Screen" "Component"
assistenteScreen = component "Tela do Assistente" "Conversa com o assistente de IA." "expo-router Screen" "Component,IA"
relatoriosScreen = component "Tela de Relatórios" "Solicita, acompanha e baixa relatórios inteligentes." "expo-router Screen" "Component,IA"

# Camada de dados
featureHooks = component "Hooks de Feature" "Consultas e mutações por domínio." "TanStack Query" "Component"
apiClient = component "Cliente de API" "Cliente HTTP: injeta o token e trata 401." "fetch" "Component"
tokenStorage = component "Armazenamento de Token" "Guarda o token de forma segura." "expo-secure-store" "Component"

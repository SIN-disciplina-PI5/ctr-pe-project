export const endpoints = {
  ai: {
    chat: "/ai/chat",
    troubleshoot: "/ai/troubleshoot",
  },
  planosManutencao: {
    list: "/planos-manutencao",
    create: "/planos-manutencao",
    byId: (id: string) => `/planos-manutencao/${id}`,
    gerarOS: (id: string) => `/planos-manutencao/${id}/gerar-os`,
    processarVencidos: "/planos-manutencao/processar-vencidos",
  },
  ordensServico: {
    list: "/ordens-servico",
    create: "/ordens-servico",
    byId: (id: string) => `/ordens-servico/${id}`,
    iniciar: (id: string) => `/ordens-servico/${id}/iniciar`,
    aguardarPeca: (id: string) => `/ordens-servico/${id}/aguardar-peca`,
    retomar: (id: string) => `/ordens-servico/${id}/retomar`,
    encerrar: (id: string) => `/ordens-servico/${id}/encerrar`,
    cancelar: (id: string) => `/ordens-servico/${id}/cancelar`,
  },
};

export const endpoints = {
  ai: {
    chat: "/ai/chat",
    reports: {
      root: "/ai/reports",
      byId: (id: string) => `/ai/reports/${id}`,
      download: (id: string) => `/ai/reports/${id}/download`,
    },
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

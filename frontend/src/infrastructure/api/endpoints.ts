export const endpoints = {
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

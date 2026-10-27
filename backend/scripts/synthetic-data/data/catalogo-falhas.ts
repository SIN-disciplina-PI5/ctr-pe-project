import type { Falha, TipoSimulado } from "../types.js";

export interface CatalogoTipo {
  corretivas: readonly Falha[];
  preventivas: readonly Falha[];
}

const FALHA_ELETRICA_PARTIDA_BATERIA: Falha = {
  titulo: "Falha elétrica na partida",
  descricoes: [
    "Veículo não dá partida pela manhã.",
    "Painel apaga ao tentar dar partida e o motor não gira.",
    "Falha intermitente de partida, com luzes do painel oscilando.",
  ],
  diagnosticos: [
    "Bateria sem carga por terminal oxidado.",
    "Bateria com células em curto, não sustenta a partida.",
    "Terminais oxidados e fusível do circuito de ignição aberto.",
  ],
  solucoes: [
    "Substituída a bateria e limpos os terminais; partida normalizada.",
    "Trocada a bateria e o fusível do circuito; testes de partida sem falhas.",
    "Instalada bateria nova, aplicado protetor nos terminais e revisado o chicote.",
  ],
  materiais: ["MAT-010", "MAT-019"],
  horas: [1, 4],
};

const FALHA_SUPERAQUECIMENTO: Falha = {
  titulo: "Superaquecimento do motor",
  descricoes: [
    "Indicador de temperatura no vermelho durante a operação.",
    "Motor aquecendo acima do normal e alarme sonoro ativado.",
    "Perda de líquido de arrefecimento observada ao final do turno.",
  ],
  diagnosticos: [
    "Bomba d'água com vazamento pela vedação e sensor de temperatura com leitura instável.",
    "Bomba d'água com folga no eixo e sensor de temperatura defeituoso.",
    "Circuito de arrefecimento com bomba d'água comprometida e sensor fora de calibração.",
  ],
  solucoes: [
    "Substituídas bomba d'água e sensor; sistema sangrado e testado em carga.",
    "Trocadas bomba d'água e sensor de temperatura, com reposição do líquido de arrefecimento.",
    "Bomba d'água e sensor trocados; temperatura estabilizada em teste.",
  ],
  materiais: ["MAT-017", "MAT-018"],
  horas: [3, 8],
};

const FALHA_FILTRO_HIDRAULICO: Falha = {
  titulo: "Filtro hidráulico saturado",
  descricoes: [
    "Alarme de restrição no filtro hidráulico acendeu no painel.",
    "Movimentos lentos e ruído na bomba hidráulica.",
    "Temperatura do óleo hidráulico acima do normal.",
  ],
  diagnosticos: [
    "Filtro hidráulico saturado por partículas metálicas e sujeira.",
    "Elemento do filtro entupido, reduzindo a vazão do circuito.",
    "Óleo hidráulico contaminado e filtro obstruído.",
  ],
  solucoes: [
    "Substituído o filtro e trocado o óleo hidráulico contaminado.",
    "Filtro novo instalado e circuito limpo com troca de óleo.",
    "Trocados filtro e óleo; temperatura normalizada em teste.",
  ],
  materiais: ["MAT-004", "MAT-006"],
  horas: [2, 4],
};

export const CATALOGO_FALHAS: Record<TipoSimulado, CatalogoTipo> = {
  CAMINHAO: {
    corretivas: [
      {
        titulo: "Vazamento hidráulico",
        descricoes: [
          "Vazamento de óleo hidráulico observado no pátio sob o caminhão.",
          "Motorista relatou queda de pressão e óleo escorrendo na lateral da caçamba.",
          "Mancha de óleo hidráulico no piso após a operação do dia.",
        ],
        diagnosticos: [
          "Mangueira de alta pressão ressecada com trinca próxima à conexão.",
          "Conexão da mangueira hidráulica frouxa e com desgaste no anel de vedação.",
          "Mangueira rompida por atrito com a estrutura do chassi.",
        ],
        solucoes: [
          "Substituída a mangueira hidráulica; teste de pressão sem vazamentos.",
          "Trocada a mangueira e reapertadas as conexões; sistema purgado e testado.",
          "Mangueira nova instalada com protetor anti-atrito e circuito verificado.",
        ],
        materiais: ["MAT-007"],
        horas: [2, 6],
      },
      FALHA_ELETRICA_PARTIDA_BATERIA,
      FALHA_SUPERAQUECIMENTO,
      {
        titulo: "Desgaste dos freios",
        descricoes: [
          "Ruído metálico ao frear e pedal mais baixo que o normal.",
          "Motorista reportou distância de frenagem maior.",
          "Inspeção do motorista apontou freio traseiro com vibração.",
        ],
        diagnosticos: [
          "Pastilhas abaixo do limite mínimo e rolamento de roda com folga.",
          "Pastilhas desgastadas e rolamento com ruído.",
          "Desgaste acentuado das pastilhas e rolamento da roda traseira com folga.",
        ],
        solucoes: [
          "Substituído o jogo de pastilhas e o rolamento; freio testado em pista.",
          "Trocadas as pastilhas e o rolamento, com regulagem e teste de frenagem.",
          "Pastilhas e rolamento novos instalados; teste de frenagem aprovado.",
        ],
        materiais: ["MAT-008", "MAT-015"],
        horas: [2, 5],
      },
      {
        titulo: "Pneu danificado",
        descricoes: [
          "Pneu dianteiro com bolha lateral.",
          "Pneu traseiro furado durante a operação.",
          "Desgaste irregular detectado no pneu do eixo traseiro.",
        ],
        diagnosticos: [
          "Carcaça do pneu danificada por impacto, sem possibilidade de reparo.",
          "Corte na banda lateral inviabiliza a recapagem.",
          "Desgaste irregular causado por desalinhamento; pneu fora do limite.",
        ],
        solucoes: [
          "Pneu substituído e calibragem ajustada.",
          "Instalado pneu novo e feito o balanceamento.",
          "Substituído o pneu e corrigido o alinhamento do eixo.",
        ],
        materiais: ["MAT-014"],
        horas: [1, 3],
      },
    ],
    preventivas: [
      {
        titulo: "Revisão preventiva de 10.000 km",
        descricoes: [
          "Revisão preventiva programada conforme o plano de manutenção.",
          "Manutenção preventiva por quilometragem, com troca de fluidos e filtros.",
          "Parada programada para revisão periódica do caminhão.",
        ],
        diagnosticos: [
          "Sem anomalias além do desgaste normal de uso.",
          "Itens de desgaste dentro dos limites do fabricante.",
          "Componentes inspecionados sem sinais de falha iminente.",
        ],
        solucoes: [
          "Trocados óleo do motor e filtros conforme o plano; itens verificados e liberados.",
          "Realizada a troca de óleo e filtros, com lubrificação geral e liberação do veículo.",
          "Revisão concluída com troca de fluidos e filtros; veículo liberado para operação.",
        ],
        materiais: ["MAT-001", "MAT-002", "MAT-003", "MAT-005"],
        horas: [2, 4],
      },
      {
        titulo: "Lubrificação geral e verificação dos freios",
        descricoes: [
          "Lubrificação programada dos pontos de articulação e conferência do sistema de freios.",
          "Preventiva de lubrificação e checagem de freios conforme o cronograma.",
          "Rotina de lubrificação do chassi e inspeção dos freios.",
        ],
        diagnosticos: [
          "Freios com desgaste normal e pontos de lubrificação ressecados.",
          "Sistema de freios dentro da especificação; articulações com pouca graxa.",
          "Sem falhas; apenas necessidade de lubrificação.",
        ],
        solucoes: [
          "Lubrificados todos os pontos de articulação e conferido o sistema de freios.",
          "Aplicada graxa nos pontos do chassi e liberado o veículo.",
          "Lubrificação concluída e freios verificados sem necessidade de troca.",
        ],
        materiais: ["MAT-016"],
        horas: [1, 3],
      },
    ],
  },
  MAQUINA: {
    corretivas: [
      {
        titulo: "Vazamento em cilindro hidráulico",
        descricoes: [
          "Cilindro da lança com vazamento de óleo na haste.",
          "Perda de força no braço e óleo escorrendo pelo cilindro.",
          "Operador notou movimento lento da caçamba e vazamento visível.",
        ],
        diagnosticos: [
          "Vedações do cilindro ressecadas, causando passagem de óleo.",
          "Retentor da haste danificado por contaminação com poeira.",
          "Kit de vedação desgastado após longo período sem revisão.",
        ],
        solucoes: [
          "Substituído o kit de vedação e completado o óleo hidráulico; teste de carga sem vazamentos.",
          "Trocadas as vedações do cilindro e reposto o óleo; movimentos normalizados.",
          "Aplicado kit de vedação novo e feita a purga do circuito hidráulico.",
        ],
        materiais: ["MAT-013", "MAT-006"],
        horas: [4, 10],
      },
      {
        titulo: "Mangueira hidráulica rompida",
        descricoes: [
          "Rompimento de mangueira hidráulica durante a escavação.",
          "Jato de óleo no compartimento do motor, máquina parada imediatamente.",
          "Queda brusca de pressão hidráulica com óleo no chão.",
        ],
        diagnosticos: [
          "Mangueira de alta pressão rompida por fadiga na curvatura.",
          "Mangueira com cobertura ressecada e ruptura próxima à conexão.",
          "Mangueira atritando contra a estrutura e rompendo a camada externa.",
        ],
        solucoes: [
          "Substituída a mangueira de alta pressão e testado o circuito.",
          "Mangueira nova instalada com protetor e circuito testado sem vazamentos.",
          "Trocada a mangueira, limpo o compartimento e testado o sistema sob pressão.",
        ],
        materiais: ["MAT-007"],
        horas: [2, 6],
      },
      {
        titulo: "Desgaste dos dentes da caçamba",
        descricoes: [
          "Produtividade baixa na escavação e dentes visivelmente gastos.",
          "Dentes da caçamba quebrados após trabalho em solo rochoso.",
          "Operador reportou dificuldade de penetração no material.",
        ],
        diagnosticos: [
          "Dentes da caçamba desgastados além do limite.",
          "Pontas quebradas por impacto em rocha.",
          "Desgaste acentuado dos dentes e pinos de fixação com folga.",
        ],
        solucoes: [
          "Substituídos os dentes e lubrificados os pinos.",
          "Trocadas as pontas e aplicada graxa nos pontos de articulação.",
          "Dentes novos instalados e fixação revisada.",
        ],
        materiais: ["MAT-020", "MAT-016"],
        horas: [1, 3],
      },
      {
        titulo: "Falha no motor de partida",
        descricoes: [
          "Máquina não liga ao girar a chave.",
          "Motor de partida emite estalo e não gira.",
          "Falha intermitente na partida do motor.",
        ],
        diagnosticos: [
          "Motor de partida com escovas desgastadas.",
          "Solenoide do motor de partida travado.",
          "Motor de partida com enrolamento danificado.",
        ],
        solucoes: [
          "Substituído o motor de partida; testes de partida aprovados.",
          "Trocado o motor de partida e revisadas as conexões elétricas.",
          "Instalado motor de partida novo e trocado o fusível associado.",
        ],
        materiais: ["MAT-012", "MAT-019"],
        horas: [2, 5],
      },
      FALHA_FILTRO_HIDRAULICO,
    ],
    preventivas: [
      {
        titulo: "Revisão preventiva de 250 horas",
        descricoes: [
          "Revisão preventiva programada por horímetro.",
          "Manutenção periódica de 250 horas conforme o plano do fabricante.",
          "Parada programada para troca de fluidos e filtros da máquina.",
        ],
        diagnosticos: [
          "Itens de desgaste dentro do limite; sem anomalias relevantes.",
          "Máquina em boas condições gerais, com filtros no fim da vida útil.",
          "Sem vazamentos ou ruídos anormais durante a inspeção.",
        ],
        solucoes: [
          "Trocados óleo do motor e filtros conforme o plano; máquina liberada.",
          "Realizada a troca de óleo e filtros e a lubrificação geral.",
          "Revisão de 250 horas concluída com troca de fluidos e filtros.",
        ],
        materiais: ["MAT-001", "MAT-002", "MAT-004", "MAT-005"],
        horas: [4, 8],
      },
      {
        titulo: "Lubrificação geral e revisão do sistema hidráulico",
        descricoes: [
          "Lubrificação programada dos pinos e buchas e checagem do circuito hidráulico.",
          "Preventiva de lubrificação e verificação de mangueiras e cilindros.",
          "Rotina de lubrificação da lança e do braço com revisão hidráulica.",
        ],
        diagnosticos: [
          "Pinos e buchas com pouca graxa; circuito hidráulico sem vazamentos.",
          "Mangueiras e cilindros em bom estado, nível de óleo ligeiramente baixo.",
          "Sem falhas encontradas; lubrificação necessária.",
        ],
        solucoes: [
          "Lubrificados todos os pontos e completado o óleo hidráulico.",
          "Aplicada graxa nos pinos e buchas e reposto o nível do reservatório.",
          "Lubrificação concluída e circuito hidráulico verificado e liberado.",
        ],
        materiais: ["MAT-016", "MAT-006"],
        horas: [3, 6],
      },
    ],
  },
  EQUIPAMENTO: {
    corretivas: [
      {
        titulo: "Falha na partida do gerador",
        descricoes: [
          "Gerador não assumiu a carga durante a queda de energia.",
          "Falha ao dar partida automática do gerador.",
          "Painel do gerador sinalizou falha de partida.",
        ],
        diagnosticos: [
          "Bateria descarregada e fusível do circuito de comando aberto.",
          "Bateria com tensão baixa e terminais oxidados.",
          "Bateria no fim da vida útil e relé de comando com mau contato.",
        ],
        solucoes: [
          "Substituídos a bateria e o fusível; teste de partida automática aprovado.",
          "Trocada a bateria e limpos os terminais; gerador assumiu a carga no teste.",
          "Bateria nova instalada e relé substituído; partida normalizada.",
        ],
        materiais: ["MAT-010", "MAT-019"],
        horas: [1, 3],
      },
      FALHA_SUPERAQUECIMENTO,
      {
        titulo: "Vazamento de óleo lubrificante",
        descricoes: [
          "Óleo lubrificante no piso sob o gerador.",
          "Nível de óleo caindo entre as revisões.",
          "Cheiro de óleo queimado e fumaça no escapamento.",
        ],
        diagnosticos: [
          "Filtro de óleo mal vedado causando vazamento.",
          "Junta do filtro danificada e nível de óleo baixo.",
          "Filtro de óleo com vedação ressecada.",
        ],
        solucoes: [
          "Substituído o filtro de óleo e completado o nível; sem vazamentos após o teste.",
          "Trocado o filtro e o óleo lubrificante; estanqueidade verificada.",
          "Filtro novo instalado, óleo reposto e área limpa.",
        ],
        materiais: ["MAT-001", "MAT-005"],
        horas: [1, 3],
      },
      {
        titulo: "Correia do alternador desgastada",
        descricoes: [
          "Ruído agudo na partida e carga da bateria baixa.",
          "Correia com aspecto ressecado e patinando.",
          "Tensão de saída do gerador oscilando.",
        ],
        diagnosticos: [
          "Correia do alternador desgastada e patinando.",
          "Correia com trincas e tensão insuficiente.",
          "Correia ressecada e sem aderência na polia.",
        ],
        solucoes: [
          "Substituída a correia e ajustada a tensão.",
          "Correia nova instalada e tensionada; carga normalizada.",
          "Trocada a correia e verificada a tensão de saída.",
        ],
        materiais: ["MAT-009"],
        horas: [1, 3],
      },
    ],
    preventivas: [
      {
        titulo: "Manutenção preventiva do gerador",
        descricoes: [
          "Manutenção preventiva periódica do gerador conforme o plano.",
          "Revisão programada do gerador, com troca de óleo e filtros.",
          "Preventiva por horímetro do grupo gerador.",
        ],
        diagnosticos: [
          "Gerador em boas condições; filtros e óleo no fim do intervalo.",
          "Sem vazamentos e com parâmetros elétricos dentro do esperado.",
          "Itens de desgaste dentro do limite do fabricante.",
        ],
        solucoes: [
          "Trocados óleo e filtros; teste de carga aprovado.",
          "Realizada a troca de óleo, filtro de óleo e filtro de ar; gerador liberado.",
          "Manutenção concluída com troca de fluidos e filtros e teste de funcionamento.",
        ],
        materiais: ["MAT-001", "MAT-003", "MAT-005"],
        horas: [2, 5],
      },
      {
        titulo: "Teste de carga e verificação da bateria",
        descricoes: [
          "Teste de carga programado e verificação da bateria do gerador.",
          "Rotina de teste em carga do grupo gerador.",
          "Verificação preventiva do sistema de partida automática.",
        ],
        diagnosticos: [
          "Gerador assumiu a carga normalmente; bateria com tensão adequada.",
          "Parâmetros dentro da faixa durante o teste em carga.",
          "Sem anomalias; sistema de partida automática funcionando.",
        ],
        solucoes: [
          "Teste concluído sem intervenção; gerador liberado.",
          "Bateria verificada e terminais limpos; teste de carga aprovado.",
          "Verificação concluída e equipamento mantido em operação.",
        ],
        materiais: [],
        horas: [1, 3],
      },
    ],
  },
  COMPONENTE: {
    corretivas: [
      {
        titulo: "Ruído e folga em rolamento",
        descricoes: [
          "Ruído anormal durante o teste de bancada.",
          "Componente apresentou folga axial acima do tolerado.",
          "Vibração excessiva detectada na inspeção do componente.",
        ],
        diagnosticos: [
          "Rolamento principal com desgaste e folga excessiva.",
          "Rolamento danificado por falta de lubrificação.",
          "Pista do rolamento com marcas de desgaste.",
        ],
        solucoes: [
          "Substituído o rolamento e lubrificado o conjunto; teste de bancada aprovado.",
          "Rolamento novo instalado, com graxa nova e ajuste de folga.",
          "Trocado o rolamento e revisada a lubrificação; vibração dentro do limite.",
        ],
        materiais: ["MAT-015", "MAT-016"],
        horas: [2, 5],
      },
      {
        titulo: "Vazamento por vedação",
        descricoes: [
          "Óleo vazando pela tampa do componente.",
          "Vazamento visível na vedação após o teste.",
          "Perda de óleo hidráulico durante a operação de teste.",
        ],
        diagnosticos: [
          "Vedações ressecadas e com perda de elasticidade.",
          "Anel de vedação danificado na montagem anterior.",
          "Kit de vedação desgastado pelo tempo de uso.",
        ],
        solucoes: [
          "Substituído o kit de vedação e reposto o óleo hidráulico; sem vazamentos no teste.",
          "Vedações novas instaladas e componente testado sob pressão.",
          "Trocadas as vedações e completado o óleo; estanqueidade confirmada.",
        ],
        materiais: ["MAT-013", "MAT-006"],
        horas: [3, 6],
      },
      {
        titulo: "Perda de pressão",
        descricoes: [
          "Pressão de saída abaixo do especificado em bancada.",
          "Componente não atinge a pressão nominal.",
          "Queda de rendimento do componente durante o teste.",
        ],
        diagnosticos: [
          "Filtro obstruído e óleo contaminado reduzindo a vazão.",
          "Contaminação do óleo e filtro saturado.",
          "Restrição no filtro hidráulico causando perda de pressão.",
        ],
        solucoes: [
          "Substituídos filtro e óleo hidráulico; pressão nominal recuperada.",
          "Filtro novo instalado e óleo trocado; teste de pressão aprovado.",
          "Trocados filtro e óleo, com purga do circuito e novo teste.",
        ],
        materiais: ["MAT-004", "MAT-006"],
        horas: [2, 4],
      },
    ],
    preventivas: [
      {
        titulo: "Lubrificação e inspeção preventiva",
        descricoes: [
          "Lubrificação programada e inspeção visual do componente reserva.",
          "Preventiva periódica para manter o componente pronto para uso.",
          "Rotina de conservação do componente em estoque.",
        ],
        diagnosticos: [
          "Componente em bom estado, sem sinais de corrosão ou vazamento.",
          "Sem anomalias; apenas necessidade de lubrificação.",
          "Inspeção visual sem não conformidades.",
        ],
        solucoes: [
          "Lubrificado o conjunto e componente liberado como reserva.",
          "Aplicada graxa nos pontos de lubrificação e feita a conservação.",
          "Inspeção e lubrificação concluídas; componente pronto para uso.",
        ],
        materiais: ["MAT-016"],
        horas: [1, 2],
      },
    ],
  },
};

export const INSPECOES: readonly Falha[] = [
  {
    titulo: "Inspeção de rotina",
    descricoes: [
      "Inspeção periódica de rotina conforme o plano.",
      "Ronda de inspeção para verificar o estado geral do ativo.",
      "Inspeção visual e funcional programada.",
    ],
    diagnosticos: [
      "Nenhuma anomalia encontrada.",
      "Ativo em condições normais de operação.",
      "Sem desvios; itens verificados dentro do esperado.",
    ],
    solucoes: [
      "Sem intervenção necessária; ativo liberado.",
      "Inspeção concluída e ativo mantido em operação.",
      "Nenhuma ação corretiva necessária.",
    ],
    materiais: [],
    horas: [1, 2],
  },
  {
    titulo: "Inspeção de segurança",
    descricoes: [
      "Inspeção de segurança dos dispositivos de proteção do ativo.",
      "Checagem periódica de itens de segurança e sinalização.",
      "Verificação de segurança antes da próxima etapa de operação.",
    ],
    diagnosticos: [
      "Dispositivos de segurança funcionando corretamente.",
      "Itens de segurança conformes e sinalização em ordem.",
      "Sem não conformidades de segurança.",
    ],
    solucoes: [
      "Inspeção aprovada e ativo liberado para operação.",
      "Itens de segurança verificados; nenhuma ação necessária.",
      "Ativo liberado após a checagem de segurança.",
    ],
    materiais: [],
    horas: [1, 2],
  },
];

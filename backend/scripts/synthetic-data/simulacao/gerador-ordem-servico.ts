import {
  Prioridade,
  Severidade,
  StatusAlerta,
  StatusMaterialOS,
  StatusOS,
  StatusParada,
  TipoAcaoAuditoria,
  TipoAlerta,
  TipoOS,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import {
  ATRASO_INICIO_MIN,
  CANCELAMENTO_MIN,
  CHANCE_ALERTA_LIDO,
  CHANCE_CANCELAMENTO,
  CHANCE_DEVOLUCAO_MATERIAL,
  CHANCE_ESPERA_ALEATORIA,
  CHANCE_IMPACTA,
  CHANCE_TECNICO_ALTERNATIVO,
  CUSTO_HORA,
  DATA_REFERENCIA,
  DESCRICOES_APONTAMENTO,
  DIA_MIN,
  ENTIDADE_AUDITORIA_OS,
  ESPERA_ALEATORIA_DIAS,
  FAIXA_VARIACAO_CUSTO,
  FRACAO_FASE_INICIAL,
  HORA_MIN,
  LIDO_APOS_MIN,
  OBSERVACAO_CANCELAMENTO,
  OBSERVACOES_AGUARDANDO_PECA,
  PESO_JANELA_ATUAL,
  PESO_PRIORIDADE_CORRETIVA,
  PRAZO_HORAS,
  PREFIXO_ID,
  PRIORIDADE_NAO_CORRETIVA,
  SEVERIDADE_ATIVO_PARADO,
  STATUS_ATIVO_POR_STATUS_OS,
  STATUS_PARADA_POR_STATUS_OS,
  TOKEN_NUMERO,
  TURNO_MAX_MIN,
} from "../config.js";
import { ATIVO_PROBLEMATICO, MATERIAL_ATRASO, PICO_CUSTO } from "../data/padroes-plantados.js";
import type {
  AtivoCriado,
  Contexto,
  Faixa,
  Falha,
  MaterialCriado,
  OrdemServicoGerada,
  Peso,
  UsuarioCriado,
  UsuariosEmpresa,
} from "../types.js";
import { Moeda } from "../utils/moeda.js";
import { Tempo } from "../utils/tempo.js";

const STATUS_COM_EXECUCAO: readonly StatusOS[] = [StatusOS.EM_EXECUCAO, StatusOS.AGUARDANDO_PECA, StatusOS.ENCERRADA];

export interface EventoForcado {
  esperaPecaDias: number;
  prioridade: Prioridade;
}

export interface EmAndamento {
  minimoAbertaEm: Date;
}

export interface ParametrosGeracao {
  ativo: AtivoCriado;
  usuarios: UsuariosEmpresa;
  materiais: ReadonlyMap<string, MaterialCriado>;
  tipo: TipoOS;
  abertaEm: Date;
  falha: Falha;
  evento: EventoForcado | null;
  emAndamento: EmAndamento | null;
}

interface Duracoes {
  atrasoMin: number;
  execucaoMin: number;
  faseInicialMin: number;
  esperaMin: number;
  cancelamentoMin: number | null;
}

interface LinhaTempo {
  abertaEm: Date;
  iniciadaEm: Date;
  aguardandoDesde: Date;
  retomadaEm: Date;
  encerradaEm: Date;
  canceladaEm: Date | null;
  prazoEm: Date;
  esperaMin: number;
}

interface Situacao {
  status: StatusOS;
  iniciou: boolean;
  esperou: boolean;
  retomou: boolean;
}

interface ResultadoApontamentos {
  linhas: Prisma.ApontamentoOSCreateManyInput[];
  custo: number;
}

interface ResultadoItens {
  linhas: Prisma.OrdemServicoMaterialCreateManyInput[];
  custoConsumido: number;
}

interface DadosAlerta {
  ativo: AtivoCriado;
  ordemServicoId: string;
  tipo: TipoAlerta;
  severidade: Severidade;
  titulo: string;
  mensagem: string;
  geradoEm: Date;
  resolvidoEm: Date | null;
}

export class GeradorOrdemServico {
  constructor(private readonly ctx: Contexto) {}

  gerar(p: ParametrosGeracao): OrdemServicoGerada {
    const { aleatorio, ids } = this.ctx;
    const { ativo, usuarios, falha, tipo, evento, emAndamento } = p;
    const ordemServicoId = ids.proximo(PREFIXO_ID.ordemServico);

    const prioridade = evento?.prioridade ?? this.sortearPrioridade(tipo, ativo);
    const impacta = emAndamento !== null || evento !== null || aleatorio.chance(CHANCE_IMPACTA[tipo]);
    const pico = this.sorteouPico(tipo, p.abertaEm, evento);
    const codigos = pico ? [...falha.materiais, aleatorio.escolher(PICO_CUSTO.materiais)] : [...falha.materiais];
    const esperaMin = this.sortearEsperaMin(tipo, codigos, evento);
    const pecaEmFalta = esperaMin > 0 ? this.definirPecaEmFalta(codigos, p.materiais) : null;
    const nomePeca = pecaEmFalta ? this.obterMaterial(p.materiais, pecaEmFalta).nome : null;
    const duracoes = this.sortearDuracoes(p, esperaMin);
    const abertaEm = emAndamento ? this.escolherAberturaAtual(duracoes, emAndamento) : p.abertaEm;
    const tempo = this.montarLinhaTempo(abertaEm, duracoes, prioridade);
    const situacao = this.definirSituacao(tempo, impacta);
    const { status } = situacao;
    const encerrada = status === StatusOS.ENCERRADA;
    const cancelada = status === StatusOS.CANCELADA;

    const observacaoEspera = situacao.esperou
      ? `${aleatorio.escolher(OBSERVACOES_AGUARDANDO_PECA)} Peça: ${nomePeca}.`
      : null;
    const solicitante = aleatorio.escolher(usuarios.solicitantes);
    const responsavel = aleatorio.escolher(usuarios.tecnicos);
    const apontamentos = this.gerarApontamentos(ordemServicoId, responsavel, usuarios.tecnicos, tempo, situacao);
    const itens = this.gerarItens(ordemServicoId, p.materiais, codigos, status, pecaEmFalta, abertaEm);
    const custoTotal = Moeda.somar([itens.custoConsumido, apontamentos.custo]);
    const fim = this.definirFim(status, tempo);

    const ordem: Prisma.OrdemServicoCreateManyInput = {
      id: ordemServicoId,
      empresaId: ativo.empresaId,
      localizacaoId: ativo.localizacaoId,
      ativoId: ativo.id,
      solicitanteId: solicitante.id,
      responsavelId: responsavel.id,
      numero: "",
      titulo: `${falha.titulo} - ${ativo.codigo}`,
      descricao: aleatorio.escolher(falha.descricoes),
      tipo,
      status,
      prioridade,
      impactaDisponibilidade: impacta,
      abertaEm,
      iniciadaEm: situacao.iniciou ? tempo.iniciadaEm : null,
      encerradaEm: encerrada ? tempo.encerradaEm : null,
      canceladaEm: cancelada ? tempo.canceladaEm : null,
      prazoEm: tempo.prazoEm,
      aguardandoPecaDesde: status === StatusOS.AGUARDANDO_PECA ? tempo.aguardandoDesde : null,
      tempoAguardandoPecaMinutos: situacao.retomou ? esperaMin : null,
      tempoExecucaoMinutos: encerrada ? Tempo.diferencaMinutos(tempo.iniciadaEm, tempo.encerradaEm) : null,
      custoMateriais: itens.custoConsumido,
      custoMaoObra: apontamentos.custo,
      custoTotal,
      diagnostico: situacao.iniciou
        ? this.compor(aleatorio.escolher(falha.diagnosticos), pico ? PICO_CUSTO.complementoDiagnostico : null)
        : null,
      solucao: encerrada
        ? this.compor(aleatorio.escolher(falha.solucoes), pico ? PICO_CUSTO.complementoSolucao : null)
        : null,
      observacao: this.definirObservacao(situacao, cancelada, esperaMin, nomePeca, observacaoEspera),
      createdAt: abertaEm,
      updatedAt: fim,
    };

    return {
      abertaEm,
      fim,
      statusAtivo: impacta ? (STATUS_ATIVO_POR_STATUS_OS[status] ?? null) : null,
      ordem,
      parada: impacta ? this.construirParada(ordemServicoId, p, tempo, status) : null,
      apontamentos: apontamentos.linhas,
      itens: itens.linhas,
      alertas: this.construirAlertas(ordemServicoId, p, impacta, tempo, situacao, observacaoEspera),
      logs: this.construirLogs(ordemServicoId, p, solicitante, responsavel, tempo, status, custoTotal),
    };
  }

  private sortearPrioridade(tipo: TipoOS, ativo: AtivoCriado): Prioridade {
    if (tipo !== TipoOS.CORRETIVA) return PRIORIDADE_NAO_CORRETIVA[tipo];
    return this.ctx.aleatorio.escolherPonderado(PESO_PRIORIDADE_CORRETIVA[ativo.criticidade]);
  }

  private sorteouPico(tipo: TipoOS, abertaEm: Date, evento: EventoForcado | null): boolean {
    const noMes = abertaEm.getUTCFullYear() === PICO_CUSTO.ano && abertaEm.getUTCMonth() + 1 === PICO_CUSTO.mes;
    return tipo === TipoOS.CORRETIVA && evento === null && noMes && this.ctx.aleatorio.chance(PICO_CUSTO.chance);
  }

  private sortearEsperaMin(tipo: TipoOS, codigos: readonly string[], evento: EventoForcado | null): number {
    const { aleatorio } = this.ctx;
    if (evento) return evento.esperaPecaDias * DIA_MIN;
    if (codigos.includes(MATERIAL_ATRASO.codigo) && aleatorio.chance(MATERIAL_ATRASO.chance)) {
      return aleatorio.inteiroEm(MATERIAL_ATRASO.esperaDias) * DIA_MIN;
    }
    if (tipo === TipoOS.CORRETIVA && codigos.length > 0 && aleatorio.chance(CHANCE_ESPERA_ALEATORIA)) {
      return aleatorio.inteiroEm(ESPERA_ALEATORIA_DIAS) * DIA_MIN;
    }
    return 0;
  }

  private definirPecaEmFalta(codigos: readonly string[], materiais: ReadonlyMap<string, MaterialCriado>): string {
    if (codigos.includes(MATERIAL_ATRASO.codigo)) return MATERIAL_ATRASO.codigo;
    return codigos.reduce((maior, atual) =>
      this.obterMaterial(materiais, atual).custoMedio > this.obterMaterial(materiais, maior).custoMedio ? atual : maior,
    );
  }

  private obterMaterial(materiais: ReadonlyMap<string, MaterialCriado>, codigo: string): MaterialCriado {
    const material = materiais.get(codigo);
    if (!material) throw new Error(`Material ${codigo} não existe no catálogo.`);
    return material;
  }

  private sortearDuracoes(p: ParametrosGeracao, esperaMin: number): Duracoes {
    const { aleatorio } = this.ctx;
    const { falha, tipo, evento, ativo, emAndamento } = p;
    const problematico = ativo.codigo === ATIVO_PROBLEMATICO.codigo;
    const multiplicador = problematico ? ATIVO_PROBLEMATICO.multiplicadorExecucao : 1;
    const prioridadeAtraso = evento?.prioridade ?? this.sortearPrioridade(tipo, ativo);

    const atrasoMin = aleatorio.inteiroEm(ATRASO_INICIO_MIN[prioridadeAtraso]);
    const execucaoMin = Math.round(aleatorio.inteiro(falha.horas[0] * HORA_MIN, falha.horas[1] * HORA_MIN) * multiplicador);
    const cancela = tipo === TipoOS.CORRETIVA && evento === null && emAndamento === null && aleatorio.chance(CHANCE_CANCELAMENTO);

    return {
      atrasoMin,
      execucaoMin,
      faseInicialMin: esperaMin > 0 ? Math.round(execucaoMin * FRACAO_FASE_INICIAL) : execucaoMin,
      esperaMin,
      cancelamentoMin: cancela ? aleatorio.inteiroEm(CANCELAMENTO_MIN) : null,
    };
  }

  private escolherAberturaAtual(duracoes: Duracoes, emAndamento: EmAndamento): Date {
    const { aleatorio } = this.ctx;
    const fimAtraso = duracoes.atrasoMin;
    const fimFaseInicial = fimAtraso + duracoes.faseInicialMin;
    const fimEspera = fimFaseInicial + duracoes.esperaMin;
    const total = fimEspera + (duracoes.execucaoMin - duracoes.faseInicialMin);

    const janelas: Peso<Faixa>[] =
      duracoes.esperaMin > 0
        ? [
            { valor: [1, fimAtraso - 1], peso: PESO_JANELA_ATUAL.aberta },
            { valor: [fimAtraso, fimFaseInicial - 1], peso: PESO_JANELA_ATUAL.execucao },
            { valor: [fimFaseInicial, fimEspera - 1], peso: PESO_JANELA_ATUAL.espera },
            { valor: [fimEspera, total - 1], peso: PESO_JANELA_ATUAL.retomada },
          ]
        : [
            { valor: [1, fimAtraso - 1], peso: PESO_JANELA_ATUAL.aberta },
            { valor: [fimAtraso, total - 1], peso: PESO_JANELA_ATUAL.execucao },
          ];

    const faixa = aleatorio.escolherPonderado(janelas);
    const sorteada = Tempo.somarMinutos(DATA_REFERENCIA, -aleatorio.inteiroEm(faixa));
    return sorteada < emAndamento.minimoAbertaEm ? emAndamento.minimoAbertaEm : sorteada;
  }

  private montarLinhaTempo(abertaEm: Date, duracoes: Duracoes, prioridade: Prioridade): LinhaTempo {
    const iniciadaEm = Tempo.somarMinutos(abertaEm, duracoes.atrasoMin);
    const aguardandoDesde = Tempo.somarMinutos(iniciadaEm, duracoes.faseInicialMin);
    const retomadaEm = Tempo.somarMinutos(aguardandoDesde, duracoes.esperaMin);
    const cancelamento =
      duracoes.cancelamentoMin === null ? null : Tempo.somarMinutos(abertaEm, duracoes.cancelamentoMin);

    return {
      abertaEm,
      iniciadaEm,
      aguardandoDesde,
      retomadaEm,
      encerradaEm: Tempo.somarMinutos(retomadaEm, duracoes.execucaoMin - duracoes.faseInicialMin),
      canceladaEm: cancelamento && cancelamento <= DATA_REFERENCIA ? cancelamento : null,
      prazoEm: Tempo.somarMinutos(abertaEm, PRAZO_HORAS[prioridade] * HORA_MIN),
      esperaMin: duracoes.esperaMin,
    };
  }

  private definirSituacao(tempo: LinhaTempo, impacta: boolean): Situacao {
    const agora = DATA_REFERENCIA;
    let status: StatusOS;

    if (tempo.canceladaEm) status = StatusOS.CANCELADA;
    else if (tempo.encerradaEm <= agora) status = StatusOS.ENCERRADA;
    else if (!impacta || agora < tempo.iniciadaEm) status = StatusOS.ABERTA;
    else if (tempo.esperaMin > 0 && agora >= tempo.aguardandoDesde && agora < tempo.retomadaEm) {
      status = StatusOS.AGUARDANDO_PECA;
    } else status = StatusOS.EM_EXECUCAO;

    const iniciou = STATUS_COM_EXECUCAO.includes(status);
    const esperou = iniciou && tempo.esperaMin > 0 && agora >= tempo.aguardandoDesde;
    return { status, iniciou, esperou, retomou: esperou && agora >= tempo.retomadaEm };
  }

  private definirFim(status: StatusOS, tempo: LinhaTempo): Date {
    if (status === StatusOS.ENCERRADA) return tempo.encerradaEm;
    if (status === StatusOS.CANCELADA) return tempo.canceladaEm ?? DATA_REFERENCIA;
    return DATA_REFERENCIA;
  }

  private definirObservacao(
    situacao: Situacao,
    cancelada: boolean,
    esperaMin: number,
    nomePeca: string | null,
    observacaoEspera: string | null,
  ): string | null {
    if (cancelada) return OBSERVACAO_CANCELAMENTO;
    if (situacao.status === StatusOS.AGUARDANDO_PECA) return observacaoEspera;
    if (situacao.retomou) return `Peça recebida após ${Math.round(esperaMin / DIA_MIN)} dias de espera: ${nomePeca}.`;
    return null;
  }

  private compor(texto: string, complemento: string | null): string {
    return complemento ? `${texto} ${complemento}` : texto;
  }

  private gerarApontamentos(
    ordemServicoId: string,
    responsavel: UsuarioCriado,
    tecnicos: readonly UsuarioCriado[],
    tempo: LinhaTempo,
    situacao: Situacao,
  ): ResultadoApontamentos {
    const { aleatorio, ids } = this.ctx;
    const resultado: ResultadoApontamentos = { linhas: [], custo: 0 };
    if (!situacao.iniciou) return resultado;

    const fases =
      tempo.esperaMin > 0
        ? [
            { inicio: tempo.iniciadaEm, fim: tempo.aguardandoDesde },
            { inicio: tempo.retomadaEm, fim: tempo.encerradaEm },
          ]
        : [{ inicio: tempo.iniciadaEm, fim: tempo.encerradaEm }];

    for (const fase of fases) {
      const limite = Tempo.minimo(fase.fim, DATA_REFERENCIA);
      let inicio = fase.inicio;

      while (inicio < limite) {
        const duracao = Math.min(TURNO_MAX_MIN, Tempo.diferencaMinutos(inicio, limite));
        if (duracao <= 0) break;

        const fim = Tempo.somarMinutos(inicio, duracao);
        const custoHora = aleatorio.inteiroEm(CUSTO_HORA);
        const custoTotal = Moeda.arredondar((duracao / HORA_MIN) * custoHora);
        const tecnico = aleatorio.chance(CHANCE_TECNICO_ALTERNATIVO) ? aleatorio.escolher(tecnicos) : responsavel;

        resultado.linhas.push({
          id: ids.proximo(PREFIXO_ID.apontamento),
          ordemServicoId,
          usuarioId: tecnico.id,
          inicioEm: inicio,
          fimEm: fim,
          duracaoMinutos: duracao,
          descricao: aleatorio.escolher(DESCRICOES_APONTAMENTO),
          custoHora,
          custoTotal,
          createdAt: inicio,
          updatedAt: fim,
        });
        resultado.custo = Moeda.arredondar(resultado.custo + custoTotal);
        inicio = fim;
      }
    }

    return resultado;
  }

  private gerarItens(
    ordemServicoId: string,
    materiais: ReadonlyMap<string, MaterialCriado>,
    codigos: readonly string[],
    status: StatusOS,
    pecaEmFalta: string | null,
    criadoEm: Date,
  ): ResultadoItens {
    const { aleatorio, ids } = this.ctx;
    const resultado: ResultadoItens = { linhas: [], custoConsumido: 0 };

    for (const codigo of codigos) {
      const material = this.obterMaterial(materiais, codigo);
      const quantidade = aleatorio.inteiroEm(material.quantidade);
      const custoUnitario = Moeda.arredondar(material.custoMedio * aleatorio.decimal(FAIXA_VARIACAO_CUSTO));
      const custoTotal = Moeda.arredondar(quantidade * custoUnitario);
      const statusItem = this.definirStatusItem(status, codigo, pecaEmFalta);

      if (statusItem === StatusMaterialOS.CONSUMIDO) {
        resultado.custoConsumido = Moeda.arredondar(resultado.custoConsumido + custoTotal);
      }

      resultado.linhas.push({
        id: ids.proximo(PREFIXO_ID.itemMaterial),
        ordemServicoId,
        materialId: material.id,
        quantidade,
        custoUnitario,
        custoTotal: statusItem === StatusMaterialOS.DEVOLVIDO ? 0 : custoTotal,
        status: statusItem,
        createdAt: criadoEm,
      });
    }

    return resultado;
  }

  private definirStatusItem(status: StatusOS, codigo: string, pecaEmFalta: string | null): StatusMaterialOS {
    switch (status) {
      case StatusOS.CANCELADA:
        return StatusMaterialOS.CANCELADO;
      case StatusOS.ABERTA:
        return StatusMaterialOS.SOLICITADO;
      case StatusOS.AGUARDANDO_PECA:
        return codigo === pecaEmFalta ? StatusMaterialOS.SOLICITADO : StatusMaterialOS.CONSUMIDO;
      case StatusOS.ENCERRADA:
        return codigo !== pecaEmFalta && this.ctx.aleatorio.chance(CHANCE_DEVOLUCAO_MATERIAL)
          ? StatusMaterialOS.DEVOLVIDO
          : StatusMaterialOS.CONSUMIDO;
      default:
        return StatusMaterialOS.CONSUMIDO;
    }
  }

  private construirParada(
    ordemServicoId: string,
    p: ParametrosGeracao,
    tempo: LinhaTempo,
    status: StatusOS,
  ): Prisma.ParadaAtivoCreateManyInput {
    const encerrada = status === StatusOS.ENCERRADA;
    const fimEm = encerrada ? tempo.encerradaEm : status === StatusOS.CANCELADA ? tempo.canceladaEm : null;

    return {
      id: this.ctx.ids.proximo(PREFIXO_ID.parada),
      empresaId: p.ativo.empresaId,
      ativoId: p.ativo.id,
      ordemServicoId,
      status: STATUS_PARADA_POR_STATUS_OS[status] ?? StatusParada.ABERTA,
      inicioEm: tempo.abertaEm,
      fimEm,
      duracaoMinutos: encerrada ? Tempo.diferencaMinutos(tempo.iniciadaEm, tempo.encerradaEm) : null,
      motivo: `O.S. ${TOKEN_NUMERO}: ${p.falha.titulo} - ${p.ativo.codigo}`,
      programada: p.tipo === TipoOS.PREVENTIVA,
      impactaDisponibilidade: true,
      createdAt: tempo.abertaEm,
      updatedAt: fimEm ?? DATA_REFERENCIA,
    };
  }

  private construirAlertas(
    ordemServicoId: string,
    p: ParametrosGeracao,
    impacta: boolean,
    tempo: LinhaTempo,
    situacao: Situacao,
    observacaoEspera: string | null,
  ): Prisma.AlertaCreateManyInput[] {
    const { ativo, falha } = p;
    const { status } = situacao;
    const titulo = `${falha.titulo} - ${ativo.codigo}`;
    const alertas: Prisma.AlertaCreateManyInput[] = [];
    const fimParada =
      status === StatusOS.ENCERRADA ? tempo.encerradaEm : status === StatusOS.CANCELADA ? tempo.canceladaEm : null;

    if (impacta) {
      alertas.push(
        this.criarAlerta({
          ativo,
          ordemServicoId,
          tipo: TipoAlerta.ATIVO_PARADO,
          severidade: SEVERIDADE_ATIVO_PARADO[ativo.criticidade],
          titulo: `Ativo parado: ${ativo.nome}`,
          mensagem: `O ativo ${ativo.nome} (${ativo.codigo}) está parado. Motivo: O.S. ${TOKEN_NUMERO}.`,
          geradoEm: tempo.abertaEm,
          resolvidoEm: fimParada,
        }),
      );
    }

    if (situacao.esperou) {
      alertas.push(
        this.criarAlerta({
          ativo,
          ordemServicoId,
          tipo: TipoAlerta.AGUARDANDO_PECA,
          severidade: Severidade.MEDIA,
          titulo: `O.S. aguardando peça: ${TOKEN_NUMERO}`,
          mensagem: `A O.S. ${TOKEN_NUMERO} (${titulo}) está aguardando peça. Observação: ${observacaoEspera}`,
          geradoEm: tempo.aguardandoDesde,
          resolvidoEm: situacao.retomou ? tempo.retomadaEm : null,
        }),
      );
    }

    const atrasadaEncerrada = status === StatusOS.ENCERRADA && tempo.encerradaEm > tempo.prazoEm;
    const atrasadaAberta =
      status !== StatusOS.ENCERRADA && status !== StatusOS.CANCELADA && DATA_REFERENCIA > tempo.prazoEm;
    if (atrasadaEncerrada || atrasadaAberta) {
      alertas.push(
        this.criarAlerta({
          ativo,
          ordemServicoId,
          tipo: TipoAlerta.OS_ATRASADA,
          severidade: Severidade.ALTA,
          titulo: `O.S. atrasada: ${TOKEN_NUMERO}`,
          mensagem: `A O.S. ${TOKEN_NUMERO} (${titulo}) está atrasada. Prazo: ${tempo.prazoEm.toISOString()}.`,
          geradoEm: tempo.prazoEm,
          resolvidoEm: atrasadaEncerrada ? tempo.encerradaEm : null,
        }),
      );
    }

    return alertas;
  }

  private criarAlerta(dados: DadosAlerta): Prisma.AlertaCreateManyInput {
    const { aleatorio, ids } = this.ctx;
    const resolvido = dados.resolvidoEm !== null && dados.resolvidoEm <= DATA_REFERENCIA;
    const lido = !resolvido && aleatorio.chance(CHANCE_ALERTA_LIDO);

    let status: StatusAlerta = StatusAlerta.ABERTO;
    if (resolvido) status = StatusAlerta.RESOLVIDO;
    else if (lido) status = StatusAlerta.LIDO;

    return {
      id: ids.proximo(PREFIXO_ID.alerta),
      empresaId: dados.ativo.empresaId,
      ativoId: dados.ativo.id,
      ordemServicoId: dados.ordemServicoId,
      tipo: dados.tipo,
      severidade: dados.severidade,
      status,
      titulo: dados.titulo,
      mensagem: dados.mensagem,
      geradoEm: dados.geradoEm,
      lidoEm: lido
        ? Tempo.minimo(Tempo.somarMinutos(dados.geradoEm, aleatorio.inteiroEm(LIDO_APOS_MIN)), DATA_REFERENCIA)
        : null,
      resolvidoEm: resolvido ? dados.resolvidoEm : null,
      createdAt: dados.geradoEm,
    };
  }

  private construirLogs(
    ordemServicoId: string,
    p: ParametrosGeracao,
    solicitante: UsuarioCriado,
    responsavel: UsuarioCriado,
    tempo: LinhaTempo,
    status: StatusOS,
    custoTotal: number,
  ): Prisma.LogAuditoriaCreateManyInput[] {
    const { ids } = this.ctx;
    const base = { empresaId: p.ativo.empresaId, entidade: ENTIDADE_AUDITORIA_OS, entidadeId: ordemServicoId };
    const logs: Prisma.LogAuditoriaCreateManyInput[] = [
      {
        ...base,
        id: ids.proximo(PREFIXO_ID.log),
        usuarioId: solicitante.id,
        acao: TipoAcaoAuditoria.CRIACAO,
        depois: { id: ordemServicoId, numero: TOKEN_NUMERO, titulo: p.falha.titulo, ativoId: p.ativo.id, status: StatusOS.ABERTA },
        createdAt: tempo.abertaEm,
      },
    ];

    if (status === StatusOS.ENCERRADA) {
      logs.push({
        ...base,
        id: ids.proximo(PREFIXO_ID.log),
        usuarioId: responsavel.id,
        acao: TipoAcaoAuditoria.ENCERRAMENTO_OS,
        depois: { id: ordemServicoId, numero: TOKEN_NUMERO, status, custoTotal },
        createdAt: tempo.encerradaEm,
      });
    }

    if (status === StatusOS.CANCELADA && tempo.canceladaEm) {
      logs.push({
        ...base,
        id: ids.proximo(PREFIXO_ID.log),
        usuarioId: solicitante.id,
        acao: TipoAcaoAuditoria.CANCELAMENTO_OS,
        depois: { id: ordemServicoId, numero: TOKEN_NUMERO, status },
        createdAt: tempo.canceladaEm,
      });
    }

    return logs;
  }
}

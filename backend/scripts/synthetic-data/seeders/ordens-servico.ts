import { StatusAtivo, TipoOS } from "@prisma/client";
import {
  CHANCE_CORRETIVA,
  CHANCE_EM_USO,
  CHANCE_FALHA_PECA_ATRASO_ATUAL,
  CHANCE_OS_EM_ANDAMENTO,
  DATA_REFERENCIA,
  DIA_MIN,
  DIGITOS_NUMERO_OS,
  HORA_ABERTURA_UTC,
  INICIO_SIMULACAO,
  INTERVALO_ENTRE_OS_DIAS,
  JANELA_OS_EM_ANDAMENTO_DIAS,
  MARGEM_OS_EM_ANDAMENTO_MIN,
  MINUTO_ABERTURA,
  PERFIS_SOLICITANTES,
  PESO_TIPO_NAO_CORRETIVA,
  PREFIXO_NUMERO_OS,
  TAMANHO_LOTE,
  TOKEN_NUMERO,
} from "../config.js";
import { CATALOGO_FALHAS, INSPECOES } from "../data/catalogo-falhas.js";
import { ATIVO_PROBLEMATICO, EVENTO_TRANSMISSAO, MATERIAL_ATRASO } from "../data/padroes-plantados.js";
import { GeradorOrdemServico } from "../simulacao/gerador-ordem-servico.js";
import type {
  AtivoCriado,
  BaseSeed,
  Contexto,
  Falha,
  MaterialCriado,
  OrdemServicoGerada,
  TipoSimulado,
  UsuarioCriado,
  UsuariosEmpresa,
} from "../types.js";
import { Tempo } from "../utils/tempo.js";

export class OrdensServicoSeeder {
  private readonly gerador: GeradorOrdemServico;

  constructor(private readonly ctx: Contexto) {
    this.gerador = new GeradorOrdemServico(ctx);
  }

  async executar(base: BaseSeed): Promise<void> {
    const geradas: OrdemServicoGerada[] = [];
    const statusAtivos = new Map<string, StatusAtivo>();

    for (const empresa of base.empresas) {
      const usuarios = this.agruparUsuarios(base.usuarios, empresa.id);
      const materiais = new Map(
        base.materiais.filter((m) => m.empresaId === empresa.id).map((m): [string, MaterialCriado] => [m.codigo, m]),
      );
      const daEmpresa: OrdemServicoGerada[] = [];

      for (const ativo of base.ativos.filter((a) => a.empresaId === empresa.id && a.ativo)) {
        daEmpresa.push(...this.simularAtivo(ativo, usuarios, materiais, statusAtivos));
      }

      daEmpresa.sort((a, b) => a.abertaEm.getTime() - b.abertaEm.getTime());
      daEmpresa.forEach((gerada, indice) => this.aplicarNumero(gerada, this.formatarNumero(indice + 1)));
      geradas.push(...daEmpresa);
    }

    await this.gravar(geradas);
    await this.atualizarAtivos(base.ativos, statusAtivos);
  }

  private simularAtivo(
    ativo: AtivoCriado,
    usuarios: UsuariosEmpresa,
    materiais: ReadonlyMap<string, MaterialCriado>,
    statusAtivos: Map<string, StatusAtivo>,
  ): OrdemServicoGerada[] {
    const { aleatorio } = this.ctx;
    const problematico = ativo.codigo === ATIVO_PROBLEMATICO.codigo;
    const terOsEmAndamento = problematico ? ATIVO_PROBLEMATICO.emAndamentoAgora : aleatorio.chance(CHANCE_OS_EM_ANDAMENTO);
    const limite = terOsEmAndamento
      ? Tempo.somarMinutos(DATA_REFERENCIA, -JANELA_OS_EM_ANDAMENTO_DIAS * DIA_MIN)
      : DATA_REFERENCIA;
    const geradas: OrdemServicoGerada[] = [];
    let eventoPendente = ativo.codigo === EVENTO_TRANSMISSAO.codigoAtivo;
    let cursor = this.agendar(INICIO_SIMULACAO, ativo);

    while (cursor < limite) {
      const forcado = eventoPendente && cursor >= EVENTO_TRANSMISSAO.data;
      const tipo = forcado ? TipoOS.CORRETIVA : this.sortearTipo(problematico);
      const falha = forcado ? EVENTO_TRANSMISSAO.falha : this.sortearFalha(ativo, tipo);

      const gerada = this.gerador.gerar({
        ativo,
        usuarios,
        materiais,
        tipo,
        abertaEm: cursor,
        falha,
        evento: forcado
          ? { esperaPecaDias: EVENTO_TRANSMISSAO.esperaPecaDias, prioridade: EVENTO_TRANSMISSAO.prioridade }
          : null,
        emAndamento: null,
      });

      geradas.push(gerada);
      if (forcado) eventoPendente = false;
      if (gerada.statusAtivo) statusAtivos.set(ativo.id, gerada.statusAtivo);
      cursor = this.agendar(gerada.fim, ativo);
    }

    if (terOsEmAndamento) {
      const ultimoFim = geradas.at(-1)?.fim ?? INICIO_SIMULACAO;
      const atual = this.gerador.gerar({
        ativo,
        usuarios,
        materiais,
        tipo: TipoOS.CORRETIVA,
        abertaEm: DATA_REFERENCIA,
        falha: this.sortearFalhaAtual(ativo),
        evento: null,
        emAndamento: { minimoAbertaEm: Tempo.somarMinutos(ultimoFim, MARGEM_OS_EM_ANDAMENTO_MIN) },
      });
      geradas.push(atual);
      if (atual.statusAtivo) statusAtivos.set(ativo.id, atual.statusAtivo);
    }

    return geradas;
  }

  private sortearTipo(problematico: boolean): TipoOS {
    const { aleatorio } = this.ctx;
    const chanceCorretiva = problematico ? ATIVO_PROBLEMATICO.chanceCorretiva : CHANCE_CORRETIVA;
    return aleatorio.chance(chanceCorretiva) ? TipoOS.CORRETIVA : aleatorio.escolherPonderado(PESO_TIPO_NAO_CORRETIVA);
  }

  private sortearFalha(ativo: AtivoCriado, tipo: TipoOS): Falha {
    const { aleatorio } = this.ctx;
    if (tipo === TipoOS.INSPECAO) return aleatorio.escolher(INSPECOES);
    const catalogo = CATALOGO_FALHAS[ativo.tipo as TipoSimulado];
    return aleatorio.escolher(tipo === TipoOS.CORRETIVA ? catalogo.corretivas : catalogo.preventivas);
  }

  private sortearFalhaAtual(ativo: AtivoCriado): Falha {
    const { aleatorio } = this.ctx;
    const corretivas = CATALOGO_FALHAS[ativo.tipo as TipoSimulado].corretivas;
    const comPecaAtrasada = corretivas.filter((f) => f.materiais.includes(MATERIAL_ATRASO.codigo));
    const preferirPecaAtrasada = comPecaAtrasada.length > 0 && aleatorio.chance(CHANCE_FALHA_PECA_ATRASO_ATUAL);
    return aleatorio.escolher(preferirPecaAtrasada ? comPecaAtrasada : corretivas);
  }

  private agendar(base: Date, ativo: AtivoCriado): Date {
    const { aleatorio } = this.ctx;
    const faixa =
      ativo.codigo === ATIVO_PROBLEMATICO.codigo ? ATIVO_PROBLEMATICO.intervaloDias : INTERVALO_ENTRE_OS_DIAS[ativo.criticidade];
    const data = Tempo.somarMinutos(base, aleatorio.inteiroEm(faixa) * DIA_MIN);
    data.setUTCHours(aleatorio.inteiroEm(HORA_ABERTURA_UTC), aleatorio.inteiroEm(MINUTO_ABERTURA), 0, 0);
    return data;
  }

  private agruparUsuarios(usuarios: UsuarioCriado[], empresaId: string): UsuariosEmpresa {
    const daEmpresa = usuarios.filter((u) => u.empresaId === empresaId);
    return {
      solicitantes: daEmpresa.filter((u) => PERFIS_SOLICITANTES.includes(u.perfil)),
      tecnicos: daEmpresa.filter((u) => u.perfil === "TECNICO"),
    };
  }

  private formatarNumero(sequencial: number): string {
    const ano = DATA_REFERENCIA.getUTCFullYear();
    return `${PREFIXO_NUMERO_OS}-${ano}-${String(sequencial).padStart(DIGITOS_NUMERO_OS, "0")}`;
  }

  private aplicarNumero(gerada: OrdemServicoGerada, numero: string): void {
    const trocar = (texto: string) => texto.replaceAll(TOKEN_NUMERO, numero);

    gerada.ordem.numero = numero;
    if (gerada.parada?.motivo) gerada.parada.motivo = trocar(gerada.parada.motivo);
    for (const alerta of gerada.alertas) {
      alerta.titulo = trocar(alerta.titulo);
      alerta.mensagem = trocar(alerta.mensagem);
    }
    for (const log of gerada.logs) {
      log.depois = JSON.parse(trocar(JSON.stringify(log.depois)));
    }
  }

  private async gravar(geradas: OrdemServicoGerada[]): Promise<void> {
    const { prisma } = this.ctx;

    await this.inserir(
      geradas.map((g) => g.ordem),
      (lote) => prisma.ordemServico.createMany({ data: lote }),
    );
    await this.inserir(
      geradas.flatMap((g) => (g.parada ? [g.parada] : [])),
      (lote) => prisma.paradaAtivo.createMany({ data: lote }),
    );
    await this.inserir(
      geradas.flatMap((g) => g.apontamentos),
      (lote) => prisma.apontamentoOS.createMany({ data: lote }),
    );
    await this.inserir(
      geradas.flatMap((g) => g.itens),
      (lote) => prisma.ordemServicoMaterial.createMany({ data: lote }),
    );
    await this.inserir(
      geradas.flatMap((g) => g.alertas),
      (lote) => prisma.alerta.createMany({ data: lote }),
    );
    await this.inserir(
      geradas.flatMap((g) => g.logs),
      (lote) => prisma.logAuditoria.createMany({ data: lote }),
    );
  }

  private async inserir<T>(dados: T[], gravarLote: (lote: T[]) => Promise<unknown>): Promise<void> {
    for (let posicao = 0; posicao < dados.length; posicao += TAMANHO_LOTE) {
      await gravarLote(dados.slice(posicao, posicao + TAMANHO_LOTE));
    }
  }

  private async atualizarAtivos(ativos: AtivoCriado[], statusAtivos: ReadonlyMap<string, StatusAtivo>): Promise<void> {
    const { prisma, aleatorio } = this.ctx;

    for (const ativo of ativos) {
      const operando = aleatorio.chance(CHANCE_EM_USO) ? StatusAtivo.EM_USO : StatusAtivo.DISPONIVEL;
      const livre = ativo.ativo ? operando : StatusAtivo.DESATIVADO;
      await prisma.ativo.update({ where: { id: ativo.id }, data: { status: statusAtivos.get(ativo.id) ?? livre } });
    }
  }
}


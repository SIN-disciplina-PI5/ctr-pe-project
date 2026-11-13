import type { Prisma, PrismaClient } from "@prisma/client";
import { StatusOS, StatusParada, TipoOS } from "@prisma/client";
import { jest } from "@jest/globals";
import { DATA_REFERENCIA, DIA_MIN, SEMENTE, TOKEN_NUMERO } from "../../scripts/synthetic-data/config.js";
import { EVENTO_TRANSMISSAO, MATERIAL_ATRASO, PICO_CUSTO } from "../../scripts/synthetic-data/data/padroes-plantados.js";
import { AtivosSeeder } from "../../scripts/synthetic-data/seeders/ativos.js";
import { EmpresasSeeder } from "../../scripts/synthetic-data/seeders/empresas.js";
import { LocalizacoesSeeder } from "../../scripts/synthetic-data/seeders/localizacoes.js";
import { MateriaisSeeder } from "../../scripts/synthetic-data/seeders/materiais.js";
import { OrdensServicoSeeder } from "../../scripts/synthetic-data/seeders/ordens-servico.js";
import { UsuariosSeeder } from "../../scripts/synthetic-data/seeders/usuarios.js";
import type { BaseSeed, Contexto } from "../../scripts/synthetic-data/types.js";
import { Aleatorio } from "../../scripts/synthetic-data/utils/aleatorio.js";
import { GeradorId } from "../../scripts/synthetic-data/utils/gerador-id.js";
import {
  VERIFICACOES,
  VerificadorConsistencia,
  type CategoriaVerificacao,
} from "../../scripts/synthetic-data/verificacoes.js";

interface DadosCapturados {
  ativos: Prisma.AtivoCreateManyInput[];
  materiais: Prisma.MaterialCreateManyInput[];
  ordens: Prisma.OrdemServicoCreateManyInput[];
  paradas: Prisma.ParadaAtivoCreateManyInput[];
  apontamentos: Prisma.ApontamentoOSCreateManyInput[];
  itens: Prisma.OrdemServicoMaterialCreateManyInput[];
  alertas: Prisma.AlertaCreateManyInput[];
  logs: Prisma.LogAuditoriaCreateManyInput[];
  atualizacoesAtivos: Array<{ id: string; status: string }>;
}

interface ExecucaoSintetica {
  base: BaseSeed;
  dados: DadosCapturados;
}

function coletor<T>(destino: T[]) {
  return jest.fn(async ({ data }: { data: T | T[] }) => {
    const lote = Array.isArray(data) ? data : [data];
    destino.push(...lote);
    return { count: lote.length };
  });
}

function criarPrismaEmMemoria(dados: DadosCapturados): PrismaClient {
  const criar = jest.fn(async () => ({}));

  return {
    empresa: { create: criar },
    usuario: { create: criar, createMany: coletor([]) },
    localizacao: { createMany: coletor([]) },
    ativo: {
      createMany: coletor(dados.ativos),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: { status: string } }) => {
        dados.atualizacoesAtivos.push({ id: where.id, status: data.status });
        return {};
      }),
    },
    material: { createMany: coletor(dados.materiais) },
    ordemServico: { createMany: coletor(dados.ordens) },
    paradaAtivo: { createMany: coletor(dados.paradas) },
    apontamentoOS: { createMany: coletor(dados.apontamentos) },
    ordemServicoMaterial: { createMany: coletor(dados.itens) },
    alerta: { createMany: coletor(dados.alertas) },
    logAuditoria: { createMany: coletor(dados.logs) },
  } as unknown as PrismaClient;
}

async function executarGeracao(): Promise<ExecucaoSintetica> {
  const dados: DadosCapturados = {
    ativos: [],
    materiais: [],
    ordens: [],
    paradas: [],
    apontamentos: [],
    itens: [],
    alertas: [],
    logs: [],
    atualizacoesAtivos: [],
  };
  const ctx: Contexto = {
    prisma: criarPrismaEmMemoria(dados),
    aleatorio: new Aleatorio(SEMENTE),
    ids: new GeradorId(),
    senhaHash: "hash-deterministico-apenas-para-teste",
  };

  const empresas = await new EmpresasSeeder(ctx).executar();
  const usuarios = await new UsuariosSeeder(ctx).executar(empresas);
  const localizacoes = await new LocalizacoesSeeder(ctx).executar(empresas);
  const ativos = await new AtivosSeeder(ctx).executar(empresas, localizacoes);
  const materiais = await new MateriaisSeeder(ctx).executar(empresas);
  const base = { empresas, usuarios, localizacoes, ativos, materiais };
  await new OrdensServicoSeeder(ctx).executar(base);

  return { base, dados };
}

function numero(valor: unknown): number {
  return Number(valor ?? 0);
}

function instante(valor: Date | string | null | undefined): number | null {
  return valor == null ? null : new Date(valor).getTime();
}

function media(valores: readonly number[]): number {
  return valores.reduce((soma, valor) => soma + valor, 0) / valores.length;
}

describe("verificações SQL dos dados sintéticos", () => {
  it("mantém verificações críticas para todos os grupos de consistência", () => {
    const categorias = new Set<CategoriaVerificacao>(VERIFICACOES.map((verificacao) => verificacao.categoria));

    expect(categorias).toEqual(new Set(["TEMPORAL", "STATUS", "CUSTO", "IDENTIFICADOR", "TENANT"]));
    expect(VERIFICACOES).toHaveLength(13);
    expect(VERIFICACOES.every((verificacao) => verificacao.sql.includes("SELECT"))).toBe(true);
  });

  it("retorna um relatório automatizável quando a base está consistente", async () => {
    const queryRaw = jest.fn(async (_sql: string) => [{ contagem: 0 }]);
    const prisma = {
      $queryRawUnsafe: queryRaw,
    } as unknown as PrismaClient;

    const resultados = await new VerificadorConsistencia(prisma).avaliar();

    expect(resultados).toHaveLength(VERIFICACOES.length);
    expect(resultados.every((resultado) => resultado.ok)).toBe(true);
    expect(queryRaw).toHaveBeenCalledTimes(VERIFICACOES.length);
  });

  it("reprova a execução e informa quantas regras foram violadas", async () => {
    let chamada = 0;
    const queryRaw = jest.fn(async (_sql: string) => [{ contagem: chamada++ < 2 ? 1 : 0 }]);
    const prisma = {
      $queryRawUnsafe: queryRaw,
    } as unknown as PrismaClient;
    const verificador = new VerificadorConsistencia(prisma);
    const consoleLog = jest.spyOn(console, "log").mockImplementation(() => undefined);

    try {
      await expect(verificador.executar()).rejects.toThrow("2 verificação(ões) de consistência falharam.");
    } finally {
      consoleLog.mockRestore();
    }
  });
});

describe("geração sintética determinística", () => {
  let primeira: ExecucaoSintetica;
  let segunda: ExecucaoSintetica;

  beforeAll(async () => {
    primeira = await executarGeracao();
    segunda = await executarGeracao();
  });

  it("produz exatamente a mesma base em duas execuções com a semente oficial", () => {
    expect(segunda).toEqual(primeira);
    expect(primeira.dados.ordens.length).toBeGreaterThan(300);
  });

  it("preserva datas, tempos, custos, status e relações de tenant", () => {
    const { base, dados } = primeira;
    const ativoPorId = new Map(base.ativos.map((ativo) => [ativo.id, ativo]));
    const apontamentosPorOs = new Map<string, number>();
    const materiaisPorOs = new Map<string, number>();

    for (const apontamento of dados.apontamentos) {
      apontamentosPorOs.set(
        apontamento.ordemServicoId,
        (apontamentosPorOs.get(apontamento.ordemServicoId) ?? 0) + numero(apontamento.custoTotal),
      );
    }
    for (const item of dados.itens) {
      if (item.status !== "CONSUMIDO") continue;
      materiaisPorOs.set(item.ordemServicoId, (materiaisPorOs.get(item.ordemServicoId) ?? 0) + numero(item.custoTotal));
    }

    for (const ordem of dados.ordens) {
      const aberta = instante(ordem.abertaEm);
      const iniciada = instante(ordem.iniciadaEm);
      const encerrada = instante(ordem.encerradaEm);
      const cancelada = instante(ordem.canceladaEm);
      expect(iniciada === null || (aberta !== null && iniciada >= aberta)).toBe(true);
      expect(encerrada === null || encerrada >= (iniciada ?? aberta ?? 0)).toBe(true);
      expect(cancelada === null || (aberta !== null && cancelada >= aberta)).toBe(true);

      expect(numero(ordem.custoMaoObra)).toBeCloseTo(apontamentosPorOs.get(ordem.id!) ?? 0, 2);
      expect(numero(ordem.custoMateriais)).toBeCloseTo(materiaisPorOs.get(ordem.id!) ?? 0, 2);
      expect(numero(ordem.custoTotal)).toBeCloseTo(numero(ordem.custoMaoObra) + numero(ordem.custoMateriais), 2);
      expect(ativoPorId.get(ordem.ativoId)?.empresaId).toBe(ordem.empresaId);
      expect(ordem.numero).not.toContain(TOKEN_NUMERO);
    }

    const statusAbertos: readonly StatusOS[] = [StatusOS.ABERTA, StatusOS.EM_EXECUCAO, StatusOS.AGUARDANDO_PECA];
    const abertasImpactantes = dados.ordens.filter(
      (ordem) =>
        ordem.impactaDisponibilidade &&
        statusAbertos.includes(ordem.status as StatusOS),
    );
    expect(new Set(abertasImpactantes.map((ordem) => ordem.ativoId)).size).toBe(abertasImpactantes.length);

    for (const parada of dados.paradas) {
      if (parada.status === StatusParada.CANCELADA) expect(parada.duracaoMinutos).toBeNull();
    }
    for (const item of dados.itens) {
      if (item.status === "DEVOLVIDO") expect(numero(item.custoTotal)).toBe(0);
    }
  });

  it("mantém detectáveis os quatro padrões plantados", () => {
    const { base, dados } = primeira;
    const ativoPorId = new Map(base.ativos.map((ativo) => [ativo.id, ativo]));
    const materialPorId = new Map(base.materiais.map((material) => [material.id, material]));
    const ordemPorId = new Map(dados.ordens.map((ordem) => [ordem.id, ordem]));

    for (const empresa of base.empresas) {
      const ordensEmpresa = dados.ordens.filter((ordem) => ordem.empresaId === empresa.id);
      const corretivasCt07 = ordensEmpresa.filter(
        (ordem) => ativoPorId.get(ordem.ativoId)?.codigo === "CT-07" && ordem.tipo === TipoOS.CORRETIVA,
      ).length;
      const corretivasOutros = base.ativos
        .filter((ativo) => ativo.empresaId === empresa.id && ativo.ativo && ativo.codigo !== "CT-07")
        .map(
          (ativo) =>
            ordensEmpresa.filter((ordem) => ordem.ativoId === ativo.id && ordem.tipo === TipoOS.CORRETIVA).length,
        );
      expect(corretivasCt07).toBeGreaterThanOrEqual(media(corretivasOutros) * 3);
    }

    const ordensComMaterialAtrasado = new Set(
      dados.itens
        .filter((item) => materialPorId.get(item.materialId)?.codigo === MATERIAL_ATRASO.codigo)
        .map((item) => item.ordemServicoId),
    );
    const comEspera = [...ordensComMaterialAtrasado].filter((id) => {
      const ordem = ordemPorId.get(id);
      return numero(ordem?.tempoAguardandoPecaMinutos) > 0 || ordem?.status === StatusOS.AGUARDANDO_PECA;
    });
    expect(comEspera.length / ordensComMaterialAtrasado.size).toBeGreaterThanOrEqual(0.7);

    const encerradas = dados.ordens.filter((ordem) => ordem.status === StatusOS.ENCERRADA);
    const agosto = encerradas.filter(
      (ordem) =>
        new Date(ordem.abertaEm!).getUTCFullYear() === PICO_CUSTO.ano &&
        new Date(ordem.abertaEm!).getUTCMonth() + 1 === PICO_CUSTO.mes,
    );
    const demais = encerradas.filter((ordem) => !agosto.includes(ordem));
    expect(media(agosto.map((ordem) => numero(ordem.custoTotal)))).toBeGreaterThan(
      media(demais.map((ordem) => numero(ordem.custoTotal))) * 1.5,
    );

    const eventosTransmissao = dados.ordens.filter((ordem) => {
      const ativo = ativoPorId.get(ordem.ativoId);
      const usaKit = dados.itens.some(
        (item) => item.ordemServicoId === ordem.id && materialPorId.get(item.materialId)?.codigo === "MAT-022",
      );
      return ativo?.codigo === EVENTO_TRANSMISSAO.codigoAtivo && ordem.titulo.startsWith(EVENTO_TRANSMISSAO.falha.titulo) && usaKit;
    });
    expect(eventosTransmissao).toHaveLength(base.empresas.length);
    expect(
      eventosTransmissao.every(
        (ordem) =>
          numero(ordem.tempoAguardandoPecaMinutos) === EVENTO_TRANSMISSAO.esperaPecaDias * DIA_MIN &&
          new Date(ordem.abertaEm!) >= EVENTO_TRANSMISSAO.data &&
          new Date(ordem.encerradaEm ?? DATA_REFERENCIA) <= DATA_REFERENCIA,
      ),
    ).toBe(true);
  });
});

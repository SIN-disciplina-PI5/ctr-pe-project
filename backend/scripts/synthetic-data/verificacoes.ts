import type { PrismaClient } from "@prisma/client";
import { TABELAS } from "./config.js";

interface Verificacao {
  nome: string;
  sql: string;
}

const STATUS_ATIVO_EM_MANUTENCAO = "'PARADO', 'EM_MANUTENCAO', 'AGUARDANDO_PECA'";
const STATUS_OS_ABERTAS = "'ABERTA', 'EM_EXECUCAO', 'AGUARDANDO_PECA'";
const TOLERANCIA_CUSTO = 0.01;
const TOLERANCIA_MINUTOS = 1;

const VERIFICACOES: readonly Verificacao[] = [
  {
    nome: "Datas das OS em ordem (abertura, início, encerramento)",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico"
          WHERE "iniciadaEm" < "abertaEm"
             OR "encerradaEm" < COALESCE("iniciadaEm", "abertaEm")
             OR "canceladaEm" < "abertaEm"`,
  },
  {
    nome: "Paradas abertas pertencem a ativos parados, em manutenção ou aguardando peça",
    sql: `SELECT COUNT(*)::int AS contagem FROM "ParadaAtivo" p
          JOIN "Ativo" a ON a.id = p."ativoId"
          WHERE p.status = 'ABERTA' AND a.status NOT IN (${STATUS_ATIVO_EM_MANUTENCAO})`,
  },
  {
    nome: "Ativos parados, em manutenção ou aguardando peça têm parada aberta",
    sql: `SELECT COUNT(*)::int AS contagem FROM "Ativo" a
          WHERE a.status IN (${STATUS_ATIVO_EM_MANUTENCAO})
            AND NOT EXISTS (SELECT 1 FROM "ParadaAtivo" p WHERE p."ativoId" = a.id AND p.status = 'ABERTA')`,
  },
  {
    nome: "Parada encerrada tem a duração calculada pelo repository (encerramento menos início da execução)",
    sql: `SELECT COUNT(*)::int AS contagem FROM "ParadaAtivo" p
          JOIN "OrdemServico" o ON o.id = p."ordemServicoId"
          WHERE p.status = 'ENCERRADA'
            AND ABS(p."duracaoMinutos" - EXTRACT(EPOCH FROM (o."encerradaEm" - o."iniciadaEm")) / 60) > ${TOLERANCIA_MINUTOS}`,
  },
  {
    nome: "No máximo uma OS impactante aberta por ativo",
    sql: `SELECT COUNT(*)::int AS contagem FROM (
            SELECT "ativoId" FROM "OrdemServico"
            WHERE "impactaDisponibilidade" AND status IN (${STATUS_OS_ABERTAS})
            GROUP BY "ativoId" HAVING COUNT(*) > 1
          ) t`,
  },
  {
    nome: "Custo total = materiais + mão de obra",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico"
          WHERE ABS("custoTotal" - ("custoMateriais" + "custoMaoObra")) > ${TOLERANCIA_CUSTO}`,
  },
  {
    nome: "Custo de mão de obra bate com os apontamentos",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico" o
          WHERE ABS(o."custoMaoObra" - COALESCE(
            (SELECT SUM(ap."custoTotal") FROM "ApontamentoOS" ap WHERE ap."ordemServicoId" = o.id), 0
          )) > ${TOLERANCIA_CUSTO}`,
  },
  {
    nome: "Custo de materiais bate com os itens consumidos",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico" o
          WHERE ABS(o."custoMateriais" - COALESCE(
            (SELECT SUM(m."custoTotal") FROM "OrdemServicoMaterial" m
             WHERE m."ordemServicoId" = o.id AND m.status = 'CONSUMIDO'), 0
          )) > ${TOLERANCIA_CUSTO}`,
  },
  {
    nome: "Tempo de execução das OS encerradas = encerramento menos início, como no repository",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico"
          WHERE status = 'ENCERRADA'
            AND ABS("tempoExecucaoMinutos" - EXTRACT(EPOCH FROM ("encerradaEm" - "iniciadaEm")) / 60) > ${TOLERANCIA_MINUTOS}`,
  },
  {
    nome: "Parada cancelada não tem duração (o repository só grava status e fim)",
    sql: `SELECT COUNT(*)::int AS contagem FROM "ParadaAtivo" WHERE status = 'CANCELADA' AND "duracaoMinutos" IS NOT NULL`,
  },
  {
    nome: "Material devolvido tem custo zero",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServicoMaterial" WHERE status = 'DEVOLVIDO' AND "custoTotal" <> 0`,
  },
  {
    nome: "Número da OS não ficou com o marcador de substituição",
    sql: `SELECT (
            (SELECT COUNT(*) FROM "OrdemServico" WHERE numero LIKE '%{{%') +
            (SELECT COUNT(*) FROM "Alerta" WHERE titulo LIKE '%{{%' OR mensagem LIKE '%{{%') +
            (SELECT COUNT(*) FROM "ParadaAtivo" WHERE motivo LIKE '%{{%') +
            (SELECT COUNT(*) FROM "LogAuditoria" WHERE "depois"::text LIKE '%{{%')
          )::int AS contagem`,
  },
  {
    nome: "OS e ativo pertencem à mesma empresa",
    sql: `SELECT COUNT(*)::int AS contagem FROM "OrdemServico" o
          JOIN "Ativo" a ON a.id = o."ativoId" WHERE a."empresaId" <> o."empresaId"`,
  },
];

export class VerificadorConsistencia {
  constructor(private readonly prisma: PrismaClient) {}

  async resumo(): Promise<void> {
    console.log("\nRegistros criados:");
    for (const tabela of TABELAS) {
      console.log(`  ${tabela}: ${await this.contar(`SELECT COUNT(*)::int AS contagem FROM "${tabela}"`)}`);
    }
  }

  async executar(): Promise<void> {
    console.log("\nVerificações de consistência:");
    let falhas = 0;

    for (const verificacao of VERIFICACOES) {
      const contagem = await this.contar(verificacao.sql);
      const ok = contagem === 0;
      if (!ok) falhas++;
      console.log(`  ${ok ? "OK    " : "FALHOU"} ${verificacao.nome}${ok ? "" : ` (${contagem})`}`);
    }

    if (falhas > 0) throw new Error(`${falhas} verificação(ões) de consistência falharam.`);
  }

  private async contar(sql: string): Promise<number> {
    const [linha] = await this.prisma.$queryRawUnsafe<{ contagem: number }[]>(sql);
    return linha?.contagem ?? 0;
  }
}

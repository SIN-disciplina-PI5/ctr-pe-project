import { Severidade, StatusAlerta, TipoAlerta } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { ATRASO_ALERTA_ESTOQUE_DIAS, DATA_REFERENCIA, DIA_MIN, PREFIXO_ID } from "../config.js";
import { MODELOS_MATERIAIS } from "../data/catalogo-materiais.js";
import type { Contexto, EmpresaCriada, MaterialCriado } from "../types.js";
import { Tempo } from "../utils/tempo.js";

export class MateriaisSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(empresas: EmpresaCriada[]): Promise<MaterialCriado[]> {
    const { prisma, ids, aleatorio } = this.ctx;
    const dados: Prisma.MaterialCreateManyInput[] = [];
    const alertas: Prisma.AlertaCreateManyInput[] = [];
    const criados: MaterialCriado[] = [];

    for (const empresa of empresas) {
      for (const modelo of MODELOS_MATERIAIS) {
        const id = ids.proximo(PREFIXO_ID.material);
        dados.push({
          id,
          empresaId: empresa.id,
          codigo: modelo.codigo,
          nome: modelo.nome,
          descricao: modelo.descricao,
          unidade: modelo.unidade,
          estoqueAtual: modelo.estoqueAtual,
          estoqueMinimo: modelo.estoqueMinimo,
          custoMedio: modelo.custoMedio,
        });
        criados.push({
          id,
          empresaId: empresa.id,
          codigo: modelo.codigo,
          nome: modelo.nome,
          custoMedio: modelo.custoMedio,
          quantidade: modelo.quantidade,
        });

        if (modelo.estoqueAtual <= modelo.estoqueMinimo) {
          const geradoEm = Tempo.somarMinutos(DATA_REFERENCIA, -aleatorio.inteiroEm(ATRASO_ALERTA_ESTOQUE_DIAS) * DIA_MIN);
          alertas.push({
            id: ids.proximo(PREFIXO_ID.alerta),
            empresaId: empresa.id,
            tipo: TipoAlerta.ESTOQUE_BAIXO,
            severidade: Severidade.ALTA,
            status: StatusAlerta.ABERTO,
            titulo: `Estoque baixo: ${modelo.nome}`,
            mensagem:
              `Material ${modelo.nome} (${modelo.codigo}) está com estoque baixo. ` +
              `Estoque atual: ${modelo.estoqueAtual}. Estoque mínimo: ${modelo.estoqueMinimo}. materialId=${id}`,
            geradoEm,
            createdAt: geradoEm,
          });
        }
      }
    }

    await prisma.material.createMany({ data: dados });
    await prisma.alerta.createMany({ data: alertas });
    return criados;
  }
}

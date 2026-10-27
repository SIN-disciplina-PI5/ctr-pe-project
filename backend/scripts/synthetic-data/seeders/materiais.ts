import type { Prisma } from "@prisma/client";
import { PREFIXO_ID } from "../config";
import { MODELOS_MATERIAIS } from "../data/catalogo-materiais";
import type { Contexto, EmpresaCriada, MaterialCriado } from "../types";

export class MateriaisSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(empresas: EmpresaCriada[]): Promise<MaterialCriado[]> {
    const { prisma, ids } = this.ctx;
    const dados: Prisma.MaterialCreateManyInput[] = [];
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
        criados.push({ id, empresaId: empresa.id, codigo: modelo.codigo, custoMedio: modelo.custoMedio });
      }
    }

    await prisma.material.createMany({ data: dados });
    return criados;
  }
}

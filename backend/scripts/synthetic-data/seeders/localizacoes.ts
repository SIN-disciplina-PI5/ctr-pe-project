import type { Prisma } from "@prisma/client";
import { LOCALIZACOES, PREFIXO_ID } from "../config";
import type { Contexto, EmpresaCriada, LocalizacaoCriada } from "../types";

export class LocalizacoesSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(empresas: EmpresaCriada[]): Promise<LocalizacaoCriada[]> {
    const { prisma, ids } = this.ctx;
    const dados: Prisma.LocalizacaoCreateManyInput[] = [];
    const criadas: LocalizacaoCriada[] = [];

    for (const empresa of empresas) {
      for (const modelo of LOCALIZACOES) {
        const id = ids.proximo(PREFIXO_ID.localizacao);
        dados.push({ id, empresaId: empresa.id, codigo: modelo.codigo, nome: modelo.nome, tipo: modelo.tipo });
        criadas.push({ id, empresaId: empresa.id, codigo: modelo.codigo });
      }
    }

    await prisma.localizacao.createMany({ data: dados });
    return criadas;
  }
}

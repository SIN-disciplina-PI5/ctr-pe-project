import { StatusAtivo, TipoAtivo } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import {
  CODIGO_ATIVO_DESATIVADO,
  DIGITOS_CODIGO_ATIVO,
  LOCALIZACAO_POR_TIPO,
  PESO_CRITICIDADE,
  PREFIXO_ID,
} from "../config.js";
import { MODELOS_ATIVOS } from "../data/catalogo-ativos.js";
import { ATIVO_PROBLEMATICO } from "../data/padroes-plantados.js";
import type { AtivoCriado, Contexto, EmpresaCriada, LocalizacaoCriada } from "../types.js";

export class AtivosSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(empresas: EmpresaCriada[], localizacoes: LocalizacaoCriada[]): Promise<AtivoCriado[]> {
    const { prisma, ids, aleatorio } = this.ctx;
    const dados: Prisma.AtivoCreateManyInput[] = [];
    const criados: AtivoCriado[] = [];

    for (const empresa of empresas) {
      for (const modelo of MODELOS_ATIVOS) {
        const codigoLocalizacao = LOCALIZACAO_POR_TIPO[modelo.tipo];
        const localizacao = localizacoes.find((l) => l.empresaId === empresa.id && l.codigo === codigoLocalizacao);

        for (let numero = 1; numero <= modelo.quantidade; numero++) {
          const id = ids.proximo(PREFIXO_ID.ativo);
          const codigo = `${modelo.prefixo}-${String(numero).padStart(DIGITOS_CODIGO_ATIVO, "0")}`;
          const ativo = codigo !== CODIGO_ATIVO_DESATIVADO;
          const nome = `${modelo.nome} ${codigo}`;
          const criticidade =
            codigo === ATIVO_PROBLEMATICO.codigo ? ATIVO_PROBLEMATICO.criticidade : aleatorio.escolherPonderado(PESO_CRITICIDADE);
          const { marca, modelo: nomeModelo } = aleatorio.escolher(modelo.marcas);
          const contador = aleatorio.inteiroEm(modelo.faixaContador);

          dados.push({
            id,
            empresaId: empresa.id,
            localizacaoId: localizacao?.id ?? null,
            codigo,
            nome,
            descricao: `${modelo.nome} da frota ${empresa.nome}.`,
            tipo: modelo.tipo,
            status: ativo ? StatusAtivo.DISPONIVEL : StatusAtivo.DESATIVADO,
            criticidade,
            marca,
            modelo: nomeModelo,
            numeroSerie: `SN${aleatorio.inteiro(100_000, 999_999)}`,
            placa: modelo.tipo === TipoAtivo.CAMINHAO ? aleatorio.placa() : null,
            horimetroAtual: modelo.contador === "horimetro" ? contador : null,
            odometroAtual: modelo.contador === "odometro" ? contador : null,
            ativo,
          });
          criados.push({
            id,
            empresaId: empresa.id,
            localizacaoId: localizacao?.id ?? null,
            codigo,
            nome,
            tipo: modelo.tipo,
            criticidade,
            ativo,
          });
        }
      }
    }

    await prisma.ativo.createMany({ data: dados });
    return criados;
  }
}

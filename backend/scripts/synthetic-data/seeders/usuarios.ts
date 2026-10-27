import type { Prisma } from "@prisma/client";
import { PREFIXO_ID, SUFIXO_EMAIL, USUARIOS_POR_PERFIL } from "../config.js";
import type { Contexto, EmpresaCriada, UsuarioCriado } from "../types.js";

export class UsuariosSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(empresas: EmpresaCriada[]): Promise<UsuarioCriado[]> {
    const { prisma, ids, aleatorio, senhaHash } = this.ctx;
    const dados: Prisma.UsuarioCreateManyInput[] = [];
    const criados: UsuarioCriado[] = [];

    for (const empresa of empresas) {
      for (const { perfil, quantidade } of USUARIOS_POR_PERFIL) {
        for (let numero = 1; numero <= quantidade; numero++) {
          const id = ids.proximo(PREFIXO_ID.usuario);
          dados.push({
            id,
            empresaId: empresa.id,
            nome: aleatorio.nome(),
            email: `${perfil.toLowerCase()}${numero}@${empresa.codigo}${SUFIXO_EMAIL}`,
            senhaHash,
            perfil,
          });
          criados.push({ id, empresaId: empresa.id, perfil });
        }
      }
    }

    await prisma.usuario.createMany({ data: dados });
    return criados;
  }
}

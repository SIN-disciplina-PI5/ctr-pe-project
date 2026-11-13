import { PerfilUsuario } from "@prisma/client";
import { EMPRESAS, PREFIXO_ID } from "../config.js";
import type { Contexto, EmpresaCriada } from "../types.js";

export class EmpresasSeeder {
  constructor(private readonly ctx: Contexto) {}

  async executar(): Promise<EmpresaCriada[]> {
    const { prisma, ids, senhaHash } = this.ctx;
    const criadas: EmpresaCriada[] = [];

    for (const modelo of EMPRESAS) {
      const id = ids.proximo(PREFIXO_ID.empresa);
      const adminId = ids.proximo(PREFIXO_ID.usuario);

      await prisma.empresa.create({ data: { id, codigo: modelo.codigo, nome: modelo.nome } });
      await prisma.usuario.create({
        data: {
          id: adminId,
          empresaId: id,
          nome: modelo.admin.nome,
          email: modelo.admin.email,
          senhaHash,
          perfil: PerfilUsuario.ADMIN,
        },
      });

      criadas.push({ id, codigo: modelo.codigo, nome: modelo.nome, adminId });
    }

    return criadas;
  }
}

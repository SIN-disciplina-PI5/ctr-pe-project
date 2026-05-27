interface OrdemServicoCriada {
  id: string;
  empresaId: string;
  ativoId: string;
  numero: string;
  titulo: string;
  tipo: string;
}

interface PrismaTransaction {
  ativo: {
    update(args: unknown): Promise<unknown>;
  };
  paradaAtivo: {
    create(args: unknown): Promise<unknown>;
  };
}

export async function aplicarImpactoDisponibilidade(
  tx: PrismaTransaction,
  ordemServico: OrdemServicoCriada
) {
  await tx.ativo.update({
    where: {
      id: ordemServico.ativoId,
    },
    data: {
      status: "PARADO",
    },
  });

  await tx.paradaAtivo.create({
    data: {
      empresaId: ordemServico.empresaId,
      ativoId: ordemServico.ativoId,
      ordemServicoId: ordemServico.id,
      status: "ABERTA",
      motivo: `O.S. ${ordemServico.numero}: ${ordemServico.titulo}`,
      programada: ordemServico.tipo === "PREVENTIVA",
      impactaDisponibilidade: true,
    },
  });
}
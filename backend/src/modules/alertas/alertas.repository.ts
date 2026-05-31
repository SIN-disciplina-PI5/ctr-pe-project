import { prisma } from "../../prisma/prisma.client.js";
import type { Prisma, Severidade, StatusAlerta, TipoAlerta } from "@prisma/client";

const ABERTO_OU_LIDO: StatusAlerta[] = ["ABERTO", "LIDO"];

interface CreateEstoqueBaixoAlertaData {
  empresaId: string;
  materialId: string;
  materialCodigo: string;
  materialNome: string;
  estoqueAtual: string;
  estoqueMinimo: string;
}

interface CreateAlertaData {
  empresaId: string;
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
  severidade?: Severidade;
  ativoId?: string;
  ordemServicoId?: string;
  usuarioId?: string;
}

interface FindAllAlertasFilters {
  empresaId?: string;
  status?: StatusAlerta;
  tipo?: TipoAlerta;
  usuarioId?: string;
}

interface UpdateStatusData {
  status: StatusAlerta;
  lidoEm?: Date;
  resolvidoEm?: Date;
}

const alertaSelect = {
  id: true,
  empresaId: true,
  ativoId: true,
  ordemServicoId: true,
  usuarioId: true,
  tipo: true,
  severidade: true,
  status: true,
  titulo: true,
  mensagem: true,
  geradoEm: true,
  lidoEm: true,
  resolvidoEm: true,
  createdAt: true,
} satisfies Prisma.AlertaSelect;

export class AlertasRepository {
  async findAll(filters: FindAllAlertasFilters) {
    return prisma.alerta.findMany({
      where: {
        ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
        ...(filters.status !== undefined && { status: filters.status }),
        ...(filters.tipo !== undefined && { tipo: filters.tipo }),
        ...(filters.usuarioId !== undefined && { usuarioId: filters.usuarioId }),
      },
      orderBy: { createdAt: "desc" },
      select: alertaSelect,
    });
  }

  async findById(id: string) {
    return prisma.alerta.findUnique({
      where: { id },
      select: alertaSelect,
    });
  }

  async create(data: CreateAlertaData) {
    return prisma.alerta.create({
      data: {
        empresaId: data.empresaId,
        tipo: data.tipo,
        titulo: data.titulo,
        mensagem: data.mensagem,
        ...(data.severidade !== undefined && { severidade: data.severidade }),
        ...(data.ativoId !== undefined && { ativoId: data.ativoId }),
        ...(data.ordemServicoId !== undefined && {
          ordemServicoId: data.ordemServicoId,
        }),
        ...(data.usuarioId !== undefined && { usuarioId: data.usuarioId }),
      },
      select: alertaSelect,
    });
  }

  async updateStatus(id: string, data: UpdateStatusData) {
    return prisma.alerta.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.lidoEm !== undefined && { lidoEm: data.lidoEm }),
        ...(data.resolvidoEm !== undefined && { resolvidoEm: data.resolvidoEm }),
      },
      select: alertaSelect,
    });
  }

  async createAtivoParado(data: {
    empresaId: string;
    ativoId: string;
    motivo?: string;
  }) {
    const existente = await prisma.alerta.findFirst({
      where: {
        tipo: "ATIVO_PARADO",
        ativoId: data.ativoId,
        status: { in: ABERTO_OU_LIDO },
      },
      select: { id: true },
    });

    if (existente) return existente;

    const ativo = await prisma.ativo.findUnique({
      where: { id: data.ativoId },
      select: { codigo: true, nome: true, criticidade: true },
    });

    const severidade: Severidade =
      ativo?.criticidade === "CRITICA"
        ? "CRITICA"
        : ativo?.criticidade === "ALTA"
          ? "ALTA"
          : "MEDIA";

    return prisma.alerta.create({
      data: {
        empresaId: data.empresaId,
        ativoId: data.ativoId,
        tipo: "ATIVO_PARADO",
        severidade,
        status: "ABERTO",
        titulo: `Ativo parado: ${ativo?.nome ?? data.ativoId}`,
        mensagem:
          `O ativo ${ativo?.nome ?? ""} (${ativo?.codigo ?? data.ativoId}) está parado.` +
          (data.motivo ? ` Motivo: ${data.motivo}.` : ""),
      },
      select: alertaSelect,
    });
  }

  async createOSAguardandoPeca(data: {
    ordemServicoId: string;
    observacao?: string;
  }) {
    const existente = await prisma.alerta.findFirst({
      where: {
        tipo: "AGUARDANDO_PECA",
        ordemServicoId: data.ordemServicoId,
        status: { in: ABERTO_OU_LIDO },
      },
      select: { id: true },
    });

    if (existente) return existente;

    const os = await prisma.ordemServico.findUnique({
      where: { id: data.ordemServicoId },
      select: { empresaId: true, ativoId: true, numero: true, titulo: true },
    });

    if (!os) return null;

    return prisma.alerta.create({
      data: {
        empresaId: os.empresaId,
        ordemServicoId: data.ordemServicoId,
        ativoId: os.ativoId,
        tipo: "AGUARDANDO_PECA",
        severidade: "MEDIA",
        status: "ABERTO",
        titulo: `O.S. aguardando peça: ${os.numero}`,
        mensagem:
          `A O.S. ${os.numero} (${os.titulo}) está aguardando peça.` +
          (data.observacao ? ` Observação: ${data.observacao}.` : ""),
      },
      select: alertaSelect,
    });
  }

  async verificarOsAtrasadas(empresaId?: string) {
    const agora = new Date();

    const atrasadas = await prisma.ordemServico.findMany({
      where: {
        ...(empresaId !== undefined && { empresaId }),
        status: { notIn: ["ENCERRADA", "CANCELADA"] },
        prazoEm: { lt: agora },
      },
      select: {
        id: true,
        empresaId: true,
        ativoId: true,
        numero: true,
        titulo: true,
        prazoEm: true,
      },
    });

    const criados = [];

    for (const os of atrasadas) {
      const existente = await prisma.alerta.findFirst({
        where: {
          tipo: "OS_ATRASADA",
          ordemServicoId: os.id,
          status: { in: ABERTO_OU_LIDO },
        },
        select: { id: true },
      });

      if (existente) continue;

      const alerta = await prisma.alerta.create({
        data: {
          empresaId: os.empresaId,
          ordemServicoId: os.id,
          ativoId: os.ativoId,
          tipo: "OS_ATRASADA",
          severidade: "ALTA",
          status: "ABERTO",
          titulo: `O.S. atrasada: ${os.numero}`,
          mensagem:
            `A O.S. ${os.numero} (${os.titulo}) está atrasada. ` +
            `Prazo: ${os.prazoEm ? os.prazoEm.toISOString() : "indefinido"}.`,
        },
        select: { id: true },
      });

      criados.push(alerta);
    }

    return criados;
  }

  async findEstoqueBaixoAbertoPorMaterial(materialId: string) {
    return prisma.alerta.findFirst({
      where: {
        tipo: "ESTOQUE_BAIXO",
        status: { in: ABERTO_OU_LIDO },
        mensagem: { contains: materialId },
      },
      select: { id: true },
    });
  }

  async createEstoqueBaixo(data: CreateEstoqueBaixoAlertaData) {
    const alertaExistente = await this.findEstoqueBaixoAbertoPorMaterial(
      data.materialId,
    );

    if (alertaExistente) {
      return alertaExistente;
    }

    return prisma.alerta.create({
      data: {
        empresaId: data.empresaId,
        tipo: "ESTOQUE_BAIXO",
        severidade: "ALTA",
        status: "ABERTO",
        titulo: `Estoque baixo: ${data.materialNome}`,
        mensagem:
          `Material ${data.materialNome} (${data.materialCodigo}) ` +
          `está com estoque baixo. ` +
          `Estoque atual: ${data.estoqueAtual}. ` +
          `Estoque mínimo: ${data.estoqueMinimo}. ` +
          `materialId=${data.materialId}`,
      },
      select: {
        id: true,
        tipo: true,
        status: true,
        titulo: true,
        mensagem: true,
        createdAt: true,
      },
    });
  }
}

import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { prisma } from "../../prisma/prisma.client.js";
import type {
  CreatePlanoManutencaoDto,
  ListPlanosManutencaoDto,
  UpdatePlanoManutencaoDto,
} from "./dto/planos-manutencao.dto.js";

function addDays(base: Date, days: number): Date {
  const next = new Date(base.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function buildDescricaoOS(
  descricao: string,
  checklist: readonly string[],
): string {
  if (checklist.length === 0) return descricao;
  const formattedList = checklist
    .map((item, idx) => `[ ] ${idx + 1}. ${item}`)
    .join("\n");
  return `${descricao}\n\nChecklist da Manutenção Preventiva:\n${formattedList}`;
}

export class PlanosManutencaoService {
  constructor(private readonly db = prisma) {}

  async findAll(empresaId: string, filters: ListPlanosManutencaoDto) {
    return this.db.planoManutencao.findMany({
      where: {
        empresaId,
        ...(filters.ativoId ? { ativoId: filters.ativoId } : {}),
        ...(filters.ativo !== undefined ? { ativo: filters.ativo } : {}),
      },
      orderBy: [{ proximaExecucaoEm: "asc" }, { createdAt: "desc" }],
      include: {
        ativoRef: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            status: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
          },
        },
        materiais: {
          include: {
            material: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                unidade: true,
                estoqueAtual: true,
                custoMedio: true,
              },
            },
          },
        },
        _count: {
          select: { ordensServico: true },
        },
      },
    });
  }

  async findById(id: string, empresaId: string) {
    const plano = await this.db.planoManutencao.findFirst({
      where: { id, empresaId },
      include: {
        ativoRef: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            localizacaoId: true,
          },
        },
        responsavel: {
          select: { id: true, nome: true },
        },
        materiais: {
          include: {
            material: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                unidade: true,
                estoqueAtual: true,
                custoMedio: true,
              },
            },
          },
        },
      },
    });

    if (!plano) {
      throw new AppError({
        message: "Plano de manutenção preventiva não encontrado.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return plano;
  }

  async create(empresaId: string, input: CreatePlanoManutencaoDto) {
    const ativo = await this.db.ativo.findFirst({
      where: { id: input.ativoId, empresaId, ativo: true },
      select: { id: true },
    });

    if (!ativo) {
      throw new AppError({
        message: "Ativo não encontrado ou inativo.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    if (input.responsavelId) {
      await this.ensureResponsavelDaEmpresa(empresaId, input.responsavelId);
    }
    if (input.materiais && input.materiais.length > 0) {
      await this.ensureMateriaisDaEmpresa(
        empresaId,
        input.materiais.map((item) => item.materialId),
      );
    }

    const now = new Date();
    const proximaExecucaoEm = input.proximaExecucaoEm
      ? new Date(input.proximaExecucaoEm)
      : addDays(now, input.periodicidadeDias);

    return this.db.planoManutencao.create({
      data: {
        empresaId,
        ativoId: input.ativoId,
        ...(input.responsavelId ? { responsavelId: input.responsavelId } : {}),
        titulo: input.titulo,
        descricao: input.descricao,
        prioridade: input.prioridade,
        periodicidadeDias: input.periodicidadeDias,
        antecedenciaAlertaDias: input.antecedenciaAlertaDias,
        ...(input.checklist ? { checklist: input.checklist } : {}),
        proximaExecucaoEm,
        ...(input.materiais && input.materiais.length > 0
          ? {
              materiais: {
                create: input.materiais.map((item) => ({
                  materialId: item.materialId,
                  quantidade: item.quantidade,
                })),
              },
            }
          : {}),
      },
      include: {
        ativoRef: { select: { id: true, codigo: true, nome: true } },
        materiais: true,
      },
    });
  }

  async update(
    id: string,
    empresaId: string,
    input: UpdatePlanoManutencaoDto,
  ) {
    await this.findById(id, empresaId);

    if (typeof input.responsavelId === "string") {
      await this.ensureResponsavelDaEmpresa(empresaId, input.responsavelId);
    }

    return this.db.planoManutencao.update({
      where: { id },
      data: {
        ...(input.responsavelId !== undefined
          ? { responsavelId: input.responsavelId }
          : {}),
        ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
        ...(input.descricao !== undefined ? { descricao: input.descricao } : {}),
        ...(input.prioridade !== undefined
          ? { prioridade: input.prioridade }
          : {}),
        ...(input.periodicidadeDias !== undefined
          ? { periodicidadeDias: input.periodicidadeDias }
          : {}),
        ...(input.antecedenciaAlertaDias !== undefined
          ? { antecedenciaAlertaDias: input.antecedenciaAlertaDias }
          : {}),
        ...(input.checklist !== undefined ? { checklist: input.checklist } : {}),
        ...(input.proximaExecucaoEm !== undefined
          ? { proximaExecucaoEm: new Date(input.proximaExecucaoEm) }
          : {}),
        ...(input.ativo !== undefined ? { ativo: input.ativo } : {}),
      },
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findById(id, empresaId);
    await this.db.planoManutencao.delete({ where: { id } });
  }

  async gerarOrdemServico(
    id: string,
    empresaId: string,
    solicitanteId?: string,
    referenceDate = new Date(),
  ) {
    const plano = await this.findById(id, empresaId);

    const checklist = Array.isArray(plano.checklist)
      ? plano.checklist.filter((item): item is string => typeof item === "string")
      : [];

    const numero = await this.generateNextOSNumero(empresaId);
    const prazoEm = addDays(referenceDate, 2);

    const materiaisInsuficientes: string[] = [];
    for (const item of plano.materiais) {
      if (Number(item.material.estoqueAtual) < Number(item.quantidade)) {
        materiaisInsuficientes.push(
          `${item.material.codigo} (${item.material.nome})`,
        );
      }
    }

    const ordemServico = await this.db.$transaction(async (tx) => {
      const claimed = await tx.planoManutencao.updateMany({
        where: {
          id: plano.id,
          empresaId,
          ativo: true,
          proximaExecucaoEm: plano.proximaExecucaoEm,
        },
        data: {
          ultimaExecucaoEm: referenceDate,
          proximaExecucaoEm: addDays(referenceDate, plano.periodicidadeDias),
        },
      });

      if (claimed.count !== 1) {
        throw new AppError({
          message: "Plano já processado por outra execução ou está inativo.",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
      }

      const createdOS = await tx.ordemServico.create({
        data: {
          empresaId,
          ativoId: plano.ativoId,
          ...(plano.ativoRef.localizacaoId
            ? { localizacaoId: plano.ativoRef.localizacaoId }
            : {}),
          ...(solicitanteId ? { solicitanteId } : {}),
          ...(plano.responsavelId ? { responsavelId: plano.responsavelId } : {}),
          planoManutencaoId: plano.id,
          numero,
          titulo: `[Preventiva] ${plano.titulo}`,
          descricao: buildDescricaoOS(plano.descricao, checklist),
          tipo: "PREVENTIVA",
          prioridade: plano.prioridade,
          impactaDisponibilidade: false,
          prazoEm,
          ...(plano.materiais.length > 0
            ? {
                materiais: {
                  create: plano.materiais.map((item) => {
                    const qtd = Number(item.quantidade);
                    const unit = Number(item.material.custoMedio);
                    return {
                      materialId: item.materialId,
                      quantidade: qtd,
                      custoUnitario: unit,
                      custoTotal: qtd * unit,
                      status: "SOLICITADO",
                    };
                  }),
                },
              }
            : {}),
        },
      });

      if (materiaisInsuficientes.length > 0) {
        await tx.alerta.create({
          data: {
            empresaId,
            ativoId: plano.ativoId,
            ordemServicoId: createdOS.id,
            tipo: "ESTOQUE_BAIXO",
            severidade: "ALTA",
            titulo: `Peças insuficientes para preventiva ${createdOS.numero}`,
            mensagem: `A O.S. preventiva ${createdOS.numero} (${plano.ativoRef.codigo}) requer materiais sem saldo suficiente: ${materiaisInsuficientes.join(", ")}.`,
          },
        });
      }

      return createdOS;
    });

    return {
      ordemServico,
      materiaisInsuficientes,
    };
  }

  async processarPlanosVencidos(empresaId?: string, referenceDate = new Date()) {
    const planos = await this.db.planoManutencao.findMany({
      where: {
        ativo: true,
        ...(empresaId ? { empresaId } : {}),
      },
      include: {
        ativoRef: { select: { id: true, codigo: true, nome: true } },
      },
    });

    let osGeradas = 0;
    let alertasCriados = 0;

    for (const plano of planos) {
      if (plano.proximaExecucaoEm <= referenceDate) {
        await this.gerarOrdemServico(
          plano.id,
          plano.empresaId,
          undefined,
          referenceDate,
        );
        osGeradas += 1;
        continue;
      }

      const janelaAlerta = addDays(
        referenceDate,
        plano.antecedenciaAlertaDias,
      );
      if (plano.proximaExecucaoEm <= janelaAlerta) {
        const tituloAlerta = `Preventiva próxima: ${plano.titulo} (${plano.ativoRef.codigo})`;
        const jaExiste = await this.db.alerta.findFirst({
          where: {
            empresaId: plano.empresaId,
            ativoId: plano.ativoId,
            status: { in: ["ABERTO", "LIDO"] },
            titulo: tituloAlerta,
          },
          select: { id: true },
        });

        if (!jaExiste) {
          await this.db.alerta.create({
            data: {
              empresaId: plano.empresaId,
              ativoId: plano.ativoId,
              tipo: "OUTRO",
              severidade: "INFO",
              titulo: tituloAlerta,
              mensagem: `Manutenção preventiva "${plano.titulo}" programada para ${plano.proximaExecucaoEm.toISOString().slice(0, 10)}.`,
            },
          });
          alertasCriados += 1;
        }
      }
    }

    return {
      planosAvaliados: planos.length,
      osGeradas,
      alertasCriados,
    };
  }

  private async ensureResponsavelDaEmpresa(
    empresaId: string,
    responsavelId: string,
  ): Promise<void> {
    const responsavel = await this.db.usuario.findFirst({
      where: { id: responsavelId, empresaId, ativo: true },
      select: { id: true },
    });

    if (!responsavel) {
      throw new AppError({
        message: "Responsável não encontrado ou inativo.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
  }

  private async ensureMateriaisDaEmpresa(
    empresaId: string,
    materialIds: readonly string[],
  ): Promise<void> {
    const uniqueIds = [...new Set(materialIds)];
    if (uniqueIds.length !== materialIds.length) {
      throw new AppError({
        message: "Não repita materiais no mesmo plano.",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const materiais = await this.db.material.findMany({
      where: { id: { in: uniqueIds }, empresaId, ativo: true },
      select: { id: true },
    });

    if (materiais.length !== uniqueIds.length) {
      throw new AppError({
        message: "Um ou mais materiais não foram encontrados ou estão inativos.",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
  }

  private async generateNextOSNumero(empresaId: string): Promise<string> {
    const year = new Date().getUTCFullYear();
    const prefix = `OS-${year}-`;
    const count = await this.db.ordemServico.count({
      where: {
        empresaId,
        numero: { startsWith: prefix },
      },
    });
    return `${prefix}${String(count + 1).padStart(4, "0")}-${Math.floor(100 + Math.random() * 900)}`;
  }
}

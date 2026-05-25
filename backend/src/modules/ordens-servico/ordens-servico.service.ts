import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { OrdensServicoRepository } from "./ordens-servico.repository.js";

interface CreateOrdemServicoInput {
  empresaId: string;
  localizacaoId?: string;
  ativoId: string;

  solicitanteId?: string;
  responsavelId?: string;

  numero?: string;
  titulo: string;
  descricao: string;

  tipo?: "CORRETIVA" | "PREVENTIVA" | "INSPECAO" | "OUTRA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

  impactaDisponibilidade?: boolean;

  prazoEm?: string;

  diagnostico?: string;
  solucao?: string;
  observacao?: string;
}

interface UpdateOrdemServicoInput {
  localizacaoId?: string | null;
  solicitanteId?: string | null;
  responsavelId?: string | null;

  titulo?: string;
  descricao?: string;

  tipo?: "CORRETIVA" | "PREVENTIVA" | "INSPECAO" | "OUTRA";
  status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

  impactaDisponibilidade?: boolean;

  prazoEm?: string | null;

  diagnostico?: string | null;
  solucao?: string | null;
  observacao?: string | null;
}

interface FindAllFilters {
  empresaId?: string;
  ativoId?: string;
  responsavelId?: string;
  status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  search?: string;
}

export class OrdensServicoService {
  private ordensServicoRepository = new OrdensServicoRepository();

  async findAll(filters: FindAllFilters) {
    return this.ordensServicoRepository.findAll(filters);
  }

  async findById(id: string) {
    const ordemServico = await this.ordensServicoRepository.findById(id);

    if (!ordemServico) {
      throw new AppError({
        message: "Ordem de serviço não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return ordemServico;
  }

  async create(data: CreateOrdemServicoInput) {
    const ativo = await this.ordensServicoRepository.findAtivoById(data.ativoId);

    if (!ativo || !ativo.ativo) {
      throw new AppError({
        message: "Ativo não encontrado ou inativo",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    if (ativo.empresaId !== data.empresaId) {
      throw new AppError({
        message: "Ativo não pertence à empresa informada",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const numero = data.numero ?? (await this.generateNumero(data.empresaId));

    const numeroEmUso = await this.ordensServicoRepository.findByNumero(
      data.empresaId,
      numero
    );

    if (numeroEmUso) {
      throw new AppError({
        message: "Número da O.S. já está em uso nesta empresa",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    return this.ordensServicoRepository.create({
      empresaId: data.empresaId,
      ativoId: data.ativoId,
      numero,
      titulo: data.titulo,
      descricao: data.descricao,
      impactaDisponibilidade: data.impactaDisponibilidade ?? true,
      ...(data.localizacaoId !== undefined && { localizacaoId: data.localizacaoId }),
      ...(data.solicitanteId !== undefined && { solicitanteId: data.solicitanteId }),
      ...(data.responsavelId !== undefined && { responsavelId: data.responsavelId }),
      ...(data.tipo !== undefined && { tipo: data.tipo }),
      ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
      ...(data.prazoEm !== undefined && { prazoEm: new Date(data.prazoEm) }),
      ...(data.diagnostico !== undefined && { diagnostico: data.diagnostico }),
      ...(data.solucao !== undefined && { solucao: data.solucao }),
      ...(data.observacao !== undefined && { observacao: data.observacao }),
    });
  }

  async update(id: string, data: UpdateOrdemServicoInput) {
    await this.findById(id);

    return this.ordensServicoRepository.update(id, {
      ...(data.localizacaoId !== undefined && { localizacaoId: data.localizacaoId }),
      ...(data.solicitanteId !== undefined && { solicitanteId: data.solicitanteId }),
      ...(data.responsavelId !== undefined && { responsavelId: data.responsavelId }),
      ...(data.titulo !== undefined && { titulo: data.titulo }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.tipo !== undefined && { tipo: data.tipo }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
      ...(data.impactaDisponibilidade !== undefined && {
        impactaDisponibilidade: data.impactaDisponibilidade,
      }),
      ...(data.prazoEm !== undefined && {
        prazoEm: data.prazoEm === null ? null : new Date(data.prazoEm),
      }),
      ...(data.diagnostico !== undefined && { diagnostico: data.diagnostico }),
      ...(data.solucao !== undefined && { solucao: data.solucao }),
      ...(data.observacao !== undefined && { observacao: data.observacao }),
    });
  }

  private async generateNumero(empresaId: string) {
    const ano = new Date().getFullYear();

    for (let sequencial = 1; sequencial <= 9999; sequencial += 1) {
      const numero = `OS-${ano}-${String(sequencial).padStart(4, "0")}`;
      const existente = await this.ordensServicoRepository.findByNumero(
        empresaId,
        numero
      );

      if (!existente) {
        return numero;
      }
    }

    throw new AppError({
      message: "Não foi possível gerar número para a O.S.",
      statusCode: 500,
      errorCode: ErrorCode.INTERNAL_ERROR,
    });
  }
}
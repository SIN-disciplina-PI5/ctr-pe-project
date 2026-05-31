import type { TipoAcaoAuditoria } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { AuditoriaRepository } from "./auditoria.repository.js";

interface RegistrarAuditoriaInput {
  entidade: string;
  entidadeId: string;
  acao: TipoAcaoAuditoria;
  empresaId?: string | null;
  usuarioId?: string | null;
  antes?: unknown;
  depois?: unknown;
}

interface FindAllFilters {
  empresaId?: string;
  usuarioId?: string;
  entidade?: string;
  entidadeId?: string;
  acao?: TipoAcaoAuditoria;
  limit?: number;
}

export class AuditoriaService {
  private auditoriaRepository = new AuditoriaRepository();

  async registrar(input: RegistrarAuditoriaInput) {
    return this.auditoriaRepository.create(input);
  }

  async findAll(filters: FindAllFilters) {
    return this.auditoriaRepository.findAll(filters);
  }

  async findById(id: string) {
    const log = await this.auditoriaRepository.findById(id);

    if (!log) {
      throw new AppError({
        message: "Registro de auditoria não encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return log;
  }
}

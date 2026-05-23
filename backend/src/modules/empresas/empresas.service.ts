import { EmpresasRepository } from "./empresas.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  canCreateEmpresa,
  canUpdateEmpresa,
  canDeleteEmpresa,
} from "./empresas.policy.js";
import type { PerfilUsuario } from "@prisma/client";

interface Actor {
  userId: string;
  perfil: PerfilUsuario;
  empresaId: string;
}

interface CreateEmpresaInput {
  codigo?: string;
  nome: string;
  ativa?: boolean;
}

interface UpdateEmpresaInput {
  codigo?: string;
  nome?: string;
  ativa?: boolean;
}

interface FindAllFilters {
  search?: string;
  ativa?: boolean;
}

export class EmpresasService {
  private empresasRepository = new EmpresasRepository();

  async findAll(filters: FindAllFilters) {
    return this.empresasRepository.findAll(filters);
  }

  async findById(id: string) {
    const empresa = await this.empresasRepository.findById(id);

    if (!empresa)
      throw new AppError({
        message: "Empresa não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });

    return empresa;
  }

  async create(data: CreateEmpresaInput, actor: Actor) {
    canCreateEmpresa(actor);

    if (data.codigo) {
      const codigoEmUso = await this.empresasRepository.findByCodigo(
        data.codigo,
      );
      if (codigoEmUso)
        throw new AppError({
          message: "Código já está em uso",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
    }

    return this.empresasRepository.create(data);
  }

  async update(id: string, data: UpdateEmpresaInput, actor: Actor) {
    canUpdateEmpresa(actor);

    await this.findById(id);

    if (data.codigo) {
      const codigoEmUso =
        await this.empresasRepository.findByCodigo(data.codigo);
      if (codigoEmUso && codigoEmUso.id !== id) {
        throw new AppError({
          message: "Código já está em uso",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
      }
    }

    return this.empresasRepository.update(id, data);
  }

  async delete(id: string, actor: Actor) {
    canDeleteEmpresa(actor);

    await this.findById(id);
    return this.empresasRepository.delete(id);
  }
}

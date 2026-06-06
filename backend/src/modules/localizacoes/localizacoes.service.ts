import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { LocalizacoesRepository } from "./localizacoes.repository.js";

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativa?: boolean;
}

interface CreateLocalizacaoInput {
  empresaId: string;
  codigo: string;
  nome: string;
  tipo: string;
  ativa?: boolean;
}

interface UpdateLocalizacaoInput {
  codigo?: string;
  nome?: string;
  tipo?: string;
  ativa?: boolean;
}

export class LocalizacoesService {
  private localizacoesRepository = new LocalizacoesRepository();

  async findAll(filters: FindAllFilters) {
    return this.localizacoesRepository.findAll(filters);
  }

  async findById(id: string) {
    const localizacao = await this.localizacoesRepository.findById(id);

    if (!localizacao) {
      throw new AppError({
        message: "Localizacao nao encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return localizacao;
  }

  async create(data: CreateLocalizacaoInput) {
    const empresa = await this.localizacoesRepository.findEmpresaById(data.empresaId);

    if (!empresa || !empresa.ativa) {
      throw new AppError({
        message: "Empresa nao encontrada ou inativa",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const codigoEmUso = await this.localizacoesRepository.findByCodigo(
      data.empresaId,
      data.codigo,
    );

    if (codigoEmUso) {
      throw new AppError({
        message: "Codigo ja esta em uso nesta empresa",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    return this.localizacoesRepository.create(data);
  }

  async update(id: string, data: UpdateLocalizacaoInput) {
    const localizacao = await this.findById(id);

    if (data.codigo && data.codigo !== localizacao.codigo) {
      const codigoEmUso = await this.localizacoesRepository.findByCodigo(
        localizacao.empresaId,
        data.codigo,
      );

      if (codigoEmUso && codigoEmUso.id !== id) {
        throw new AppError({
          message: "Codigo ja esta em uso nesta empresa",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
      }
    }

    return this.localizacoesRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.localizacoesRepository.delete(id);
  }
}
import { LocalizacoesRepository } from "./localizacoes.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import {
  canCreateLocalizacao,
  canUpdateLocalizacao,
  canDeleteLocalizacao,
} from "./localizacoes.policy.js";
import type { PerfilUsuario } from "@prisma/client";

interface Actor {
  userId: string;
  perfil: PerfilUsuario;
  empresaId: string;
}

interface CreateLocalizacaoInput {
  codigo?: string;
  nome: string;
  tipo?: string;
  ativa?: boolean;
}

interface UpdateLocalizacaoInput {
  codigo?: string;
  nome?: string;
  tipo?: string;
  ativa?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativa?: boolean;
}

export class LocalizacoesService {
  private localizacoesRepository = new LocalizacoesRepository();

  async findAll(filters: FindAllFilters, actor: Actor) {
    // Garante escopo por empresa: usuários não-ADMIN só veem da própria empresa
    const empresaId =
      actor.perfil === "ADMIN"
        ? filters.empresaId
        : actor.empresaId;

    return this.localizacoesRepository.findAll({
      ...filters,
      empresaId,
    });
  }

  async findById(id: string, actor: Actor) {
    const localizacao = await this.localizacoesRepository.findById(id);

    if (!localizacao)
      throw new AppError({
        message: "Localização não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });

    // Garante escopo por empresa
    if (
      actor.perfil !== "ADMIN" &&
      localizacao.empresaId !== actor.empresaId
    ) {
      throw new AppError({
        message: "Acesso negado.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    return localizacao;
  }

  async create(data: CreateLocalizacaoInput, actor: Actor) {
    canCreateLocalizacao(actor);

    // Usa a empresa do actor (SUPERVISOR só cria na própria empresa)
    const empresaId = actor.empresaId;

    if (data.codigo) {
      const codigoEmUso = await this.localizacoesRepository.findByCodigo(
        empresaId,
        data.codigo,
      );
      if (codigoEmUso)
        throw new AppError({
          message: "Código já está em uso nesta empresa",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
    }

    return this.localizacoesRepository.create({ ...data, empresaId });
  }

  async update(id: string, data: UpdateLocalizacaoInput, actor: Actor) {
    canUpdateLocalizacao(actor);

    const localizacao = await this.findById(id, actor);

    if (data.codigo && data.codigo !== localizacao.codigo) {
      const codigoEmUso = await this.localizacoesRepository.findByCodigo(
        localizacao.empresaId,
        data.codigo,
      );
      if (codigoEmUso && codigoEmUso.id !== id) {
        throw new AppError({
          message: "Código já está em uso nesta empresa",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
      }
    }

    return this.localizacoesRepository.update(id, data);
  }

  async delete(id: string, actor: Actor) {
    canDeleteLocalizacao(actor);

    await this.findById(id, actor);
    return this.localizacoesRepository.delete(id);
  }
}

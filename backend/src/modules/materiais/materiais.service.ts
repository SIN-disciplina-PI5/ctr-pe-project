import { MateriaisRepository } from "./materiais.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { Prisma } from "@prisma/client";

interface CreateMaterialInput {
  empresaId: string;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade?: string;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  custoMedio?: number;
  ativo?: boolean;
}

interface UpdateMaterialInput {
  codigo?: string;
  nome?: string;
  descricao?: string;
  unidade?: string;
  estoqueMinimo?: number;
  custoMedio?: number;
  ativo?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  search?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
}

interface UpdateEstoqueInput {
  operacao: "ENTRADA" | "SAIDA" | "AJUSTE";
  quantidade?: number;
  novoEstoque?: number;
  motivo?: string;
}

export class MateriaisService {
  private materiaisRepository = new MateriaisRepository();

  async findAll(filters: FindAllFilters) {
    return this.materiaisRepository.findAll(filters);
  }

  async findById(id: string) {
    const material = await this.materiaisRepository.findById(id);

    if (!material) {
      throw new AppError({
        message: "Material não encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return material;
  }

  async create(data: CreateMaterialInput) {
    const codigoEmUso = await this.materiaisRepository.findByCodigo(
      data.empresaId,
      data.codigo
    );

    if (codigoEmUso) {
      throw new AppError({
        message: "Código já está em uso nesta empresa",
        statusCode: 409,
        errorCode: ErrorCode.CONFLICT,
      });
    }

    return this.materiaisRepository.create(data);
  }

  async update(id: string, data: UpdateMaterialInput) {
    const material = await this.findById(id);

    if (data.codigo && data.codigo !== material.codigo) {
      const codigoEmUso = await this.materiaisRepository.findByCodigo(
        material.empresaId,
        data.codigo
      );

      if (codigoEmUso) {
        throw new AppError({
          message: "Código já está em uso nesta empresa",
          statusCode: 409,
          errorCode: ErrorCode.CONFLICT,
        });
      }
    }

    return this.materiaisRepository.update(id, data);
  }

  async updateEstoque(id: string, input: UpdateEstoqueInput) {
    const material = await this.findById(id);

    const estoqueAtual = new Prisma.Decimal(material.estoqueAtual ?? 0);

    let novoEstoque: Prisma.Decimal;

    if (input.operacao === "ENTRADA") {
      if (input.quantidade === undefined || input.quantidade <= 0) {
        throw new AppError({
          message: "Quantidade válida é obrigatória para ENTRADA",
          statusCode: 400,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }

      novoEstoque = estoqueAtual.plus(new Prisma.Decimal(input.quantidade));
    } else if (input.operacao === "SAIDA") {
      if (input.quantidade === undefined || input.quantidade <= 0) {
        throw new AppError({
          message: "Quantidade válida é obrigatória para SAIDA",
          statusCode: 400,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }

      const quantidade = new Prisma.Decimal(input.quantidade);

      if (estoqueAtual.lessThan(quantidade)) {
        throw new AppError({
          message: "Estoque insuficiente",
          statusCode: 400,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }

      novoEstoque = estoqueAtual.minus(quantidade);
    } else {
      if (input.novoEstoque === undefined || input.novoEstoque < 0) {
        throw new AppError({
          message: "novoEstoque válido é obrigatório para AJUSTE",
          statusCode: 400,
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      }

      novoEstoque = new Prisma.Decimal(input.novoEstoque);
    }

    return this.materiaisRepository.updateEstoque(id, novoEstoque);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.materiaisRepository.delete(id);
  }
}
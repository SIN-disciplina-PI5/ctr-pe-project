import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { AlertasRepository } from "../alertas/alertas.repository.js";
import { MateriaisRepository } from "./materiais.repository.js";

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
  private alertasRepository = new AlertasRepository();

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

    const material = await this.materiaisRepository.create(data);

    const estoqueAtual = new Prisma.Decimal(material.estoqueAtual ?? 0);
    const estoqueMinimo = new Prisma.Decimal(material.estoqueMinimo ?? 0);

    if (estoqueAtual.lte(estoqueMinimo)) {
      await this.alertasRepository.createEstoqueBaixo({
        empresaId: material.empresaId,
        materialId: material.id,
        materialCodigo: material.codigo,
        materialNome: material.nome,
        estoqueAtual: estoqueAtual.toString(),
        estoqueMinimo: estoqueMinimo.toString(),
      });
    }

    return material;
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

    const materialAtualizado = await this.materiaisRepository.update(id, data);

    const estoqueAtual = new Prisma.Decimal(materialAtualizado.estoqueAtual ?? 0);
    const estoqueMinimo = new Prisma.Decimal(materialAtualizado.estoqueMinimo ?? 0);

    if (estoqueAtual.lte(estoqueMinimo)) {
      await this.alertasRepository.createEstoqueBaixo({
        empresaId: materialAtualizado.empresaId,
        materialId: materialAtualizado.id,
        materialCodigo: materialAtualizado.codigo,
        materialNome: materialAtualizado.nome,
        estoqueAtual: estoqueAtual.toString(),
        estoqueMinimo: estoqueMinimo.toString(),
      });
    }

    return materialAtualizado;
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

    const materialAtualizado = await this.materiaisRepository.updateEstoque(
      id,
      novoEstoque
    );

    const estoqueAtualizado = new Prisma.Decimal(materialAtualizado.estoqueAtual);
    const estoqueMinimo = new Prisma.Decimal(materialAtualizado.estoqueMinimo);

    if (estoqueAtualizado.lte(estoqueMinimo)) {
      await this.alertasRepository.createEstoqueBaixo({
        empresaId: material.empresaId,
        materialId: material.id,
        materialCodigo: material.codigo,
        materialNome: material.nome,
        estoqueAtual: estoqueAtualizado.toString(),
        estoqueMinimo: estoqueMinimo.toString(),
      });
    }

    return materialAtualizado;
  }

  async delete(id: string) {
    await this.findById(id);
    return this.materiaisRepository.delete(id);
  }
}
import { OrdensServicoMateriaisRepository } from "./ordens-servico-materiais.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { Prisma } from "@prisma/client";
import { OrdensServicoRepository } from "../ordens-servico/ordens-servico.repository.js";

interface CreateOSMaterialInput {
  materialId: string;
  quantidade: number;
  custoUnitario?: number;
}

interface UpdateOSMaterialInput {
  quantidade?: number;
  custoUnitario?: number;
}

export class OrdensServicoMateriaisService {
  private repository = new OrdensServicoMateriaisRepository();
  private ordensServicoRepository = new OrdensServicoRepository();

  async findByOrdemServico(ordemServicoId: string) {
    return this.repository.findByOrdemServico(ordemServicoId);
  }

  async findById(id: string) {
    const item = await this.repository.findById(id);

    if (!item) throw new AppError({ message: "Material da O.S. não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return item;
  }

  async create(ordemServicoId: string, data: CreateOSMaterialInput) {
    if (data.quantidade <= 0) {
      throw new AppError({
        message: "Quantidade deve ser maior que zero",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    const ordemServico = await this.ordensServicoRepository.findById(ordemServicoId);

    if (!ordemServico) {
      throw new AppError({
        message: "Ordem de serviço não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const material = await this.repository.findMaterialById(data.materialId);

    if (!material || !material.ativo) {
      throw new AppError({
        message: "Material não encontrado ou inativo",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const custoUnitario =
      data.custoUnitario !== undefined
        ? new Prisma.Decimal(data.custoUnitario)
        : material.custoMedio;

    return this.repository.create({
      ordemServicoId,
      materialId: data.materialId,
      quantidade: data.quantidade,
      custoUnitario,
    });
  }

  async update(id: string, data: UpdateOSMaterialInput) {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async consumir(id: string, quantidade?: number) {
    const item = await this.findById(id);

    if (item.status !== "SOLICITADO") throw new AppError({ message: "Apenas itens com status SOLICITADO podem ser consumidos", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const qtd = quantidade ?? Number(item.quantidade);

    const material = await this.repository.findMaterialById(item.materialId);

    if (!material) throw new AppError({ message: "Material não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    if (new Prisma.Decimal(material.estoqueAtual).lessThan(qtd)) throw new AppError({ message: "Estoque insuficiente", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    return this.repository.consumir(id, qtd);
  }

  async devolver(id: string, quantidade?: number) {
    const item = await this.findById(id);

    if (item.status !== "CONSUMIDO") throw new AppError({ message: "Apenas itens consumidos podem ser devolvidos", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const qtd = quantidade ?? Number(item.quantidade);

    return this.repository.devolver(id, qtd);
  }

  async cancelar(id: string) {
    const item = await this.findById(id);

    if (item.status === "CONSUMIDO") throw new AppError({ message: "Itens consumidos não podem ser cancelados, use devolver", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    if (item.status === "CANCELADO") throw new AppError({ message: "Item já cancelado", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    return this.repository.cancelar(id);
  }
}
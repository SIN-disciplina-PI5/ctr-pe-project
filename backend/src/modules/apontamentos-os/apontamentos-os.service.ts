import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { ApontamentosOSRepository } from "./apontamentos-os.repository.js";
import { OrdensServicoRepository } from "../ordens-servico/ordens-servico.repository.js";


interface CreateApontamentoInput {
  ordemServicoId: string;
  usuarioId: string;
  inicioEm: Date;
  descricao?: string;
  custoHora?: number;
}

interface UpdateApontamentoInput {
  inicioEm?: Date;
  fimEm?: Date;
  descricao?: string;
  custoHora?: number;
}

interface EncerrarApontamentoInput {
  fimEm?: Date;
}

export class ApontamentosOSService {
  private repository = new ApontamentosOSRepository();
  private ordensServicoRepository = new OrdensServicoRepository();

  async findByOrdemServico(ordemServicoId: string) {
    return this.repository.findByOrdemServico(ordemServicoId);
  }

  async findById(id: string) {
    const apontamento = await this.repository.findById(id);

    if (!apontamento) throw new AppError({ message: "Apontamento não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return apontamento;
  }

  async create(data: CreateApontamentoInput) {
    const ordemServico = await this.ordensServicoRepository.findById(data.ordemServicoId);

    if (!ordemServico) {
      throw new AppError({
        message: "Ordem de serviço não encontrada",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    const aberto = await this.repository.findAbertoPorUsuario(data.usuarioId);

    if (aberto) {
      throw new AppError({
        message: "Usuário já possui um apontamento em aberto",
        statusCode: 400,
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    return this.repository.create(data);
  }

  async update(id: string, data: UpdateApontamentoInput) {
    const apontamento = await this.findById(id);

    if (apontamento.fimEm) throw new AppError({ message: "Apontamento já encerrado não pode ser alterado", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const inicioEm = data.inicioEm ? new Date(data.inicioEm) : new Date(apontamento.inicioEm);
    const fimEm = data.fimEm ? new Date(data.fimEm) : null;

    if (fimEm && fimEm < inicioEm) throw new AppError({ message: "fimEm não pode ser anterior a inicioEm", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    return this.repository.update(id, {
      ...(data.inicioEm !== undefined && { inicioEm: new Date(data.inicioEm) }),
      ...(data.fimEm !== undefined && { fimEm: new Date(data.fimEm) }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.custoHora !== undefined && { custoHora: new Prisma.Decimal(data.custoHora) }),
    });
  }

  async encerrar(id: string, data: EncerrarApontamentoInput) {
    const apontamento = await this.findById(id);

    if (apontamento.fimEm) throw new AppError({ message: "Apontamento já encerrado", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const fimEm = data.fimEm ? new Date(data.fimEm) : new Date();
    const inicioEm = new Date(apontamento.inicioEm);

    if (fimEm < inicioEm) throw new AppError({ message: "fimEm não pode ser anterior a inicioEm", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const duracaoMinutos = Math.round((fimEm.getTime() - inicioEm.getTime()) / 60000);

    const custoHora = apontamento.custoHora ? new Prisma.Decimal(apontamento.custoHora) : null;
    const custoTotal = custoHora !== null ? new Prisma.Decimal(duracaoMinutos).div(60).times(custoHora) : null;

    return this.repository.encerrar(id, fimEm, duracaoMinutos, custoTotal);
  }

  async delete(id: string) {
    const apontamento = await this.findById(id);
    return this.repository.delete(id, apontamento.ordemServicoId);
  }
}
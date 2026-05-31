import { ParadasAtivosRepository } from "./paradas-ativos.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

interface CreateParadaAtivoInput {
  empresaId: string;
  ativoId: string;
  ordemServicoId?: string;
  inicioEm?: string;
  motivo?: string;
  programada?: boolean;
  impactaDisponibilidade?: boolean;
}

interface UpdateParadaAtivoInput {
  motivo?: string;
  programada?: boolean;
  impactaDisponibilidade?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  ativoId?: string;
  status?: "ABERTA" | "ENCERRADA" | "CANCELADA";
  from?: string;
  to?: string;
}

export class ParadasAtivosService {
  private paradasAtivosRepository = new ParadasAtivosRepository();

  async findAll(filters: FindAllFilters) {
    return this.paradasAtivosRepository.findAll({
      ...(filters.empresaId !== undefined && { empresaId: filters.empresaId }),
      ...(filters.ativoId !== undefined && { ativoId: filters.ativoId }),
      ...(filters.status !== undefined && { status: filters.status }),
      ...(filters.from !== undefined && { from: new Date(filters.from) }),
      ...(filters.to !== undefined && { to: new Date(filters.to) }),
    });
  }

  async findById(id: string) {
    const parada = await this.paradasAtivosRepository.findById(id);

    if (!parada) throw new AppError({ message: "Parada não encontrada", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return parada;
  }

  async create(data: CreateParadaAtivoInput) {
    const paradaAberta = await this.paradasAtivosRepository.findParadaAbertaByAtivo(data.ativoId);

    if (paradaAberta) throw new AppError({ message: "Ativo já possui uma parada aberta", statusCode: 409, errorCode: ErrorCode.CONFLICT });

    return this.paradasAtivosRepository.create({
      empresaId: data.empresaId,
      ativoId: data.ativoId,
      ...(data.ordemServicoId !== undefined && { ordemServicoId: data.ordemServicoId }),
      ...(data.inicioEm !== undefined && { inicioEm: new Date(data.inicioEm) }),
      ...(data.motivo !== undefined && { motivo: data.motivo }),
      ...(data.programada !== undefined && { programada: data.programada }),
      ...(data.impactaDisponibilidade !== undefined && { impactaDisponibilidade: data.impactaDisponibilidade }),
    });
  }

  async update(id: string, data: UpdateParadaAtivoInput) {
    await this.findById(id);
    return this.paradasAtivosRepository.update(id, data);
  }

  async encerrar(id: string, fimEm?: string) {
    const parada = await this.findById(id);

    if (parada.status !== "ABERTA") throw new AppError({ message: "Apenas paradas abertas podem ser encerradas", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    return this.paradasAtivosRepository.encerrar(id, fimEm ? new Date(fimEm) : new Date());
  }

  async cancelar(id: string, motivo?: string) {
    const parada = await this.findById(id);

    if (parada.status !== "ABERTA") throw new AppError({ message: "Apenas paradas abertas podem ser canceladas", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    return this.paradasAtivosRepository.cancelar(id, motivo);
  }
}
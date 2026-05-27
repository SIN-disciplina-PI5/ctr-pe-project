import { AtivosRepository } from "./ativos.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { TipoAtivo, StatusAtivo, Criticidade } from "@prisma/client";

interface CreateAtivoInput {
  empresaId: string;
  localizacaoId?: string;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: TipoAtivo;
  status?: StatusAtivo;
  criticidade?: Criticidade;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  placa?: string;
  horimetroAtual?: number;
  odometroAtual?: number;
  ativo?: boolean;
}

interface UpdateAtivoInput {
  localizacaoId?: string;
  codigo?: string;
  nome?: string;
  descricao?: string;
  tipo?: TipoAtivo;
  criticidade?: Criticidade;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  placa?: string;
  horimetroAtual?: number;
  odometroAtual?: number;
  ativo?: boolean;
}

interface FindAllFilters {
  empresaId?: string;
  localizacaoId?: string;
  status?: StatusAtivo;
  tipo?: TipoAtivo;
  criticidade?: Criticidade;
  search?: string;
}

export class AtivosService {
  private ativosRepository = new AtivosRepository();

  async findAll(filters: FindAllFilters) {
    return this.ativosRepository.findAll(filters);
  }

  async findById(id: string) {
    const ativo = await this.ativosRepository.findById(id);

    if (!ativo) throw new AppError({ message: "Ativo não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return ativo;
  }

  async create(data: CreateAtivoInput) {
    const codigoEmUso = await this.ativosRepository.findByCodigo(data.empresaId, data.codigo);

    if (codigoEmUso) throw new AppError({ message: "Código já está em uso nesta empresa", statusCode: 409, errorCode: ErrorCode.CONFLICT });

    return this.ativosRepository.create(data);
  }

  async update(id: string, data: UpdateAtivoInput) {
    const ativo = await this.findById(id);

    if (data.codigo && data.codigo !== ativo.codigo) {
      const codigoEmUso = await this.ativosRepository.findByCodigo(ativo.empresaId, data.codigo);
      if (codigoEmUso) throw new AppError({ message: "Código já está em uso nesta empresa", statusCode: 409, errorCode: ErrorCode.CONFLICT });
    }

    return this.ativosRepository.update(id, data);
  }

  async updateStatus(id: string, status: StatusAtivo) {
    await this.findById(id);
    return this.ativosRepository.updateStatus(id, status);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.ativosRepository.delete(id);
  }
}
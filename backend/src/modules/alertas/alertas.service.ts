import type { Severidade, StatusAlerta, TipoAlerta } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { AlertasRepository } from "./alertas.repository.js";

interface FindAllFilters {
  empresaId: string; // Obrigatório
  status?: StatusAlerta;
  tipo?: TipoAlerta;
  usuarioId?: string;
}

interface CreateAlertaInput {
  empresaId: string;
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
  severidade?: Severidade;
  ativoId?: string;
  ordemServicoId?: string;
  usuarioId?: string;
}

export class AlertasService {
  private alertasRepository = new AlertasRepository();

  async findAll(filters: FindAllFilters) {
    await this.alertasRepository.verificarOsAtrasadas(filters.empresaId);
    return this.alertasRepository.findAll(filters);
  }

  async findByUsuario(usuarioId: string, filters: FindAllFilters) {
    return this.alertasRepository.findAll({ ...filters, usuarioId });
  }

  async findById(id: string, empresaId: string) {
    const alerta = await this.alertasRepository.findById(id, empresaId);

    if (!alerta) {
      throw new AppError({
        message: "Alerta não encontrado",
        statusCode: 404,
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return alerta;
  }

  async create(data: CreateAlertaInput) {
    return this.alertasRepository.create(data);
  }

  async marcarComoLido(id: string, empresaId: string) {
    await this.findById(id, empresaId);
    return this.alertasRepository.updateStatus(id, empresaId, {
      status: "LIDO",
      lidoEm: new Date(),
    });
  }

  async resolver(id: string, empresaId: string) {
    await this.findById(id, empresaId);
    return this.alertasRepository.updateStatus(id, empresaId, {
      status: "RESOLVIDO",
      resolvidoEm: new Date(),
    });
  }

  async ignorar(id: string, empresaId: string) {
    await this.findById(id, empresaId);
    return this.alertasRepository.updateStatus(id, empresaId, { status: "IGNORADO" });
  }
}
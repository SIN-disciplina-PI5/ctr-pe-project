import { UsuariosRepository } from "./usuarios.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import bcrypt from "bcrypt";
import type { PerfilUsuario } from "@prisma/client";

interface CreateUsuarioInput {
  nome: string;
  email: string;
  password: string;
  perfil: PerfilUsuario;
  empresaId?: string;
}

interface UpdateUsuarioInput {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  empresaId?: string;
}

interface FindAllFilters {
  empresaId?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  search?: string;
}

export class UsuariosService {
  private usuariosRepository = new UsuariosRepository();

  async findAll(filters: FindAllFilters) {
    return this.usuariosRepository.findAll(filters);
  }

  async findById(id: string) {
    const user = await this.usuariosRepository.findById(id);

    if (!user) throw new AppError({ message: "Usuário não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return user;
  }

  async create(data: CreateUsuarioInput) {
    const emailEmUso = await this.usuariosRepository.findByEmail(data.email);

    if (emailEmUso) throw new AppError({ message: "Email já está em uso", statusCode: 409, errorCode: ErrorCode.CONFLICT });

    const saltRounds = parseInt(process.env["BCRYPT_SALT_ROUNDS"] ?? "10", 10);
    const senhaHash = await bcrypt.hash(data.password, saltRounds);

    return this.usuariosRepository.create({
      nome: data.nome,
      email: data.email,
      senhaHash,
      perfil: data.perfil,
      empresaId: data.empresaId,
    });
  }

  async update(id: string, data: UpdateUsuarioInput) {
    const user = await this.findById(id);

    if (data.email && data.email !== user.email) {
      const emailEmUso = await this.usuariosRepository.findByEmail(data.email);
      if (emailEmUso) throw new AppError({ message: "Email já está em uso", statusCode: 409, errorCode: ErrorCode.CONFLICT });
    }

    return this.usuariosRepository.update(id, data);
  }

  async resetPassword(id: string, novaSenha: string) {
    await this.findById(id);

    const saltRounds = parseInt(process.env["BCRYPT_SALT_ROUNDS"] ?? "10", 10);
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await this.usuariosRepository.updatePassword(id, senhaHash);

    return { message: "Senha resetada com sucesso" };
  }

  async delete(id: string) {
    await this.findById(id);
    return this.usuariosRepository.delete(id);
  }
}
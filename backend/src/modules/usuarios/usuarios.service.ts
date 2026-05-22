import { UsuariosRepository } from "./usuarios.repository.js";
import bcrypt from "bcrypt";
import type { PerfilUsuario } from "@prisma/client";

interface CreateUsuarioInput {
  nome: string;
  email: string;
  password: string;
  perfil: PerfilUsuario;
}

interface UpdateUsuarioInput {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
}

export class UsuariosService {
  private usuariosRepository = new UsuariosRepository();

  async findAll(empresaId: string) {
    return this.usuariosRepository.findAll({ empresaId });
  }

  async findById(id: string, empresaId: string) {
    const user = await this.usuariosRepository.findById(id, empresaId);

    if (!user) throw new Error("Usuário não encontrado");

    return user;
  }

  async create(empresaId: string, data: CreateUsuarioInput) {
    const emailEmUso = await this.usuariosRepository.findByEmail(data.email);

    if (emailEmUso) throw new Error("Email já está em uso");

    const saltRounds = parseInt(process.env["BCRYPT_SALT_ROUNDS"] ?? "10", 10);
    const senhaHash = await bcrypt.hash(data.password, saltRounds);

    return this.usuariosRepository.create({
      nome: data.nome,
      email: data.email,
      senhaHash,
      perfil: data.perfil,
      empresaId,
    });
  }

  async update(id: string, empresaId: string, data: UpdateUsuarioInput) {
    const user = await this.findById(id, empresaId);

    if (data.email && data.email !== user.email) {
      const emailEmUso = await this.usuariosRepository.findByEmail(data.email);

      if (emailEmUso) throw new Error("Email já está em uso");
    }

    return this.usuariosRepository.update(id, empresaId, data);
  }

  async delete(id: string, empresaId: string) {
    await this.findById(id, empresaId);

    return this.usuariosRepository.delete(id, empresaId);
  }
}
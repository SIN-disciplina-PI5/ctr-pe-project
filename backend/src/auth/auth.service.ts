import { AuthRepository } from "./auth.repository.js";
import { TokenService } from "./token.service.js";
import { AppError } from "../common/errors/AppError.js";
import { ErrorCode } from "../common/errors/error-code.js";
import bcrypt from "bcrypt";

export class AuthService {
  private authRepository = new AuthRepository();
  private tokenService = new TokenService();

  async me(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) throw new AppError({ message: "Usuário não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    if (newPassword !== confirmNewPassword) {
      throw new AppError({ message: "As senhas não coincidem", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });
    }

    const user = await this.authRepository.findByIdWithPassword(userId);

    if (!user) throw new AppError({ message: "Usuário não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    const passwordMatch = await bcrypt.compare(currentPassword, user.senhaHash);

    if (!passwordMatch) throw new AppError({ message: "Senha atual incorreta", statusCode: 400, errorCode: ErrorCode.VALIDATION_ERROR });

    const saltRounds = Number(process.env["BCRYPT_SALT_ROUNDS"]) || 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    await this.authRepository.updatePassword(userId, newHash);

    return { message: "Senha alterada com sucesso" };
  }

  async signIn(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) throw new AppError({ message: "Usuário não encontrado", statusCode: 404, errorCode: ErrorCode.NOT_FOUND });

    if (!user.ativo) throw new AppError({ message: "Usuário inativo", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });

    const passwordMatch = await bcrypt.compare(password, user.senhaHash);

    if (!passwordMatch) throw new AppError({ message: "Senha inválida", statusCode: 401, errorCode: ErrorCode.UNAUTHORIZED });

    const token = this.tokenService.generateToken({
      userId: user.id,
      perfil: user.perfil,
      empresaId: user.empresaId,
    });

    return { accessToken: token };
  }
}
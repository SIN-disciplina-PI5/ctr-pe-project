import type { AuthUser } from "../../common/types/auth-user.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

type Actor = AuthUser;

export function canReadLocalizacao(_actor: Actor) {
  // Todos os perfis autenticados podem visualizar localizações
  return true;
}

export function canCreateLocalizacao(actor: Actor) {
  if (actor.perfil !== "ADMIN" && actor.perfil !== "SUPERVISOR") {
    throw new AppError({
      message: "Apenas ADMIN ou SUPERVISOR podem criar localizações.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

export function canUpdateLocalizacao(actor: Actor) {
  if (actor.perfil !== "ADMIN" && actor.perfil !== "SUPERVISOR") {
    throw new AppError({
      message: "Apenas ADMIN ou SUPERVISOR podem editar localizações.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

export function canDeleteLocalizacao(actor: Actor) {
  if (actor.perfil !== "ADMIN" && actor.perfil !== "SUPERVISOR") {
    throw new AppError({
      message: "Apenas ADMIN ou SUPERVISOR podem inativar localizações.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

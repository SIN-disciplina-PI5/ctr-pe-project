import type { PerfilUsuario } from "@prisma/client";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

type Actor = {
  userId: string;
  perfil: PerfilUsuario;
  empresaId: string;
};

export function canReadEmpresa(actor: Actor) {
  // Todos os perfis autenticados podem listar empresas
  return true;
}

export function canCreateEmpresa(actor: Actor) {
  if (actor.perfil !== "ADMIN") {
    throw new AppError({
      message: "Apenas ADMIN pode criar empresas.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

export function canUpdateEmpresa(actor: Actor) {
  if (actor.perfil !== "ADMIN") {
    throw new AppError({
      message: "Apenas ADMIN pode editar empresas.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

export function canDeleteEmpresa(actor: Actor) {
  if (actor.perfil !== "ADMIN") {
    throw new AppError({
      message: "Apenas ADMIN pode inativar empresas.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
}

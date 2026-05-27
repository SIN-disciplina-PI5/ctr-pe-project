import type { Request, Response, NextFunction } from "express";
import { UsuariosService } from "./usuarios.service.js";
import type { PerfilUsuario } from "@prisma/client";
import { canReadUsuario } from "./usuarios.policy.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

const usuariosService = new UsuariosService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, perfil, ativo, search } = req.query as {
      empresaId?: string;
      perfil?: PerfilUsuario;
      ativo?: string;
      search?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(perfil !== undefined && { perfil }),
      ...(ativo !== undefined && { ativo: ativo === "true" }),
      ...(search !== undefined && { search }),
    };

    const result = await usuariosService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };

    if (!canReadUsuario(actor, id)) {
      throw new AppError({ message: "Sem permissão para esta ação", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await usuariosService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await usuariosService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await usuariosService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { novaSenha } = req.body as { novaSenha: string };
    const result = await usuariosService.resetPassword(id, novaSenha);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await usuariosService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}


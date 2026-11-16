import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";
import type {
  CreatePlanoManutencaoDto,
  ListPlanosManutencaoDto,
  UpdatePlanoManutencaoDto,
} from "./dto/planos-manutencao.dto.js";
import { PlanosManutencaoService } from "./planos-manutencao.service.js";

const service = new PlanosManutencaoService();

function requireEmpresaId(req: Request): { empresaId: string; userId: string } {
  const user = getCurrentUser(req);
  if (!user.empresaId) {
    throw new AppError({
      message: "Usuário sem empresa vinculada.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    });
  }
  return { empresaId: user.empresaId, userId: user.id };
}

export async function findAllPlanos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    const filters = req.query as unknown as ListPlanosManutencaoDto;
    const data = await service.findAll(empresaId, filters);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function findPlanoById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    const data = await service.findById(String(req.params["id"]), empresaId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function createPlano(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    const data = await service.create(
      empresaId,
      req.body as CreatePlanoManutencaoDto,
    );
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

export async function updatePlano(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    const data = await service.update(
      String(req.params["id"]),
      empresaId,
      req.body as UpdatePlanoManutencaoDto,
    );
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function removePlano(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    await service.remove(String(req.params["id"]), empresaId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function gerarOSDoPlano(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId, userId } = requireEmpresaId(req);
    const result = await service.gerarOrdemServico(
      String(req.params["id"]),
      empresaId,
      userId,
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function processarPlanosVencidos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { empresaId } = requireEmpresaId(req);
    const result = await service.processarPlanosVencidos(empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

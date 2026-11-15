import type { Request, Response, NextFunction } from "express";
import { EstoqueForecastService } from "./estoque-forecast.service.js";
import { MateriaisService } from "./materiais.service.js";
import { getCurrentCompanyUser } from "../../common/utils/get-current-user.js";

const materiaisService = new MateriaisService();
const estoqueForecastService = new EstoqueForecastService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { search, ativo, estoqueBaixo } = req.query as {
      search?: string;
      ativo?: string;
      estoqueBaixo?: string;
    };

    const filters = {
      empresaId: currentUser.empresaId, // Força a empresa do usuário autenticado
      ...(search !== undefined && { search }),
      ...(ativo !== undefined && { ativo: ativo === "true" }),
      ...(estoqueBaixo !== undefined && { estoqueBaixo: estoqueBaixo === "true" }),
    };

    const result = await materiaisService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { id } = req.params as { id: string };
    const result = await materiaisService.findById(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { empresaId: _, ...bodyData } = req.body; // Ignora empresaId vindo no body

    const result = await materiaisService.create({
      ...bodyData,
      empresaId: currentUser.empresaId, // Força empresa do usuário logado
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { id } = req.params as { id: string };
    const { empresaId: _, ...bodyData } = req.body; // Ignora empresaId vindo no body

    const result = await materiaisService.update(id, currentUser.empresaId, bodyData);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateEstoque(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { id } = req.params as { id: string };

    const result = await materiaisService.updateEstoque(id, currentUser.empresaId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { id } = req.params as { id: string };

    await materiaisService.delete(id, currentUser.empresaId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getPrevisaoRupturaEmpresa(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const janelaDias = req.query.janelaDias ? Number(req.query.janelaDias) : undefined;
    const horizonteAlertaDias = req.query.horizonteAlertaDias
      ? Number(req.query.horizonteAlertaDias)
      : undefined;
    const result = await estoqueForecastService.calcularPrevisaoEmpresa(currentUser.empresaId, {
      ...(janelaDias !== undefined && !Number.isNaN(janelaDias) && { janelaDias }),
      ...(horizonteAlertaDias !== undefined &&
        !Number.isNaN(horizonteAlertaDias) && { horizonteAlertaDias }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPrevisaoRupturaMaterial(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const { id } = req.params as { id: string };
    const result = await estoqueForecastService.calcularPrevisaoMaterial(
      currentUser.empresaId,
      id,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verificarPrevisaoRupturaEmpresa(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUser = getCurrentCompanyUser(req);
    const result = await estoqueForecastService.processarAlertasRupturaEmpresa(
      currentUser.empresaId,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

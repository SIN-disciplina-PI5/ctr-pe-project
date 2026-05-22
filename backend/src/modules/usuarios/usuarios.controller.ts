import type { Request, Response, NextFunction } from "express";
import { UsuariosService } from "./usuarios.service.js";

const usuariosService = new UsuariosService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = req.user?.empresaId;
    if (!empresaId) throw new Error("Usuário não autenticado");

    const result = await usuariosService.findAll(empresaId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = req.user?.empresaId;
    if (!empresaId) throw new Error("Usuário não autenticado");

    const id = req.params.id as string;

    const result = await usuariosService.findById(id, empresaId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = req.user?.empresaId;
    if (!empresaId) throw new Error("Usuário não autenticado");

    const result = await usuariosService.create(empresaId, req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = req.user?.empresaId;
    if (!empresaId) throw new Error("Usuário não autenticado");

    const id = req.params.id as string;

    const result = await usuariosService.update(id, empresaId, req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = req.user?.empresaId;
    if (!empresaId) throw new Error("Usuário não autenticado");

    const id = req.params.id as string;

    await usuariosService.delete(id, empresaId);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
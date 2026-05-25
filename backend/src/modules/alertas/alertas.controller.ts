import type { NextFunction, Request, Response } from "express";
import { AlertasRepository } from "./alertas.repository.js";

const alertasRepository = new AlertasRepository();

export async function findAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { empresaId, status, tipo } = req.query as {
      empresaId?: string;
      status?: string;
      tipo?: string;
    };

    const alertas = await alertasRepository.findAll({
      empresaId,
      status,
      tipo,
    });

    return res.status(200).json(alertas);
  } catch (error) {
    next(error);
  }
}
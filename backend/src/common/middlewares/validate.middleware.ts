import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

type ValidateTarget = "body" | "params" | "query";

export function validate(schema: z.ZodType, target: ValidateTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req[target]);
      req[target] = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError({
            message: "Dados inválidos.",
            statusCode: 400,
            errorCode: ErrorCode.VALIDATION_ERROR,
            details: z.flattenError(error),
          }),
        );
      }

      next(error);
    }
  };
}

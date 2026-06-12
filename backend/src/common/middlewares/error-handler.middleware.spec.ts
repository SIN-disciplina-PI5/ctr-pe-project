import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { errorHandlerMiddleware } from "./error-handler.middleware.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn<typeof res.status>().mockReturnValue(res);
  res.json = jest.fn<typeof res.json>().mockReturnValue(res);
  return res;
}

describe("errorHandlerMiddleware", () => {
  let res: Response;
  let req: Request;
  let next: NextFunction;

  beforeEach(() => {
    jest.restoreAllMocks();
    res = makeResponse();
    req = { traceId: "trace-123" } as Request;
    next = jest.fn();
  });

  it("should responder AppError com status correto", () => {
    const err = new AppError({
      message: "Sem permissão",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
      details: { campo: "x" },
    });

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Sem permissão",
        errorCode: ErrorCode.FORBIDDEN,
        statusCode: 403,
        traceId: "trace-123",
        details: { campo: "x" },
      }),
    );
  });

  it("should responder 500 para erro desconhecido", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("falha interna");

    errorHandlerMiddleware(err, req, res, next);

    expect(errorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Erro interno do servidor.",
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: 500,
        traceId: "trace-123",
      }),
    );
  });
});
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { AppError } from "./common/errors/AppError.js";
import { ErrorCode } from "./common/errors/error-code.js";
import { errorHandlerMiddleware } from "./common/middlewares/error-handler.middleware.js";
import { requestContextMiddleware } from "./common/middlewares/request-context.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(requestContextMiddleware);
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "ctrpe-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/", (_req, _res, next) => {
  next(
    new AppError({
      message: "Rota não encontrada.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    }),
  );
});

app.use((_req, _res, next) => {
  next(
    new AppError({
      message: "Rota não encontrada.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    }),
  );
});

app.use(errorHandlerMiddleware);

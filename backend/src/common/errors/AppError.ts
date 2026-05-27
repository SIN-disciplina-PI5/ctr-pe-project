import { ErrorCode } from "./error-code.js";

type AppErrorParams = {
  message: string;
  statusCode?: number;
  errorCode?: ErrorCode;
  details?: unknown;
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;

  constructor({
    message,
    statusCode = 500,
    errorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    details,
  }: AppErrorParams) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

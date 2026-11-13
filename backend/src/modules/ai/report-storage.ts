import { del, get, put } from "@vercel/blob";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

export interface UploadReportFileInput {
  readonly pathname: string;
  readonly bytes: Uint8Array;
  readonly contentType: "application/pdf";
}

export interface UploadedReportFile {
  readonly pathname: string;
  readonly contentType: string;
}

export interface StoredReportContent {
  readonly stream: ReadableStream<Uint8Array>;
  readonly contentType: string;
  readonly size: number | null;
  readonly etag: string;
}

export interface ReportStorage {
  upload(input: UploadReportFileInput): Promise<UploadedReportFile>;
  get(pathname: string): Promise<StoredReportContent | null>;
  delete(pathname: string): Promise<void>;
}

interface BlobSdk {
  readonly put: typeof put;
  readonly get: typeof get;
  readonly del: typeof del;
}

const defaultBlobSdk: BlobSdk = { put, get, del };

function storageFailure(message: string): AppError {
  return new AppError({
    message,
    statusCode: 502,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
  });
}

export class VercelBlobReportStorage implements ReportStorage {
  constructor(
    private readonly token: string,
    private readonly sdk: BlobSdk = defaultBlobSdk,
  ) {
    if (!token.trim()) throw new Error("BLOB_READ_WRITE_TOKEN não definido.");
  }

  async upload(input: UploadReportFileInput): Promise<UploadedReportFile> {
    try {
      const result = await this.sdk.put(
        input.pathname,
        Buffer.from(input.bytes),
        {
          access: "private",
          addRandomSuffix: false,
          contentType: input.contentType,
          token: this.token,
        },
      );

      return {
        pathname: result.pathname,
        contentType: result.contentType,
      };
    } catch {
      throw storageFailure("Não foi possível armazenar o relatório.");
    }
  }

  async get(pathname: string): Promise<StoredReportContent | null> {
    try {
      const result = await this.sdk.get(pathname, {
        access: "private",
        token: this.token,
      });
      if (!result || result.statusCode !== 200 || !result.stream) return null;

      return {
        stream: result.stream,
        contentType: result.blob.contentType,
        size: result.blob.size,
        etag: result.blob.etag,
      };
    } catch {
      throw storageFailure("Não foi possível recuperar o relatório.");
    }
  }

  async delete(pathname: string): Promise<void> {
    try {
      await this.sdk.del(pathname, { token: this.token });
    } catch {
      throw storageFailure("Não foi possível remover o relatório.");
    }
  }
}

export function createReportStorage(
  environment: NodeJS.ProcessEnv = process.env,
): ReportStorage {
  const token = environment["BLOB_READ_WRITE_TOKEN"]?.trim();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN não definido.");
  return new VercelBlobReportStorage(token);
}

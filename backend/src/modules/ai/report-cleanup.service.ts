import type { ReportFileRepositoryPort } from "./report-file.repository.js";
import type { ReportStorage } from "./report-storage.js";

const DEFAULT_CLEANUP_BATCH_SIZE = 100;

export interface ReportCleanupSummary {
  readonly examined: number;
  readonly deleted: number;
  readonly failed: number;
}

export interface ReportCleanupServiceOptions {
  readonly batchSize?: number;
  readonly now?: () => Date;
}

export class ReportCleanupService {
  private readonly batchSize: number;
  private readonly now: () => Date;

  constructor(
    private readonly storage: ReportStorage,
    private readonly repository: ReportFileRepositoryPort,
    options: ReportCleanupServiceOptions = {},
  ) {
    this.batchSize = options.batchSize ?? DEFAULT_CLEANUP_BATCH_SIZE;
    this.now = options.now ?? (() => new Date());

    if (
      !Number.isInteger(this.batchSize) ||
      this.batchSize <= 0 ||
      this.batchSize > DEFAULT_CLEANUP_BATCH_SIZE
    ) {
      throw new Error("batchSize deve ser um inteiro entre 1 e 100.");
    }
  }

  async cleanupExpired(): Promise<ReportCleanupSummary> {
    const expiresBefore = this.now();
    const expired = await this.repository.findExpired(
      expiresBefore,
      this.batchSize,
    );
    let deleted = 0;
    let failed = 0;

    for (const report of expired) {
      try {
        await this.storage.delete(report.storagePathname);
        const metadataDeleted = await this.repository.deleteExpired(
          report.id,
          expiresBefore,
        );
        if (metadataDeleted) deleted += 1;
      } catch {
        failed += 1;
      }
    }

    return {
      examined: expired.length,
      deleted,
      failed,
    };
  }
}

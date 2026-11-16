// Espelham o contrato de /api/ai/reports (backend: report-job.types.ts).

export type ReportType = "monthly_maintenance" | "asset_costs" | "availability";

export type ReportJobStatus = "queued" | "running" | "done" | "failed";

export type ReportJob = {
  id: string;
  status: ReportJobStatus;
  request: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  nextAttemptAt: string | null;
  error: { code: string; message: string } | null;
  reportFileId: string | null;
  report: {
    title: string;
    type: ReportType;
    sizeBytes: number;
    expiresAt: string;
  } | null;
  expired: boolean;
  downloadUrl: string | null;
};

export type ListReportsParams = {
  status?: ReportJobStatus;
  page?: number;
  pageSize?: number;
};

export type ListReportsResponse = {
  items: ReportJob[];
  total: number;
  page: number;
  pageSize: number;
  hasActiveJobs: boolean;
};

export type CreateReportInput = {
  reportType?: ReportType;
  period?: { start: string; end: string };
  request?: string;
};

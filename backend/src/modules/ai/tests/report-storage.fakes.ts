import type {
  CreateReportFileInput,
  ReportFileRecord,
  ReportFileRepositoryPort,
  ReportFileScope,
} from "../report-file.repository.js";
import type {
  ReportStorage,
  StoredReportContent,
  UploadReportFileInput,
  UploadedReportFile,
} from "../report-storage.js";

/** Storage privado em memória, com a mesma semântica do Vercel Blob. */
export class InMemoryReportStorage implements ReportStorage {
  readonly objects = new Map<string, Uint8Array>();
  readonly deleted: string[] = [];
  failUpload = false;
  failDeleteFor = new Set<string>();

  async upload(input: UploadReportFileInput): Promise<UploadedReportFile> {
    if (this.failUpload) throw new Error("upload indisponível");
    this.objects.set(input.pathname, input.bytes);
    return { pathname: input.pathname, contentType: input.contentType };
  }

  async get(pathname: string): Promise<StoredReportContent | null> {
    const bytes = this.objects.get(pathname);
    if (!bytes) return null;
    return {
      stream: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
      contentType: "application/pdf",
      size: bytes.byteLength,
      etag: `etag-${pathname}`,
    };
  }

  async delete(pathname: string): Promise<void> {
    if (this.failDeleteFor.has(pathname)) throw new Error("delete indisponível");
    this.deleted.push(pathname);
    this.objects.delete(pathname);
  }
}

type MutableRecord = { -readonly [K in keyof ReportFileRecord]: ReportFileRecord[K] };

/** Metadados em memória, filtrando por empresa e usuário como o Prisma. */
export class InMemoryReportFileRepository implements ReportFileRepositoryPort {
  readonly records = new Map<string, MutableRecord>();
  failCreate: Error | null = null;
  private sequence = 0;

  constructor(private readonly now: () => Date = () => new Date()) {}

  async create(input: CreateReportFileInput): Promise<ReportFileRecord> {
    if (this.failCreate) throw this.failCreate;
    this.sequence += 1;
    const record: MutableRecord = {
      id: `arquivo-${this.sequence}`,
      ...input,
      createdAt: this.now(),
    };
    this.records.set(record.id, record);
    return { ...record };
  }

  async findOwned(id: string, scope: ReportFileScope) {
    const record = this.records.get(id);
    if (!record || record.empresaId !== scope.empresaId || record.usuarioId !== scope.usuarioId) {
      return null;
    }
    return { ...record };
  }

  async findExpired(expiresBefore: Date, limit: number) {
    return [...this.records.values()]
      .filter((record) => record.expiresAt.getTime() <= expiresBefore.getTime())
      .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime())
      .slice(0, limit)
      .map((record) => ({ ...record }));
  }

  async deleteExpired(id: string, expiresBefore: Date) {
    const record = this.records.get(id);
    if (!record || record.expiresAt.getTime() > expiresBefore.getTime()) return false;
    return this.records.delete(id);
  }

  async deleteById(id: string) {
    return this.records.delete(id);
  }
}

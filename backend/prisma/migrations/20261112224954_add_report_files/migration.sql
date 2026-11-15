-- CreateTable
CREATE TABLE "RelatorioArquivo" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "tamanhoBytes" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelatorioArquivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RelatorioArquivo_empresaId_createdAt_idx" ON "RelatorioArquivo"("empresaId", "createdAt");

-- AddForeignKey
ALTER TABLE "RelatorioArquivo" ADD CONSTRAINT "RelatorioArquivo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

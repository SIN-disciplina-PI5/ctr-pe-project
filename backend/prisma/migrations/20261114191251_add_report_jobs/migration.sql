/*
  Warnings:

  - You are about to drop the `RelatorioArquivo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusJobRelatorioIA" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'FAILED');

-- DropForeignKey
ALTER TABLE "RelatorioArquivo" DROP CONSTRAINT "RelatorioArquivo_empresaId_fkey";

-- DropTable
DROP TABLE "RelatorioArquivo";

-- CreateTable
CREATE TABLE "JobRelatorioIA" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "solicitacao" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "StatusJobRelatorioIA" NOT NULL DEFAULT 'QUEUED',
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "triggerRunId" TEXT,
    "erro" TEXT,
    "arquivoRelatorioIAId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "JobRelatorioIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRelatorioIA_triggerRunId_key" ON "JobRelatorioIA"("triggerRunId");

-- CreateIndex
CREATE UNIQUE INDEX "JobRelatorioIA_arquivoRelatorioIAId_key" ON "JobRelatorioIA"("arquivoRelatorioIAId");

-- CreateIndex
CREATE INDEX "JobRelatorioIA_empresaId_usuarioId_createdAt_idx" ON "JobRelatorioIA"("empresaId", "usuarioId", "createdAt");

-- CreateIndex
CREATE INDEX "JobRelatorioIA_status_updatedAt_idx" ON "JobRelatorioIA"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobRelatorioIA_empresaId_usuarioId_idempotencyKey_key" ON "JobRelatorioIA"("empresaId", "usuarioId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_arquivoRelatorioIAId_fkey" FOREIGN KEY ("arquivoRelatorioIAId") REFERENCES "ArquivoRelatorioIA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

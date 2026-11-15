-- CreateEnum
CREATE TYPE "StatusJobRelatorioIA" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "JobRelatorioIA" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "chaveIdempotencia" TEXT NOT NULL,
    "solicitacao" TEXT NOT NULL,
    "status" "StatusJobRelatorioIA" NOT NULL DEFAULT 'QUEUED',
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "maxTentativas" INTEGER NOT NULL DEFAULT 3,
    "disponivelEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseToken" TEXT,
    "leaseAte" TIMESTAMP(3),
    "iniciadoEm" TIMESTAMP(3),
    "concluidoEm" TIMESTAMP(3),
    "erroCodigo" TEXT,
    "erroMensagem" TEXT,
    "arquivoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobRelatorioIA_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "JobRelatorioIA_tentativas_check" CHECK ("tentativas" >= 0 AND "tentativas" <= "maxTentativas"),
    CONSTRAINT "JobRelatorioIA_maxTentativas_check" CHECK ("maxTentativas" BETWEEN 1 AND 10)
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRelatorioIA_arquivoId_key" ON "JobRelatorioIA"("arquivoId");

-- CreateIndex
CREATE UNIQUE INDEX "JobRelatorioIA_empresaId_usuarioId_chaveIdempotencia_key" ON "JobRelatorioIA"("empresaId", "usuarioId", "chaveIdempotencia");

-- CreateIndex
CREATE INDEX "JobRelatorioIA_status_disponivelEm_idx" ON "JobRelatorioIA"("status", "disponivelEm");

-- CreateIndex
CREATE INDEX "JobRelatorioIA_status_leaseAte_idx" ON "JobRelatorioIA"("status", "leaseAte");

-- CreateIndex
CREATE INDEX "JobRelatorioIA_empresaId_usuarioId_createdAt_idx" ON "JobRelatorioIA"("empresaId", "usuarioId", "createdAt");

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRelatorioIA" ADD CONSTRAINT "JobRelatorioIA_arquivoId_fkey" FOREIGN KEY ("arquivoId") REFERENCES "ArquivoRelatorioIA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

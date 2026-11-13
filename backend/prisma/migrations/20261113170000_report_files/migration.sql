-- CreateEnum
CREATE TYPE "TipoRelatorioIA" AS ENUM ('MANUTENCAO_MENSAL', 'CUSTOS_POR_ATIVO', 'DISPONIBILIDADE');

-- CreateTable
CREATE TABLE "ArquivoRelatorioIA" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" "TipoRelatorioIA" NOT NULL,
    "titulo" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "storagePathname" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArquivoRelatorioIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArquivoRelatorioIA_storagePathname_key" ON "ArquivoRelatorioIA"("storagePathname");

-- CreateIndex
CREATE INDEX "ArquivoRelatorioIA_empresaId_createdAt_idx" ON "ArquivoRelatorioIA"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "ArquivoRelatorioIA_empresaId_usuarioId_createdAt_idx" ON "ArquivoRelatorioIA"("empresaId", "usuarioId", "createdAt");

-- CreateIndex
CREATE INDEX "ArquivoRelatorioIA_expiresAt_idx" ON "ArquivoRelatorioIA"("expiresAt");

-- AddForeignKey
ALTER TABLE "ArquivoRelatorioIA" ADD CONSTRAINT "ArquivoRelatorioIA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArquivoRelatorioIA" ADD CONSTRAINT "ArquivoRelatorioIA_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

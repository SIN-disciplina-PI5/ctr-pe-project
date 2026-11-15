-- AlterTable
ALTER TABLE "OrdemServico" ADD COLUMN     "planoManutencaoId" TEXT;

-- CreateTable
CREATE TABLE "PlanoManutencao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "ativoId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA',
    "periodicidadeDias" INTEGER NOT NULL,
    "antecedenciaAlertaDias" INTEGER NOT NULL DEFAULT 3,
    "checklist" JSONB,
    "ultimaExecucaoEm" TIMESTAMP(3),
    "proximaExecucaoEm" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoManutencao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoManutencaoMaterial" (
    "id" TEXT NOT NULL,
    "planoManutencaoId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoManutencaoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanoManutencao_empresaId_ativo_idx" ON "PlanoManutencao"("empresaId", "ativo");

-- CreateIndex
CREATE INDEX "PlanoManutencao_empresaId_proximaExecucaoEm_idx" ON "PlanoManutencao"("empresaId", "proximaExecucaoEm");

-- CreateIndex
CREATE INDEX "PlanoManutencao_ativoId_idx" ON "PlanoManutencao"("ativoId");

-- CreateIndex
CREATE INDEX "PlanoManutencaoMaterial_materialId_idx" ON "PlanoManutencaoMaterial"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanoManutencaoMaterial_planoManutencaoId_materialId_key" ON "PlanoManutencaoMaterial"("planoManutencaoId", "materialId");

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_planoManutencaoId_fkey" FOREIGN KEY ("planoManutencaoId") REFERENCES "PlanoManutencao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoManutencao" ADD CONSTRAINT "PlanoManutencao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoManutencao" ADD CONSTRAINT "PlanoManutencao_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "Ativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoManutencao" ADD CONSTRAINT "PlanoManutencao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoManutencaoMaterial" ADD CONSTRAINT "PlanoManutencaoMaterial_planoManutencaoId_fkey" FOREIGN KEY ("planoManutencaoId") REFERENCES "PlanoManutencao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoManutencaoMaterial" ADD CONSTRAINT "PlanoManutencaoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

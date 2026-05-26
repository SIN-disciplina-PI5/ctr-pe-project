import { prisma } from "../../prisma/prisma.client.js";
import { Prisma } from "@prisma/client";

interface CreateOSMaterialData {
  ordemServicoId: string;
  materialId: string;
  quantidade: number;
  custoUnitario: Prisma.Decimal;
}

interface UpdateOSMaterialData {
  quantidade?: number;
  custoUnitario?: number;
}

const osMaterialSelect = {
  id: true,
  ordemServicoId: true,
  materialId: true,
  quantidade: true,
  custoUnitario: true,
  custoTotal: true,
  status: true,
  createdAt: true,
  material: {
    select: {
      id: true,
      codigo: true,
      nome: true,
      unidade: true,
      estoqueAtual: true,
      custoMedio: true,
    },
  },
};

export class OrdensServicoMateriaisRepository {
  async findByOrdemServico(ordemServicoId: string) {
    return prisma.ordemServicoMaterial.findMany({
      where: { ordemServicoId },
      select: osMaterialSelect,
    });
  }

  async findById(id: string) {
    return prisma.ordemServicoMaterial.findUnique({
      where: { id },
      select: osMaterialSelect,
    });
  }

  async findMaterialById(materialId: string) {
    return prisma.material.findUnique({
      where: { id: materialId },
      select: {
        id: true,
        estoqueAtual: true,
        custoMedio: true,
        ativo: true,
      },
    });
  }

  async create(data: CreateOSMaterialData) {
    const custoTotal = new Prisma.Decimal(data.custoUnitario).times(data.quantidade);

    return prisma.ordemServicoMaterial.create({
      data: {
        ordemServicoId: data.ordemServicoId,
        materialId: data.materialId,
        quantidade: data.quantidade,
        custoUnitario: data.custoUnitario,
        custoTotal,
      },
      select: osMaterialSelect,
    });
  }

  async update(id: string, data: UpdateOSMaterialData) {
    const current = await prisma.ordemServicoMaterial.findUniqueOrThrow({
      where: { id },
      select: { quantidade: true, custoUnitario: true },
    });

    const quantidade = data.quantidade ?? Number(current.quantidade);
    const custoUnitario = data.custoUnitario ?? Number(current.custoUnitario);
    const custoTotal = new Prisma.Decimal(custoUnitario).times(quantidade);

    return prisma.ordemServicoMaterial.update({
      where: { id },
      data: { quantidade, custoUnitario, custoTotal },
      select: osMaterialSelect,
    });
  }

  async consumir(id: string, quantidade: number) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.ordemServicoMaterial.findUniqueOrThrow({
        where: { id },
        select: { materialId: true, custoUnitario: true, ordemServicoId: true },
      });

      const custoTotal = new Prisma.Decimal(item.custoUnitario).times(quantidade);

      const updated = await tx.ordemServicoMaterial.update({
        where: { id },
        data: { status: "CONSUMIDO", quantidade, custoTotal },
        select: osMaterialSelect,
      });

      await tx.material.update({
        where: { id: item.materialId },
        data: { estoqueAtual: { decrement: quantidade } },
      });

      await this.recalcularCustoOS(tx, item.ordemServicoId);

      return updated;
    });
  }

  async devolver(id: string, quantidade: number) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.ordemServicoMaterial.findUniqueOrThrow({
        where: { id },
        select: { materialId: true, custoUnitario: true, ordemServicoId: true },
      });

      const updated = await tx.ordemServicoMaterial.update({
        where: { id },
        data: { status: "DEVOLVIDO", quantidade, custoTotal: 0 },
        select: osMaterialSelect,
      });

      await tx.material.update({
        where: { id: item.materialId },
        data: { estoqueAtual: { increment: quantidade } },
      });

      await this.recalcularCustoOS(tx, item.ordemServicoId);

      return updated;
    });
  }

  async cancelar(id: string) {
    return prisma.ordemServicoMaterial.update({
      where: { id },
      data: { status: "CANCELADO" },
      select: osMaterialSelect,
    });
  }

  private async recalcularCustoOS(
    tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    ordemServicoId: string
  ) {
    const materiais = await tx.ordemServicoMaterial.findMany({
      where: { ordemServicoId, status: "CONSUMIDO" },
      select: { custoTotal: true },
    });

    const custoMateriais = materiais.reduce(
      (acc, m) => acc.plus(m.custoTotal),
      new Prisma.Decimal(0)
    );

    await tx.ordemServico.update({
      where: { id: ordemServicoId },
      data: {
        custoMateriais,
        custoTotal: custoMateriais,
      },
    });
  }
}
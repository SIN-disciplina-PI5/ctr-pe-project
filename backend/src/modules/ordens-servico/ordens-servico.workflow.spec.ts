import { describe, expect, it, jest } from "@jest/globals";

import { aplicarImpactoDisponibilidade } from "./ordens-servico.workflow.js";

type WorkflowTx = Parameters<typeof aplicarImpactoDisponibilidade>[0];

describe("ordens-servico.workflow", () => {
    it("should parar o ativo e criar parada vinculada", async () => {
        const update = jest.fn(async () => undefined);
        const create = jest.fn(async () => undefined);

        const tx: WorkflowTx = {
            ativo: {
                update,
            },
            paradaAtivo: {
                create,
            },
        };

        await aplicarImpactoDisponibilidade(tx, {
            id: "os-1",
            empresaId: "empresa-1",
            ativoId: "ativo-1",
            numero: "OS-001",
            titulo: "Troca de correia",
            tipo: "PREVENTIVA",
        });

        expect(tx.ativo.update).toHaveBeenCalledWith({
            where: {
                id: "ativo-1",
            },
            data: {
                status: "PARADO",
            },
        });

        expect(tx.paradaAtivo.create).toHaveBeenCalledWith({
            data: {
                empresaId: "empresa-1",
                ativoId: "ativo-1",
                ordemServicoId: "os-1",
                status: "ABERTA",
                motivo: "O.S. OS-001: Troca de correia",
                programada: true,
                impactaDisponibilidade: true,
            },
        });
    });

    it("should marcar parada não programada quando tipo não for PREVENTIVA", async () => {
        const update = jest.fn(async () => undefined);
        const create = jest.fn(async () => undefined);

        const tx: WorkflowTx = {
            ativo: {
                update,
            },
            paradaAtivo: {
                create,
            },
        };

        await aplicarImpactoDisponibilidade(tx, {
            id: "os-2",
            empresaId: "empresa-1",
            ativoId: "ativo-2",
            numero: "OS-002",
            titulo: "Falha no motor",
            tipo: "CORRETIVA",
        });

        expect(tx.paradaAtivo.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                programada: false,
            }),
        });
    });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
    create,
    encerrar,
    findById,
    findByOrdemServico,
    remove,
    update,
} from "./apontamentos-os.controller.js";
import { ApontamentosOSService } from "./apontamentos-os.service.js";
import { AppError } from "../../common/errors/AppError.js";

function makeResponse() {
    const res = {} as Response;
    res.status = jest.fn<typeof res.status>().mockReturnValue(res);
    res.json = jest.fn<typeof res.json>().mockReturnValue(res);
    res.send = jest.fn<typeof res.send>().mockReturnValue(res);
    return res;
}

describe("apontamentos-os.controller", () => {
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        jest.restoreAllMocks();
        res = makeResponse();
        next = jest.fn();
    });

    it("should listar por ordem de serviço", async () => {
        jest
            .spyOn(ApontamentosOSService.prototype, "findByOrdemServico")
            .mockResolvedValue([{ id: "1" }] as never);

        const req = {
            params: { ordemServicoId: "os-1" },
        } as unknown as Request;

        await findByOrdemServico(req, res, next);

        expect(ApontamentosOSService.prototype.findByOrdemServico).toHaveBeenCalledWith("os-1");
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should retornar por id", async () => {
        jest.spyOn(ApontamentosOSService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await findById(req, res, next);

        expect(ApontamentosOSService.prototype.findById).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should criar apontamento válido", async () => {
        jest.spyOn(ApontamentosOSService.prototype, "create").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { ordemServicoId: "os-1" },
            user: { id: "user-1" },
            body: {
                inicioEm: "2026-06-11T10:00:00.000Z",
                descricao: "Teste",
                custoHora: 50,
            },
        } as unknown as Request;

        await create(req, res, next);

        expect(ApontamentosOSService.prototype.create).toHaveBeenCalledWith({
            ordemServicoId: "os-1",
            usuarioId: "user-1",
            inicioEm: new Date("2026-06-11T10:00:00.000Z"),
            descricao: "Teste",
            custoHora: 50,
        });
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should chamar next quando inicioEm não for enviado", async () => {
        const createSpy = jest.spyOn(ApontamentosOSService.prototype, "create");

        const req = {
            params: { ordemServicoId: "os-1" },
            user: { id: "user-1" },
            body: {},
        } as unknown as Request;

        await create(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it("should chamar next quando inicioEm for inválido", async () => {
        const createSpy = jest.spyOn(ApontamentosOSService.prototype, "create");

        const req = {
            params: { ordemServicoId: "os-1" },
            user: { id: "user-1" },
            body: { inicioEm: "data-invalida" },
        } as unknown as Request;

        await create(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it("should atualizar apontamento", async () => {
        jest.spyOn(ApontamentosOSService.prototype, "update").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
            body: { descricao: "Atualizado" },
        } as unknown as Request;

        await update(req, res, next);

        expect(ApontamentosOSService.prototype.update).toHaveBeenCalledWith("1", {
            descricao: "Atualizado",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should encerrar apontamento", async () => {
        jest.spyOn(ApontamentosOSService.prototype, "encerrar").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
            body: { fimEm: "2026-06-11T11:00:00.000Z" },
        } as unknown as Request;

        await encerrar(req, res, next);

        expect(ApontamentosOSService.prototype.encerrar).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                fimEm: "2026-06-11T11:00:00.000Z",
            }),
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should remover apontamento", async () => {
        jest.spyOn(ApontamentosOSService.prototype, "delete").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await remove(req, res, next);

        expect(ApontamentosOSService.prototype.delete).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
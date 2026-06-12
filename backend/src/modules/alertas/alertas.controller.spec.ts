import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
    create,
    findAll,
    findById,
    findMe,
    ignorar,
    marcarLido,
    resolver,
} from "./alertas.controller.js";
import { AlertasService } from "./alertas.service.js";

function makeResponse() {
    const res = {} as Response;
    res.status = jest.fn<typeof res.status>().mockReturnValue(res);
    res.json = jest.fn<typeof res.json>().mockReturnValue(res);
    return res;
}

describe("alertas.controller", () => {
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        jest.restoreAllMocks();
        res = makeResponse();
        next = jest.fn();
    });

    it("should listar alertas com filtros", async () => {
        jest.spyOn(AlertasService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

        const req = {
            query: {
                empresaId: "empresa-1",
                status: "ABERTO",
                tipo: "ATIVO_PARADO",
                usuarioId: "user-1",
            },
        } as unknown as Request;

        await findAll(req, res, next);

        expect(AlertasService.prototype.findAll).toHaveBeenCalledWith({
            empresaId: "empresa-1",
            status: "ABERTO",
            tipo: "ATIVO_PARADO",
            usuarioId: "user-1",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should listar meus alertas", async () => {
        jest.spyOn(AlertasService.prototype, "findByUsuario").mockResolvedValue([{ id: "1" }] as never);

        const req = {
            user: { id: "user-1" },
            query: {
                status: "LIDO",
                tipo: "OS_ATRASADA",
            },
        } as unknown as Request;

        await findMe(req, res, next);

        expect(AlertasService.prototype.findByUsuario).toHaveBeenCalledWith("user-1", {
            status: "LIDO",
            tipo: "OS_ATRASADA",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should retornar lista vazia em findMe quando não houver usuário", async () => {
        const req = {
            query: {},
        } as unknown as Request;

        await findMe(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should retornar alerta por id", async () => {
        jest.spyOn(AlertasService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await findById(req, res, next);

        expect(AlertasService.prototype.findById).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should criar alerta", async () => {
        jest.spyOn(AlertasService.prototype, "create").mockResolvedValue({ id: "1" } as never);

        const req = {
            body: {
                empresaId: "empresa-1",
                tipo: "ATIVO_PARADO",
            },
        } as Request;

        await create(req, res, next);

        expect(AlertasService.prototype.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should marcar alerta como lido", async () => {
        jest.spyOn(AlertasService.prototype, "marcarComoLido").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await marcarLido(req, res, next);

        expect(AlertasService.prototype.marcarComoLido).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should resolver alerta", async () => {
        jest.spyOn(AlertasService.prototype, "resolver").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await resolver(req, res, next);

        expect(AlertasService.prototype.resolver).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should ignorar alerta", async () => {
        jest.spyOn(AlertasService.prototype, "ignorar").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await ignorar(req, res, next);

        expect(AlertasService.prototype.ignorar).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import {
    create,
    findAll,
    findById,
    remove,
    resetPassword,
    update,
} from "./usuarios.controller.js";
import { UsuariosService } from "./usuarios.service.js";

function makeResponse() {
    const res = {} as Response;
    res.status = jest.fn<typeof res.status>().mockReturnValue(res);
    res.json = jest.fn<typeof res.json>().mockReturnValue(res);
    res.send = jest.fn<typeof res.send>().mockReturnValue(res);
    return res;
}

describe("usuarios.controller", () => {
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        jest.restoreAllMocks();
        res = makeResponse();
        next = jest.fn();
    });

    it("should listar usuários com filtros", async () => {
        jest.spyOn(UsuariosService.prototype, "findAll").mockResolvedValue([{ id: "1" }] as never);

        const req = {
            query: {
                empresaId: "empresa-1",
                perfil: "TECNICO",
                ativo: "true",
                search: "joao",
            },
        } as unknown as Request;

        await findAll(req, res, next);

        expect(UsuariosService.prototype.findAll).toHaveBeenCalledWith({
            empresaId: "empresa-1",
            perfil: "TECNICO",
            ativo: true,
            search: "joao",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should retornar usuário por id quando permitido", async () => {
        jest.spyOn(UsuariosService.prototype, "findById").mockResolvedValue({ id: "1" } as never);

        const req = {
            user: {
                id: "admin-id",
                empresaId: null,
                nome: "Admin",
                email: "admin@teste.com",
                perfil: "ADMIN",
            },
            params: { id: "1" },
        } as unknown as Request;

        await findById(req, res, next);

        expect(UsuariosService.prototype.findById).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "1" });
    });

    it("should chamar next quando não houver permissão no findById", async () => {
        const findByIdSpy = jest.spyOn(UsuariosService.prototype, "findById");

        const req = {
            user: {
                id: "consulta-id",
                empresaId: "empresa-1",
                nome: "Consulta",
                email: "consulta@teste.com",
                perfil: "CONSULTA",
            },
            params: { id: "outro-id" },
        } as unknown as Request;

        await findById(req, res, next);

        expect(findByIdSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should criar usuário", async () => {
        jest.spyOn(UsuariosService.prototype, "create").mockResolvedValue({ id: "1" } as never);

        const req = {
            body: {
                nome: "João",
                email: "joao@teste.com",
                password: "123456",
                perfil: "TECNICO",
            },
        } as Request;

        await create(req, res, next);

        expect(UsuariosService.prototype.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should atualizar usuário", async () => {
        jest.spyOn(UsuariosService.prototype, "update").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
            body: { nome: "João Atualizado" },
        } as unknown as Request;

        await update(req, res, next);

        expect(UsuariosService.prototype.update).toHaveBeenCalledWith("1", {
            nome: "João Atualizado",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should resetar senha", async () => {
        jest.spyOn(UsuariosService.prototype, "resetPassword").mockResolvedValue({
            message: "Senha resetada com sucesso",
        } as never);

        const req = {
            params: { id: "1" },
            body: { novaSenha: "novaSenha123" },
        } as unknown as Request;

        await resetPassword(req, res, next);

        expect(UsuariosService.prototype.resetPassword).toHaveBeenCalledWith(
            "1",
            "novaSenha123",
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should remover usuário", async () => {
        jest.spyOn(UsuariosService.prototype, "delete").mockResolvedValue({ id: "1" } as never);

        const req = {
            params: { id: "1" },
        } as unknown as Request;

        await remove(req, res, next);

        expect(UsuariosService.prototype.delete).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("should chamar next quando create falhar", async () => {
        const error = new Error("falha");
        jest.spyOn(UsuariosService.prototype, "create").mockRejectedValue(error);

        const req = {
            body: {
                nome: "João",
            },
        } as Request;

        await create(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
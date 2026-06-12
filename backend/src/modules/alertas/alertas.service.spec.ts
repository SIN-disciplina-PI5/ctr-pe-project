import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { AlertasService } from "./alertas.service.js";
import { AlertasRepository } from "./alertas.repository.js";
import { AppError } from "../../common/errors/AppError.js";

describe("AlertasService", () => {
    let service: AlertasService;

    beforeEach(() => {
        service = new AlertasService();
        jest.restoreAllMocks();
    });

    it("should listar alertas e verificar O.S. atrasadas", async () => {
        const verificarSpy = jest
            .spyOn(AlertasRepository.prototype, "verificarOsAtrasadas")
            .mockResolvedValue(undefined as never);
        const findAllSpy = jest
            .spyOn(AlertasRepository.prototype, "findAll")
            .mockResolvedValue([{ id: "1" }] as never);

        const result = await service.findAll({
            empresaId: "empresa-1",
            status: "ABERTO",
        });

        expect(verificarSpy).toHaveBeenCalledWith("empresa-1");
        expect(findAllSpy).toHaveBeenCalledWith({
            empresaId: "empresa-1",
            status: "ABERTO",
        });
        expect(result).toEqual([{ id: "1" }]);
    });

    it("should listar alertas por usuário", async () => {
        const spy = jest
            .spyOn(AlertasRepository.prototype, "findAll")
            .mockResolvedValue([{ id: "1" }] as never);

        const result = await service.findByUsuario("user-1", {
            status: "LIDO",
            tipo: "ATIVO_PARADO",
        });

        expect(spy).toHaveBeenCalledWith({
            usuarioId: "user-1",
            status: "LIDO",
            tipo: "ATIVO_PARADO",
        });
        expect(result).toEqual([{ id: "1" }]);
    });

    it("should retornar alerta por id", async () => {
        jest.spyOn(AlertasRepository.prototype, "findById").mockResolvedValue({
            id: "1",
        } as never);

        const result = await service.findById("1");

        expect(result).toEqual({ id: "1" });
    });

    it("should lançar 404 quando alerta não existir", async () => {
        jest.spyOn(AlertasRepository.prototype, "findById").mockResolvedValue(null);

        await expect(service.findById("1")).rejects.toBeInstanceOf(AppError);
    });

    it("should criar alerta", async () => {
        const spy = jest.spyOn(AlertasRepository.prototype, "create").mockResolvedValue({
            id: "1",
        } as never);

        const result = await service.create({
            empresaId: "empresa-1",
            tipo: "ATIVO_PARADO",
            titulo: "Ativo parado",
            mensagem: "Motor parado",
            usuarioId: "user-1",
        });

        expect(spy).toHaveBeenCalledWith({
            empresaId: "empresa-1",
            tipo: "ATIVO_PARADO",
            titulo: "Ativo parado",
            mensagem: "Motor parado",
            usuarioId: "user-1",
        });
        expect(result).toEqual({ id: "1" });
    });

    it("should marcar como lido", async () => {
        jest.spyOn(AlertasRepository.prototype, "findById").mockResolvedValue({
            id: "1",
        } as never);
        const spy = jest
            .spyOn(AlertasRepository.prototype, "updateStatus")
            .mockResolvedValue({ id: "1", status: "LIDO" } as never);

        const result = await service.marcarComoLido("1");

        expect(spy).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                status: "LIDO",
                lidoEm: expect.any(Date),
            }),
        );
        expect(result).toEqual({ id: "1", status: "LIDO" });
    });

    it("should resolver alerta", async () => {
        jest.spyOn(AlertasRepository.prototype, "findById").mockResolvedValue({
            id: "1",
        } as never);
        const spy = jest
            .spyOn(AlertasRepository.prototype, "updateStatus")
            .mockResolvedValue({ id: "1", status: "RESOLVIDO" } as never);

        const result = await service.resolver("1");

        expect(spy).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                status: "RESOLVIDO",
                resolvidoEm: expect.any(Date),
            }),
        );
        expect(result).toEqual({ id: "1", status: "RESOLVIDO" });
    });

    it("should ignorar alerta", async () => {
        jest.spyOn(AlertasRepository.prototype, "findById").mockResolvedValue({
            id: "1",
        } as never);
        const spy = jest
            .spyOn(AlertasRepository.prototype, "updateStatus")
            .mockResolvedValue({ id: "1", status: "IGNORADO" } as never);

        const result = await service.ignorar("1");

        expect(spy).toHaveBeenCalledWith("1", { status: "IGNORADO" });
        expect(result).toEqual({ id: "1", status: "IGNORADO" });
    });
});
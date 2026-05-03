import { api } from "./test-server.js";

describe("not found routes", () => {
  it("should return 404 with standardized error payload", async () => {
    const response = await api.get("/rota-inexistente");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Rota não encontrada.");
    expect(response.body.errorCode).toBe("NOT_FOUND");
    expect(response.body.statusCode).toBe(404);
    expect(response.body.timestamp).toEqual(expect.any(String));
    expect(response.body.traceId).toEqual(expect.any(String));
  });
});

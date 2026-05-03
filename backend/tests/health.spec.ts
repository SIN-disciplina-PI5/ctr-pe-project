import { api } from "./test-server.js";

describe("GET /health", () => {
  it("should return 200 and api status", async () => {
    const response = await api.get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("ctrpe-api");
    expect(response.body.timestamp).toEqual(expect.any(String));
  });
});

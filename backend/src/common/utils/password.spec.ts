import { describe, expect, it } from "@jest/globals";

import { comparePassword, hashPassword } from "./password.js";

describe("password utils", () => {
  it("should gerar hash diferente da senha original", async () => {
    const password = "123456";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("should validar senha correta", async () => {
    const password = "123456";
    const hash = await hashPassword(password);

    const result = await comparePassword(password, hash);

    expect(result).toBe(true);
  });

  it("should rejeitar senha incorreta", async () => {
    const hash = await hashPassword("123456");

    const result = await comparePassword("654321", hash);

    expect(result).toBe(false);
  });
});
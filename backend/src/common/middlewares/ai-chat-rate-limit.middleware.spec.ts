import { describe, expect, it } from "@jest/globals";
import type { Request } from "express";

import { aiChatRateLimitKey } from "./ai-chat-rate-limit.middleware.js";

function request(ip: string, user?: Request["user"]) {
  return { ip, user } as Request;
}

describe("aiChatRateLimitKey", () => {
  it("agrupa endereços IPv6 do mesmo bloco", () => {
    const first = aiChatRateLimitKey(
      request("2001:db8:85a3:1200:8a2e:370:7334:1001"),
    );
    const second = aiChatRateLimitKey(
      request("2001:db8:85a3:1200:ffff:ffff:ffff:ffff"),
    );

    expect(first).toBe(second);
    expect(first).toMatch(/^nao-autenticado:2001:db8:85a3:1200:/);
  });

  it("preserva endereços IPv4 distintos", () => {
    expect(aiChatRateLimitKey(request("192.0.2.10"))).not.toBe(
      aiChatRateLimitKey(request("192.0.2.11")),
    );
  });

  it("prioriza usuário e empresa quando há autenticação", () => {
    const key = aiChatRateLimitKey(
      request("2001:db8::1", {
        id: "usr_000001",
        empresaId: "emp_000001",
        nome: "Usuário",
        email: "usuario@empresa.com",
        perfil: "CONSULTA",
      }),
    );

    expect(key).toBe("usr_000001:emp_000001");
  });
});

import type { AuthUser } from "./auth-user.js";

export {};

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      user?: AuthUser;
    }
  }
}

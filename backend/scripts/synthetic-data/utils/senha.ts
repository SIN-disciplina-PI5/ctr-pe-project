import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";

export class Senha {
  static gerarHash(senha: string): Promise<string> {
    return bcrypt.hash(senha, SALT_ROUNDS);
  }
}

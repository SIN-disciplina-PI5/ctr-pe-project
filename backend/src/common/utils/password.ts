import { compare, hash } from "bcrypt";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

export function hashPassword(password: string) {
  return hash(password, saltRounds);
}

export function comparePassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

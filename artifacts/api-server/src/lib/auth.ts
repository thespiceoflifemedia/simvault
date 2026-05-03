import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return derived.toString("hex") === storedHash;
}

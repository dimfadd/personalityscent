import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ps_admin";

function token() {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", secret).update("personality-scent-admin").digest("hex");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(pw: string) {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && safeEqual(pw, real!);
}

export function adminToken() {
  return token();
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  return safeEqual(c, token());
}

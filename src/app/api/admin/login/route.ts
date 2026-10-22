import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/admin";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!process.env.ADMIN_PASSWORD) return Response.json({ error: "admin_disabled" }, { status: 503 });
  if (!password || !checkPassword(password)) return Response.json({ error: "wrong_password" }, { status: 401 });
  (await cookies()).set(ADMIN_COOKIE, adminToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return Response.json({ ok: true });
}

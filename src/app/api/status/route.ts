import { connection } from "next/server";
import { getAiSettings, hasKey } from "@/lib/ai";

export async function GET() {
  await connection();
  const s = await getAiSettings();
  return Response.json({ ai: s.provider !== "none" && hasKey(s.provider) });
}

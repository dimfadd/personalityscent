import { isAdmin } from "@/lib/admin";
import { testAi } from "@/lib/ai";

export const maxDuration = 60;

export async function POST() {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json(await testAi());
}

import { getProfile } from "@/lib/profiles";
import { recommend } from "@/lib/engine";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProfile(id);
  if (!p) return Response.json({ error: "not_found" }, { status: 404 });
  if (!p.paid) return Response.json({ error: "payment_required" }, { status: 402 });
  return Response.json({ recommendations: recommend(p.profile, p.answers) });
}

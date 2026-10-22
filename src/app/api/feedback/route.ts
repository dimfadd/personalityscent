import { query } from "@/lib/db";
import { getProfile } from "@/lib/profiles";
import { PERFUME_MAP } from "@/data/perfumes";

export async function POST(req: Request) {
  const { profileId, perfumeId, rating } = (await req.json().catch(() => ({}))) as { profileId?: string; perfumeId?: string; rating?: number };
  if (!profileId || !perfumeId || !PERFUME_MAP[perfumeId] || !Number.isInteger(rating) || rating! < 1 || rating! > 5)
    return Response.json({ error: "invalid" }, { status: 400 });
  const p = await getProfile(profileId);
  if (!p?.paid) return Response.json({ error: "not_allowed" }, { status: 403 });
  await query("insert into feedback (profile_id, perfume_id, rating) values ($1, $2, $3)", [profileId, perfumeId, rating]);
  return Response.json({ ok: true });
}

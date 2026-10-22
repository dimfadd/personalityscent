import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { query } from "@/lib/db";
import { PROVIDERS, PROVIDER_INFO, getAiSettings, hasKey, saveAiSettings } from "@/lib/ai";
import { PERFUMES } from "@/data/perfumes";
import { midtransConfigured, unlockPrice } from "@/lib/midtrans";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const [ai, counts, orders, ratings] = await Promise.all([
    getAiSettings(),
    query<{ profiles: number; paid: number; revenue: number }>(
      "select (select count(*)::int from profiles) as profiles, (select count(*)::int from orders where status = 'paid') as paid, (select coalesce(sum(amount),0)::int from orders where status = 'paid') as revenue",
    ),
    query("select id, profile_id, amount, status, created_at, paid_at from orders order by created_at desc limit 25"),
    query<{ n: number; avg: number | null }>("select count(*)::int as n, avg(rating)::float as avg from feedback"),
  ]);
  return Response.json({
    ai,
    providers: PROVIDERS.map((p) => ({ id: p, label: PROVIDER_INFO[p].label, keyEnv: PROVIDER_INFO[p].keyEnv, hasKey: hasKey(p), defaultModel: process.env[PROVIDER_INFO[p].modelEnv] ?? PROVIDER_INFO[p].defaultModel })),
    stats: { ...counts[0], feedback: ratings[0] },
    orders,
    perfumes: { total: PERFUMES.length, unverified: PERFUMES.filter((p) => !p.verified).length },
    payment: { configured: midtransConfigured(), production: process.env.MIDTRANS_IS_PRODUCTION === "true", price: unlockPrice() },
  });
}

const Body = z.object({ provider: z.enum([...PROVIDERS, "none"]), model: z.string().max(120) });

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  await saveAiSettings(parsed.data);
  return Response.json({ ok: true });
}

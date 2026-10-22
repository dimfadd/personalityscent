import { randomBytes } from "node:crypto";
import { query } from "@/lib/db";
import { siteUrl } from "@/lib/site";
import { getProfile, markPaid } from "@/lib/profiles";
import { createSnapTransaction, midtransConfigured, snapScriptUrl, unlockPrice } from "@/lib/midtrans";

export async function POST(req: Request) {
  const { profileId } = (await req.json().catch(() => ({}))) as { profileId?: string };
  const p = profileId ? await getProfile(profileId) : null;
  if (!p) return Response.json({ error: "not_found" }, { status: 404 });
  if (p.paid) return Response.json({ alreadyPaid: true });

  if (!midtransConfigured() && process.env.NODE_ENV === "production") return Response.json({ error: "payment_not_configured" }, { status: 503 });

  const amount = unlockPrice();
  const orderId = `PS-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`.toUpperCase();
  await query("insert into orders (id, profile_id, amount, status) values ($1, $2, $3, 'pending')", [orderId, p.id, amount]);

  // Local development without Midtrans keys: unlock immediately and say so in the UI.
  if (!midtransConfigured()) {
    await markPaid(orderId, { demo: true });
    return Response.json({ demo: true, orderId });
  }

  try {
    const origin = siteUrl(new URL(req.url).origin);
    const snap = await createSnapTransaction(orderId, amount, "Personality Scent: rekomendasi parfum", `${origin}/result/${p.id}?order=${orderId}`);
    await query("update orders set snap_token = $2 where id = $1", [orderId, snap.token]);
    return Response.json({ orderId, token: snap.token, clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY, snapUrl: snapScriptUrl() });
  } catch (e) {
    console.error("[checkout]", e);
    await query("update orders set status = 'error' where id = $1", [orderId]);
    return Response.json({ error: "gateway_error" }, { status: 502 });
  }
}

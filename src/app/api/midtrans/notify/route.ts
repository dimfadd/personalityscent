import { query } from "@/lib/db";
import { markPaid } from "@/lib/profiles";
import { isPaid, verifySignature, type MidtransStatus } from "@/lib/midtrans";

/** Midtrans HTTP notification. Set this URL in the Midtrans dashboard: <site>/api/midtrans/notify */
export async function POST(req: Request) {
  const n = (await req.json().catch(() => null)) as MidtransStatus | null;
  if (!n?.order_id || !verifySignature(n)) return Response.json({ error: "invalid_signature" }, { status: 403 });

  const rows = await query<{ amount: number }>("select amount from orders where id = $1", [n.order_id]);
  if (!rows[0]) return Response.json({ ok: true }); // unknown order: acknowledge so Midtrans stops retrying
  if (Number(n.gross_amount) !== rows[0].amount) return Response.json({ error: "amount_mismatch" }, { status: 400 });

  if (isPaid(n)) await markPaid(n.order_id, n);
  else await query("update orders set status = $2, raw = $3 where id = $1 and status <> 'paid'", [n.order_id, n.transaction_status, n]);
  return Response.json({ ok: true });
}

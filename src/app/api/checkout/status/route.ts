import { query } from "@/lib/db";
import { markPaid } from "@/lib/profiles";
import { getTransactionStatus, isPaid, midtransConfigured } from "@/lib/midtrans";

/** Polled by the browser after the Snap popup closes. Asks Midtrans directly, so it cannot be spoofed. */
export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("orderId") ?? "";
  const rows = await query<{ id: string; status: string; profile_id: string }>("select id, status, profile_id from orders where id = $1", [orderId]);
  const order = rows[0];
  if (!order) return Response.json({ error: "not_found" }, { status: 404 });
  if (order.status === "paid") return Response.json({ paid: true });
  if (!midtransConfigured()) return Response.json({ paid: false, status: order.status });

  const s = await getTransactionStatus(orderId);
  if (isPaid(s)) {
    await markPaid(orderId, s);
    return Response.json({ paid: true });
  }
  if (["deny", "cancel", "expire", "failure"].includes(s.transaction_status)) {
    await query("update orders set status = $2 where id = $1", [orderId, s.transaction_status]);
  }
  return Response.json({ paid: false, status: s.transaction_status ?? order.status });
}

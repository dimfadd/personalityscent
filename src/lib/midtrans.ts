import "server-only";
import { createHash } from "node:crypto";

const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_BASE = isProd ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
const CORE_BASE = isProd ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";

export const midtransConfigured = () => Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
export const snapScriptUrl = () => `${SNAP_BASE}/snap/snap.js`;
export const unlockPrice = () => Number(process.env.UNLOCK_PRICE_IDR ?? 29000);

function authHeader() {
  return "Basic " + Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64");
}

export async function createSnapTransaction(orderId: string, amount: number, itemName: string, finishUrl: string) {
  const r = await fetch(`${SNAP_BASE}/snap/v1/transactions`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", authorization: authHeader() },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: "unlock-recs", price: amount, quantity: 1, name: itemName.slice(0, 50) }],
      callbacks: { finish: finishUrl },
    }),
  });
  if (!r.ok) throw new Error(`Midtrans ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return (await r.json()) as { token: string; redirect_url: string };
}

export type MidtransStatus = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  signature_key?: string;
};

export async function getTransactionStatus(orderId: string): Promise<MidtransStatus> {
  const r = await fetch(`${CORE_BASE}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { accept: "application/json", authorization: authHeader() },
  });
  return (await r.json()) as MidtransStatus;
}

/** signature_key = SHA512(order_id + status_code + gross_amount + ServerKey) */
export function verifySignature(n: MidtransStatus) {
  const expected = createHash("sha512")
    .update(n.order_id + n.status_code + n.gross_amount + process.env.MIDTRANS_SERVER_KEY)
    .digest("hex");
  return n.signature_key === expected;
}

export function isPaid(n: Pick<MidtransStatus, "transaction_status" | "fraud_status">) {
  if (n.transaction_status === "settlement") return true;
  if (n.transaction_status === "capture") return !n.fraud_status || n.fraud_status === "accept";
  return false;
}

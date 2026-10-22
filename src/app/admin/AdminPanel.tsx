"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Wordmark } from "@/components/PyramidMark";

type Data = {
  ai: { provider: string; model: string };
  providers: { id: string; label: string; keyEnv: string; hasKey: boolean; defaultModel: string }[];
  stats: { profiles: number; paid: number; revenue: number; feedback: { n: number; avg: number | null } };
  orders: { id: string; profile_id: string; amount: number; status: string; created_at: string; paid_at: string | null }[];
  perfumes: { total: number; unverified: number };
  payment: { configured: boolean; production: boolean; price: number };
};

const idr = (n: number) => "Rp" + n.toLocaleString("id-ID");

export function AdminPanel() {
  const [state, setState] = useState<"loading" | "login" | "ready" | "error" | "disabled">("loading");
  const [data, setData] = useState<Data | null>(null);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [provider, setProvider] = useState("none");
  const [model, setModel] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/settings");
      if (r.status === 401) return setState("login");
      if (!r.ok) throw new Error();
      const d: Data = await r.json();
      setData(d);
      setProvider(d.ai.provider);
      setModel(d.ai.model);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(load, 0);
    return () => clearTimeout(id);
  }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.status === 503) return setState("disabled");
    if (!r.ok) return setLoginErr("Password salah.");
    setPw("");
    void load();
  }

  async function saveSettings() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/admin/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ provider, model }) });
    setBusy(false);
    setMsg(r.ok ? "Tersimpan." : "Gagal menyimpan.");
    if (r.ok) void load();
  }

  async function test() {
    setBusy(true); setMsg("Menguji...");
    const r = await fetch("/api/admin/test", { method: "POST" });
    const d = await r.json().catch(() => ({ ok: false, message: "Error" }));
    setBusy(false);
    setMsg(d.ok ? `Berhasil: ${d.message}` : `Gagal: ${d.message}`);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setState("login");
  }

  const field = "min-h-11 w-full rounded-md border border-line bg-ink-2 px-3 text-paper focus:border-amber focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-10 flex items-center justify-between">
        <Link href="/"><Wordmark /></Link>
        {state === "ready" && <button type="button" onClick={logout} className="min-h-10 rounded-md border border-line px-4 text-sm">Keluar</button>}
      </div>

      {state === "loading" && <p role="status" className="text-muted">Memuat...</p>}
      {state === "error" && <p role="alert" className="text-red-200">Gagal memuat data admin. Periksa koneksi database.</p>}
      {state === "disabled" && <p className="text-muted">Admin nonaktif. Set <code>ADMIN_PASSWORD</code> di environment untuk mengaktifkan.</p>}

      {state === "login" && (
        <form onSubmit={login} className="mx-auto max-w-sm space-y-4">
          <h1 className="font-display text-4xl">Admin</h1>
          <label className="block text-sm">
            Password
            <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className={`mt-1 ${field}`} />
          </label>
          {loginErr && <p role="alert" className="text-sm text-red-200">{loginErr}</p>}
          <button className="min-h-11 w-full rounded-md bg-amber font-semibold text-ink">Masuk</button>
        </form>
      )}

      {state === "ready" && data && (
        <div className="space-y-8">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Profil dibuat", data.stats.profiles],
              ["Order terbayar", data.stats.paid],
              ["Pendapatan", idr(data.stats.revenue)],
              ["Rating parfum", data.stats.feedback.n ? `${data.stats.feedback.avg?.toFixed(2)} (${data.stats.feedback.n})` : "Belum ada"],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl border border-line p-4">
                <p className="label">{k}</p>
                <p className="mt-2 font-display text-3xl">{v}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-display text-3xl">Model AI</h2>
            <p className="mt-1 text-sm text-muted">API key hanya dibaca dari environment. Pilihan di sini menimpa <code>AI_PROVIDER</code>.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[{ id: "none", label: "Nonaktif (pakai template)", hasKey: true, keyEnv: "", defaultModel: "" }, ...data.providers].map((p) => (
                <label key={p.id} className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 ${provider === p.id ? "border-amber bg-amber/10" : "border-line"} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="provider" className="accent-amber" checked={provider === p.id} onChange={() => { setProvider(p.id); setModel(p.defaultModel); }} />
                    <span>{p.label}</span>
                  </span>
                  {p.id !== "none" && (
                    <span className={`text-xs ${p.hasKey ? "text-amber" : "text-muted"}`}>{p.hasKey ? "Key terpasang" : `Belum ada ${p.keyEnv}`}</span>
                  )}
                </label>
              ))}
            </div>
            {provider !== "none" && (
              <label className="mt-4 block text-sm">
                ID model
                <input value={model} onChange={(e) => setModel(e.target.value)} className={`mt-1 ${field}`} />
              </label>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button type="button" disabled={busy} onClick={saveSettings} className="min-h-11 rounded-md bg-amber px-5 font-semibold text-ink disabled:opacity-50">Simpan</button>
              <button type="button" disabled={busy} onClick={test} className="min-h-11 rounded-md border border-line px-5 disabled:opacity-50">Uji koneksi</button>
              {msg && <span role="status" className="text-sm text-muted">{msg}</span>}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl">Pembayaran</h2>
              <p className="mt-2 text-sm text-muted">
                Midtrans: {data.payment.configured ? (data.payment.production ? "production" : "sandbox") : "belum dikonfigurasi (mode demo di development)"}
              </p>
              <p className="mt-1 text-sm text-muted">Harga buka rekomendasi: {idr(data.payment.price)}</p>
              <p className="mt-1 text-sm text-muted">URL notifikasi: <code>/api/midtrans/notify</code></p>
            </div>
            <div className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl">Database parfum</h2>
              <p className="mt-2 text-sm text-muted">{data.perfumes.total} parfum, {data.perfumes.unverified} belum diverifikasi manual.</p>
              <p className="mt-1 text-sm text-muted">Edit di <code>src/data/perfumes.ts</code>.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-display text-2xl">Order terbaru</h2>
            {data.orders.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Belum ada order.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="text-muted">
                    <tr><th className="py-2 font-medium">Order</th><th className="font-medium">Jumlah</th><th className="font-medium">Status</th><th className="font-medium">Dibuat</th><th className="font-medium">Hasil</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {data.orders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2 font-mono text-xs">{o.id}</td>
                        <td>{idr(o.amount)}</td>
                        <td className={o.status === "paid" ? "text-amber" : "text-muted"}>{o.status}</td>
                        <td className="text-muted">{new Date(o.created_at).toLocaleString("id-ID")}</td>
                        <td><Link className="underline underline-offset-4" href={`/result/${o.profile_id}`}>Lihat</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

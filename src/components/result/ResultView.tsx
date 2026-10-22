"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { Wordmark } from "@/components/PyramidMark";
import { RecCard } from "./RecCard";
import { PerfumeBottle } from "@/components/PerfumeBottle";
import { SiteFooter } from "@/components/SiteFooter";
import { track } from "@/lib/pixel";
import { ACCORD_MAP } from "@/data/accords";
import { TRAIT_LABELS } from "@/data/questions";
import { BIG_FIVE, type NotePosition, type Recommendation, type ScentProfile } from "@/lib/types";

const formatIdr = (n: number) => "Rp" + n.toLocaleString("id-ID");

type SnapCallbacks = { onSuccess?: () => void; onPending?: () => void; onError?: () => void; onClose?: () => void };
declare global {
  interface Window { snap?: { pay: (token: string, cb: SnapCallbacks) => void } }
}

function loadSnap(src: string, clientKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.snap) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.setAttribute("data-client-key", clientKey);
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("snap"));
    document.body.appendChild(s);
  });
}

export function ResultView({ id, profile, paid: initialPaid, price }: { id: string; profile: ScentProfile; paid: boolean; price: number }) {
  const { t, locale } = useLocale();
  const reduce = useReducedMotion();
  const [paid, setPaid] = useState(initialPaid);
  const [pay, setPay] = useState<"idle" | "opening" | "checking" | "pending" | "error">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [copied, setCopied] = useState(false);

  const familyName = profile.family.secondary ? `${profile.family.primary[locale]} ${profile.family.secondary[locale]}` : profile.family.primary[locale];

  const check = useCallback(async (oid: string) => {
    setOrderId(oid);
    setPay("checking");
    for (let i = 0; i < 5; i++) {
      try {
        const r = await fetch(`/api/checkout/status?orderId=${encodeURIComponent(oid)}`);
        const d = await r.json();
        if (d.paid) {
          setPaid(true);
          setPay("idle");
          track("Purchase", { value: price, currency: "IDR", content_name: "perfume_matches" }, false);
          return;
        }
      } catch { /* retry */ }
      await new Promise((res) => setTimeout(res, 2000));
    }
    setPay("pending");
  }, [price]);

  // Returning from Midtrans' redirect page carries ?order=...
  useEffect(() => {
    const oid = new URLSearchParams(window.location.search).get("order");
    if (!oid || initialPaid) return;
    const t = setTimeout(() => void check(oid), 0);
    return () => clearTimeout(t);
  }, [check, initialPaid]);

  async function unlock() {
    setPay("opening");
    track("InitiateCheckout", { value: price, currency: "IDR", content_name: "perfume_matches" });
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ profileId: id }) });
      const d = await r.json();
      if (d.alreadyPaid || d.demo) { setDemo(Boolean(d.demo)); setPaid(true); setPay("idle"); return; }
      if (!r.ok || !d.token) throw new Error("checkout");
      setOrderId(d.orderId);
      await loadSnap(d.snapUrl, d.clientKey);
      window.snap!.pay(d.token, {
        onSuccess: () => check(d.orderId),
        onPending: () => check(d.orderId),
        onClose: () => check(d.orderId),
        onError: () => setPay("error"),
      });
    } catch {
      setPay("error");
    }
  }

  async function share() {
    const url = window.location.origin + `/result/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Personality Scent", text: familyName, url }); return; } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  }

  const bandWidth: Record<NotePosition, string> = { top: "58%", heart: "80%", base: "100%" };

  return (
    <>
      <header className="border-b border-line/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label={t.result.home}><Wordmark /></Link>
          <LangSwitch />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 sm:px-6">
        {/* Reveal */}
        <section className="pt-10 text-center sm:pt-14">
          <motion.div className="mx-auto mb-6 w-fit" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <PerfumeBottle
              colors={(["base", "heart", "top"] as const).map((pos) => ACCORD_MAP[profile.pyramid[pos][0]?.accord ?? profile.topAccords[0].id].color) as [string, string, string]}
              label={profile.family.primary[locale]}
              shape="classic"
              mist
              delay={0.3}
              fill={0.8}
              title={`${t.result.kicker}: ${familyName}`}
              className="h-56 w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] sm:h-72"
            />
          </motion.div>
          <motion.p className="label" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {t.result.kicker} · {t.result.family}
          </motion.p>
          <motion.h1
            className="mx-auto mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {familyName}
          </motion.h1>
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
            <p className="mx-auto mt-6 max-w-2xl font-display text-2xl italic text-amber">{profile.narrative.title}</p>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">{profile.narrative.body}</p>
            {profile.narrative.source === "ai" && <p className="mt-3 text-xs text-muted/80">{t.result.narrativeAi}</p>}
          </motion.div>
        </section>

        {/* Pyramid: the identity motif at full size */}
        <section className="mt-16" aria-labelledby="pyr">
          <h2 id="pyr" className="label mb-6 text-center">{t.result.pyramid}</h2>
          <div className="flex flex-col items-center gap-3">
            {(["top", "heart", "base"] as NotePosition[]).map((pos, i) => (
              <motion.div
                key={pos}
                style={{ width: bandWidth[pos] }}
                className={`min-w-[17rem] rounded-xl border px-4 py-5 text-center sm:px-8 ${pos === "top" ? "border-amber/60 bg-amber/[0.08]" : "border-line bg-ink-2"}`}
                initial={reduce ? false : { opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.3 + i * 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  {t.result[pos]} · {t.result[`${pos}Desc` as "topDesc"]}
                </p>
                <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display text-2xl sm:text-3xl">
                  {profile.pyramid[pos].map((n) => (
                    <span key={n.id} className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCORD_MAP[n.accord].color }} aria-hidden />
                      {n.name[locale]}
                    </span>
                  ))}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Accords */}
          <section className="rounded-2xl border border-line p-6 sm:p-8" aria-labelledby="acc">
            <h2 id="acc" className="label">{t.result.accords}</h2>
            <div className="mt-6 space-y-4">
              {profile.topAccords.map((a, i) => (
                <div key={a.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl">{ACCORD_MAP[a.id].name[locale]}</span>
                    <span className="text-sm tabular-nums text-muted">{a.score}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-line">
                    <motion.div className="h-full rounded-full" style={{ background: ACCORD_MAP[a.id].color }}
                      initial={{ width: reduce ? `${a.score}%` : 0 }} whileInView={{ width: `${a.score}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{ACCORD_MAP[a.id].desc[locale]}</p>
                </div>
              ))}
            </div>
            {profile.avoided.length > 0 && (
              <p className="mt-6 text-sm text-muted">
                {t.result.avoided}: {profile.avoided.map((a) => ACCORD_MAP[a].name[locale]).join(", ")}
              </p>
            )}
          </section>

          {/* Big Five */}
          <section className="rounded-2xl border border-line p-6 sm:p-8" aria-labelledby="b5">
            <h2 id="b5" className="label">{t.result.personality}</h2>
            <div className="mt-6 space-y-5">
              {BIG_FIVE.map((tr) => {
                const v = profile.bigFive[tr];
                return (
                  <div key={tr}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold">{TRAIT_LABELS[tr].name[locale]}</span>
                      <span className="text-sm tabular-nums text-muted">{v}</span>
                    </div>
                    <div className="relative mt-2 h-1.5 rounded-full bg-line" role="img" aria-label={`${TRAIT_LABELS[tr].name[locale]} ${v}/100`}>
                      <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-amber" style={{ left: `${v}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between gap-4 text-[11px] text-muted">
                      <span>{TRAIT_LABELS[tr].low[locale]}</span>
                      <span className="text-right">{TRAIT_LABELS[tr].high[locale]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-muted">{t.result.personalityNote}</p>
          </section>
        </div>

        {/* Share */}
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl">{t.result.share}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={share} className="min-h-11 rounded-md border border-line px-4 text-sm hover:border-muted" aria-live="polite">
              {copied ? t.result.copied : t.result.copy}
            </button>
            <a href={`/api/card/${id}?l=${locale}`} download={`personality-scent-${id.slice(0, 6)}.png`} className="inline-flex min-h-11 items-center rounded-md border border-line px-4 text-sm hover:border-muted">
              {t.result.downloadCard}
            </a>
          </div>
        </section>

        {/* Paywall / recommendations */}
        <section className="mt-16" aria-labelledby="recs">
          {paid ? (
            <Recommendations id={id} demo={demo} />
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-amber/70 bg-amber/[0.06] p-7 sm:p-10">
              <h2 id="recs" className="max-w-xl font-display text-4xl leading-tight">{t.result.unlockTitle}</h2>
              <p className="mt-4 max-w-xl text-muted">{t.result.unlockBody}</p>
              <ul className="mt-5 space-y-2 text-sm text-paper/90">
                {t.pricing.paidItems.map((x) => <li key={x} className="flex gap-3"><span className="text-amber" aria-hidden>+</span>{x}</li>)}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" onClick={unlock} disabled={pay === "opening" || pay === "checking"}
                  className="min-h-12 rounded-md bg-amber px-6 font-semibold text-ink hover:bg-paper disabled:opacity-60">
                  {pay === "opening" ? t.result.paying : pay === "checking" ? t.result.checking : `${t.result.unlockCta} · ${formatIdr(price)}`}
                </button>
                <span className="text-xs text-muted">{t.pricing.payNote}</span>
              </div>
              {pay === "pending" && orderId && (
                <p role="status" className="mt-4 text-sm text-paper">
                  {t.result.payPending}{" "}
                  <button type="button" className="underline underline-offset-4" onClick={() => check(orderId)}>{t.result.payCheck}</button>
                </p>
              )}
              {pay === "error" && <p role="alert" className="mt-4 text-sm text-red-200">{t.result.payError}</p>}
            </div>
          )}
        </section>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link href="/profiling" className="inline-flex min-h-11 items-center rounded-md border border-line px-5 text-sm hover:border-muted">{t.result.again}</Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md px-5 text-sm text-muted hover:text-paper">{t.result.home}</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Recommendations({ id, demo }: { id: string; demo: boolean }) {
  const { t } = useLocale();
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [rated, setRated] = useState<Record<string, number>>({});
  const [origin, setOrigin] = useState<"all" | "local" | "international">("all");
  const [sort, setSort] = useState<"match" | "cheap" | "pricey">("match");

  useEffect(() => {
    fetch(`/api/profile/${id}/recommendations`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { setRecs(d.recommendations); setState("ready"); })
      .catch(() => setState("error"));
  }, [id]);

  async function rate(perfumeId: string, rating: number) {
    setRated((r) => ({ ...r, [perfumeId]: rating }));
    await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ profileId: id, perfumeId, rating }) }).catch(() => {});
  }

  const shown = recs
    .filter((r) => origin === "all" || r.origin === origin)
    .sort((a, b) => (sort === "cheap" ? a.priceIdr - b.priceIdr : sort === "pricey" ? b.priceIdr - a.priceIdr : b.match - a.match));
  const best = recs[0]?.perfumeId;

  return (
    <div>
      <h2 id="recs" className="font-display text-4xl">{t.result.recsTitle}</h2>
      {demo && <p className="mt-3 rounded-lg border border-line p-3 text-sm text-muted">{t.result.demo}</p>}
      {state === "loading" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2" role="status" aria-label={t.result.loading}>
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-ink-2" />)}
        </div>
      )}
      {state === "error" && <p role="alert" className="mt-6 text-red-200">{t.result.recsError}</p>}
      {state === "ready" && recs.length === 0 && <p className="mt-6 text-muted">{t.result.recsEmpty}</p>}
      {state === "ready" && recs.length > 0 && (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div role="radiogroup" aria-label={t.result.filterAll} className="flex flex-wrap gap-2">
              {([["all", t.result.filterAll], ["local", t.result.filterLocal], ["international", t.result.filterIntl]] as const).map(([v, label]) => {
                const count = v === "all" ? recs.length : recs.filter((r) => r.origin === v).length;
                return (
                  <button key={v} type="button" role="radio" aria-checked={origin === v} onClick={() => setOrigin(v)}
                    className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${origin === v ? "border-amber bg-amber text-ink" : "border-line text-muted hover:text-paper"}`}>
                    {label} <span className="tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              {t.result.sortLabel}
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="min-h-11 rounded-full border border-line bg-ink px-4 text-paper focus:border-amber focus:outline-none">
                <option value="match">{t.result.sortMatch}</option>
                <option value="cheap">{t.result.sortCheap}</option>
                <option value="pricey">{t.result.sortPricey}</option>
              </select>
            </label>
          </div>

          {shown.length === 0 ? (
            <p className="mt-8 text-muted">{t.result.noneInFilter}</p>
          ) : (
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {shown.map((r, i) => {
                const featured = r.perfumeId === best && sort === "match" && origin === "all";
                return (
                  <motion.li key={r.perfumeId} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.05 }}
                    className={featured ? "sm:col-span-2" : ""}>
                    <RecCard r={r} featured={featured}>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span>{rated[r.perfumeId] ? t.result.thanks : t.result.rate}</span>
                        <span role="group" aria-label={t.result.rate} className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} type="button" onClick={() => rate(r.perfumeId, n)} aria-pressed={rated[r.perfumeId] === n}
                              className={`h-9 w-9 rounded-full border text-sm ${rated[r.perfumeId] && n <= rated[r.perfumeId] ? "border-amber bg-amber text-ink" : "border-line hover:border-muted"}`}>
                              {n}
                            </button>
                          ))}
                        </span>
                      </div>
                    </RecCard>
                  </motion.li>
                );
              })}
            </ol>
          )}
          <p className="mt-6 text-xs text-muted">{t.result.priceNote} {t.result.unverified}</p>
        </>
      )}
    </div>
  );
}

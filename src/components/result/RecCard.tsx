"use client";
import { useLocale } from "@/components/LocaleProvider";
import { ACCORD_MAP } from "@/data/accords";
import { idrShort, shopLinks } from "@/lib/format";
import type { Recommendation } from "@/lib/types";

const TIER: Record<Recommendation["tier"], { id: string; en: string }> = {
  affordable: { id: "Terjangkau", en: "Affordable" },
  mid: { id: "Menengah", en: "Mid-range" },
  designer: { id: "Designer", en: "Designer" },
  niche: { id: "Niche", en: "Niche" },
};

export function RecCard({ r, featured = false, children, preview = false }: { r: Recommendation; featured?: boolean; children?: React.ReactNode; preview?: boolean }) {
  const { t, locale } = useLocale();
  const links = shopLinks(r.brand, r.name);
  return (
    <div className={`flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${featured ? "border-amber/70 bg-amber/[0.05]" : "border-line bg-ink-2/40"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            <span>{r.brand}</span>
            <span aria-hidden>·</span>
            <span>{TIER[r.tier][locale]}</span>
            {r.origin === "local" && <span className="rounded-full border border-amber/60 px-2 py-0.5 normal-case tracking-normal text-amber">{t.result.local}</span>}
          </p>
          <p className={`mt-1 font-display leading-tight ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{r.name}</p>
        </div>
        <p className="shrink-0 text-right leading-none">
          <span className="font-display text-3xl tabular-nums text-amber">{r.match}%</span>
          <span className="mt-1 block text-[11px] text-muted">{t.result.match}</span>
        </p>
      </div>

      <p className="mt-3 text-sm">
        <span className="font-semibold">± {idrShort(r.priceIdr)}</span>
        <span className="text-muted"> · {r.sizeMl} ml · {t.result.priceEst}</span>
      </p>

      {r.sharedAccords.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          {t.result.because}:
          {r.sharedAccords.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-paper/90">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCORD_MAP[a].color }} aria-hidden />
              {ACCORD_MAP[a].name[locale]}
            </span>
          ))}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-[3.75rem_1fr] gap-x-3 gap-y-1 text-sm">
        {(["top", "heart", "base"] as const).map((pos) => (
          <div key={pos} className="contents">
            <dt className="text-muted">{t.result[pos]}</dt>
            <dd>{r.notes[pos].join(", ")}</dd>
          </div>
        ))}
      </dl>
      {r.notesApprox && <p className="mt-2 text-xs text-muted">{t.result.notesApprox}</p>}

      {!preview && (
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={links.shopee} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-xs font-semibold hover:border-amber">{t.result.shopee}</a>
          <a href={links.tokopedia} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-xs font-semibold hover:border-amber">{t.result.tokopedia}</a>
        </div>
      )}
      {children && <div className="mt-auto pt-5">{children}</div>}
    </div>
  );
}

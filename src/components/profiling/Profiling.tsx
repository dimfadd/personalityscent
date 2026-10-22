"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { PyramidMark } from "@/components/PyramidMark";
import { ACCORD_MAP } from "@/data/accords";
import { ASPIRATIONS, IPIP_ITEMS, LIKERT, SCENARIOS, SMELLS } from "@/data/questions";
import type { AccordId, Climate, Expression, Intensity, Occasion, PriceTier, ProfileAnswers } from "@/lib/types";

type Draft = Omit<ProfileAnswers, "locale">;
const EMPTY: Draft = {
  ipip: {},
  liked: [],
  disliked: [],
  scenarios: {},
  aspirations: [],
  occasion: "daily",
  intensity: 2,
  expression: "any",
  budget: "any",
  climate: "tropical",
  story: "",
};
const DRAFT_KEY = "ps_draft_v1";

type Step =
  | { kind: "ipip"; items: typeof IPIP_ITEMS }
  | { kind: "liked" }
  | { kind: "disliked" }
  | { kind: "scenario"; index: number }
  | { kind: "aspirations" }
  | { kind: "context" }
  | { kind: "story" };

const STEPS: Step[] = [
  ...[0, 1, 2, 3, 4].map((i) => ({ kind: "ipip" as const, items: IPIP_ITEMS.slice(i * 4, i * 4 + 4) })),
  { kind: "liked" },
  { kind: "disliked" },
  ...SCENARIOS.map((_, index) => ({ kind: "scenario" as const, index })),
  { kind: "aspirations" },
  { kind: "context" },
  { kind: "story" },
];
// Progress is shown as the three pyramid bands: personality, scent, you.
const BANDS = [
  [0, 4],
  [5, 9],
  [10, 12],
];

function primaryAccord(id: string): AccordId {
  const s = SMELLS.find((x) => x.id === id)!;
  return (Object.entries(s.accords).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] ?? "musky") as AccordId;
}

// The draft is read once on load; later writes come from this component itself.
let initialDraft: string | null | undefined;
function readDraft() {
  if (initialDraft === undefined) {
    try { initialDraft = localStorage.getItem(DRAFT_KEY); } catch { initialDraft = null; }
  }
  return initialDraft;
}
const noopSubscribe = () => () => {};

function save(d: Draft, step: number) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step })); } catch { /* ignore */ }
}

export function Profiling() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const storedDraft = useSyncExternalStore(noopSubscribe, readDraft, () => null);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const resume = useMemo(() => {
    if (resumeDismissed || !storedDraft) return null;
    try {
      const parsed = JSON.parse(storedDraft);
      return parsed?.d && typeof parsed.step === "number" && parsed.step > 0 ? (parsed as { d: Draft; step: number }) : null;
    } catch {
      return null;
    }
  }, [storedDraft, resumeDismissed]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [aiOn, setAiOn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/status").then((r) => r.json()).then((s) => setAiOn(Boolean(s.ai))).catch(() => setAiOn(false));
  }, []);

  const update = (patch: Partial<Draft>) => setDraft((d) => { const n = { ...d, ...patch }; save(n, step); return n; });

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setDraft((d) => { save(d, to); return d; });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const current = STEPS[step];
  const valid = useMemo(() => {
    switch (current.kind) {
      case "ipip": return current.items.every((i) => draft.ipip[i.id]);
      case "liked": return draft.liked.length >= 3;
      case "disliked": return true;
      case "scenario": return Boolean(draft.scenarios[SCENARIOS[current.index].id]);
      case "aspirations": return draft.aspirations.length === 2;
      default: return true;
    }
  }, [current, draft]);

  async function submit() {
    setSubmitting(true);
    setError(false);
    const started = Date.now();
    try {
      const body: ProfileAnswers = { ...draft, locale, story: draft.story?.trim() || undefined };
      const r = await fetch("/api/profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      const { id } = await r.json();
      // Let the composing animation finish one pass so the reveal does not feel abrupt.
      const wait = Math.max(0, 3200 - (Date.now() - started));
      await new Promise((res) => setTimeout(res, reduce ? 0 : wait));
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      router.push(`/result/${id}`);
    } catch {
      setError(true);
      setSubmitting(false);
    }
  }

  const toggle = (key: "liked" | "disliked" | "aspirations", id: string, max: number) => {
    const list = draft[key];
    if (list.includes(id)) update({ [key]: list.filter((x) => x !== id) });
    else if (list.length < max) update({ [key]: [...list, id] });
  };

  if (submitting) return <Composing />;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-paper">
            <PyramidMark size={18} /> {t.profiling.exit}
          </Link>
          <div className="flex flex-1 items-center justify-center gap-1.5" aria-label={`${t.profiling.step} ${step + 1} ${t.profiling.of} ${STEPS.length}`} role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            {BANDS.map(([a, b], i) => {
              const pct = step > b ? 100 : step < a ? 0 : ((step - a + 1) / (b - a + 1)) * 100;
              return (
                <span key={i} className="h-1.5 w-10 overflow-hidden rounded-full bg-line sm:w-16">
                  <motion.span className="block h-full bg-amber" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
                </span>
              );
            })}
          </div>
          <LangSwitch />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-36 pt-8 sm:pt-12">
        {resume && step === 0 && (
          <div className="mb-8 rounded-xl border border-amber/50 bg-amber/[0.06] p-4">
            <p className="font-semibold">{t.profiling.resumeTitle}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="min-h-11 rounded-md bg-amber px-4 text-sm font-semibold text-ink" onClick={() => { setDraft({ ...EMPTY, ...resume.d }); setStep(resume.step); setResumeDismissed(true); }}>
                {t.profiling.resume}
              </button>
              <button type="button" className="min-h-11 rounded-md border border-line px-4 text-sm" onClick={() => { setResumeDismissed(true); try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } }}>
                {t.profiling.restart}
              </button>
            </div>
          </div>
        )}

        <p className="label mb-3">{t.profiling.step} {step + 1} {t.profiling.of} {STEPS.length}</p>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={reduce ? false : { opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 * dir }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {current.kind === "ipip" && (
              <>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t.profiling.ipipTitle}</h1>
                <p className="mt-2 text-sm text-muted">{t.profiling.ipipHint}</p>
                <div className="mt-8 space-y-8">
                  {current.items.map((item) => (
                    <fieldset key={item.id}>
                      <legend className="mb-3 text-lg font-medium">{item.text[locale]}</legend>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {LIKERT.map((label, i) => {
                          const v = i + 1;
                          const on = draft.ipip[item.id] === v;
                          return (
                            <label key={v} className={`flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-lg border px-1 py-2 text-center text-[11px] leading-tight transition-colors sm:text-xs ${on ? "border-amber bg-amber/15 text-paper" : "border-line text-muted hover:border-muted"} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber`}>
                              <input type="radio" className="sr-only" name={item.id} value={v} checked={on} onChange={() => update({ ipip: { ...draft.ipip, [item.id]: v } })} />
                              <span className="mb-1 font-display text-lg text-paper">{v}</span>
                              <span className="hidden sm:block">{label[locale]}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="mt-1.5 flex justify-between text-[11px] text-muted sm:hidden">
                        <span>{LIKERT[0][locale]}</span>
                        <span>{LIKERT[4][locale]}</span>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </>
            )}

            {(current.kind === "liked" || current.kind === "disliked") && (
              <>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">{current.kind === "liked" ? t.profiling.likedTitle : t.profiling.dislikedTitle}</h1>
                <p className="mt-2 text-sm text-muted">{current.kind === "liked" ? t.profiling.likedHint : t.profiling.dislikedHint}</p>
                <p className="mt-4 text-sm tabular-nums text-amber">{draft[current.kind].length} {t.profiling.selected}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SMELLS.filter((s) => current.kind === "liked" || !draft.liked.includes(s.id)).map((s) => {
                    const key = current.kind as "liked" | "disliked";
                    const on = draft[key].includes(s.id);
                    const max = key === "liked" ? 8 : 5;
                    const full = !on && draft[key].length >= max;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={on}
                        disabled={full}
                        onClick={() => toggle(key, s.id, max)}
                        className={`flex min-h-14 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-all ${on ? (key === "liked" ? "border-amber bg-amber/15" : "border-muted bg-ink-3 line-through decoration-muted") : "border-line hover:border-muted"} disabled:opacity-40`}
                      >
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: ACCORD_MAP[primaryAccord(s.id)].color }} aria-hidden />
                        {s.label[locale]}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {current.kind === "scenario" && (() => {
              const sc = SCENARIOS[current.index];
              return (
                <>
                  <h1 className="font-display text-3xl leading-tight sm:text-4xl">{sc.prompt[locale]}</h1>
                  <div className="mt-8 grid gap-2.5">
                    {sc.options.map((o) => {
                      const on = draft.scenarios[sc.id] === o.id;
                      const dots = (Object.keys(o.accords) as AccordId[]).slice(0, 3);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            update({ scenarios: { ...draft.scenarios, [sc.id]: o.id } });
                            setTimeout(() => go(step + 1), reduce ? 0 : 280);
                          }}
                          className={`flex min-h-16 items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${on ? "border-amber bg-amber/15" : "border-line hover:border-muted"}`}
                        >
                          <span className="font-display text-xl sm:text-2xl">{o.label[locale]}</span>
                          <span className="flex -space-x-1" aria-hidden>
                            {dots.map((d) => <span key={d} className="h-4 w-4 rounded-full border border-ink" style={{ background: ACCORD_MAP[d].color }} />)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}

            {current.kind === "aspirations" && (
              <>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t.profiling.aspTitle}</h1>
                <p className="mt-2 text-sm text-muted">{t.profiling.aspHint}</p>
                <div className="mt-8 grid grid-cols-2 gap-2">
                  {ASPIRATIONS.map((a) => {
                    const on = draft.aspirations.includes(a.id);
                    const full = !on && draft.aspirations.length >= 2;
                    return (
                      <button key={a.id} type="button" aria-pressed={on} disabled={full} onClick={() => toggle("aspirations", a.id, 2)}
                        className={`min-h-16 rounded-xl border px-4 py-3 text-left font-display text-xl transition-colors ${on ? "border-amber bg-amber/15" : "border-line hover:border-muted"} disabled:opacity-40`}>
                        {a.label[locale]}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {current.kind === "context" && (
              <>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t.profiling.ctxTitle}</h1>
                <div className="mt-8 space-y-8">
                  <Choice legend={t.profiling.occasion} value={draft.occasion} options={(["daily", "night", "date", "all"] as Occasion[]).map((v) => [v, t.profiling.occasions[v]])} onChange={(v) => update({ occasion: v as Occasion })} />
                  <Choice legend={t.profiling.intensity} value={String(draft.intensity)} options={([1, 2, 3] as Intensity[]).map((v) => [String(v), t.profiling.intensities[v]])} onChange={(v) => update({ intensity: Number(v) as Intensity })} />
                  <Choice legend={t.profiling.expression} value={draft.expression} options={(["feminine", "masculine", "any"] as Expression[]).map((v) => [v, t.profiling.expressions[v]])} onChange={(v) => update({ expression: v as Expression })} />
                  <Choice legend={t.profiling.budget} value={draft.budget} options={(["any", "affordable", "mid", "designer", "niche"] as (PriceTier | "any")[]).map((v) => [v, t.profiling.budgets[v]])} onChange={(v) => update({ budget: v as PriceTier | "any" })} />
                  <Choice legend={t.profiling.climate} value={draft.climate} options={(["tropical", "temperate"] as Climate[]).map((v) => [v, t.profiling.climates[v]])} onChange={(v) => update({ climate: v as Climate })} />
                </div>
              </>
            )}

            {current.kind === "story" && (
              <>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t.profiling.storyTitle}</h1>
                <p className="mt-2 text-sm text-muted">{t.profiling.storyHint}</p>
                <label className="sr-only" htmlFor="story">{t.profiling.storyTitle}</label>
                <textarea
                  id="story"
                  rows={6}
                  maxLength={1200}
                  value={draft.story ?? ""}
                  onChange={(e) => update({ story: e.target.value })}
                  placeholder={t.profiling.storyPlaceholder}
                  className="mt-6 w-full rounded-xl border border-line bg-ink-2 p-4 font-display text-xl leading-relaxed text-paper placeholder:text-muted/70 focus:border-amber focus:outline-none"
                />
                <p className="mt-2 text-right text-xs tabular-nums text-muted">{(draft.story ?? "").length}/1200</p>
                {aiOn === false && <p className="mt-2 text-sm text-muted">{t.profiling.storyAiOff}</p>}
                {error && (
                  <p role="alert" className="mt-4 rounded-lg border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-200">{t.profiling.error}</p>
                )}
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="min-h-12 rounded-md border border-line px-5 text-sm disabled:invisible">
            {t.profiling.back}
          </button>
          {current.kind === "disliked" && draft.disliked.length === 0 ? (
            <button type="button" onClick={() => go(step + 1)} className="min-h-12 rounded-md border border-line px-5 text-sm">{t.profiling.skip}</button>
          ) : step < STEPS.length - 1 ? (
            <button type="button" onClick={() => go(step + 1)} disabled={!valid} className="min-h-12 rounded-md bg-amber px-6 text-sm font-semibold text-ink transition-opacity disabled:opacity-40">
              {t.profiling.next}
            </button>
          ) : (
            <button type="button" onClick={submit} className="min-h-12 rounded-md bg-amber px-6 text-sm font-semibold text-ink">
              {error ? t.profiling.retry : t.profiling.finish}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function Choice({ legend, value, options, onChange }: { legend: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, label]) => (
          <label key={v} className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg border px-4 text-sm transition-colors ${value === v ? "border-amber bg-amber/15 text-paper" : "border-line text-muted hover:border-muted"} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber`}>
            <input type="radio" className="sr-only" name={legend} value={v} checked={value === v} onChange={() => onChange(v)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Purpose: the wait for scoring + AI becomes part of the ritual instead of a spinner. */
function Composing() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => Math.min(x + 1, t.profiling.submittingSteps.length - 1)), 800);
    return () => clearInterval(id);
  }, [t]);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center" role="status" aria-live="polite">
      <div className="flex w-56 flex-col items-center gap-2.5">
        {[0.45, 0.72, 1].map((w, k) => (
          <motion.span
            key={k}
            className={`h-3 rounded ${k === 0 ? "bg-amber" : "bg-paper/70"}`}
            style={{ width: `${w * 100}%` }}
            initial={reduce ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: k === 0 ? 1 : 0.4 + k * 0.2 }}
            transition={{ duration: 0.8, delay: k * 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <p className="mt-10 font-display text-3xl">{t.profiling.submitting}</p>
      <AnimatePresence mode="wait">
        <motion.p key={i} className="mt-3 text-sm text-muted" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          {t.profiling.submittingSteps[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

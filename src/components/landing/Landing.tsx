"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { Wordmark } from "@/components/PyramidMark";
import { SiteFooter } from "@/components/SiteFooter";
import { RecCard } from "@/components/result/RecCard";
import { Simulation } from "./Simulation";
import { ACCORD_MAP } from "@/data/accords";
import { WEIGHTS } from "@/lib/weights";
import { idr, idrShort } from "@/lib/format";
import type { Locale, Recommendation, ScentProfile } from "@/lib/types";

export type Showcase = {
  profile: Omit<ScentProfile, "narrative">;
  narrative: Record<Locale, ScentProfile["narrative"]>;
  shown: Recommendation[];
  total: number;
  minPrice: number;
  maxPrice: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Purpose: soft scroll reveal paces a long sales page; disabled for reduced motion. */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function PrimaryCta({ className = "", id }: { className?: string; id?: string }) {
  const { t } = useLocale();
  return (
    <Link
      id={id}
      href="/profiling"
      className={`group relative inline-flex min-h-13 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#ecd59f] to-amber px-7 py-3.5 text-base font-semibold text-ink shadow-[0_10px_40px_-12px_rgba(207,169,104,0.6)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {t.hero.cta}
    </Link>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="label mb-4 text-amber">{children}</p>;
}

function Header() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const links = [
    ["#how", t.nav.how],
    ["#showcase", t.nav.sample],
    ["#science", t.nav.science],
    ["#pricing", t.nav.pricing],
    ["#faq", t.nav.faq],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="Personality Scent" className="shrink-0">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted lg:flex" aria-label="Main">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-paper">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch className="hidden sm:inline-flex" />
          <Link href="/profiling" className="hidden min-h-11 items-center rounded-full bg-amber px-5 text-sm font-semibold text-ink hover:bg-paper md:inline-flex">
            {t.nav.start}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d={open ? "M3 3l12 12M15 3L3 15" : "M2 6h14M2 12h14"} stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <div className="px-4 pb-5 pt-2">
              {links.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line/60 font-display text-xl text-paper">{label}</a>
              ))}
              <div className="mt-4 flex items-center justify-between gap-3">
                <LangSwitch />
                <Link href="/profiling" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-amber font-semibold text-ink">{t.nav.start}</Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber/[0.07] blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pb-28">
        <div>
          <p className="label mb-5 text-amber">{t.hero.eyebrow}</p>
          <h1 className="font-display text-[2.6rem] font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.3rem]">
            {t.hero.title1}
            <br />
            <em className="text-gold">{t.hero.title2}</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">{t.hero.sub}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryCta id="hero-cta" />
            <a href="#showcase" className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-paper underline-offset-8 hover:underline">
              {t.hero.secondary}
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {t.hero.micro.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-amber" aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <Simulation />
      </div>
    </section>
  );
}

function Problem() {
  const { t } = useLocale();
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <Reveal>
          <Kicker>{t.problem.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-[1.08] sm:text-5xl">{t.problem.title}</h2>
        </Reveal>
        <div>
          <ol className="divide-y divide-line border-y border-line">
            {t.problem.items.map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <li className="flex gap-5 py-6">
                  <span className="font-display text-2xl text-amber/70 tabular-nums">0{i + 1}</span>
                  <div>
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="mt-1 text-muted">{body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-10 font-display text-3xl italic leading-snug text-gold sm:text-[2.1rem]">{t.problem.turn}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The three steps are drawn as the note pyramid itself (identity motif): narrow top, wide base. */
function Steps() {
  const { t } = useLocale();
  const widths = ["lg:w-[62%]", "lg:w-[81%]", "lg:w-full"];
  return (
    <section id="how" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="text-center">
          <Kicker>{t.steps.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.steps.title}</h2>
        </Reveal>
        <div className="mt-14 flex flex-col items-center gap-3">
          {t.steps.items.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.12} className={`w-full ${widths[i]}`}>
              <div className={`flex flex-col gap-2 rounded-2xl border px-6 py-6 sm:flex-row sm:items-center sm:gap-8 sm:px-8 ${i === 2 ? "border-amber/60 bg-amber/[0.06]" : "border-line bg-ink-2"}`}>
                <span className="font-display text-5xl leading-none text-gold">{i + 1}</span>
                <div>
                  <p className="font-display text-2xl">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <PrimaryCta />
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection({ s }: { s: Showcase }) {
  const { t, locale } = useLocale();
  const p = s.profile;
  const family = p.family.secondary ? `${p.family.primary[locale]} ${p.family.secondary[locale]}` : p.family.primary[locale];
  const fill = (str: string) => str.replace("{n}", String(s.total)).replace("{min}", idrShort(s.minPrice)).replace("{max}", idrShort(s.maxPrice));
  const hidden = s.total - s.shown.length;

  return (
    <section id="showcase" className="scroll-mt-20 border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <Kicker>{t.showcase.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.showcase.title}</h2>
        </Reveal>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Free */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-ink p-6 sm:p-8">
              <p className="label">{t.showcase.freeLabel}</p>
              <p className="mt-1 font-display text-2xl text-muted">{t.showcase.freeTitle}</p>
              <p className="mt-6 font-display text-5xl leading-none">{family}</p>
              <p className="mt-3 font-display text-xl italic text-gold">{s.narrative[locale].title}</p>
              <div className="mt-7 flex flex-col items-center gap-2">
                {(["top", "heart", "base"] as const).map((pos, i) => (
                  <div key={pos} style={{ width: `${[64, 82, 100][i]}%` }} className={`rounded-xl border px-3 py-3 text-center ${i === 0 ? "border-amber/60 bg-amber/[0.07]" : "border-line bg-ink-2"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{t.result[pos]}</p>
                    <p className="mt-0.5 font-display text-lg leading-snug">{p.pyramid[pos].map((n) => n.name[locale]).join(" · ")}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 space-y-2.5">
                {p.topAccords.slice(0, 4).map((a) => (
                  <div key={a.id} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span>{ACCORD_MAP[a.id].name[locale]}</span>
                    <span className="h-1.5 rounded-full bg-line">
                      <motion.span className="block h-full rounded-full" style={{ background: ACCORD_MAP[a.id].color }} initial={{ width: 0 }} whileInView={{ width: `${a.score}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} />
                    </span>
                    <span className="text-right tabular-nums text-muted">{a.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Paid */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-amber/60 bg-gradient-to-b from-amber/[0.08] to-transparent p-6 sm:p-8">
              <p className="label text-amber">{t.showcase.paidLabel}</p>
              <p className="mt-1 font-display text-2xl">{t.showcase.paidTitle}</p>
              <p className="mt-3 text-sm text-paper/80">{fill(t.showcase.range)}</p>
              <ol className="mt-6 grid gap-3">
                {s.shown.map((r, i) => (
                  <li key={r.perfumeId}><RecCard r={r} featured={i === 0} preview /></li>
                ))}
              </ol>
              {hidden > 0 && (
                <div className="relative mt-3" aria-label={fill(t.showcase.more.replace("{n}", String(hidden)))}>
                  <div aria-hidden className="space-y-3 blur-[6px]">
                    {[0, 1].map((k) => (
                      <div key={k} className="h-24 rounded-2xl border border-line bg-ink-2/60 p-5">
                        <div className="h-3 w-28 rounded bg-line" />
                        <div className="mt-3 h-5 w-48 rounded bg-line" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
                    <p className="font-display text-2xl">{t.showcase.more.replace("{n}", String(hidden))}</p>
                    <p className="max-w-xs text-xs text-muted">{t.showcase.filters}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
        <p className="mt-6 text-xs text-muted">{t.showcase.note}</p>
      </div>
    </section>
  );
}

function Formula() {
  const { t } = useLocale();
  const weights = [WEIGHTS.liked, WEIGHTS.scenarios, WEIGHTS.aspirations, WEIGHTS.personality, WEIGHTS.story];
  return (
    <section id="formula" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <Reveal>
          <Kicker>{t.formula.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.formula.title}</h2>
          <p className="mt-5 leading-relaxed text-muted">{t.formula.body}</p>
        </Reveal>
        <ol className="space-y-6">
          {t.formula.rows.map(([name, desc], i) => (
            <Reveal key={name} delay={i * 0.06}>
              <li className="grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[6rem_1fr]">
                <span className="font-display text-4xl leading-none text-gold sm:text-5xl">{Math.round(weights[i] * 100)}%</span>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
                    <motion.div className="h-full rounded-full bg-amber" initial={{ width: 0 }} whileInView={{ width: `${(weights[i] / WEIGHTS.liked) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} />
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
          <Reveal>
            <p className="rounded-xl border border-line p-4 text-sm text-muted">{t.formula.dislike}</p>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

function Science() {
  const { t } = useLocale();
  return (
    <section id="science" className="scroll-mt-20 border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <Kicker>{t.science.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.science.title}</h2>
          <p className="mt-5 text-muted">{t.science.intro}</p>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {t.science.items.map(([kind, title, body, use], i) => (
            <Reveal key={title} delay={i * 0.04}>
              <div className="grid gap-3 py-7 md:grid-cols-[7rem_1fr_16rem] md:gap-8">
                <span className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold ${kind === "strong" ? "bg-amber text-ink" : "border border-muted/60 text-muted"}`}>
                  {kind === "strong" ? t.science.strong : t.science.weak}
                </span>
                <div>
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
                <p className="text-sm text-paper/85 md:pt-1">{use}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 max-w-3xl font-display text-2xl italic leading-snug text-paper/90">{t.science.genetic}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing({ price }: { price: number }) {
  const { t } = useLocale();
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <Kicker>{t.pricing.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.pricing.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-line p-7 sm:p-8">
              <p className="label">{t.pricing.freeName}</p>
              <p className="mt-3 font-display text-5xl">{t.pricing.free}</p>
              <ul className="mt-6 space-y-3 text-sm text-paper/80">
                {t.pricing.freeItems.map((x) => <li key={x} className="flex gap-3"><Check muted />{x}</li>)}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-amber/70 bg-gradient-to-b from-amber/[0.09] to-transparent p-7 sm:p-8">
              <p className="label text-amber">{t.pricing.paidName}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
                <span className="text-gold font-display text-6xl">{idr(price)}</span>
                <span className="text-sm text-muted">{t.pricing.once}</span>
              </p>
              <p className="mt-2 font-display text-xl italic text-paper/90">{t.pricing.anchor}</p>
              <ul className="mt-6 space-y-3 text-sm text-paper">
                {t.pricing.paidItems.map((x) => <li key={x} className="flex gap-3"><Check />{x}</li>)}
              </ul>
              <p className="mt-6 text-xs text-muted">{t.pricing.payNote}</p>
            </div>
          </Reveal>
        </div>
        <div className="mt-10">
          <Link href="/profiling" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber/60 px-7 font-semibold text-paper hover:bg-amber hover:text-ink">
            {t.pricing.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Check({ muted = false }: { muted?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={`mt-0.5 shrink-0 ${muted ? "text-muted" : "text-amber"}`}>
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Faq() {
  const { t } = useLocale();
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:py-28">
        <div>
          <Kicker>{t.faq.kicker}</Kicker>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.faq.title}</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {t.faq.items.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-amber transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 max-w-2xl pb-2 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Final() {
  const { t } = useLocale();
  return (
    <section id="final" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.08] blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <Reveal>
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">{t.final.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-paper/80">{t.final.sub}</p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <PrimaryCta id="final-cta" />
            <p className="text-sm text-muted">{t.hero.micro.join(" · ")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Mobile-only bar so the CTA is always one tap away once the hero button scrolls out of view. */
function StickyCta() {
  const { t } = useLocale();
  const [heroVisible, setHeroVisible] = useState(true);
  const [finalVisible, setFinalVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const fin = document.getElementById("final");
    if (!hero || !fin) return;
    const o1 = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
    const o2 = new IntersectionObserver(([e]) => setFinalVisible(e.isIntersecting));
    o1.observe(hero);
    o2.observe(fin);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);
  const show = !heroVisible && !finalVisible;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
        >
          <Link href="/profiling" className="flex min-h-12 items-center justify-center rounded-full bg-gradient-to-b from-[#ecd59f] to-amber font-semibold text-ink">
            {t.hero.cta} · {t.hero.micro[0]}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Landing({ price, showcase }: { price: number; showcase: Showcase }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Steps />
        <ShowcaseSection s={showcase} />
        <Formula />
        <Science />
        <Pricing price={price} />
        <Faq />
        <Final />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}

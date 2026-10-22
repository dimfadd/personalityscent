"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { Wordmark } from "@/components/PyramidMark";
import { Simulation } from "./Simulation";
import { ACCORD_MAP } from "@/data/accords";
import { NOTE_MAP } from "@/data/notes";
import { WEIGHTS } from "@/lib/weights";
import type { AccordId } from "@/lib/types";

const formatIdr = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** Purpose: soft scroll reveal paces long sections; disabled for reduced motion. */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Header() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const links = [
    ["#formula", t.nav.how],
    ["#science", t.nav.science],
    ["#pricing", t.nav.pricing],
    ["#faq", t.nav.faq],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Personality Scent">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Main">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-paper">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Link href="/profiling" className="hidden min-h-10 items-center rounded-md bg-amber px-4 text-sm font-semibold text-ink hover:bg-paper sm:inline-flex">
            {t.nav.start}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d={open ? "M3 3l12 12M15 3L3 15" : "M2 5h14M2 9h14M2 13h14"} stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line px-4 pb-4 md:hidden" aria-label="Mobile">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-paper">{label}</a>
          ))}
          <Link href="/profiling" className="mt-2 flex min-h-11 items-center justify-center rounded-md bg-amber font-semibold text-ink">
            {t.nav.start}
          </Link>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-28">
        <div>
          <p className="label mb-5">{t.hero.eyebrow}</p>
          <h1 className="font-display text-[2.9rem] font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero.title1}
            <br />
            <em className="text-amber">{t.hero.title2}</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.hero.sub}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/profiling" className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 font-semibold text-ink transition-colors hover:bg-paper">
              {t.hero.cta}
            </Link>
            <a href="#formula" className="inline-flex min-h-12 items-center justify-center rounded-md border border-line px-6 text-paper hover:border-muted">
              {t.hero.secondary}
            </a>
          </div>
        </div>
        <Simulation />
      </div>
    </section>
  );
}

function Formula() {
  const { t } = useLocale();
  const weights = [WEIGHTS.liked, WEIGHTS.scenarios, WEIGHTS.aspirations, WEIGHTS.personality, WEIGHTS.story];
  return (
    <section id="formula" className="scroll-mt-20 border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <Reveal>
          <p className="label mb-4">{t.formula.kicker}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.formula.title}</h2>
          <p className="mt-5 text-muted leading-relaxed">{t.formula.body}</p>
        </Reveal>
        <ol className="space-y-6">
          {t.formula.rows.map(([name, desc], i) => (
            <Reveal key={name} delay={i * 0.06}>
              <li className="grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[6rem_1fr]">
                <span className="font-display text-4xl leading-none text-amber sm:text-5xl">{Math.round(weights[i] * 100)}%</span>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full rounded-full bg-amber"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${weights[i] / WEIGHTS.liked * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
          <Reveal>
            <p className="rounded-lg border border-line p-4 text-sm text-muted">{t.formula.dislike}</p>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

function Science() {
  const { t } = useLocale();
  return (
    <section id="science" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="label mb-4">{t.science.kicker}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.science.title}</h2>
          <p className="mt-5 text-muted">{t.science.intro}</p>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {t.science.items.map(([kind, title, body, use], i) => (
            <Reveal key={title} delay={i * 0.04}>
              <div className="grid gap-3 py-7 md:grid-cols-[7rem_1fr_16rem] md:gap-8">
                <span className={`h-fit w-fit rounded px-2 py-1 text-xs font-semibold ${kind === "strong" ? "bg-amber text-ink" : "border border-muted/60 text-muted"}`}>
                  {kind === "strong" ? t.science.strong : t.science.weak}
                </span>
                <div>
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
                <p className="text-sm text-paper/90 md:pt-1">{use}</p>
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

const SAMPLE: { id: AccordId; score: number }[] = [
  { id: "woody", score: 100 },
  { id: "amber", score: 82 },
  { id: "gourmand", score: 64 },
  { id: "earthy", score: 51 },
  { id: "warm_spicy", score: 40 },
];
const SAMPLE_PYR = { top: ["cardamom", "bergamot"], heart: ["coffee", "cinnamon"], base: ["sandalwood", "vetiver", "benzoin"] };

function Sample() {
  const { t, locale } = useLocale();
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <Reveal className="lg:order-2">
          <p className="label mb-4">{t.sample.kicker}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.sample.title}</h2>
          <ul className="mt-6 space-y-2 text-muted">
            {t.pricing.freeItems.map((x) => (
              <li key={x} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />{x}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="lg:order-1">
          <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8 lg:-rotate-1">
            <p className="label">{t.result.kicker}</p>
            <p className="mt-2 font-display text-3xl">{t.sample.name}</p>
            <div className="mt-6 space-y-3">
              {SAMPLE.map((a) => (
                <div key={a.id} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm">
                  <span>{ACCORD_MAP[a.id].name[locale]}</span>
                  <span className="h-2 rounded-full bg-line">
                    <span className="block h-full rounded-full" style={{ width: `${a.score}%`, background: ACCORD_MAP[a.id].color }} />
                  </span>
                  <span className="text-right text-muted tabular-nums">{a.score}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs">
              {(["top", "heart", "base"] as const).map((pos) => (
                <div key={pos} className="rounded-lg border border-line p-3">
                  <p className="label mb-1">{t.result[pos]}</p>
                  {SAMPLE_PYR[pos].map((n) => <p key={n} className="text-paper">{NOTE_MAP[n].name[locale]}</p>)}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted">{t.sample.disclaimer}</p>
          </div>
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
          <p className="label mb-4">{t.pricing.kicker}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.pricing.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="h-full rounded-2xl border border-line p-7">
              <p className="label">{t.pricing.freeName}</p>
              <p className="mt-3 font-display text-5xl">{t.pricing.free}</p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {t.pricing.freeItems.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className="text-paper">+</span>{x}</li>)}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-amber/70 bg-amber/[0.06] p-7">
              <p className="label text-amber">{t.pricing.paidName}</p>
              <p className="mt-3 font-display text-5xl">{formatIdr(price)} <span className="font-sans text-sm text-muted">{t.pricing.once}</span></p>
              <ul className="mt-6 space-y-3 text-sm text-paper/90">
                {t.pricing.paidItems.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className="text-amber">+</span>{x}</li>)}
              </ul>
              <p className="mt-6 text-xs text-muted">{t.pricing.payNote}</p>
            </div>
          </Reveal>
        </div>
        <div className="mt-10">
          <Link href="/profiling" className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 font-semibold text-ink hover:bg-paper">
            {t.pricing.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLocale();
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:py-28">
        <div>
          <p className="label mb-4">{t.faq.kicker}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.faq.title}</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {t.faq.items.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span aria-hidden className="text-amber transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Wordmark />
          <p className="mt-2">{t.footer.note}</p>
        </div>
        <LangSwitch />
      </div>
    </footer>
  );
}

export function Landing({ price }: { price: number }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Formula />
        <Science />
        <Sample />
        <Pricing price={price} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

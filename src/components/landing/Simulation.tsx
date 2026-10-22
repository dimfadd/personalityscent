"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { ACCORD_MAP } from "@/data/accords";
import { NOTE_MAP } from "@/data/notes";
import { SMELLS } from "@/data/questions";
import type { AccordId } from "@/lib/types";

/** Purpose: explain the whole product (pick smells -> pyramid) in one loop, before any reading. */
const CHIPS = ["jasmine", "petrichor", "coffee", "laundry", "orange_peel", "leather_jacket"];
const PICKS = ["jasmine", "petrichor", "coffee"];
const PYRAMID: { pos: "top" | "heart" | "base"; notes: string[]; width: string }[] = [
  { pos: "top", notes: ["bergamot", "rain"], width: "56%" },
  { pos: "heart", notes: ["jasmine", "coffee"], width: "78%" },
  { pos: "base", notes: ["vetiver", "vanilla"], width: "100%" },
];

export function Simulation() {
  const { t, locale } = useLocale();
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  // tick 0..3 = picking chips, 4..7 = pyramid builds, then loop
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((x) => (x + 1) % 9), 900);
    return () => clearInterval(id);
  }, [reduce]);

  const phase = reduce ? "pyramid" : tick < 4 ? "pick" : "pyramid";
  const picked = reduce ? PICKS : PICKS.slice(0, Math.max(0, tick));
  const bands = reduce ? 3 : Math.max(0, tick - 4);

  return (
    <figure aria-label={t.hero.simLabel} className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-10 rounded-full bg-amber/10 blur-3xl" />
      <div className="relative rounded-2xl border border-line bg-ink-2 p-5 sm:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="mb-5 flex items-center justify-between">
          <span className="label">{t.hero.simLabel}</span>
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1 w-6 rounded-full ${phase === "pyramid" && i <= bands - 1 ? "bg-amber" : i === 0 ? "bg-amber" : "bg-line"}`} />
            ))}
          </span>
        </div>

        <div className="min-h-[260px] sm:min-h-[280px]">
          <AnimatePresence mode="wait">
            {phase === "pick" ? (
              <motion.div key="pick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
                <p className="font-display text-2xl leading-snug sm:text-3xl">{t.sim.q}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {CHIPS.map((id) => {
                    const s = SMELLS.find((x) => x.id === id)!;
                    const on = picked.includes(id);
                    const accord = (Object.keys(s.accords)[0] ?? "musky") as AccordId;
                    return (
                      <motion.span
                        key={id}
                        animate={on ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${on ? "border-amber bg-amber/15 text-paper" : "border-line text-muted"}`}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: ACCORD_MAP[accord].color }} />
                        {s.label[locale]}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="pyr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <p className="label mb-5">{t.sim.building}</p>
                <div className="flex flex-col items-center gap-3">
                  {PYRAMID.map((row, i) => (
                    <motion.div
                      key={row.pos}
                      initial={reduce ? false : { opacity: 0, scaleX: 0.4 }}
                      animate={i < bands ? { opacity: 1, scaleX: 1 } : { opacity: 0.15, scaleX: 0.9 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: row.width }}
                      className={`rounded-lg border px-3 py-3 text-center ${i === 0 ? "border-amber/60 bg-amber/10" : "border-line bg-ink-3"}`}
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{t.result[row.pos]}</span>
                      <span className="font-display text-lg sm:text-xl">{row.notes.map((n) => NOTE_MAP[n].name[locale]).join(" · ")}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}

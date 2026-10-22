"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { PerfumeBottle, type BottleShape } from "@/components/PerfumeBottle";
import { ACCORD_MAP } from "@/data/accords";
import { NOTE_MAP } from "@/data/notes";
import type { AccordId, Localized } from "@/lib/types";

/**
 * Hero focal point. Purpose: show in a few seconds that every person gets a different scent.
 * Three illustrative profiles rotate; liquid layers and floating notes change with each.
 */
const PROFILES: { label: Localized; shape: BottleShape; accords: [AccordId, AccordId, AccordId]; notes: string[] }[] = [
  { label: { id: "Woody", en: "Woody" }, shape: "classic", accords: ["woody", "gourmand", "fresh_spicy"], notes: ["cardamom", "coffee", "sandalwood", "vanilla"] },
  { label: { id: "Floral", en: "Floral" }, shape: "round", accords: ["musky", "white_floral", "fruity"], notes: ["pear", "jasmine", "ylang", "white_musk"] },
  { label: { id: "Segar", en: "Fresh" }, shape: "tall", accords: ["earthy", "aquatic", "citrus"], notes: ["bergamot", "rain", "green_tea", "vetiver"] },
];

const SPOTS = [
  "left-0 top-[14%]",
  "right-0 top-[24%]",
  "left-[2%] bottom-[22%]",
  "right-[2%] bottom-[12%]",
];

export function HeroBottle({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % PROFILES.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);
  const p = PROFILES[i];
  const colors = p.accords.map((a) => ACCORD_MAP[a].color) as [string, string, string];

  return (
    <div className={`relative mx-auto aspect-[4/5] w-full ${className}`} aria-hidden>
      <div className="absolute inset-[12%] rounded-full bg-amber/[0.08] blur-3xl" />
      <motion.div
        className="absolute inset-x-[18%] inset-y-[4%]"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={p.shape} className="h-full w-full" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.45 }}>
            <PerfumeBottle colors={colors} shape={p.shape} label={p.label[locale]} mist fill={0.8} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* reflection */}
      <div className="absolute inset-x-[26%] bottom-[1%] h-3 rounded-full bg-black/60 blur-md" />

      <AnimatePresence mode="popLayout">
        {p.notes.map((n, k) => (
          <motion.span
            key={`${i}-${n}`}
            className={`absolute ${SPOTS[k]} inline-flex items-center gap-2 rounded-full border border-line bg-ink/80 px-3 py-1.5 text-xs text-paper backdrop-blur-sm sm:text-sm`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: reduce ? 0 : [0, -6, 0] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ opacity: { duration: 0.4, delay: 0.5 + k * 0.12 }, y: { duration: 4 + k, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: ACCORD_MAP[NOTE_MAP[n].accord].color }} />
            {NOTE_MAP[n].name[locale]}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { motion } from "motion/react";
import { useId } from "react";
import { useLocale } from "./LocaleProvider";

/** Pill switch with a sliding gold thumb. 44px tall hit area, compact visual. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const id = useId();
  return (
    <div role="radiogroup" aria-label="Language / Bahasa" className={`relative inline-flex h-11 shrink-0 items-center self-start rounded-full border border-amber/35 p-1 ${className}`}>
      {(["id", "en"] as const).map((l) => {
        const on = locale === l;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setLocale(l)}
            className={`relative z-10 h-full rounded-full px-3.5 text-[11px] font-semibold tracking-[0.08em] transition-colors ${on ? "text-ink" : "text-muted hover:text-paper"}`}
          >
            {on && (
              <motion.span
                layoutId={`lang-thumb-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-[#ecd59f] to-amber"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

"use client";
import { useLocale } from "./LocaleProvider";

export function LangSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div role="group" aria-label="Language" className={`inline-flex rounded-md border border-line p-0.5 text-xs font-semibold ${className}`}>
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`min-h-9 min-w-10 rounded px-2 uppercase transition-colors ${locale === l ? "bg-paper text-ink" : "text-muted hover:text-paper"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

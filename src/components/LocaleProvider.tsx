"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { DICTS, type Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dict };
const LocaleCtx = createContext<Ctx>({ locale: "id", setLocale: () => {}, t: DICTS.id });

const EVENT = "ps-locale";
const KEY = "ps_locale";

function getSnapshot(): Locale {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "en" || v === "id") return v;
  } catch { /* private mode */ }
  return navigator.language?.toLowerCase().startsWith("id") ? "id" : "en";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server render is Indonesian; the browser switches to the stored or detected language after hydration.
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => "id" as Locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return <LocaleCtx.Provider value={{ locale, setLocale, t: DICTS[locale] }}>{children}</LocaleCtx.Provider>;
}

export const useLocale = () => useContext(LocaleCtx);

"use client";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { Wordmark } from "@/components/PyramidMark";
import { SiteFooter } from "@/components/SiteFooter";
import type { Locale } from "@/lib/types";

export type LegalDoc = Record<Locale, { title: string; updated: string; sections: [string, string[]][] }>;

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { locale } = useLocale();
  const d = doc[locale];
  return (
    <>
      <header className="border-b border-line/70">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Personality Scent"><Wordmark /></Link>
          <LangSwitch />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-display text-5xl">{d.title}</h1>
        <p className="mt-3 text-sm text-muted">{d.updated}</p>
        <div className="mt-10 space-y-10">
          {d.sections.map(([h, paras], i) => (
            <section key={h}>
              <h2 className="font-display text-2xl"><span className="text-amber">{i + 1}.</span> {h}</h2>
              {paras.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-paper/85">
                  {p.replace("{contact}", CONTACT ?? (locale === "id" ? "alamat kontak yang tercantum di footer situs" : "the contact address listed in the site footer"))}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

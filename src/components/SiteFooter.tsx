"use client";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { Wordmark } from "@/components/PyramidMark";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
// Static year avoids a request-time Date in prerendered pages; update when the year changes.
const YEAR = 2026;

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label="Personality Scent"><Wordmark /></Link>
            <p className="mt-3 text-sm text-muted">{t.footer.note}</p>
          </div>
          <nav aria-label="Legal" className="flex flex-col gap-1 text-sm">
            <Link href="/syarat" className="inline-flex min-h-11 items-center text-paper hover:text-amber">{t.footer.terms}</Link>
            <Link href="/privasi" className="inline-flex min-h-11 items-center text-paper hover:text-amber">{t.footer.privacy}</Link>
            {CONTACT && (
              <a href={`mailto:${CONTACT}`} className="inline-flex min-h-11 items-center text-paper hover:text-amber">
                {t.footer.contact}: {CONTACT}
              </a>
            )}
          </nav>
          <LangSwitch />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Personality Scent. {t.footer.rights}</p>
          <p className="max-w-md sm:text-right">{t.footer.ipip}</p>
        </div>
      </div>
    </footer>
  );
}

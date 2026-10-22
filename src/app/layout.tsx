import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Cormorant: high-contrast serif in the tradition of perfume labels. Manrope: calm, legible at small sizes.
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Personality Scent", template: "%s · Personality Scent" },
  description: "Ubah kepribadian dan kenangan aromamu menjadi piramida notes parfum. Turn your personality and scent memories into a perfume note pyramid.",
};

export const viewport: Viewport = { themeColor: "#15110e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${cormorant.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

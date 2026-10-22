import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getProfile } from "@/lib/profiles";
import { unlockPrice } from "@/lib/midtrans";
import { ResultView } from "@/components/result/ResultView";

export async function generateMetadata({ params }: PageProps<"/result/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Scent DNA",
    robots: { index: false },
    openGraph: { images: [{ url: `/api/card/${id}?f=og`, width: 1200, height: 630 }] },
  };
}

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const p = await getProfile(id);
  if (!p) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-3xl">Hasil tidak ditemukan / Result not found</p>
        <Link href="/profiling" className="inline-flex min-h-11 items-center rounded-md bg-amber px-5 font-semibold text-ink">Mulai profiling</Link>
      </main>
    );
  }
  return <ResultView id={p.id} profile={p.profile} paid={p.paid} price={unlockPrice()} />;
}

function Skeleton() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3" role="status" aria-label="Loading">
      {[0.45, 0.72, 1].map((w, i) => (
        <span key={i} className="h-3 animate-pulse rounded bg-line" style={{ width: `${w * 14}rem` }} />
      ))}
    </main>
  );
}

export default function Page({ params }: PageProps<"/result/[id]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Loader params={params} />
    </Suspense>
  );
}

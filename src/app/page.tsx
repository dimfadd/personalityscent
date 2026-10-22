import { Landing } from "@/components/landing/Landing";
import { sampleResult } from "@/lib/sample";

export default function Home() {
  const price = Number(process.env.UNLOCK_PRICE_IDR ?? 29000);
  const sample = sampleResult();
  // Only what the landing shows leaves the server: three cards plus summary numbers.
  const prices = sample.recs.map((r) => r.priceIdr);
  const showcase = {
    profile: sample.profile,
    narrative: sample.narrative,
    // Landing samples avoid approximate-note entries and names that ad reviewers may flag.
    shown: pickShowcase(sample.recs),
    total: sample.recs.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
  return <Landing price={price} showcase={showcase} />;
}

const AD_UNSAFE = /orgasm|sex|nude|naked|erotic/i;

function pickShowcase(recs: ReturnType<typeof sampleResult>["recs"]) {
  const ok = recs.filter((r) => !r.notesApprox && !AD_UNSAFE.test(r.name));
  const out = [ok[0]];
  const cheap = ok.find((r) => r.tier === "affordable" || r.tier === "mid");
  if (cheap && !out.includes(cheap)) out.push(cheap);
  const other = ok.find((r) => !out.includes(r) && r.tier !== out[0]?.tier);
  if (other) out.push(other);
  return out.filter(Boolean).slice(0, 3);
}

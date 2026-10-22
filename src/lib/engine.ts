import { ACCORD_MAP, FAMILIES } from "@/data/accords";
import { NOTES } from "@/data/notes";
import { PERFUMES, type Perfume } from "@/data/perfumes";
import { ASPIRATIONS, IPIP_ITEMS, SCENARIOS, SMELLS, TRAIT_ACCORD_MAP } from "@/data/questions";
import {
  ACCORD_IDS,
  BIG_FIVE,
  type AccordId,
  type AccordVector,
  type AccordWeights,
  type BigFive,
  type Locale,
  type NotePosition,
  type PriceTier,
  type ProfileAnswers,
  type PyramidNote,
  type Recommendation,
  type ScentProfile,
} from "@/lib/types";

import { WEIGHTS } from "@/lib/weights";
export { WEIGHTS };
const DISLIKE_PENALTY = 0.6;

const zero = (): AccordVector => Object.fromEntries(ACCORD_IDS.map((a) => [a, 0])) as AccordVector;

function add(target: AccordVector, w: AccordWeights, factor = 1) {
  for (const [k, v] of Object.entries(w) as [AccordId, number][]) target[k] += v * factor;
}

/** Scale so the largest component equals 100 (or leave all-zero). */
function normalize(v: AccordVector): AccordVector {
  const max = Math.max(...Object.values(v));
  if (max <= 0) return v;
  const out = zero();
  for (const k of ACCORD_IDS) out[k] = (v[k] / max) * 100;
  return out;
}

export function scoreBigFive(ipip: Record<string, number>): BigFive {
  const sums: Record<string, number[]> = { E: [], A: [], C: [], N: [], O: [] };
  for (const item of IPIP_ITEMS) {
    const raw = ipip[item.id];
    if (!raw) continue;
    sums[item.trait].push(item.reverse ? 6 - raw : raw);
  }
  const out = {} as BigFive;
  for (const t of BIG_FIVE) {
    const xs = sums[t];
    const avg = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 3;
    out[t] = Math.round(((avg - 1) / 4) * 100);
  }
  return out;
}

function personalityVector(b: BigFive): AccordVector {
  const v = zero();
  for (const t of BIG_FIVE) {
    // distance from the midpoint, -1..1
    const d = (b[t] - 50) / 50;
    if (d > 0) add(v, TRAIT_ACCORD_MAP[t].high, d);
    else if (d < 0) add(v, TRAIT_ACCORD_MAP[t].low, -d);
  }
  return normalize(v);
}

function fromList<T extends { id: string; accords: AccordWeights }>(list: T[], ids: string[]): AccordVector {
  const v = zero();
  for (const id of ids) {
    const item = list.find((x) => x.id === id);
    if (item) add(v, item.accords);
  }
  return normalize(v);
}

export function dislikedAccords(disliked: string[]): AccordId[] {
  const v = fromList(SMELLS, disliked);
  return ACCORD_IDS.filter((a) => v[a] >= 50);
}

export function buildVector(a: ProfileAnswers, storyAccords: AccordWeights | null, bigFive: BigFive): AccordVector {
  const liked = fromList(SMELLS, a.liked);
  const scen = zero();
  for (const s of SCENARIOS) {
    const opt = s.options.find((o) => o.id === a.scenarios[s.id]);
    if (opt) add(scen, opt.accords);
  }
  const asp = fromList(ASPIRATIONS, a.aspirations);
  const pers = personalityVector(bigFive);
  const story = storyAccords ? (() => { const v = zero(); add(v, storyAccords); return normalize(v); })() : null;

  // Redistribute the story weight when there is no story.
  const storyW = story ? WEIGHTS.story : 0;
  const scale = 1 / (1 - (WEIGHTS.story - storyW));

  const v = zero();
  for (const k of ACCORD_IDS) {
    v[k] =
      scale *
      (WEIGHTS.liked * liked[k] +
        WEIGHTS.scenarios * normalize(scen)[k] +
        WEIGHTS.aspirations * asp[k] +
        WEIGHTS.personality * pers[k] +
        storyW * (story ? story[k] : 0));
  }

  // Climate nudge: humid tropics favour lighter accords for daytime wear.
  if (a.climate === "tropical" && a.occasion !== "night") {
    v.citrus *= 1.08; v.aquatic *= 1.08; v.green *= 1.06;
    v.gourmand *= 0.95; v.amber *= 0.95; v.smoky_oud *= 0.93;
  }

  const disliked = fromList(SMELLS, a.disliked);
  for (const k of ACCORD_IDS) v[k] = Math.max(0, v[k] - DISLIKE_PENALTY * disliked[k]);

  const n = normalize(v);
  for (const k of ACCORD_IDS) n[k] = Math.round(n[k]);
  return n;
}

export function topAccords(v: AccordVector, count = 5) {
  return ACCORD_IDS.map((id) => ({ id, score: v[id] }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function familyOf(v: AccordVector): ScentProfile["family"] {
  const fam: Record<string, number> = {};
  for (const id of ACCORD_IDS) {
    const f = ACCORD_MAP[id].family;
    fam[f] = (fam[f] ?? 0) + v[id];
  }
  const ranked = Object.entries(fam).sort((a, b) => b[1] - a[1]);
  const [p, s] = ranked;
  const secondary = s && s[1] >= p[1] * 0.6 ? FAMILIES[s[0] as keyof typeof FAMILIES] : null;
  return { primary: FAMILIES[p[0] as keyof typeof FAMILIES], secondary };
}

/** Choose 3 notes per position that best express the top accords, never from avoided accords. */
export function buildPyramid(v: AccordVector, avoided: AccordId[], preferNotes: string[] = []): Record<NotePosition, PyramidNote[]> {
  const out: Record<NotePosition, PyramidNote[]> = { top: [], heart: [], base: [] };
  for (const pos of ["top", "heart", "base"] as NotePosition[]) {
    const ranked = NOTES.filter((x) => x.position === pos && !avoided.includes(x.accord) && v[x.accord] > 0)
      .map((x, i) => ({ x, s: v[x.accord] + (preferNotes.includes(x.id) ? 25 : 0) - i * 0.01 }))
      .sort((a, b) => b.s - a.s);
    const perAccord: Record<string, number> = {};
    for (const { x } of ranked) {
      if (out[pos].length >= 3) break;
      if ((perAccord[x.accord] ?? 0) >= 1 && ranked.length > 6) continue;
      perAccord[x.accord] = (perAccord[x.accord] ?? 0) + 1;
      out[pos].push({ id: x.id, name: x.name, accord: x.accord });
    }
  }
  return out;
}

function perfumeVector(p: Perfume): AccordVector {
  const v = zero();
  add(v, p.accords);
  return v;
}

function cosine(a: AccordVector, b: AccordVector) {
  let dot = 0, na = 0, nb = 0;
  for (const k of ACCORD_IDS) { dot += a[k] * b[k]; na += a[k] ** 2; nb += b[k] ** 2; }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export function recommend(profile: Pick<ScentProfile, "vector" | "avoided">, a: Pick<ProfileAnswers, "expression" | "intensity" | "budget">, limit = 9): Recommendation[] {
  const user = profile.vector;
  const scored = PERFUMES.filter((p) => {
    if (a.expression === "feminine") return p.gender !== "masculine";
    if (a.expression === "masculine") return p.gender !== "feminine";
    return true;
  }).map((p) => {
    const pv = perfumeVector(p);
    let s = cosine(user, pv);
    for (const d of profile.avoided) s -= ((pv[d] ?? 0) / 100) * 0.25;
    s -= Math.abs(p.intensity - a.intensity) * 0.04;
    const shared = (Object.keys(p.accords) as AccordId[])
      .filter((k) => user[k] >= 40)
      .sort((x, y) => user[y] - user[x])
      .slice(0, 3);
    return { p, s, shared };
  });
  scored.sort((x, y) => y.s - x.s);

  // Keep the best overall, but guarantee at least one pick per price tier when possible.
  const picked: typeof scored = [];
  const tiers: PriceTier[] = a.budget === "any" ? ["affordable", "mid", "designer", "niche"] : [a.budget];
  for (const t of tiers) {
    const best = scored.find((x) => x.p.tier === t && !picked.includes(x));
    if (best) picked.push(best);
  }
  for (const x of scored) {
    if (picked.length >= limit) break;
    if (!picked.includes(x)) picked.push(x);
  }
  picked.sort((x, y) => y.s - x.s);

  return picked.map(({ p, s, shared }) => ({
    perfumeId: p.id,
    brand: p.brand,
    name: p.name,
    tier: p.tier,
    gender: p.gender,
    match: Math.max(0, Math.min(99, Math.round(s * 100))),
    sharedAccords: shared,
    notes: p.notes,
  }));
}

/** Deterministic narrative used when no AI provider is configured or the AI call fails. */
export function templateNarrative(locale: Locale, v: AccordVector, family: ScentProfile["family"]): ScentProfile["narrative"] {
  const [a1, a2, a3] = topAccords(v, 3).map((x) => ACCORD_MAP[x.id]);
  const fam = family.secondary ? `${family.primary[locale]} ${family.secondary[locale]}` : family.primary[locale];
  if (locale === "en") {
    return {
      source: "template",
      title: a2 ? `${a1.name.en} meets ${a2.name.en}` : `${fam}, led by ${a1?.name.en ?? ""}`,
      body: `Your profile leans ${a1?.name.en.toLowerCase()}${a2 ? ` with a thread of ${a2.name.en.toLowerCase()}` : ""}${a3 ? ` and a touch of ${a3.name.en.toLowerCase()}` : ""}. ${a1?.desc.en}. This is the character a perfumer would build around: it opens with the brightest part of your choices and settles into the warmer ones you kept coming back to.`,
    };
  }
  return {
    source: "template",
    title: a2 ? `${a1.name.id} bertemu ${a2.name.id}` : `${fam}, dipimpin ${a1?.name.id ?? ""}`,
    body: `Profilmu condong ke ${a1?.name.id.toLowerCase()}${a2 ? ` dengan benang ${a2.name.id.toLowerCase()}` : ""}${a3 ? ` dan sentuhan ${a3.name.id.toLowerCase()}` : ""}. ${a1?.desc.id}. Inilah karakter yang akan dibangun seorang perfumer: dibuka dengan sisi paling cerah dari pilihanmu, lalu mengendap di sisi hangat yang terus kamu pilih.`,
  };
}

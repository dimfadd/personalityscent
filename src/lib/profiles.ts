import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { query } from "@/lib/db";
import { readStory, writeNarrative } from "@/lib/ai";
import { buildPyramid, buildVector, dislikedAccords, familyOf, scoreBigFive, templateNarrative, topAccords } from "@/lib/engine";
import { ACCORD_MAP } from "@/data/accords";
import { ASPIRATIONS, IPIP_ITEMS, SCENARIOS, SMELLS, TRAIT_LABELS } from "@/data/questions";
import { BIG_FIVE, type ProfileAnswers, type ScentProfile } from "@/lib/types";

const smellIds = SMELLS.map((s) => s.id) as [string, ...string[]];

export const AnswersSchema = z.object({
  locale: z.enum(["id", "en"]),
  ipip: z.record(z.string(), z.number().int().min(1).max(5)).refine((r) => IPIP_ITEMS.every((i) => r[i.id]), "all items required"),
  liked: z.array(z.enum(smellIds)).min(1).max(8),
  disliked: z.array(z.enum(smellIds)).max(5),
  scenarios: z.record(z.string(), z.string()).refine((r) => SCENARIOS.every((s) => s.options.some((o) => o.id === r[s.id])), "all scenarios required"),
  aspirations: z.array(z.enum(ASPIRATIONS.map((a) => a.id) as [string, ...string[]])).min(1).max(2),
  occasion: z.enum(["daily", "night", "date", "all"]),
  intensity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  expression: z.enum(["feminine", "masculine", "any"]),
  budget: z.enum(["affordable", "mid", "designer", "niche", "any"]),
  climate: z.enum(["tropical", "temperate"]),
  story: z.string().max(1200).optional(),
});

export type StoredProfile = { id: string; created_at: string; locale: string; answers: ProfileAnswers; profile: ScentProfile; paid: boolean };

export async function createProfile(a: ProfileAnswers): Promise<string> {
  const bigFive = scoreBigFive(a.ipip);
  const story = a.story?.trim() ? await readStory(a.story.trim()) : null;
  const vector = buildVector(a, story?.accords ?? null, bigFive);
  const avoided = dislikedAccords(a.disliked).filter((x) => vector[x] < 30);
  const pyramid = buildPyramid(vector, avoided, story?.notes ?? []);
  const family = familyOf(vector);
  const tops = topAccords(vector, 5);

  const traits = BIG_FIVE.filter((t) => Math.abs(bigFive[t] - 50) >= 15).map((t) =>
    bigFive[t] > 50 ? TRAIT_LABELS[t].high.en : TRAIT_LABELS[t].low.en,
  );
  const ai = await writeNarrative({
    locale: a.locale,
    family: family.secondary ? `${family.primary.en} ${family.secondary.en}` : family.primary.en,
    accords: tops.map((t) => ACCORD_MAP[t.id].name.en),
    notes: {
      top: pyramid.top.map((n) => n.name.en),
      heart: pyramid.heart.map((n) => n.name.en),
      base: pyramid.base.map((n) => n.name.en),
    },
    traits,
    aspirations: a.aspirations.map((id) => ASPIRATIONS.find((x) => x.id === id)!.label.en),
    story: a.story?.slice(0, 600),
  });

  const profile: ScentProfile = {
    vector,
    topAccords: tops,
    avoided,
    family,
    pyramid,
    bigFive,
    narrative: ai ? { ...ai, body: ai.body.replaceAll("—", ", "), source: "ai" } : templateNarrative(a.locale, vector, family),
  };

  const id = randomUUID();
  await query("insert into profiles (id, locale, answers, profile) values ($1, $2, $3, $4)", [
    id,
    a.locale,
    a,
    profile,
  ]);
  return id;
}

export async function getProfile(id: string): Promise<StoredProfile | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const rows = await query<StoredProfile>("select * from profiles where id = $1", [id]);
  return rows[0] ?? null;
}

export async function markPaid(orderId: string, raw: unknown) {
  const rows = await query<{ profile_id: string }>(
    "update orders set status = 'paid', paid_at = coalesce(paid_at, now()), raw = $2 where id = $1 returning profile_id",
    [orderId, raw],
  );
  if (rows[0]) await query("update profiles set paid = true where id = $1", [rows[0].profile_id]);
  return rows[0]?.profile_id ?? null;
}

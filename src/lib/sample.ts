import { buildPyramid, buildVector, dislikedAccords, familyOf, recommend, scoreBigFive, templateNarrative, topAccords } from "@/lib/engine";
import type { Locale, ProfileAnswers, Recommendation, ScentProfile } from "@/lib/types";

/** A fixed example profile, run through the real engine, used to show the output on the landing page. */
const ANSWERS: ProfileAnswers = {
  locale: "id",
  ipip: { q1: 2, q2: 4, q3: 4, q4: 3, q5: 5, q6: 4, q7: 2, q8: 2, q9: 3, q10: 1, q11: 2, q12: 4, q13: 4, q14: 3, q15: 1, q16: 4, q17: 2, q18: 2, q19: 3, q20: 1 },
  liked: ["coffee", "petrichor", "pencil", "incense", "jasmine"],
  disliked: ["baby_powder"],
  scenarios: { place: "cafe", time: "dusk", texture: "wood" },
  aspirations: ["mysterious", "warm"],
  occasion: "all",
  intensity: 2,
  expression: "any",
  budget: "any",
  climate: "tropical",
};

export type SampleResult = {
  profile: Omit<ScentProfile, "narrative">;
  narrative: Record<Locale, ScentProfile["narrative"]>;
  recs: Recommendation[];
};

export function sampleResult(): SampleResult {
  const bigFive = scoreBigFive(ANSWERS.ipip);
  const vector = buildVector(ANSWERS, null, bigFive);
  const avoided = dislikedAccords(ANSWERS.disliked).filter((x) => vector[x] < 30);
  const family = familyOf(vector);
  const profile = { vector, avoided, family, bigFive, topAccords: topAccords(vector, 5), pyramid: buildPyramid(vector, avoided) };
  return {
    profile,
    narrative: { id: templateNarrative("id", vector, family), en: templateNarrative("en", vector, family) },
    recs: recommend(profile, ANSWERS),
  };
}

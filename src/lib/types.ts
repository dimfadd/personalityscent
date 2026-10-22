export type Locale = "id" | "en";
export type Localized = { id: string; en: string };

export const ACCORD_IDS = [
  "citrus",
  "aquatic",
  "green",
  "aromatic",
  "fruity",
  "white_floral",
  "rose_floral",
  "powdery",
  "fresh_spicy",
  "warm_spicy",
  "woody",
  "smoky_oud",
  "amber",
  "gourmand",
  "leather",
  "tobacco",
  "musky",
  "earthy",
] as const;

export type AccordId = (typeof ACCORD_IDS)[number];
/** Partial accord weights, 0-100. */
export type AccordWeights = Partial<Record<AccordId, number>>;
/** Full accord vector, 0-100 for every accord. */
export type AccordVector = Record<AccordId, number>;

export type NotePosition = "top" | "heart" | "base";
export type Expression = "feminine" | "masculine" | "any";
export type PerfumeGender = "feminine" | "masculine" | "unisex";
export type PriceTier = "affordable" | "mid" | "designer" | "niche";
export type Intensity = 1 | 2 | 3;
export type Occasion = "daily" | "night" | "date" | "all";
export type Climate = "tropical" | "temperate";

export const BIG_FIVE = ["E", "A", "C", "N", "O"] as const;
export type Trait = (typeof BIG_FIVE)[number];
export type BigFive = Record<Trait, number>;

/** Raw answers submitted from the profiling flow. */
export type ProfileAnswers = {
  locale: Locale;
  /** Mini-IPIP item id -> 1..5 */
  ipip: Record<string, number>;
  liked: string[];
  disliked: string[];
  /** scenario question id -> option id */
  scenarios: Record<string, string>;
  aspirations: string[];
  occasion: Occasion;
  intensity: Intensity;
  expression: Expression;
  budget: PriceTier | "any";
  climate: Climate;
  story?: string;
};

export type PyramidNote = { id: string; name: Localized; accord: AccordId };

export type ScentProfile = {
  vector: AccordVector;
  topAccords: { id: AccordId; score: number }[];
  avoided: AccordId[];
  family: { primary: Localized; secondary: Localized | null };
  pyramid: Record<NotePosition, PyramidNote[]>;
  bigFive: BigFive;
  narrative: { title: string; body: string; source: "ai" | "template" };
};

export type Recommendation = {
  perfumeId: string;
  brand: string;
  name: string;
  tier: PriceTier;
  gender: PerfumeGender;
  match: number;
  sharedAccords: AccordId[];
  priceIdr: number;
  sizeMl: number;
  origin: "local" | "international";
  notesApprox: boolean;
  notes: { top: string[]; heart: string[]; base: string[] };
};

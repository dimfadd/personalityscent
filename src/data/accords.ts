import type { AccordId, Localized } from "@/lib/types";

export type Accord = {
  id: AccordId;
  name: Localized;
  /** One-line sensory description shown to users. */
  desc: Localized;
  /** Family used to name the overall scent profile. */
  family: "fresh" | "floral" | "amber" | "woody" | "soft";
  /** Display colour, chosen by cross-modal association (e.g. citrus = bright yellow). */
  color: string;
};

export const FAMILIES: Record<Accord["family"], Localized> = {
  fresh: { id: "Segar", en: "Fresh" },
  floral: { id: "Floral", en: "Floral" },
  amber: { id: "Amber", en: "Amber" },
  woody: { id: "Woody", en: "Woody" },
  soft: { id: "Musky Lembut", en: "Soft Musk" },
};

export const ACCORDS: Accord[] = [
  { id: "citrus", family: "fresh", color: "#E8C547", name: { id: "Citrus", en: "Citrus" }, desc: { id: "Kulit jeruk yang baru dikupas, cerah dan sebentar", en: "Freshly peeled citrus rind, bright and fleeting" } },
  { id: "aquatic", family: "fresh", color: "#7FB3C8", name: { id: "Aquatic", en: "Aquatic" }, desc: { id: "Angin laut, garam, udara setelah hujan", en: "Sea breeze, salt, air after rain" } },
  { id: "green", family: "fresh", color: "#8DB572", name: { id: "Hijau", en: "Green" }, desc: { id: "Daun yang dipatahkan, rumput, batang segar", en: "Snapped leaves, cut grass, fresh stems" } },
  { id: "aromatic", family: "fresh", color: "#9AA6C9", name: { id: "Aromatik", en: "Aromatic" }, desc: { id: "Lavender dan herba seperti rosemary dan sage", en: "Lavender and herbs like rosemary and sage" } },
  { id: "fruity", family: "floral", color: "#E58A7B", name: { id: "Buah", en: "Fruity" }, desc: { id: "Buah matang yang juicy: pir, persik, berry", en: "Ripe, juicy fruit: pear, peach, berries" } },
  { id: "white_floral", family: "floral", color: "#F1E6C8", name: { id: "Bunga Putih", en: "White Floral" }, desc: { id: "Melati, sedap malam, kamboja: manis dan pekat", en: "Jasmine, tuberose, frangipani: heady and rich" } },
  { id: "rose_floral", family: "floral", color: "#D98BA0", name: { id: "Mawar", en: "Rose" }, desc: { id: "Mawar dan peony, romantis dan sedikit asam", en: "Rose and peony, romantic and slightly tart" } },
  { id: "powdery", family: "soft", color: "#C9B2D6", name: { id: "Powdery", en: "Powdery" }, desc: { id: "Iris, violet, bedak: lembut dan nostalgik", en: "Iris, violet, face powder: soft and nostalgic" } },
  { id: "fresh_spicy", family: "fresh", color: "#D6A15E", name: { id: "Rempah Segar", en: "Fresh Spice" }, desc: { id: "Jahe, lada, kapulaga: menggigit dan hidup", en: "Ginger, pepper, cardamom: sharp and lively" } },
  { id: "warm_spicy", family: "amber", color: "#B5582E", name: { id: "Rempah Hangat", en: "Warm Spice" }, desc: { id: "Kayu manis, cengkeh, pala: hangat seperti dapur", en: "Cinnamon, clove, nutmeg: warm like a kitchen" } },
  { id: "woody", family: "woody", color: "#9C7652", name: { id: "Kayu", en: "Woody" }, desc: { id: "Cedar, cendana, serutan pensil: kering dan tenang", en: "Cedar, sandalwood, pencil shavings: dry and calm" } },
  { id: "smoky_oud", family: "woody", color: "#5E4A45", name: { id: "Oud & Asap", en: "Oud & Smoke" }, desc: { id: "Gaharu, dupa, kayu terbakar: gelap dan dalam", en: "Agarwood, incense, burnt wood: dark and deep" } },
  { id: "amber", family: "amber", color: "#C98A3E", name: { id: "Amber & Resin", en: "Amber & Resin" }, desc: { id: "Kemenyan, labdanum, benzoin: hangat dan berkilau", en: "Benzoin, labdanum, resins: warm and glowing" } },
  { id: "gourmand", family: "amber", color: "#A8683F", name: { id: "Gourmand", en: "Gourmand" }, desc: { id: "Vanila, karamel, kopi: aroma yang bisa dimakan", en: "Vanilla, caramel, coffee: edible scents" } },
  { id: "leather", family: "woody", color: "#7A4B35", name: { id: "Kulit", en: "Leather" }, desc: { id: "Jaket kulit, suede: halus atau kasar", en: "Leather jacket, suede: smooth or rugged" } },
  { id: "tobacco", family: "woody", color: "#8A5A3B", name: { id: "Tembakau & Rum", en: "Tobacco & Boozy" }, desc: { id: "Daun tembakau kering, rum, cognac", en: "Dry tobacco leaf, rum, cognac" } },
  { id: "musky", family: "soft", color: "#D9CFC4", name: { id: "Musk Bersih", en: "Clean Musk" }, desc: { id: "Kulit bersih, cucian kering, kapas", en: "Clean skin, fresh laundry, cotton" } },
  { id: "earthy", family: "woody", color: "#6E7448", name: { id: "Tanah", en: "Earthy" }, desc: { id: "Nilam, akar wangi, lumut: tanah basah", en: "Patchouli, vetiver, moss: damp earth" } },
];

export const ACCORD_MAP = Object.fromEntries(ACCORDS.map((a) => [a.id, a])) as Record<AccordId, Accord>;

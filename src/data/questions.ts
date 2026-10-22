import type { AccordWeights, Localized, Trait } from "@/lib/types";

/**
 * Mini-IPIP (Donnellan, Oswald, Baird & Lucas, 2006). Public domain, from the IPIP.
 * The Indonesian wording is our own translation and has NOT been psychometrically validated.
 * "O" here is the Intellect/Imagination domain.
 */
export type IpipItem = { id: string; trait: Trait; reverse: boolean; text: Localized };

export const IPIP_ITEMS: IpipItem[] = [
  { id: "q1", trait: "E", reverse: false, text: { en: "I am the life of the party.", id: "Saya jadi pusat suasana di sebuah acara." } },
  { id: "q2", trait: "A", reverse: false, text: { en: "I sympathize with others' feelings.", id: "Saya ikut merasakan perasaan orang lain." } },
  { id: "q3", trait: "C", reverse: false, text: { en: "I get chores done right away.", id: "Saya langsung menyelesaikan pekerjaan rumah." } },
  { id: "q4", trait: "N", reverse: false, text: { en: "I have frequent mood swings.", id: "Suasana hati saya sering berubah-ubah." } },
  { id: "q5", trait: "O", reverse: false, text: { en: "I have a vivid imagination.", id: "Imajinasi saya sangat hidup." } },
  { id: "q6", trait: "E", reverse: true, text: { en: "I don't talk a lot.", id: "Saya tidak banyak bicara." } },
  { id: "q7", trait: "A", reverse: true, text: { en: "I am not interested in other people's problems.", id: "Saya tidak tertarik pada masalah orang lain." } },
  { id: "q8", trait: "C", reverse: true, text: { en: "I often forget to put things back in their proper place.", id: "Saya sering lupa mengembalikan barang ke tempatnya." } },
  { id: "q9", trait: "N", reverse: true, text: { en: "I am relaxed most of the time.", id: "Hampir sepanjang waktu saya merasa santai." } },
  { id: "q10", trait: "O", reverse: true, text: { en: "I am not interested in abstract ideas.", id: "Saya tidak tertarik pada ide-ide abstrak." } },
  { id: "q11", trait: "E", reverse: false, text: { en: "I talk to a lot of different people at parties.", id: "Di acara ramai, saya mengobrol dengan banyak orang berbeda." } },
  { id: "q12", trait: "A", reverse: false, text: { en: "I feel others' emotions.", id: "Saya bisa merasakan emosi orang lain." } },
  { id: "q13", trait: "C", reverse: false, text: { en: "I like order.", id: "Saya suka keteraturan." } },
  { id: "q14", trait: "N", reverse: false, text: { en: "I get upset easily.", id: "Saya mudah merasa kesal." } },
  { id: "q15", trait: "O", reverse: true, text: { en: "I have difficulty understanding abstract ideas.", id: "Saya kesulitan memahami ide-ide abstrak." } },
  { id: "q16", trait: "E", reverse: true, text: { en: "I keep in the background.", id: "Saya lebih suka berada di belakang layar." } },
  { id: "q17", trait: "A", reverse: true, text: { en: "I am not really interested in others.", id: "Saya tidak terlalu tertarik pada orang lain." } },
  { id: "q18", trait: "C", reverse: true, text: { en: "I make a mess of things.", id: "Saya sering membuat sesuatu jadi berantakan." } },
  { id: "q19", trait: "N", reverse: true, text: { en: "I seldom feel blue.", id: "Saya jarang merasa sedih." } },
  { id: "q20", trait: "O", reverse: true, text: { en: "I do not have a good imagination.", id: "Imajinasi saya tidak terlalu bagus." } },
];

export const LIKERT: Localized[] = [
  { id: "Sangat tidak sesuai", en: "Very inaccurate" },
  { id: "Tidak sesuai", en: "Inaccurate" },
  { id: "Netral", en: "Neutral" },
  { id: "Sesuai", en: "Accurate" },
  { id: "Sangat sesuai", en: "Very accurate" },
];

export const TRAIT_LABELS: Record<Trait, { name: Localized; high: Localized; low: Localized }> = {
  E: {
    name: { id: "Ekstraversi", en: "Extraversion" },
    high: { id: "Mendapat energi dari orang dan keramaian", en: "Energised by people and buzz" },
    low: { id: "Mengisi ulang energi lewat ketenangan", en: "Recharges through quiet" },
  },
  A: {
    name: { id: "Keramahan", en: "Agreeableness" },
    high: { id: "Hangat, peka, mudah percaya", en: "Warm, attuned, trusting" },
    low: { id: "Lugas, independen, kritis", en: "Direct, independent, critical" },
  },
  C: {
    name: { id: "Keteraturan", en: "Conscientiousness" },
    high: { id: "Rapi, terencana, bisa diandalkan", en: "Orderly, planned, reliable" },
    low: { id: "Spontan, fleksibel, mengikuti arus", en: "Spontaneous, flexible, goes with the flow" },
  },
  N: {
    name: { id: "Kepekaan Emosi", en: "Emotional Sensitivity" },
    high: { id: "Merasakan segala sesuatu dengan dalam", en: "Feels things deeply" },
    low: { id: "Tenang dan stabil di bawah tekanan", en: "Calm and steady under pressure" },
  },
  O: {
    name: { id: "Imajinasi", en: "Imagination" },
    high: { id: "Penasaran, suka hal yang tidak biasa", en: "Curious, drawn to the unusual" },
    low: { id: "Praktis, menyukai yang sudah dikenal", en: "Practical, likes the familiar" },
  },
};

/**
 * Heuristic: how a HIGH score on each trait nudges accords (a LOW score applies the opposite map).
 * Based on cross-modal correspondence reasoning, not on validated personality-preference research.
 * It is intentionally given a small weight in the scoring engine.
 */
export const TRAIT_ACCORD_MAP: Record<Trait, { high: AccordWeights; low: AccordWeights }> = {
  E: { high: { citrus: 80, fruity: 70, fresh_spicy: 60, gourmand: 40 }, low: { woody: 70, musky: 60, powdery: 50, earthy: 40 } },
  A: { high: { rose_floral: 60, powdery: 50, gourmand: 60, musky: 50 }, low: { leather: 70, smoky_oud: 50, aromatic: 50 } },
  C: { high: { aromatic: 60, aquatic: 50, citrus: 50, woody: 40 }, low: { gourmand: 50, fruity: 50, amber: 50 } },
  N: { high: { musky: 60, powdery: 60, amber: 50 }, low: { fresh_spicy: 50, aquatic: 50, green: 40 } },
  O: { high: { smoky_oud: 70, leather: 50, tobacco: 60, earthy: 60, warm_spicy: 40 }, low: { aquatic: 60, musky: 50, citrus: 40 } },
};

/** Everyday smells, used for both "liked" and "disliked" steps. */
export type SmellCard = { id: string; label: Localized; accords: AccordWeights };

export const SMELLS: SmellCard[] = [
  { id: "coffee", label: { id: "Kopi baru digiling", en: "Freshly ground coffee" }, accords: { gourmand: 70, tobacco: 20, warm_spicy: 20 } },
  { id: "petrichor", label: { id: "Tanah setelah hujan", en: "Earth after rain" }, accords: { earthy: 70, aquatic: 40, green: 30 } },
  { id: "beach", label: { id: "Angin pantai", en: "Ocean breeze" }, accords: { aquatic: 90, musky: 20, citrus: 20 } },
  { id: "jasmine", label: { id: "Melati", en: "Jasmine" }, accords: { white_floral: 90 } },
  { id: "rose", label: { id: "Mawar", en: "Roses" }, accords: { rose_floral: 90, fruity: 10 } },
  { id: "pandan", label: { id: "Daun pandan", en: "Pandan leaves" }, accords: { green: 50, gourmand: 50 } },
  { id: "vanilla_cake", label: { id: "Kue vanila di oven", en: "Vanilla cake baking" }, accords: { gourmand: 90, amber: 20 } },
  { id: "orange_peel", label: { id: "Jeruk dikupas", en: "Peeled oranges" }, accords: { citrus: 90, fruity: 20 } },
  { id: "laundry", label: { id: "Cucian bersih", en: "Clean laundry" }, accords: { musky: 85, aquatic: 20, powdery: 15 } },
  { id: "pencil", label: { id: "Serutan pensil", en: "Pencil shavings" }, accords: { woody: 90 } },
  { id: "incense", label: { id: "Dupa atau kemenyan", en: "Incense" }, accords: { smoky_oud: 60, amber: 60 } },
  { id: "cinnamon", label: { id: "Kayu manis", en: "Cinnamon" }, accords: { warm_spicy: 90, gourmand: 20 } },
  { id: "kretek", label: { id: "Tembakau kretek", en: "Clove tobacco" }, accords: { tobacco: 80, warm_spicy: 50 } },
  { id: "leather_jacket", label: { id: "Jaket kulit", en: "Leather jacket" }, accords: { leather: 90 } },
  { id: "baby_powder", label: { id: "Bedak bayi", en: "Baby powder" }, accords: { powdery: 90, musky: 30 } },
  { id: "cut_grass", label: { id: "Rumput dipotong", en: "Cut grass" }, accords: { green: 90 } },
  { id: "mint", label: { id: "Daun mint", en: "Mint leaves" }, accords: { aromatic: 70, green: 30 } },
  { id: "lavender", label: { id: "Lavender", en: "Lavender" }, accords: { aromatic: 90, powdery: 15 } },
  { id: "fruit", label: { id: "Buah segar dipotong", en: "Freshly cut fruit" }, accords: { fruity: 90 } },
  { id: "ginger", label: { id: "Jahe digeprek", en: "Crushed ginger" }, accords: { fresh_spicy: 85, citrus: 15 } },
  { id: "chocolate", label: { id: "Cokelat", en: "Chocolate" }, accords: { gourmand: 85 } },
  { id: "campfire", label: { id: "Api unggun", en: "Campfire" }, accords: { smoky_oud: 85, woody: 30 } },
  { id: "honey", label: { id: "Madu", en: "Honey" }, accords: { gourmand: 60, amber: 40, white_floral: 10 } },
  { id: "tea", label: { id: "Teh melati", en: "Jasmine tea" }, accords: { green: 50, white_floral: 40 } },
];

export type ScenarioOption = { id: string; label: Localized; accords: AccordWeights };
export type Scenario = { id: string; prompt: Localized; options: ScenarioOption[] };

export const SCENARIOS: Scenario[] = [
  {
    id: "place",
    prompt: { id: "Di tempat mana kamu paling merasa jadi diri sendiri?", en: "Where do you feel most like yourself?" },
    options: [
      { id: "beach", label: { id: "Pantai di pagi hari", en: "A beach in the morning" }, accords: { aquatic: 80, citrus: 50 } },
      { id: "cafe", label: { id: "Kafe sepi dengan buku", en: "A quiet café with a book" }, accords: { gourmand: 70, woody: 50, tobacco: 30 } },
      { id: "forest", label: { id: "Hutan pinus setelah hujan", en: "A pine forest after rain" }, accords: { green: 70, earthy: 60, woody: 40 } },
      { id: "rooftop", label: { id: "Rooftop kota di malam hari", en: "A city rooftop at night" }, accords: { amber: 60, leather: 50, warm_spicy: 40, smoky_oud: 30 } },
      { id: "garden", label: { id: "Taman bunga di sore hari", en: "A flower garden in the afternoon" }, accords: { white_floral: 60, rose_floral: 60, fruity: 30 } },
    ],
  },
  {
    id: "time",
    prompt: { id: "Jam berapa kamu merasa paling hidup?", en: "When do you feel most alive?" },
    options: [
      { id: "dawn", label: { id: "Pagi buta", en: "Dawn" }, accords: { citrus: 60, green: 60, aquatic: 40 } },
      { id: "noon", label: { id: "Siang yang terang", en: "Bright midday" }, accords: { fruity: 60, white_floral: 50, fresh_spicy: 30 } },
      { id: "dusk", label: { id: "Senja", en: "Dusk" }, accords: { amber: 60, woody: 50, rose_floral: 30 } },
      { id: "midnight", label: { id: "Tengah malam", en: "Midnight" }, accords: { smoky_oud: 60, leather: 40, gourmand: 40, musky: 30 } },
    ],
  },
  {
    id: "texture",
    prompt: { id: "Bahan apa yang paling ingin kamu sentuh sekarang?", en: "Which material do you want to touch right now?" },
    options: [
      { id: "linen", label: { id: "Linen yang baru dicuci", en: "Freshly washed linen" }, accords: { musky: 70, aquatic: 40 } },
      { id: "velvet", label: { id: "Beludru", en: "Velvet" }, accords: { powdery: 60, rose_floral: 50, amber: 40 } },
      { id: "wood", label: { id: "Kayu yang kasar", en: "Rough wood" }, accords: { woody: 70, earthy: 50 } },
      { id: "suede", label: { id: "Suede", en: "Suede" }, accords: { leather: 70, tobacco: 40 } },
      { id: "silk", label: { id: "Sutra", en: "Silk" }, accords: { white_floral: 60, musky: 50 } },
    ],
  },
];

export type Aspiration = { id: string; label: Localized; accords: AccordWeights };

export const ASPIRATIONS: Aspiration[] = [
  { id: "clean", label: { id: "Bersih dan rapi", en: "Clean and put-together" }, accords: { musky: 70, aquatic: 50, citrus: 40 } },
  { id: "warm", label: { id: "Hangat dan mudah didekati", en: "Warm and approachable" }, accords: { gourmand: 60, amber: 50, musky: 40 } },
  { id: "mysterious", label: { id: "Misterius", en: "Mysterious" }, accords: { smoky_oud: 70, amber: 50, leather: 40 } },
  { id: "confident", label: { id: "Percaya diri dan tegas", en: "Confident and decisive" }, accords: { fresh_spicy: 60, woody: 60, leather: 40 } },
  { id: "playful", label: { id: "Ceria", en: "Playful" }, accords: { fruity: 70, citrus: 50, gourmand: 30 } },
  { id: "elegant", label: { id: "Elegan", en: "Elegant" }, accords: { powdery: 60, rose_floral: 50, white_floral: 40 } },
  { id: "free", label: { id: "Berjiwa bebas", en: "Free-spirited" }, accords: { green: 60, aromatic: 50, earthy: 40 } },
  { id: "sensual", label: { id: "Sensual", en: "Sensual" }, accords: { white_floral: 60, amber: 50, warm_spicy: 40 } },
];

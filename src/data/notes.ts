import type { AccordId, Localized, NotePosition } from "@/lib/types";

export type Note = {
  id: string;
  name: Localized;
  accord: AccordId;
  position: NotePosition;
  /** Optional story hook, e.g. Indonesian origin. */
  origin?: Localized;
};

const n = (id: string, idName: string, enName: string, accord: AccordId, position: NotePosition, origin?: Localized): Note => ({
  id,
  name: { id: idName, en: enName },
  accord,
  position,
  origin,
});

const INDONESIA: Localized = { id: "Banyak dihasilkan di Indonesia", en: "Widely produced in Indonesia" };

export const NOTES: Note[] = [
  // citrus
  n("bergamot", "Bergamot", "Bergamot", "citrus", "top"),
  n("lemon", "Lemon", "Lemon", "citrus", "top"),
  n("mandarin", "Jeruk Mandarin", "Mandarin", "citrus", "top"),
  n("grapefruit", "Grapefruit", "Grapefruit", "citrus", "top"),
  n("orange", "Jeruk Manis", "Sweet Orange", "citrus", "top"),
  n("yuzu", "Yuzu", "Yuzu", "citrus", "top"),
  n("lime", "Jeruk Nipis", "Lime", "citrus", "top"),
  n("neroli", "Neroli", "Neroli", "citrus", "heart"),
  // aquatic
  n("sea_notes", "Aroma Laut", "Sea Notes", "aquatic", "top"),
  n("sea_salt", "Garam Laut", "Sea Salt", "aquatic", "heart"),
  n("rain", "Aroma Hujan", "Rain Accord", "aquatic", "top"),
  n("water_lily", "Teratai Air", "Water Lily", "aquatic", "heart"),
  // green
  n("green_leaves", "Daun Hijau", "Green Leaves", "green", "top"),
  n("galbanum", "Galbanum", "Galbanum", "green", "top"),
  n("fig_leaf", "Daun Ara", "Fig Leaf", "green", "heart"),
  n("green_tea", "Teh Hijau", "Green Tea", "green", "heart"),
  n("cucumber", "Mentimun", "Cucumber", "green", "top"),
  n("bamboo", "Bambu", "Bamboo", "green", "heart"),
  // aromatic
  n("lavender", "Lavender", "Lavender", "aromatic", "heart"),
  n("rosemary", "Rosemary", "Rosemary", "aromatic", "top"),
  n("sage", "Sage", "Sage", "aromatic", "heart"),
  n("mint", "Daun Mint", "Mint", "aromatic", "top"),
  n("basil", "Kemangi", "Basil", "aromatic", "top"),
  n("geranium", "Geranium", "Geranium", "aromatic", "heart"),
  // fruity
  n("pear", "Pir", "Pear", "fruity", "top"),
  n("apple", "Apel", "Apple", "fruity", "top"),
  n("peach", "Persik", "Peach", "fruity", "heart"),
  n("blackcurrant", "Blackcurrant", "Blackcurrant", "fruity", "top"),
  n("raspberry", "Raspberry", "Raspberry", "fruity", "top"),
  n("lychee", "Leci", "Lychee", "fruity", "top"),
  n("pineapple", "Nanas", "Pineapple", "fruity", "top"),
  n("coconut", "Kelapa", "Coconut", "fruity", "heart"),
  // white floral
  n("jasmine", "Melati", "Jasmine", "white_floral", "heart"),
  n("tuberose", "Sedap Malam", "Tuberose", "white_floral", "heart"),
  n("orange_blossom", "Bunga Jeruk", "Orange Blossom", "white_floral", "heart"),
  n("gardenia", "Gardenia", "Gardenia", "white_floral", "heart"),
  n("ylang", "Kenanga", "Ylang-Ylang", "white_floral", "heart", INDONESIA),
  n("frangipani", "Kamboja", "Frangipani", "white_floral", "heart"),
  n("magnolia", "Magnolia", "Magnolia", "white_floral", "heart"),
  // rose
  n("rose", "Mawar", "Rose", "rose_floral", "heart"),
  n("peony", "Peony", "Peony", "rose_floral", "heart"),
  n("freesia", "Freesia", "Freesia", "rose_floral", "heart"),
  n("lily_valley", "Lily of the Valley", "Lily of the Valley", "rose_floral", "heart"),
  // powdery
  n("iris", "Iris", "Iris", "powdery", "heart"),
  n("violet", "Violet", "Violet", "powdery", "heart"),
  n("heliotrope", "Heliotrope", "Heliotrope", "powdery", "base"),
  n("mimosa", "Mimosa", "Mimosa", "powdery", "heart"),
  // fresh spice
  n("pink_pepper", "Lada Merah Muda", "Pink Pepper", "fresh_spicy", "top"),
  n("black_pepper", "Lada Hitam", "Black Pepper", "fresh_spicy", "top"),
  n("ginger", "Jahe", "Ginger", "fresh_spicy", "top"),
  n("cardamom", "Kapulaga", "Cardamom", "fresh_spicy", "top"),
  // warm spice
  n("cinnamon", "Kayu Manis", "Cinnamon", "warm_spicy", "heart"),
  n("clove", "Cengkeh", "Clove", "warm_spicy", "heart", INDONESIA),
  n("nutmeg", "Pala", "Nutmeg", "warm_spicy", "heart", INDONESIA),
  n("saffron", "Saffron", "Saffron", "warm_spicy", "top"),
  // woody
  n("cedar", "Cedarwood", "Cedarwood", "woody", "base"),
  n("sandalwood", "Cendana", "Sandalwood", "woody", "base"),
  n("guaiac", "Kayu Guaiac", "Guaiac Wood", "woody", "base"),
  n("cypress", "Cemara", "Cypress", "woody", "heart"),
  n("cashmeran", "Cashmere Wood", "Cashmere Wood", "woody", "base"),
  // smoky / oud
  n("oud", "Gaharu (Oud)", "Oud", "smoky_oud", "base", INDONESIA),
  n("incense", "Dupa", "Incense", "smoky_oud", "base"),
  n("birch_tar", "Kayu Birch Asap", "Smoked Birch", "smoky_oud", "base"),
  // amber
  n("amber", "Amber", "Amber", "amber", "base"),
  n("labdanum", "Labdanum", "Labdanum", "amber", "base"),
  n("benzoin", "Kemenyan (Benzoin)", "Benzoin", "amber", "base", INDONESIA),
  n("myrrh", "Mur", "Myrrh", "amber", "base"),
  // gourmand
  n("vanilla", "Vanila", "Vanilla", "gourmand", "base"),
  n("tonka", "Tonka", "Tonka Bean", "gourmand", "base"),
  n("caramel", "Karamel", "Caramel", "gourmand", "base"),
  n("praline", "Praline", "Praline", "gourmand", "base"),
  n("coffee", "Kopi", "Coffee", "gourmand", "heart"),
  n("cacao", "Kakao", "Cacao", "gourmand", "base"),
  n("honey", "Madu", "Honey", "gourmand", "base"),
  n("pandan", "Pandan", "Pandan", "gourmand", "heart"),
  n("almond", "Almond", "Almond", "gourmand", "heart"),
  // leather
  n("leather", "Kulit", "Leather", "leather", "base"),
  n("suede", "Suede", "Suede", "leather", "base"),
  // tobacco & boozy
  n("tobacco", "Tembakau", "Tobacco", "tobacco", "base"),
  n("rum", "Rum", "Rum", "tobacco", "heart"),
  n("cognac", "Cognac", "Cognac", "tobacco", "heart"),
  // musk
  n("white_musk", "Musk Putih", "White Musk", "musky", "base"),
  n("ambrette", "Ambrette", "Ambrette", "musky", "heart"),
  n("ambroxan", "Ambroxan", "Ambroxan", "musky", "base"),
  n("aldehydes", "Aldehida", "Aldehydes", "musky", "top"),
  // earthy
  n("patchouli", "Nilam (Patchouli)", "Patchouli", "earthy", "base", INDONESIA),
  n("vetiver", "Akar Wangi (Vetiver)", "Vetiver", "earthy", "base", INDONESIA),
  n("oakmoss", "Lumut Ek", "Oakmoss", "earthy", "base"),
];

export const NOTE_MAP = Object.fromEntries(NOTES.map((x) => [x.id, x])) as Record<string, Note>;

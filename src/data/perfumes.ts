import type { AccordWeights, Intensity, PerfumeGender, PriceTier } from "@/lib/types";

/**
 * SEED DATA. Notes, accord weights and prices were compiled from general knowledge and have NOT
 * been checked against official brand sources. Every entry is `verified: false` until someone
 * confirms it manually. Accord weights (0-100) are editorial estimates.
 *
 * priceIdr is an ESTIMATED Indonesian retail price for the listed bottle size. Tier is derived
 * from the price normalised to 100ml:
 *   affordable < Rp700rb · mid Rp700rb-1,8jt · designer Rp1,8-3,5jt · niche > Rp3,5jt
 *
 * notesApprox = notes are a best guess (used for local brands whose pyramids we could not confirm).
 */
export type Origin = "local" | "international";

export type Perfume = {
  id: string;
  brand: string;
  name: string;
  gender: PerfumeGender;
  tier: PriceTier;
  intensity: Intensity;
  accords: AccordWeights;
  notes: { top: string[]; heart: string[]; base: string[] };
  priceIdr: number;
  sizeMl: number;
  origin: Origin;
  notesApprox: boolean;
  verified: boolean;
};

type Row = [
  id: string,
  brand: string,
  name: string,
  gender: PerfumeGender,
  tier: PriceTier,
  intensity: Intensity,
  accords: AccordWeights,
  top: string[],
  heart: string[],
  base: string[],
];

const ROWS: Row[] = [
  ["dior-sauvage-edt", "Dior", "Sauvage EDT", "masculine", "designer", 3, { fresh_spicy: 80, musky: 70, aromatic: 60, citrus: 50, woody: 50 }, ["Bergamot", "Pepper"], ["Sichuan Pepper", "Lavender", "Pink Pepper", "Geranium", "Elemi"], ["Ambroxan", "Cedar", "Labdanum"]],
  ["chanel-bleu-edp", "Chanel", "Bleu de Chanel EDP", "masculine", "designer", 2, { citrus: 70, woody: 70, amber: 50, aromatic: 40, fresh_spicy: 30 }, ["Grapefruit", "Lemon", "Mint", "Pink Pepper"], ["Ginger", "Nutmeg", "Jasmine"], ["Incense", "Vetiver", "Cedar", "Sandalwood", "Labdanum"]],
  ["armani-adg", "Giorgio Armani", "Acqua di Giò EDT", "masculine", "designer", 2, { aquatic: 90, citrus: 70, aromatic: 40, woody: 30 }, ["Lime", "Lemon", "Bergamot", "Neroli"], ["Sea Notes", "Jasmine", "Peach", "Rosemary"], ["White Musk", "Cedar", "Oakmoss", "Patchouli"]],
  ["ysl-libre", "Yves Saint Laurent", "Libre EDP", "feminine", "designer", 3, { aromatic: 80, white_floral: 80, gourmand: 60, amber: 40, musky: 30 }, ["Lavender", "Mandarin", "Blackcurrant"], ["Lavender", "Orange Blossom", "Jasmine"], ["Vanilla", "Musk", "Cedar", "Ambergris"]],
  ["ysl-black-opium", "Yves Saint Laurent", "Black Opium EDP", "feminine", "designer", 3, { gourmand: 90, white_floral: 50, fruity: 40, woody: 30 }, ["Pear", "Pink Pepper", "Orange Blossom"], ["Coffee", "Jasmine", "Bitter Almond"], ["Vanilla", "Patchouli", "Cedar", "Cashmere Wood"]],
  ["mfk-br540", "Maison Francis Kurkdjian", "Baccarat Rouge 540 EDP", "unisex", "niche", 3, { amber: 90, woody: 70, warm_spicy: 50, white_floral: 30 }, ["Saffron", "Jasmine"], ["Amberwood", "Ambergris"], ["Fir Resin", "Cedar"]],
  ["lelabo-santal33", "Le Labo", "Santal 33", "unisex", "niche", 2, { woody: 95, leather: 50, fresh_spicy: 40, powdery: 40 }, ["Cardamom", "Violet"], ["Iris", "Papyrus"], ["Sandalwood", "Cedar", "Leather", "Amber"]],
  ["jomalone-woodsage", "Jo Malone London", "Wood Sage & Sea Salt", "unisex", "designer", 1, { aquatic: 80, aromatic: 60, woody: 40, musky: 30 }, ["Ambrette"], ["Sea Salt"], ["Sage"]],
  ["jomalone-pear", "Jo Malone London", "English Pear & Freesia", "unisex", "designer", 1, { fruity: 90, rose_floral: 60, musky: 40, earthy: 30 }, ["Pear", "Melon"], ["Freesia", "Rose"], ["Patchouli", "White Musk", "Rhubarb"]],
  ["jomalone-limebasil", "Jo Malone London", "Lime Basil & Mandarin", "unisex", "designer", 1, { citrus: 90, aromatic: 60, earthy: 30 }, ["Lime", "Mandarin", "Bergamot"], ["Basil", "Thyme"], ["Vetiver", "Patchouli"]],
  ["ab-blue-seduction", "Antonio Banderas", "Blue Seduction for Men", "masculine", "affordable", 2, { aquatic: 70, fruity: 50, citrus: 50, aromatic: 40, musky: 40 }, ["Bergamot", "Melon", "Mint"], ["Cardamom", "Sea Notes"], ["Musk", "Woody Notes", "Amber"]],
  ["ab-golden-secret", "Antonio Banderas", "The Golden Secret", "masculine", "affordable", 2, { aromatic: 70, fruity: 50, woody: 40, amber: 30 }, ["Mint", "Green Apple"], ["Lavender"], ["Woody Notes", "Amber", "Musk"]],
  ["ab-king-seduction", "Antonio Banderas", "King of Seduction", "masculine", "affordable", 2, { citrus: 60, aquatic: 60, aromatic: 40, woody: 40 }, ["Bergamot", "Grapefruit", "Green Apple"], ["Sea Notes", "Cardamom"], ["Cedar", "Musk", "Amber"]],
  ["versace-eros", "Versace", "Eros EDT", "masculine", "mid", 3, { gourmand: 80, aromatic: 70, fruity: 40, citrus: 40, woody: 30 }, ["Mint", "Green Apple", "Lemon"], ["Tonka", "Ambroxan", "Geranium"], ["Vanilla", "Cedar", "Vetiver", "Oakmoss"]],
  ["versace-dylan-blue", "Versace", "Dylan Blue Pour Homme", "masculine", "mid", 2, { citrus: 60, aquatic: 60, aromatic: 50, musky: 50, woody: 40 }, ["Bergamot", "Grapefruit", "Fig Leaf", "Water Notes"], ["Violet Leaf", "Papyrus", "Black Pepper", "Ambroxan"], ["Musk", "Tonka", "Saffron", "Incense"]],
  ["versace-bright-crystal", "Versace", "Bright Crystal", "feminine", "mid", 1, { fruity: 70, rose_floral: 60, musky: 50, aquatic: 20 }, ["Pomegranate", "Yuzu"], ["Peony", "Magnolia", "Lotus"], ["Musk", "Mahogany", "Amber"]],
  ["pr-1million", "Rabanne", "1 Million EDT", "masculine", "mid", 3, { warm_spicy: 70, amber: 60, leather: 40, citrus: 40, gourmand: 30 }, ["Blood Mandarin", "Grapefruit", "Mint"], ["Cinnamon", "Spicy Notes", "Rose"], ["Amber", "Leather", "Woody Notes", "Patchouli"]],
  ["pr-invictus", "Rabanne", "Invictus EDT", "masculine", "mid", 3, { aquatic: 70, citrus: 60, woody: 50, musky: 30 }, ["Marine Notes", "Grapefruit", "Mandarin"], ["Bay Leaf", "Jasmine"], ["Ambergris", "Guaiac Wood", "Oakmoss", "Patchouli"]],
  ["jpg-le-male", "Jean Paul Gaultier", "Le Male EDT", "masculine", "mid", 2, { aromatic: 80, gourmand: 70, warm_spicy: 40, powdery: 30 }, ["Lavender", "Mint", "Cardamom", "Bergamot"], ["Cinnamon", "Orange Blossom", "Cumin"], ["Vanilla", "Tonka", "Amber", "Sandalwood"]],
  ["jpg-ultra-male", "Jean Paul Gaultier", "Ultra Male", "masculine", "mid", 3, { gourmand: 80, fruity: 60, aromatic: 60, amber: 40 }, ["Pear", "Lavender", "Mint", "Bergamot"], ["Cinnamon", "Clary Sage"], ["Black Vanilla", "Amber", "Patchouli", "Cedar"]],
  ["prada-paradoxe", "Prada", "Paradoxe EDP", "feminine", "designer", 2, { white_floral: 70, amber: 60, musky: 50, citrus: 30 }, ["Pear", "Mandarin", "Bergamot"], ["Neroli", "Jasmine"], ["Amber", "Bourbon Vanilla", "White Musk"]],
  ["prada-lhomme", "Prada", "L'Homme", "masculine", "designer", 1, { powdery: 70, musky: 60, woody: 50, citrus: 30 }, ["Neroli", "Black Pepper", "Cardamom"], ["Iris", "Violet", "Geranium"], ["Amber", "Patchouli", "Cedar", "Sandalwood"]],
  ["lancome-lveb", "Lancôme", "La Vie Est Belle EDP", "feminine", "designer", 3, { gourmand: 90, fruity: 50, powdery: 50, white_floral: 40 }, ["Blackcurrant", "Pear"], ["Iris", "Jasmine", "Orange Blossom"], ["Praline", "Vanilla", "Patchouli", "Tonka"]],
  ["lancome-idole", "Lancôme", "Idôle EDP", "feminine", "designer", 1, { rose_floral: 80, musky: 60, white_floral: 40, citrus: 30 }, ["Pear", "Bergamot", "Pink Pepper"], ["Rose", "Jasmine"], ["White Musk", "Vanilla", "Patchouli", "Cedar"]],
  ["gucci-bloom", "Gucci", "Bloom EDP", "feminine", "designer", 2, { white_floral: 95, green: 20, woody: 20 }, ["Rangoon Creeper"], ["Jasmine", "Tuberose"], ["Orris Root", "Sandalwood"]],
  ["gucci-flora-gardenia", "Gucci", "Flora Gorgeous Gardenia EDP", "feminine", "designer", 2, { white_floral: 80, fruity: 60, gourmand: 50 }, ["Red Berries", "Pear Blossom"], ["Gardenia", "Jasmine", "Frangipani"], ["Brown Sugar", "Patchouli"]],
  ["chanel-coco-mlle", "Chanel", "Coco Mademoiselle EDP", "feminine", "designer", 2, { earthy: 70, citrus: 60, rose_floral: 60, white_floral: 40, musky: 40 }, ["Orange", "Mandarin", "Bergamot"], ["Rose", "Jasmine", "Mimosa", "Ylang-Ylang"], ["Patchouli", "White Musk", "Vanilla", "Vetiver"]],
  ["chanel-chance-tendre", "Chanel", "Chance Eau Tendre EDT", "feminine", "designer", 1, { fruity: 70, musky: 60, rose_floral: 50, white_floral: 30 }, ["Quince", "Grapefruit"], ["Hyacinth", "Jasmine"], ["White Musk", "Iris", "Cedar", "Amber"]],
  ["chanel-no5", "Chanel", "N°5 EDP", "feminine", "designer", 2, { musky: 80, powdery: 70, white_floral: 60, rose_floral: 50, woody: 40 }, ["Aldehydes", "Ylang-Ylang", "Neroli", "Bergamot"], ["Iris", "Jasmine", "Rose", "Lily of the Valley"], ["Sandalwood", "Vanilla", "Amber", "Vetiver"]],
  ["dior-jadore", "Dior", "J'adore EDP", "feminine", "designer", 2, { white_floral: 90, fruity: 50, rose_floral: 40, musky: 30 }, ["Pear", "Melon", "Magnolia", "Mandarin"], ["Jasmine", "Tuberose", "Rose", "Lily of the Valley"], ["Musk", "Vanilla", "Cedar"]],
  ["dior-miss-dior", "Dior", "Miss Dior EDP", "feminine", "designer", 2, { rose_floral: 90, powdery: 50, fruity: 40, musky: 40, woody: 30 }, ["Iris", "Peony", "Lily of the Valley"], ["Rose", "Apricot", "Peach"], ["Musk", "Vanilla", "Tonka"]],
  ["dior-homme-intense", "Dior", "Dior Homme Intense", "masculine", "designer", 2, { powdery: 90, woody: 50, amber: 40, fruity: 20 }, ["Lavender"], ["Iris", "Ambrette", "Pear"], ["Vetiver", "Cedar"]],
  ["armani-si", "Giorgio Armani", "Sì EDP", "feminine", "designer", 2, { fruity: 80, gourmand: 60, rose_floral: 50, woody: 30 }, ["Blackcurrant"], ["Rose", "Freesia"], ["Vanilla", "Patchouli", "Ambroxan", "Woody Notes"]],
  ["armani-my-way", "Giorgio Armani", "My Way EDP", "feminine", "designer", 2, { white_floral: 80, citrus: 50, gourmand: 50, musky: 40 }, ["Bergamot", "Orange Blossom"], ["Tuberose", "Jasmine"], ["Vanilla", "White Musk", "Cedar"]],
  ["valentino-bir-donna", "Valentino", "Born in Roma Donna EDP", "feminine", "designer", 3, { gourmand: 70, white_floral: 60, fruity: 50, woody: 40 }, ["Blackcurrant", "Pink Pepper", "Bergamot"], ["Jasmine Sambac", "Jasmine Tea"], ["Bourbon Vanilla", "Cashmeran", "Guaiac Wood"]],
  ["valentino-bir-uomo", "Valentino", "Born in Roma Uomo EDT", "masculine", "designer", 3, { fresh_spicy: 60, aromatic: 60, woody: 60, earthy: 50 }, ["Mineral Notes", "Violet Leaf"], ["Ginger", "Sage"], ["Vetiver", "Woody Notes"]],
  ["ch-good-girl", "Carolina Herrera", "Good Girl EDP", "feminine", "designer", 3, { gourmand: 80, white_floral: 70, warm_spicy: 30, woody: 30 }, ["Almond", "Coffee", "Bergamot"], ["Tuberose", "Jasmine Sambac", "Orange Blossom"], ["Tonka", "Cacao", "Vanilla", "Sandalwood"]],
  ["ch-212-vip-men", "Carolina Herrera", "212 VIP Men", "masculine", "mid", 3, { fresh_spicy: 60, fruity: 50, tobacco: 50, leather: 40, amber: 40 }, ["Passion Fruit", "Lime", "Pepper"], ["Vodka", "Ginger", "Mint"], ["Leather", "Amber", "Woody Notes"]],
  ["ch-bad-boy", "Carolina Herrera", "Bad Boy EDT", "masculine", "designer", 2, { fresh_spicy: 70, gourmand: 60, woody: 50, aromatic: 40 }, ["White Pepper", "Black Pepper", "Bergamot"], ["Cedar", "Sage"], ["Tonka", "Cacao", "Amberwood"]],
  ["ariana-cloud", "Ariana Grande", "Cloud EDP", "feminine", "mid", 2, { gourmand: 80, musky: 50, fruity: 40, aromatic: 20 }, ["Lavender", "Pear", "Bergamot"], ["Whipped Cream", "Praline", "Coconut", "Vanilla Orchid"], ["Musk", "Blonde Woods"]],
  ["ck-one", "Calvin Klein", "CK One", "unisex", "affordable", 1, { citrus: 80, green: 50, musky: 50, aromatic: 30 }, ["Lemon", "Green Notes", "Bergamot", "Pineapple"], ["Lily of the Valley", "Jasmine", "Violet"], ["Musk", "Cedar", "Green Tea", "Amber"]],
  ["davidoff-cool-water", "Davidoff", "Cool Water Man", "masculine", "affordable", 2, { aquatic: 80, aromatic: 70, woody: 40, musky: 40, citrus: 30 }, ["Sea Water", "Lavender", "Mint", "Rosemary"], ["Sandalwood", "Neroli", "Jasmine", "Geranium"], ["Musk", "Oakmoss", "Cedar", "Amber"]],
  ["boss-bottled", "Hugo Boss", "Boss Bottled EDT", "masculine", "mid", 2, { fruity: 60, warm_spicy: 60, woody: 60, citrus: 30 }, ["Apple", "Plum", "Bergamot", "Lemon"], ["Cinnamon", "Mahogany", "Carnation"], ["Vanilla", "Sandalwood", "Cedar", "Vetiver"]],
  ["boss-the-scent", "Hugo Boss", "The Scent for Him EDT", "masculine", "mid", 3, { leather: 70, fresh_spicy: 60, fruity: 40, aromatic: 30 }, ["Ginger", "Mandarin", "Bergamot"], ["Maninka Fruit", "Lavender"], ["Leather", "Woody Notes"]],
  ["burberry-her", "Burberry", "Her EDP", "feminine", "designer", 2, { fruity: 90, gourmand: 40, musky: 40, white_floral: 30 }, ["Strawberry", "Raspberry", "Blackberry", "Blackcurrant"], ["Violet", "Jasmine"], ["Musk", "Vanilla", "Cashmeran", "Amber"]],
  ["burberry-hero", "Burberry", "Hero EDT", "masculine", "designer", 2, { woody: 90, citrus: 50, fresh_spicy: 40, aromatic: 30 }, ["Bergamot"], ["Black Pepper", "Juniper"], ["Cedar"]],
  ["tf-ombre-leather", "Tom Ford", "Ombré Leather EDP", "unisex", "designer", 3, { leather: 90, fresh_spicy: 40, white_floral: 40, earthy: 30 }, ["Cardamom"], ["Leather", "Jasmine Sambac"], ["Amber", "Moss", "Patchouli"]],
  ["tf-tobacco-vanille", "Tom Ford", "Tobacco Vanille EDP", "unisex", "niche", 3, { tobacco: 90, gourmand: 80, warm_spicy: 60, woody: 30 }, ["Tobacco Leaf", "Spicy Notes"], ["Vanilla", "Cacao", "Tonka", "Tobacco Blossom"], ["Dried Fruits", "Woody Notes"]],
  ["tf-oud-wood", "Tom Ford", "Oud Wood EDP", "unisex", "niche", 2, { smoky_oud: 80, woody: 80, fresh_spicy: 40, amber: 40 }, ["Rosewood", "Cardamom", "Chinese Pepper"], ["Oud", "Sandalwood", "Vetiver"], ["Tonka", "Vanilla", "Amber"]],
  ["tf-black-orchid", "Tom Ford", "Black Orchid EDP", "unisex", "designer", 3, { gourmand: 60, white_floral: 60, earthy: 60, fruity: 40, warm_spicy: 40 }, ["Truffle", "Gardenia", "Blackcurrant", "Ylang-Ylang"], ["Orchid", "Spices", "Lotus"], ["Dark Chocolate", "Patchouli", "Vanilla", "Incense"]],
  ["tf-lost-cherry", "Tom Ford", "Lost Cherry EDP", "unisex", "niche", 3, { fruity: 90, gourmand: 70, tobacco: 40, rose_floral: 30 }, ["Black Cherry", "Cherry Liqueur", "Bitter Almond"], ["Turkish Rose", "Jasmine Sambac"], ["Peru Balsam", "Tonka", "Sandalwood", "Vetiver"]],
  ["tf-neroli-portofino", "Tom Ford", "Neroli Portofino EDP", "unisex", "niche", 1, { citrus: 95, aromatic: 40, white_floral: 30, musky: 30 }, ["Bergamot", "Mandarin", "Lemon", "Lavender"], ["Neroli", "Orange Blossom", "Jasmine"], ["Amber", "Ambrette", "Angelica"]],
  ["mm-fireplace", "Maison Margiela", "Replica By the Fireplace", "unisex", "designer", 2, { smoky_oud: 70, gourmand: 70, woody: 60, warm_spicy: 40 }, ["Pink Pepper", "Orange Blossom", "Clove"], ["Chestnut", "Guaiac Wood", "Juniper"], ["Vanilla", "Peru Balsam", "Cashmeran"]],
  ["mm-lazy-sunday", "Maison Margiela", "Replica Lazy Sunday Morning", "unisex", "designer", 1, { musky: 90, powdery: 40, rose_floral: 40, fruity: 30 }, ["Aldehydes", "Pear", "Lily of the Valley"], ["Iris", "Rose", "Orange Blossom"], ["White Musk", "Ambrette", "Patchouli"]],
  ["mm-jazz-club", "Maison Margiela", "Replica Jazz Club", "unisex", "designer", 2, { tobacco: 80, gourmand: 60, fresh_spicy: 40, citrus: 30 }, ["Pink Pepper", "Lemon", "Neroli"], ["Rum", "Clary Sage", "Vetiver"], ["Tobacco Leaf", "Vanilla", "Styrax"]],
  ["kenzo-flower", "Kenzo", "Flower by Kenzo EDP", "feminine", "mid", 2, { powdery: 90, rose_floral: 50, musky: 40, gourmand: 30 }, ["Violet", "Hawthorn", "Blackcurrant", "Mandarin"], ["Violet", "Rose", "Opoponax", "Jasmine"], ["Vanilla", "White Musk", "Incense"]],
  ["montblanc-explorer", "Montblanc", "Explorer EDP", "masculine", "mid", 2, { woody: 70, earthy: 60, citrus: 50, musky: 50, fresh_spicy: 40 }, ["Bergamot", "Pink Pepper", "Clary Sage"], ["Vetiver", "Leather"], ["Patchouli", "Akigalawood", "Ambroxan", "Cacao"]],
  ["montblanc-legend", "Montblanc", "Legend EDT", "masculine", "mid", 2, { aromatic: 70, fruity: 50, citrus: 50, woody: 40, musky: 40 }, ["Bergamot", "Lavender", "Pineapple Leaf"], ["Apple", "Rose", "Geranium"], ["Tonka", "Sandalwood", "Oakmoss"]],
  ["creed-aventus", "Creed", "Aventus", "masculine", "niche", 3, { fruity: 80, smoky_oud: 50, musky: 50, woody: 50, citrus: 40 }, ["Pineapple", "Bergamot", "Blackcurrant", "Apple"], ["Birch", "Patchouli", "Jasmine", "Rose"], ["Musk", "Oakmoss", "Ambergris", "Vanilla"]],
  ["creed-smw", "Creed", "Silver Mountain Water", "unisex", "niche", 1, { aquatic: 70, green: 70, citrus: 60, musky: 50, fruity: 40 }, ["Bergamot", "Mandarin"], ["Green Tea", "Blackcurrant"], ["Musk", "Petitgrain", "Sandalwood", "Galbanum"]],
  ["pdm-layton", "Parfums de Marly", "Layton", "masculine", "niche", 3, { aromatic: 70, fruity: 60, gourmand: 60, woody: 50, fresh_spicy: 40 }, ["Apple", "Lavender", "Bergamot", "Mandarin"], ["Geranium", "Violet", "Jasmine"], ["Vanilla", "Cardamom", "Sandalwood", "Pepper"]],
  ["pdm-delina", "Parfums de Marly", "Delina", "feminine", "niche", 2, { rose_floral: 90, fruity: 60, musky: 50, powdery: 30 }, ["Lychee", "Rhubarb", "Bergamot", "Nutmeg"], ["Turkish Rose", "Peony", "Musk", "Vanilla"], ["Cashmeran", "Cedar", "Incense", "Vetiver"]],
  ["byredo-gypsy-water", "Byredo", "Gypsy Water", "unisex", "niche", 1, { woody: 70, citrus: 50, aromatic: 40, gourmand: 40, smoky_oud: 30 }, ["Bergamot", "Lemon", "Pepper", "Juniper"], ["Incense", "Pine Needles", "Orris"], ["Amber", "Vanilla", "Sandalwood"]],
  ["byredo-mojave-ghost", "Byredo", "Mojave Ghost", "unisex", "niche", 1, { woody: 70, musky: 60, powdery: 60, fruity: 40, white_floral: 30 }, ["Ambrette", "Sapodilla"], ["Violet", "Sandalwood", "Magnolia"], ["Cedar", "Amber", "Musk"]],
  ["diptyque-philosykos", "Diptyque", "Philosykos EDT", "unisex", "designer", 1, { green: 90, woody: 60, fruity: 40 }, ["Fig Leaf", "Fig"], ["Fig Leaves"], ["White Cedar", "Fig Tree"]],
  ["diptyque-do-son", "Diptyque", "Do Son EDT", "feminine", "designer", 2, { white_floral: 95, aquatic: 40, musky: 40 }, ["Orange Blossom", "Rose"], ["Tuberose"], ["Musk", "Benzoin", "Pink Pepper"]],
  ["diptyque-tam-dao", "Diptyque", "Tam Dao EDT", "unisex", "designer", 1, { woody: 95, amber: 40, aromatic: 30, musky: 30 }, ["Rosewood", "Cypress", "Myrtle"], ["Sandalwood", "Cedar"], ["Ambergris", "White Musk", "Spices"]],
  ["glossier-you", "Glossier", "Glossier You", "unisex", "mid", 1, { musky: 90, powdery: 50, woody: 40, fresh_spicy: 30 }, ["Pink Pepper", "Iris"], ["Ambrette"], ["Ambrox", "Musk"]],
  ["lattafa-khamrah", "Lattafa", "Khamrah", "unisex", "affordable", 3, { gourmand: 90, warm_spicy: 70, amber: 50, tobacco: 40 }, ["Cinnamon", "Nutmeg", "Bergamot"], ["Dates", "Praline", "Tuberose"], ["Vanilla", "Tonka", "Benzoin", "Myrrh"]],
  ["lattafa-asad", "Lattafa", "Asad", "masculine", "affordable", 3, { fresh_spicy: 60, tobacco: 60, amber: 60, gourmand: 50 }, ["Black Pepper", "Pineapple", "Tobacco"], ["Coffee", "Iris", "Patchouli"], ["Amber", "Dry Wood", "Vanilla", "Labdanum"]],
  ["armaf-cdnim", "Armaf", "Club de Nuit Intense Man", "masculine", "affordable", 3, { fruity: 70, citrus: 60, smoky_oud: 60, musky: 50, woody: 40 }, ["Lemon", "Pineapple", "Bergamot", "Blackcurrant"], ["Birch", "Jasmine", "Rose"], ["Musk", "Ambergris", "Patchouli", "Vanilla"]],
  ["mancera-cedrat-boise", "Mancera", "Cedrat Boisé", "unisex", "designer", 3, { citrus: 70, woody: 70, fruity: 60, leather: 50, musky: 40 }, ["Sicilian Lemon", "Blackcurrant", "Bergamot"], ["Fruity Notes", "Water Jasmine", "Patchouli"], ["Leather", "Sandalwood", "Vanilla", "Oakmoss"]],
  ["mancera-red-tobacco", "Mancera", "Red Tobacco", "unisex", "designer", 3, { tobacco: 80, warm_spicy: 60, smoky_oud: 50, fruity: 40, gourmand: 30 }, ["Cinnamon", "Saffron", "Nutmeg", "Green Apple"], ["Jasmine", "Patchouli"], ["Tobacco", "Oud", "Amber", "Vanilla"]],
  ["narciso-for-her", "Narciso Rodriguez", "For Her EDP", "feminine", "designer", 2, { musky: 90, rose_floral: 60, amber: 40, woody: 30 }, ["Rose", "Peach"], ["Musk", "Amber"], ["Sandalwood", "Vanilla", "Vetiver"]],
  ["mj-daisy", "Marc Jacobs", "Daisy EDT", "feminine", "mid", 1, { fruity: 70, white_floral: 60, musky: 50, powdery: 30 }, ["Strawberry", "Violet Leaf", "Grapefruit"], ["Gardenia", "Violet", "Jasmine"], ["Musk", "Vanilla", "White Woods"]],
  ["dg-light-blue", "Dolce & Gabbana", "Light Blue EDT", "feminine", "mid", 1, { citrus: 90, fruity: 60, green: 40, musky: 40, woody: 40 }, ["Sicilian Lemon", "Apple", "Bellflower"], ["Bamboo", "Jasmine", "White Rose"], ["Cedar", "Musk", "Amber"]],
  ["dg-the-one-men", "Dolce & Gabbana", "The One for Men EDP", "masculine", "designer", 2, { tobacco: 70, amber: 70, warm_spicy: 50, citrus: 40 }, ["Grapefruit", "Coriander", "Basil"], ["Ginger", "Cardamom", "Orange Blossom"], ["Tobacco", "Amber", "Cedar"]],
  ["hermes-terre", "Hermès", "Terre d'Hermès EDT", "masculine", "designer", 2, { woody: 80, citrus: 70, earthy: 60, fresh_spicy: 40 }, ["Orange", "Grapefruit"], ["Pepper", "Pelargonium", "Flint"], ["Vetiver", "Cedar", "Patchouli", "Benzoin"]],
  ["hermes-jardin-nil", "Hermès", "Un Jardin sur le Nil", "unisex", "designer", 1, { green: 80, citrus: 60, fruity: 50, woody: 40, aquatic: 30 }, ["Green Mango", "Grapefruit", "Tomato Leaf"], ["Lotus", "Orange", "Hyacinth"], ["Incense", "Iris", "Musk", "Sycamore"]],
  ["hermes-twilly", "Hermès", "Twilly d'Hermès EDP", "feminine", "designer", 2, { fresh_spicy: 70, white_floral: 70, woody: 40 }, ["Ginger"], ["Tuberose"], ["Sandalwood"]],
  ["issey-leau-homme", "Issey Miyake", "L'Eau d'Issey Pour Homme", "masculine", "mid", 2, { citrus: 80, aquatic: 60, woody: 50, warm_spicy: 30 }, ["Yuzu", "Lemon", "Bergamot", "Cypress"], ["Water Lily", "Nutmeg", "Geranium"], ["Vetiver", "Sandalwood", "Cedar", "Musk"]],
  ["vr-flowerbomb", "Viktor&Rolf", "Flowerbomb EDP", "feminine", "designer", 3, { white_floral: 70, amber: 50, rose_floral: 50, earthy: 50, musky: 40 }, ["Tea", "Bergamot", "Osmanthus"], ["Orchid", "Rose", "Jasmine", "Freesia"], ["Patchouli", "Musk"]],
  ["vr-spicebomb", "Viktor&Rolf", "Spicebomb EDT", "masculine", "designer", 3, { warm_spicy: 90, tobacco: 70, leather: 50, amber: 50, fresh_spicy: 40 }, ["Pink Pepper", "Bergamot", "Elemi", "Grapefruit"], ["Cinnamon", "Saffron", "Chili"], ["Tobacco", "Leather", "Vetiver"]],
  ["mugler-alien", "Mugler", "Alien EDP", "feminine", "designer", 3, { white_floral: 90, amber: 60, woody: 50 }, ["Jasmine Sambac"], ["Cashmeran"], ["White Amber"]],
  ["mugler-angel", "Mugler", "Angel EDP", "feminine", "designer", 3, { gourmand: 90, earthy: 80, fruity: 50, musky: 30 }, ["Melon", "Coconut", "Mandarin", "Cotton Candy"], ["Honey", "Apricot", "Red Berries", "Rose"], ["Patchouli", "Chocolate", "Caramel", "Vanilla"]],
  ["kilian-ldbs", "Kilian", "Love, Don't Be Shy", "unisex", "niche", 3, { gourmand: 90, white_floral: 70, musky: 40, amber: 40 }, ["Neroli", "Bergamot", "Pink Pepper"], ["Orange Blossom", "Iris", "Jasmine", "Rose"], ["Marshmallow", "Vanilla", "Musk", "Labdanum"]],
  ["kayali-vanilla28", "Kayali", "Vanilla | 28", "feminine", "designer", 3, { gourmand: 95, amber: 60, woody: 30 }, ["Vanilla Orchid"], ["Brown Sugar", "Tonka"], ["Amber", "Musk", "Woody Notes"]],
  ["amouage-interlude-man", "Amouage", "Interlude Man", "masculine", "niche", 3, { smoky_oud: 90, amber: 70, warm_spicy: 50, leather: 40 }, ["Oregano", "Pimento", "Bergamot"], ["Amber", "Incense", "Opoponax"], ["Leather", "Agarwood", "Sandalwood", "Patchouli"]],
  ["bvlgari-omnia-crystalline", "Bvlgari", "Omnia Crystalline EDT", "feminine", "mid", 1, { aquatic: 60, green: 50, musky: 40, woody: 40, white_floral: 30 }, ["Bamboo", "Nashi Pear"], ["Lotus", "Tea"], ["Balsa Wood", "Musk"]],
  ["bvlgari-aqva", "Bvlgari", "Aqva Pour Homme EDT", "masculine", "mid", 2, { aquatic: 90, citrus: 50, green: 40, woody: 30 }, ["Mandarin", "Petitgrain"], ["Posidonia", "Santolina"], ["Clearwood", "Mineral Amber"]],
  ["ysl-y-edp", "Yves Saint Laurent", "Y EDP", "masculine", "designer", 2, { fruity: 60, aromatic: 60, fresh_spicy: 60, amber: 50, woody: 50 }, ["Apple", "Ginger", "Bergamot"], ["Sage", "Juniper", "Geranium"], ["Amberwood", "Tonka", "Cedar", "Vetiver"]],
  ["dior-fahrenheit", "Dior", "Fahrenheit EDT", "masculine", "designer", 2, { leather: 70, woody: 60, powdery: 50, citrus: 30 }, ["Nutmeg Flower", "Mandarin", "Bergamot", "Lemon"], ["Violet Leaf", "Nutmeg", "Cedar", "Sandalwood"], ["Leather", "Vetiver", "Musk", "Amber"]],
  ["chloe-edp", "Chloé", "Chloé EDP", "feminine", "designer", 1, { rose_floral: 90, powdery: 50, fruity: 30 }, ["Peony", "Lychee", "Freesia"], ["Rose", "Magnolia", "Lily of the Valley"], ["Amber", "Cedar"]],
  ["vs-bombshell", "Victoria's Secret", "Bombshell EDP", "feminine", "mid", 2, { fruity: 80, rose_floral: 60, woody: 30, musky: 30 }, ["Purple Passion Fruit", "Citrus"], ["Shangri-la Peony", "Vanilla Orchid"], ["Woody Notes", "Musk"]],
  ["ck-eternity-men", "Calvin Klein", "Eternity for Men EDT", "masculine", "affordable", 2, { aromatic: 80, citrus: 50, woody: 50, green: 40 }, ["Lavender", "Lemon", "Mandarin", "Bergamot"], ["Sage", "Jasmine", "Geranium"], ["Sandalwood", "Vetiver", "Rosewood", "Amber"]],
];

/** [estimated price IDR, bottle size ml] */
const PRICES: Record<string, [number, number]> = {
  "dior-sauvage-edt": [2150000, 100], "chanel-bleu-edp": [2700000, 100], "armani-adg": [1900000, 100],
  "ysl-libre": [2600000, 90], "ysl-black-opium": [2500000, 90], "mfk-br540": [5900000, 70],
  "lelabo-santal33": [5200000, 100], "jomalone-woodsage": [3100000, 100], "jomalone-pear": [3100000, 100],
  "jomalone-limebasil": [3100000, 100], "ab-blue-seduction": [250000, 100], "ab-golden-secret": [250000, 100],
  "ab-king-seduction": [250000, 100], "versace-eros": [1500000, 100], "versace-dylan-blue": [1500000, 100],
  "versace-bright-crystal": [1400000, 90], "pr-1million": [1600000, 100], "pr-invictus": [1600000, 100],
  "jpg-le-male": [1700000, 125], "jpg-ultra-male": [1800000, 125], "prada-paradoxe": [2400000, 90],
  "prada-lhomme": [2200000, 100], "lancome-lveb": [2300000, 100], "lancome-idole": [2000000, 75],
  "gucci-bloom": [2300000, 100], "gucci-flora-gardenia": [2200000, 100], "chanel-coco-mlle": [3000000, 100],
  "chanel-chance-tendre": [3000000, 100], "chanel-no5": [3200000, 100], "dior-jadore": [2700000, 100],
  "dior-miss-dior": [2800000, 100], "dior-homme-intense": [2400000, 100], "armani-si": [2300000, 100],
  "armani-my-way": [2300000, 90], "valentino-bir-donna": [2400000, 100], "valentino-bir-uomo": [2100000, 100],
  "ch-good-girl": [2200000, 80], "ch-212-vip-men": [1500000, 100], "ch-bad-boy": [1800000, 100],
  "ariana-cloud": [900000, 100], "ck-one": [600000, 100], "davidoff-cool-water": [550000, 125],
  "boss-bottled": [1500000, 100], "boss-the-scent": [1500000, 100], "burberry-her": [2200000, 100],
  "burberry-hero": [1900000, 100], "tf-ombre-leather": [3300000, 100], "tf-tobacco-vanille": [5500000, 50],
  "tf-oud-wood": [5500000, 50], "tf-black-orchid": [3000000, 100], "tf-lost-cherry": [6000000, 50],
  "tf-neroli-portofino": [5000000, 50], "mm-fireplace": [2600000, 100], "mm-lazy-sunday": [2600000, 100],
  "mm-jazz-club": [2600000, 100], "kenzo-flower": [1600000, 100], "montblanc-explorer": [1200000, 100],
  "montblanc-legend": [1000000, 100], "creed-aventus": [6500000, 100], "creed-smw": [6000000, 100],
  "pdm-layton": [5000000, 125], "pdm-delina": [5000000, 75], "byredo-gypsy-water": [4700000, 100],
  "byredo-mojave-ghost": [4700000, 100], "diptyque-philosykos": [2700000, 100], "diptyque-do-son": [2700000, 100],
  "diptyque-tam-dao": [2700000, 100], "glossier-you": [1200000, 50], "lattafa-khamrah": [450000, 100],
  "lattafa-asad": [350000, 100], "armaf-cdnim": [600000, 105], "mancera-cedrat-boise": [2400000, 120],
  "mancera-red-tobacco": [2400000, 120], "narciso-for-her": [2300000, 100], "mj-daisy": [1700000, 100],
  "dg-light-blue": [1500000, 100], "dg-the-one-men": [2000000, 100], "hermes-terre": [2400000, 100],
  "hermes-jardin-nil": [2600000, 100], "hermes-twilly": [2400000, 85], "issey-leau-homme": [1500000, 125],
  "vr-flowerbomb": [2800000, 100], "vr-spicebomb": [2000000, 90], "mugler-alien": [2600000, 90],
  "mugler-angel": [2600000, 100], "kilian-ldbs": [4800000, 50], "kayali-vanilla28": [2400000, 100],
  "amouage-interlude-man": [5800000, 100], "bvlgari-omnia-crystalline": [1100000, 65], "bvlgari-aqva": [1300000, 100],
  "ysl-y-edp": [2300000, 100], "dior-fahrenheit": [2100000, 100], "chloe-edp": [2300000, 75],
  "vs-bombshell": [1500000, 100], "ck-eternity-men": [650000, 100],
};

/** Second batch: [row, price, size]. Tier in the row is ignored; it is derived from price. */
const MORE: [Row, number, number][] = [
  [["dior-sauvage-elixir", "Dior", "Sauvage Elixir", "masculine", "designer", 3, { warm_spicy: 70, aromatic: 70, woody: 60, amber: 50, fresh_spicy: 40 }, ["Grapefruit", "Cinnamon", "Nutmeg", "Cardamom"], ["Lavender"], ["Licorice", "Sandalwood", "Amber", "Patchouli", "Vetiver"]], 2900000, 60],
  [["chanel-allure-sport", "Chanel", "Allure Homme Sport EDT", "masculine", "designer", 2, { aquatic: 60, citrus: 60, musky: 50, woody: 40, gourmand: 30 }, ["Orange", "Sea Notes", "Aldehydes"], ["Pepper", "Neroli", "Cedar"], ["Tonka", "Vanilla", "White Musk", "Vetiver"]], 2600000, 100],
  [["chanel-chance-edp", "Chanel", "Chance EDP", "feminine", "designer", 2, { earthy: 60, white_floral: 50, fresh_spicy: 40, fruity: 40, musky: 40 }, ["Pink Pepper", "Lemon", "Pineapple"], ["Jasmine", "Hyacinth", "Iris"], ["Patchouli", "Vetiver", "White Musk", "Vanilla"]], 3200000, 100],
  [["ysl-lndlh", "Yves Saint Laurent", "La Nuit de L'Homme EDT", "masculine", "designer", 2, { fresh_spicy: 80, aromatic: 60, woody: 50, earthy: 40 }, ["Cardamom"], ["Lavender", "Cedar", "Bergamot"], ["Vetiver", "Caraway"]], 2000000, 100],
  [["ysl-myslf", "Yves Saint Laurent", "MYSLF EDP", "masculine", "designer", 2, { white_floral: 70, woody: 60, citrus: 50, musky: 40 }, ["Bergamot"], ["Orange Blossom"], ["Patchouli", "Ambery Woods"]], 2400000, 100],
  [["ysl-mon-paris", "Yves Saint Laurent", "Mon Paris EDP", "feminine", "designer", 3, { fruity: 80, earthy: 60, white_floral: 50, musky: 40 }, ["Strawberry", "Raspberry", "Pear"], ["Peony", "Jasmine", "Datura"], ["Patchouli", "White Musk", "Vanilla"]], 2500000, 90],
  [["prada-lr-carbon", "Prada", "Luna Rossa Carbon EDT", "masculine", "designer", 2, { aromatic: 70, musky: 60, fresh_spicy: 50, earthy: 40, citrus: 40 }, ["Bergamot", "Pepper"], ["Lavender", "Metallic Notes"], ["Ambroxan", "Patchouli"]], 2100000, 100],
  [["prada-candy", "Prada", "Candy EDP", "feminine", "designer", 3, { gourmand: 90, amber: 50, powdery: 50, musky: 30 }, ["Caramel"], ["Powdery Notes", "Musk"], ["Benzoin", "Vanilla"]], 2300000, 80],
  [["givenchy-gentleman-edp", "Givenchy", "Gentleman EDP", "masculine", "designer", 2, { powdery: 70, earthy: 60, gourmand: 50, fresh_spicy: 40, leather: 30 }, ["Black Pepper"], ["Iris"], ["Patchouli", "Vanilla", "Benzoin"]], 2100000, 100],
  [["givenchy-linterdit", "Givenchy", "L'Interdit EDP", "feminine", "designer", 3, { white_floral: 80, earthy: 50, woody: 40, gourmand: 30 }, ["Pear", "Bergamot"], ["Tuberose", "Orange Blossom", "Jasmine Sambac"], ["Patchouli", "Vetiver", "Ambroxan", "Vanilla"]], 2300000, 80],
  [["azzaro-most-wanted", "Azzaro", "The Most Wanted EDP Intense", "masculine", "mid", 3, { gourmand: 70, amber: 60, fresh_spicy: 60, woody: 40 }, ["Cardamom"], ["Toffee"], ["Amberwood"]], 1700000, 100],
  [["azzaro-chrome", "Azzaro", "Chrome EDT", "masculine", "mid", 1, { citrus: 70, aquatic: 60, musky: 50, aromatic: 40, woody: 30 }, ["Lemon", "Bergamot", "Neroli", "Rosemary"], ["Cyclamen", "Jasmine", "Coriander"], ["White Musk", "Oakmoss", "Cedar"]], 1100000, 100],
  [["armani-code", "Giorgio Armani", "Armani Code EDT", "masculine", "designer", 2, { gourmand: 60, white_floral: 50, citrus: 50, warm_spicy: 40, leather: 30 }, ["Lemon", "Bergamot"], ["Star Anise", "Olive Blossom", "Guaiac Wood"], ["Leather", "Tonka", "Tobacco"]], 2000000, 125],
  [["armani-swy", "Giorgio Armani", "Stronger With You EDT", "masculine", "designer", 3, { gourmand: 80, fresh_spicy: 60, aromatic: 50, amber: 40 }, ["Cardamom", "Pink Pepper", "Violet Leaf"], ["Sage", "Lavender"], ["Chestnut", "Vanilla", "Amberwood"]], 1900000, 100],
  [["guerlain-shalimar", "Guerlain", "Shalimar EDP", "feminine", "designer", 3, { amber: 90, gourmand: 60, powdery: 60, citrus: 50, leather: 30 }, ["Bergamot", "Lemon"], ["Iris", "Jasmine", "Rose"], ["Vanilla", "Tonka", "Opoponax", "Incense"]], 2600000, 90],
  [["guerlain-lhomme-ideal", "Guerlain", "L'Homme Idéal EDP", "masculine", "designer", 2, { gourmand: 70, leather: 40, citrus: 40, woody: 40 }, ["Almond", "Orange", "Bergamot", "Rosemary"], ["Rose", "Leather"], ["Tonka", "Vanilla", "Cedar"]], 2000000, 100],
  [["hermes-h24", "Hermès", "H24 EDT", "masculine", "designer", 1, { aromatic: 70, green: 50, woody: 40, musky: 40 }, ["Clary Sage"], ["Narcissus"], ["Rosewood", "Sclarene"]], 2400000, 100],
  [["lacoste-blanc", "Lacoste", "L.12.12 Blanc EDT", "masculine", "mid", 1, { citrus: 60, woody: 50, green: 50, aromatic: 40 }, ["Grapefruit", "Cardamom", "Rosemary"], ["Tuberose", "Ylang-Ylang"], ["Cedar", "Vetiver", "Suede"]], 1300000, 100],
  [["ck-euphoria", "Calvin Klein", "Euphoria EDP", "feminine", "mid", 3, { fruity: 70, white_floral: 50, amber: 50, woody: 40 }, ["Pomegranate", "Persimmon", "Green Notes"], ["Black Orchid", "Lotus"], ["Mahogany", "Amber", "Violet"]], 1200000, 100],
  [["nautica-voyage", "Nautica", "Voyage EDT", "masculine", "affordable", 1, { aquatic: 70, green: 60, fruity: 40, musky: 40, woody: 30 }, ["Green Apple", "Green Leaves"], ["Lotus", "Mimosa"], ["Musk", "Cedar", "Amber", "Oakmoss"]], 350000, 100],
  [["bvlgari-mib", "Bvlgari", "Man in Black EDP", "masculine", "designer", 3, { tobacco: 60, leather: 60, warm_spicy: 50, amber: 50, gourmand: 40 }, ["Rum", "Spices"], ["Tuberose", "Iris", "Leather"], ["Benzoin", "Tonka", "Guaiac Wood"]], 2000000, 100],
  [["burberry-goddess", "Burberry", "Goddess EDP", "feminine", "designer", 2, { gourmand: 80, aromatic: 70, powdery: 30 }, ["Lavender"], ["Vanilla", "Ginger"], ["Vanilla Absolute", "Cacao"]], 2500000, 100],
  [["gucci-guilty-ph", "Gucci", "Guilty Pour Homme EDT", "masculine", "designer", 2, { aromatic: 70, citrus: 50, woody: 50, earthy: 40, white_floral: 30 }, ["Lemon", "Lavender"], ["Orange Blossom", "Neroli"], ["Patchouli", "Cedar"]], 1900000, 90],
  [["mm-beach-walk", "Maison Margiela", "Replica Beach Walk", "unisex", "designer", 1, { musky: 60, citrus: 60, fruity: 50, white_floral: 40 }, ["Bergamot", "Lemon", "Pink Pepper"], ["Ylang-Ylang", "Coconut Milk", "Heliotrope"], ["Musk", "Cedar"]], 2600000, 100],
  [["lelabo-another13", "Le Labo", "Another 13", "unisex", "niche", 1, { musky: 90, fruity: 30, green: 30 }, ["Pear", "Ambrette"], ["Jasmine", "Moss"], ["Ambroxan", "Musk"]], 5200000, 100],
  [["byredo-bal-dafrique", "Byredo", "Bal d'Afrique", "unisex", "niche", 2, { woody: 60, citrus: 50, musky: 50, powdery: 40, earthy: 40 }, ["Bergamot", "Lemon", "Neroli", "Marigold"], ["Violet", "Jasmine", "Cyclamen"], ["Vetiver", "Musk", "Cedar", "Amber"]], 4700000, 100],
  [["jomalone-peony", "Jo Malone London", "Peony & Blush Suede", "feminine", "designer", 1, { rose_floral: 90, fruity: 50, leather: 40 }, ["Red Apple"], ["Peony", "Rose", "Jasmine"], ["Suede"]], 3100000, 100],
  [["jomalone-myrrh-tonka", "Jo Malone London", "Myrrh & Tonka Cologne Intense", "unisex", "niche", 3, { amber: 80, gourmand: 70, aromatic: 40 }, ["Lavender"], ["Myrrh"], ["Tonka", "Vanilla", "Almond"]], 4200000, 100],
  [["mfk-grand-soir", "Maison Francis Kurkdjian", "Grand Soir EDP", "unisex", "niche", 3, { amber: 95, gourmand: 50, smoky_oud: 30 }, ["Labdanum"], ["Benzoin", "Tonka"], ["Amber", "Vanilla"]], 5900000, 70],
  [["creed-git", "Creed", "Green Irish Tweed", "masculine", "niche", 2, { green: 70, aromatic: 50, powdery: 50, musky: 50, woody: 40 }, ["Lemon Verbena", "Peppermint"], ["Violet Leaf", "Iris"], ["Ambergris", "Sandalwood"]], 6500000, 100],
  [["xerjoff-naxos", "Xerjoff", "Naxos", "unisex", "niche", 3, { tobacco: 80, gourmand: 70, aromatic: 60, citrus: 30 }, ["Lavender", "Bergamot", "Lemon"], ["Honey", "Cinnamon", "Jasmine"], ["Tobacco Leaf", "Tonka", "Vanilla"]], 6500000, 100],
  [["initio-ofg", "Initio", "Oud for Greatness", "unisex", "niche", 3, { smoky_oud: 90, warm_spicy: 50, aromatic: 40, earthy: 40, musky: 40 }, ["Saffron", "Nutmeg", "Lavender"], ["Agarwood"], ["Patchouli", "Musk"]], 6000000, 90],
  [["nishane-hacivat", "Nishane", "Hacivat", "unisex", "niche", 3, { fruity: 70, citrus: 60, earthy: 60, woody: 60 }, ["Pineapple", "Grapefruit", "Bergamot"], ["Cedar", "Patchouli", "Jasmine"], ["Oakmoss", "Woody Notes"]], 4500000, 50],
  [["kilian-angels-share", "Kilian", "Angels' Share", "unisex", "niche", 3, { gourmand: 80, tobacco: 70, warm_spicy: 60, woody: 30 }, ["Cognac"], ["Cinnamon", "Tonka", "Oak"], ["Praline", "Vanilla", "Sandalwood"]], 5000000, 50],
  [["mancera-roses-vanille", "Mancera", "Roses Vanille", "unisex", "designer", 3, { rose_floral: 80, gourmand: 70, citrus: 30 }, ["Lemon"], ["Rose"], ["Vanilla", "White Musk", "Sugar"]], 2400000, 120],
  [["montale-intense-cafe", "Montale", "Intense Café", "unisex", "designer", 3, { gourmand: 70, rose_floral: 70, amber: 50, musky: 40 }, ["Coffee"], ["Rose"], ["Vanilla", "Amber", "White Musk"]], 2100000, 100],
  [["lattafa-yara", "Lattafa", "Yara", "feminine", "affordable", 2, { gourmand: 80, fruity: 60, powdery: 50, musky: 40 }, ["Orchid", "Heliotrope", "Tangerine"], ["Tropical Fruits", "Gourmand Accord"], ["Vanilla", "Musk", "Sandalwood"]], 400000, 100],
  [["afnan-9pm", "Afnan", "9PM", "masculine", "affordable", 3, { gourmand: 80, fruity: 50, aromatic: 50, warm_spicy: 40, amber: 40 }, ["Apple", "Cinnamon", "Lavender", "Bergamot"], ["Orange Blossom", "Lily of the Valley"], ["Vanilla", "Tonka", "Amber", "Patchouli"]], 450000, 100],
  [["rasasi-hawas", "Rasasi", "Hawas for Him", "masculine", "affordable", 2, { aquatic: 70, fruity: 60, citrus: 50, aromatic: 40, musky: 40 }, ["Apple", "Bergamot", "Lemon", "Cinnamon"], ["Water Notes", "Plum", "Orange Blossom", "Cardamom"], ["Ambergris", "Musk", "Driftwood", "Patchouli"]], 650000, 100],
  [["alrehab-choco-musk", "Al Rehab", "Choco Musk (perfume oil)", "unisex", "affordable", 2, { gourmand: 80, musky: 60, rose_floral: 30, warm_spicy: 30 }, ["Chocolate"], ["Rose", "Spices"], ["Musk", "Vanilla"]], 75000, 6],
];

/**
 * Local Indonesian brands. Product names are real to our knowledge, but the note pyramids and
 * prices below are BEST GUESSES (notesApprox) and must be checked against the brand's own page.
 */
const LOCAL: [Row, number, number][] = [
  [["hmns-orgasm", "HMNS", "Orgasm", "unisex", "affordable", 2, { fruity: 70, white_floral: 50, gourmand: 50, musky: 40 }, ["Peach", "Bergamot"], ["Jasmine", "Rose"], ["Vanilla", "Musk"]], 369000, 100],
  [["hmns-dsoo", "HMNS", "Darker Shade of Orgasm", "unisex", "affordable", 3, { gourmand: 60, amber: 60, woody: 50, warm_spicy: 40 }, ["Spices", "Fruity Notes"], ["Floral Notes"], ["Amber", "Vanilla", "Woody Notes"]], 399000, 100],
  [["hmns-alpha", "HMNS", "Alpha", "unisex", "affordable", 2, { citrus: 70, aromatic: 60, woody: 40, musky: 40 }, ["Bergamot", "Lemon"], ["Lavender"], ["Cedar", "Musk"]], 369000, 100],
  [["hmns-farhampton", "HMNS", "Farhampton", "unisex", "affordable", 2, { aquatic: 70, citrus: 50, green: 40, musky: 40 }, ["Sea Notes", "Citrus"], ["Green Notes"], ["Musk", "Woody Notes"]], 369000, 100],
  [["hmns-eots", "HMNS", "Essence of the Sun", "unisex", "affordable", 2, { citrus: 70, white_floral: 50, musky: 40 }, ["Orange", "Bergamot"], ["Orange Blossom"], ["Musk"]], 369000, 100],
  [["hmns-unrosed", "HMNS", "Unrosed", "unisex", "affordable", 2, { rose_floral: 60, fruity: 50, musky: 50, woody: 30 }, ["Fruity Notes"], ["Rose"], ["Musk", "Woody Notes"]], 369000, 100],
];

export function tierFromPrice(priceIdr: number, sizeMl: number): PriceTier {
  const per100 = (priceIdr / sizeMl) * 100;
  if (sizeMl < 30) return priceIdr < 700000 ? "affordable" : "mid"; // oils and minis: judge by bottle price
  if (per100 < 700000) return "affordable";
  if (per100 < 1800000) return "mid";
  if (per100 < 3500000) return "designer";
  return "niche";
}

function build(row: Row, priceIdr: number, sizeMl: number, origin: Origin, notesApprox: boolean): Perfume {
  const [id, brand, name, gender, , intensity, accords, top, heart, base] = row;
  return {
    id, brand, name, gender, intensity, accords,
    notes: { top, heart, base },
    priceIdr, sizeMl, origin, notesApprox,
    tier: tierFromPrice(priceIdr, sizeMl),
    verified: false,
  };
}

export const PERFUMES: Perfume[] = [
  ...ROWS.map((r) => { const [price, size] = PRICES[r[0]] ?? [0, 100]; return build(r, price, size, "international", false); }),
  ...MORE.map(([r, price, size]) => build(r, price, size, "international", false)),
  ...LOCAL.map(([r, price, size]) => build(r, price, size, "local", true)),
];

export const PERFUME_MAP = Object.fromEntries(PERFUMES.map((p) => [p.id, p])) as Record<string, Perfume>;

export const TIER_LABEL: Record<PriceTier, { id: string; en: string }> = {
  affordable: { id: "Terjangkau", en: "Affordable" },
  mid: { id: "Menengah", en: "Mid-range" },
  designer: { id: "Designer", en: "Designer" },
  niche: { id: "Niche", en: "Niche" },
};

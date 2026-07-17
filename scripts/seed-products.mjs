// Seeds ecommerce_db with the storefront's current catalog (previously a
// static array in src/lib/data/products.ts). Transcribed once here rather
// than imported live, since Node's plain module resolution doesn't
// understand the project's "@/" tsconfig path alias.
//
// Idempotent — every insert is ON CONFLICT (slug) DO UPDATE, safe to re-run.
// Usage: node --env-file=.env.local scripts/seed-products.mjs

import pg from "pg";

const { Pool } = pg;

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unsplash(id, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

const IMG = {
  flowerBud1: unsplash("1503262028195-93c528f03218"),
  flowerBud2: unsplash("1590682751946-a65099676151"),
  flowerBud3: unsplash("1518469669531-9b8c528f909d"),
  flowerBud4: unsplash("1589141986943-5578615fdef2"),
  flowerBud5: unsplash("1520224855316-280b2e6afca1"),
  preRoll1: unsplash("1649127472726-5396b1e85a31"),
  preRoll2: unsplash("1625565828426-c4b6ce15b76d"),
  preRoll3: unsplash("1695866648575-843558bd6293"),
  preRoll4: unsplash("1605570380656-fbf9e534ac78"),
  vapePen1: unsplash("1545095088-26a59e3f2717"),
  vapePen2: unsplash("1579165466814-e646cfa4a3be"),
  vapePen3: unsplash("1666402666733-b6e4443dc4de"),
  vapePen4: unsplash("1616093053570-0143f27b994d"),
  gummies1: unsplash("1582058091505-f87a2e55a40f"),
  gummies2: unsplash("1635342219731-4ae2bf39e1e9"),
  gummies3: unsplash("1617627191898-1408bf607b4d"),
  gummies4: unsplash("1675437434916-fd6d0b03749d"),
  concentrate1: unsplash("1696192410531-dc179772a0e8"),
  concentrate2: unsplash("1619870514532-280e4c479e8f"),
  concentrate3: unsplash("1655892832074-4768d61f0431"),
  concentrate4: unsplash("1647505310170-04aeadc30aeb"),
  topical1: unsplash("1631438420064-8f1b2b52b2e6"),
  topical2: unsplash("1643123158391-8543727c85f5"),
  topical3: unsplash("1622618991227-412b19e4fef9"),
  topical4: unsplash("1763709546912-62e898c99d7c"),
  beverage1: unsplash("1554866585-cd94860890b7"),
  beverage2: unsplash("1592892111425-15e04305f961"),
  beverage3: unsplash("1581098365948-6a5a912b7a49"),
  beverage4: unsplash("1585498154575-3db0fda49f1d"),
  accessory1: unsplash("1776846763275-4b4d1f13fae2"),
  accessory2: unsplash("1765120828124-f3217ba51a09"),
  accessory3: unsplash("1598052162797-ba3530cc75b1"),
  accessory4: unsplash("1627157720831-e65362d40142"),
};

const CATEGORIES = [
  { slug: "flower", name: "Flower", description: "Premium indoor-grown sativa, indica, and hybrid bud.", image: IMG.flowerBud1 },
  { slug: "pre-rolls", name: "Pre-Rolls", description: "Hand-rolled joints and blunts, ready to enjoy.", image: IMG.preRoll1 },
  { slug: "vaporizers", name: "Vaporizers", description: "Disposable vapes and 510-thread cartridges.", image: IMG.vapePen1 },
  { slug: "edibles", name: "Edibles", description: "Gummies and infused treats, precisely dosed.", image: IMG.gummies1 },
  { slug: "concentrates", name: "Concentrates", description: "Shatter, live resin, and rosin for the connoisseur.", image: IMG.concentrate1 },
  { slug: "topicals", name: "Topicals", description: "Balms and relief sticks for targeted, non-intoxicating care.", image: IMG.topical1 },
  { slug: "beverages", name: "Beverages", description: "THC and CBD infused drinks for a lighter way to unwind.", image: IMG.beverage1 },
  { slug: "accessories", name: "Accessories", description: "Grinders, papers, and gear for your sesh.", image: IMG.accessory1 },
];

const BRAND_DESCRIPTIONS = {
  "BC Smalls": "Small-batch indoor flower, hand-trimmed and cured slow for full flavour.",
  "Good Supply": "Dense, terpene-rich indoor flower and concentrates, cured for maximum quality.",
  "Happy Hour": "Heavy-hitting classics — potent flower, vapes, and concentrates for evening use.",
  "Thumbs Up": "Easy, approachable variety packs and treats for every kind of session.",
  Spinach: "Playful, potent pre-rolls, vapes, and concentrates with bold flavour profiles.",
  "Good Times Supplied by 1964": "Legacy-market-style blunts and pre-rolls with old-school character.",
  "General Admission": "Festival-ready liquid diamond vapes and concentrates built for maximum potency.",
  "SOURZ by Spinach": "Tart, candy-inspired gummies precisely dosed for a consistent experience.",
  Wildflower: "Non-intoxicating CBD balms and roll-ons for fast, targeted relief.",
  "Island Therapeutics": "Vancouver Island-made wellness balms and lotions for everyday recovery.",
  "Sweet Justice": "Fast-acting THC and CBD beverages for a light, social buzz.",
  "A Bud Above Essentials": "Our in-house line of grinders, papers, and rolling gear.",
};

// [slug, name, category, price, compareAtPrice, description, longDescription,
//  images[], brand, rating, reviewCount, tags[], inStock, isBestSeller, isNew,
//  createdAt, strainType, thcMin, thcMax, thcUnit, cbdMin, cbdMax, cbdUnit, size]
const PRODUCTS = [
  ["crystal-dream-smalls", "Crystal Dream Smalls", "flower", 24.99, null,
    "Sativa-dominant smalls with a sweet, gassy nose.",
    "A sativa-dominant cross bursting with citrus and diesel notes. Smalls are the same bud as full-size flower, just smaller — great value without sacrificing potency.",
    [IMG.flowerBud1, IMG.flowerBud2], "BC Smalls", 4.6, 9, ["flower", "sativa", "bestseller"], true, true, false,
    "2025-10-04", "Sativa", 28, 32, "%", 0, 2, "%", "3.5g"],
  ["dark-moon-smalls", "Dark Moon Smalls", "flower", 24.99, null,
    "Indica-dominant smalls with deep berry and fuel notes.",
    "A dense, dark indica-dominant cross with notes of berry and diesel. Hand-trimmed smalls packed in a resealable pouch for freshness.",
    [IMG.flowerBud3, IMG.flowerBud4], "BC Smalls", 4.5, 7, ["flower", "indica"], true, false, false,
    "2025-11-18", "Indica", 26, 30, "%", 0, 2, "%", "3.5g"],
  ["facade", "Facade", "flower", 39.99, 49.99,
    "A balanced hybrid with dense, frosty nugs.",
    "A well-balanced hybrid grown indoors and cured slow for maximum terpene retention. Dense, trichome-heavy nugs with an earthy pine finish.",
    [IMG.flowerBud5, IMG.flowerBud1], "Good Supply", 4.7, 14, ["flower", "hybrid", "bestseller"], true, true, false,
    "2025-08-22", "Hybrid", 24, 30, "%", 0, 1, "%", "7g"],
  ["yeti-og", "Yeti OG", "flower", 44.99, null,
    "A heavy-hitting indica for evening wind-down.",
    "A potent indica cross with a classic OG fuel-and-pine profile. Packed at peak freshness in a resealable mylar pouch.",
    [IMG.flowerBud2, IMG.flowerBud5], "Happy Hour", 4.8, 11, ["flower", "indica", "new"], true, false, true,
    "2026-05-02", "Indica", 24, 28, "%", 0, 2, "%", "7g"],

  ["sativa-indica-variety-pack", "Sativa - Indica Variety Pack", "pre-rolls", 11.99, null,
    "Two pre-rolls, one sativa and one indica, for either mood.",
    "A grab-and-go pack with one sativa and one indica pre-roll, ground and cone-rolled by machine for a consistent, even burn.",
    [IMG.preRoll1, IMG.preRoll2], "Thumbs Up", 4.4, 10, ["pre-roll", "hybrid", "bestseller"], true, true, false,
    "2025-09-14", "Hybrid", 23, 32, "%", 0, 1, "%", "2 x 1g"],
  ["fully-charged-pink-lemonade-pre-roll", "Fully Charged Pink Lemonade Infused Pre-Roll", "pre-rolls", 11.99, null,
    "A single infused pre-roll dipped for extra potency.",
    "Flower infused with live resin and rolled with a kief coating for a stronger, longer-lasting effect. Sweet lemonade terpene profile.",
    [IMG.preRoll3, IMG.preRoll4], "Spinach", 4.6, 8, ["pre-roll", "sativa", "infused"], true, false, false,
    "2026-01-09", "Sativa", 35, 40, "%", 0, 8, "%", "1 x 0.7g"],
  ["legacy-blunt-3-pack", "Legacy Blunt 3-Pack", "pre-rolls", 18.99, 23.99,
    "Classic tobacco-leaf-wrapped blunts, three to a pack.",
    "A throwback to the classic legacy market look and feel — three hand-finished blunts wrapped and ready to go.",
    [IMG.preRoll2, IMG.preRoll1], "Good Times Supplied by 1964", 4.5, 6, ["pre-roll", "hybrid", "new"], true, false, true,
    "2026-06-01", "Hybrid", 20, 25, "%", 0, 1, "%", "3 x 1g"],
  ["morning-glory-joint-5-pack", "Morning Glory Joint 5-Pack", "pre-rolls", 22.99, null,
    "Five bright, citrus-forward sativa joints.",
    "A five-pack of straight-cone joints rolled with bright, citrus-forward sativa smalls — a reliable daytime option.",
    [IMG.preRoll4, IMG.preRoll3], "BC Smalls", 4.3, 5, ["pre-roll", "sativa"], true, false, false,
    "2025-07-30", "Sativa", 22, 26, "%", 0, 2, "%", "5 x 0.5g"],

  ["pink-lemonade-liquid-diamond-vape", "Pink Lemonade Liquid Diamond Disposable Vape", "vaporizers", 44.99, null,
    "A liquid-diamond disposable with a tart lemonade profile.",
    "THCA diamonds suspended in live resin sauce for maximum potency and flavour, in an all-in-one rechargeable disposable.",
    [IMG.vapePen1, IMG.vapePen2], "General Admission", 4.7, 16, ["vape", "sativa", "bestseller"], true, true, false,
    "2025-09-28", "Sativa", 92, 96, "%", 0, 2, "%", "1g"],
  ["blue-dream-liquid-diamond-vape", "Blue Dream Liquid Diamond Disposable Vape", "vaporizers", 44.99, 54.99,
    "A liquid-diamond disposable with a sweet berry profile.",
    "The classic Blue Dream terpene profile in a liquid-diamond disposable format — smooth draw, no charging required.",
    [IMG.vapePen3, IMG.vapePen4], "General Admission", 4.6, 9, ["vape", "sativa"], true, false, false,
    "2025-12-05", "Sativa", 90, 94, "%", 0, 2, "%", "1g"],
  ["mango-kush-510-cartridge", "Mango Kush 510 Cartridge", "vaporizers", 32.99, null,
    "A refillable-battery-compatible 510-thread cartridge.",
    "Distillate cartridge with added terpenes for a tropical mango-kush flavour. Compatible with any standard 510-thread battery.",
    [IMG.vapePen2, IMG.vapePen1], "Happy Hour", 4.5, 6, ["vape", "hybrid", "new"], true, false, true,
    "2026-04-11", "Hybrid", 85, 89, "%", 0, 1, "%", "0.5g"],
  ["midnight-indica-disposable-vape", "Midnight Indica Disposable Vape", "vaporizers", 42.99, null,
    "A relaxing indica disposable for evening use.",
    "A deep, earthy indica blend in an all-in-one disposable — draw-activated with no buttons to fuss with.",
    [IMG.vapePen4, IMG.vapePen3], "Spinach", 4.6, 7, ["vape", "indica"], true, false, false,
    "2025-10-30", "Indica", 88, 92, "%", 0, 3, "%", "1g"],

  ["fully-blasted-peach-orange-gummies", "Fully Blasted Peach Orange 1:1 THC:CBD Gummies (Multi-pack of 10)", "edibles", 19.99, null,
    "A balanced 1:1 THC:CBD gummy in peach and orange flavours.",
    "Ten precisely dosed gummies split between peach and orange flavours, formulated with an even 1:1 ratio of THC to CBD.",
    [IMG.gummies1, IMG.gummies2], "SOURZ by Spinach", 4.7, 13, ["edible", "hybrid", "bestseller"], true, true, false,
    "2025-08-15", "Hybrid", 100, 100, "mg", 100, 100, "mg", "10packs"],
  ["fully-blasted-pink-lemonade-gummies", "Fully Blasted Pink Lemonade Gummies (Multi-pack of 10)", "edibles", 19.99, 24.99,
    "Ten tart pink lemonade gummies, sativa-leaning.",
    "A tart, sativa-leaning gummy in pink lemonade flavour — ten pieces per pack, precisely dosed for consistency.",
    [IMG.gummies3, IMG.gummies4], "SOURZ by Spinach", 4.6, 10, ["edible", "sativa"], true, false, false,
    "2025-11-01", "Sativa", 100, 100, "mg", 0, 10, "mg", "10packs"],
  ["fully-blasted-blue-raspberry-watermelon-gummies", "Fully Blasted Blue Raspberry Watermelon Indica Gummies (Multi-pack of 10)", "edibles", 19.99, null,
    "Ten indica gummies in blue raspberry watermelon flavour.",
    "A relaxing indica gummy blending blue raspberry and watermelon flavours — ten pieces per pack.",
    [IMG.gummies2, IMG.gummies1], "SOURZ by Spinach", 4.5, 8, ["edible", "indica"], true, false, false,
    "2026-02-14", "Indica", 100, 100, "mg", 0, 10, "mg", "10packs"],
  ["dark-chocolate-espresso-bites", "Dark Chocolate Espresso Bites", "edibles", 16.99, null,
    "Nine dark chocolate bites infused with real espresso.",
    "Rich dark chocolate infused with real espresso for a mild energizing lift alongside the effects — nine pieces per pack.",
    [IMG.gummies4, IMG.gummies3], "Thumbs Up", 4.4, 4, ["edible", "hybrid", "new"], true, false, true,
    "2026-06-20", "Hybrid", 90, 90, "mg", 0, 0, "mg", "9pieces"],

  ["blue-dream-live-resin", "Blue Dream Live Resin", "concentrates", 54.99, null,
    "Flash-frozen live resin with bright, fruity terpenes.",
    "Extracted from flash-frozen Blue Dream flower to preserve the full terpene profile — bright, fruity, and potent.",
    [IMG.concentrate1, IMG.concentrate2], "Happy Hour", 4.8, 9, ["concentrate", "sativa", "bestseller"], true, true, false,
    "2025-09-05", "Sativa", 78, 82, "%", 0, 1, "%", "1g"],
  ["kush-mints-shatter", "Kush Mints Shatter", "concentrates", 49.99, 59.99,
    "Glass-like shatter with a minty, gassy finish.",
    "Solvent-extracted and purged to a glass-like consistency, with the classic minty-gas profile of Kush Mints.",
    [IMG.concentrate3, IMG.concentrate4], "Good Supply", 4.6, 5, ["concentrate", "hybrid"], true, false, false,
    "2025-12-22", "Hybrid", 72, 76, "%", 0, 1, "%", "1g"],
  ["ice-cream-cake-rosin", "Ice Cream Cake Rosin", "concentrates", 59.99, null,
    "Solventless rosin pressed from premium indica flower.",
    "Cold-pressed with no solvents, preserving a rich, creamy terpene profile straight from premium Ice Cream Cake flower.",
    [IMG.concentrate2, IMG.concentrate1], "General Admission", 4.9, 6, ["concentrate", "indica", "new"], true, false, true,
    "2026-05-18", "Indica", 68, 74, "%", 0, 2, "%", "1g"],
  ["diamonds-and-sauce", "Diamonds & Sauce", "concentrates", 57.99, null,
    "THCA diamonds suspended in a terpene-rich sauce.",
    "A high-potency concentrate combining THCA diamonds with a terpene-rich sauce for both power and flavour.",
    [IMG.concentrate4, IMG.concentrate3], "Spinach", 4.7, 4, ["concentrate", "hybrid"], true, false, false,
    "2026-01-27", "Hybrid", 80, 85, "%", 0, 1, "%", "1g"],

  ["cbd-extra-strength-relief-stick", "CBD Extra Strength Relief Stick", "topicals", 34.99, null,
    "A non-intoxicating solid balm stick for targeted relief.",
    "A twist-up solid balm stick with extra-strength CBD, formulated for targeted relief without any intoxicating effects.",
    [IMG.topical1, IMG.topical2], "Wildflower", 4.7, 11, ["topical", "bestseller"], true, true, false,
    "2025-09-10", "Blend", 0, 0, "mg", 900, 1000, "mg", "60g"],
  ["cooling-relief-roll-on", "Cooling Relief Roll-On", "topicals", 28.99, 34.99,
    "A fast-absorbing roll-on with a cooling menthol finish.",
    "A fast-absorbing CBD roll-on with menthol for a cooling sensation, ideal for sore muscles and joints.",
    [IMG.topical3, IMG.topical4], "Wildflower", 4.5, 6, ["topical"], true, false, false,
    "2025-11-27", "Blend", 0, 0, "mg", 500, 500, "mg", "50mL"],
  ["warming-muscle-balm", "Warming Muscle Balm", "topicals", 16.99, null,
    "A warming THC/CBD balm for post-activity recovery.",
    "A warming balm blending THC and CBD for deep, targeted relief after a long day or workout.",
    [IMG.topical2, IMG.topical1], "Island Therapeutics", 4.4, 5, ["topical", "new"], true, false, true,
    "2026-03-08", "Blend", 50, 50, "mg", 200, 200, "mg", "125g"],
  ["calming-body-lotion", "Calming Body Lotion", "topicals", 24.99, null,
    "A lightweight, fast-absorbing daily body lotion with CBD.",
    "A lightweight daily lotion infused with CBD for everyday skin care with a calming effect.",
    [IMG.topical4, IMG.topical3], "Island Therapeutics", 4.6, 7, ["topical"], true, false, false,
    "2025-08-02", "Blend", 0, 0, "mg", 300, 300, "mg", "100mL"],

  ["pacific-island-punch", "Pacific Island Punch", "beverages", 9.99, null,
    "A tropical-punch flavoured THC:CBD beverage.",
    "A refreshing, tropical-punch flavoured beverage with a balanced dose of THC and CBD — fast-acting and low-calorie.",
    [IMG.beverage1, IMG.beverage2], "Sweet Justice", 4.5, 10, ["beverage", "bestseller"], true, true, false,
    "2025-10-12", "Blend", 10, 10, "mg", 5, 5, "mg", "1 x 355mL"],
  ["elderflower-fizz", "Elderflower Fizz", "beverages", 9.99, 12.99,
    "A light, floral sparkling THC beverage.",
    "A crisp, floral elderflower soda infused with THC for a light, social drinking experience.",
    [IMG.beverage3, IMG.beverage4], "Sweet Justice", 4.4, 6, ["beverage"], true, false, false,
    "2025-12-30", "Blend", 10, 10, "mg", 0, 0, "mg", "1 x 355mL"],
  ["cherry-lime-cooler", "Cherry Lime Cooler", "beverages", 8.99, null,
    "A bright, citrusy sativa-infused cooler.",
    "A bright cherry-lime cooler with a light sativa dose, formulated for a quick onset and clean finish.",
    [IMG.beverage2, IMG.beverage1], "Sweet Justice", 4.3, 3, ["beverage", "sativa", "new"], true, false, true,
    "2026-06-15", "Sativa", 5, 5, "mg", 5, 5, "mg", "1 x 355mL"],
  ["ginger-chai-relaxer", "Ginger Chai Relaxer", "beverages", 9.99, null,
    "A warm, spiced indica beverage for winding down.",
    "A warm, spiced ginger chai beverage with an indica-leaning dose, formulated to help you unwind in the evening.",
    [IMG.beverage4, IMG.beverage3], "Sweet Justice", 4.6, 5, ["beverage", "indica"], true, false, false,
    "2025-11-09", "Indica", 10, 10, "mg", 10, 10, "mg", "1 x 355mL"],

  ["4-piece-aluminum-grinder", "4-Piece Aluminum Grinder", "accessories", 24.99, null,
    "A durable 4-piece grinder with a kief-catching screen.",
    "Anodized aluminum construction with sharp diamond-shaped teeth, a pollen screen, and a kief catcher.",
    [IMG.accessory1, IMG.accessory2], "A Bud Above Essentials", 4.7, 12, ["accessory", "bestseller"], true, true, false,
    "2025-09-19", "Blend", 0, 0, "%", 0, 0, "%", "1 unit"],
  ["organic-hemp-rolling-papers", "Organic Hemp Rolling Papers (Pack of 3)", "accessories", 6.99, 8.99,
    "Thin, slow-burning organic hemp rolling papers.",
    "Unbleached, chlorine-free organic hemp papers that burn slow and even — three booklets per pack.",
    [IMG.accessory3, IMG.accessory4], "A Bud Above Essentials", 4.5, 8, ["accessory"], true, false, false,
    "2025-10-22", "Blend", 0, 0, "%", 0, 0, "%", "3 packs"],
  ["glass-rolling-tray", "Glass Rolling Tray", "accessories", 18.99, null,
    "A tempered-glass tray for clean, easy rolling.",
    "A tempered-glass rolling tray with raised edges to keep everything contained — easy to wipe clean.",
    [IMG.accessory2, IMG.accessory3], "A Bud Above Essentials", 4.6, 5, ["accessory", "new"], true, false, true,
    "2026-04-27", "Blend", 0, 0, "%", 0, 0, "%", "1 unit"],
  ["rolling-machine-kit", "Rolling Machine Kit", "accessories", 14.99, null,
    "A handheld rolling machine with papers and tips included.",
    "A simple handheld rolling machine that produces a consistent, evenly packed roll every time — comes with papers and tips.",
    [IMG.accessory4, IMG.accessory1], "A Bud Above Essentials", 4.3, 4, ["accessory"], true, false, false,
    "2025-12-14", "Blend", 0, 0, "%", 0, 0, "%", "1 kit"],
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Check .env.local.`);
  return value;
}

async function main() {
  const pool = new Pool({ connectionString: requireEnv("DATABASE_URL") });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Categories
    const categoryIdBySlug = new Map();
    for (const cat of CATEGORIES) {
      const { rows } = await client.query(
        `INSERT INTO categories (name, slug, description, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.image]
      );
      categoryIdBySlug.set(cat.slug, rows[0].id);
    }
    console.log(`Seeded ${categoryIdBySlug.size} categories.`);

    // 2. Brands (derived from products, first product's first image as the sample logo)
    const brandNames = [...new Set(PRODUCTS.map((p) => p[8]))];
    const brandIdByName = new Map();
    for (const name of brandNames) {
      const firstProduct = PRODUCTS.find((p) => p[8] === name);
      const logoUrl = firstProduct[7][0];
      const { rows } = await client.query(
        `INSERT INTO brands (name, slug, description, logo_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, logo_url = EXCLUDED.logo_url
         RETURNING id`,
        [name, slugify(name), BRAND_DESCRIPTIONS[name] ?? null, logoUrl]
      );
      brandIdByName.set(name, rows[0].id);
    }
    console.log(`Seeded ${brandIdByName.size} brands.`);

    // 3. Products + images
    for (const p of PRODUCTS) {
      const [
        slug, name, category, price, compareAtPrice, description, longDescription,
        images, brand, rating, reviewCount, tags, inStock, isBestSeller, isNew,
        createdAt, strainType, thcMin, thcMax, thcUnit, cbdMin, cbdMax, cbdUnit, size,
      ] = p;

      const { rows } = await client.query(
        `INSERT INTO products
           (category_id, brand_id, name, slug, description, long_description, price, compare_at_price,
            stock_quantity, is_active, rating, review_count, strain_type, thc_min, thc_max, thc_unit,
            cbd_min, cbd_max, cbd_unit, size, is_best_seller, is_new, tags, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
         ON CONFLICT (slug) DO UPDATE SET
           category_id = EXCLUDED.category_id, brand_id = EXCLUDED.brand_id, name = EXCLUDED.name,
           description = EXCLUDED.description, long_description = EXCLUDED.long_description,
           price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
           stock_quantity = EXCLUDED.stock_quantity, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count,
           strain_type = EXCLUDED.strain_type, thc_min = EXCLUDED.thc_min, thc_max = EXCLUDED.thc_max,
           thc_unit = EXCLUDED.thc_unit, cbd_min = EXCLUDED.cbd_min, cbd_max = EXCLUDED.cbd_max,
           cbd_unit = EXCLUDED.cbd_unit, size = EXCLUDED.size, is_best_seller = EXCLUDED.is_best_seller,
           is_new = EXCLUDED.is_new, tags = EXCLUDED.tags
         RETURNING id`,
        [
          categoryIdBySlug.get(category), brandIdByName.get(brand), name, slug, description, longDescription,
          price, compareAtPrice, inStock ? 50 : 0, rating, reviewCount, strainType, thcMin, thcMax, thcUnit,
          cbdMin, cbdMax, cbdUnit, size, isBestSeller, isNew, tags, createdAt,
        ]
      );
      const productId = rows[0].id;

      await client.query("DELETE FROM product_images WHERE product_id = $1", [productId]);
      for (const [index, imageUrl] of images.entries()) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
           VALUES ($1, $2, $3, $4)`,
          [productId, imageUrl, index, index === 0]
        );
      }
    }
    console.log(`Seeded ${PRODUCTS.length} products.`);

    await client.query("COMMIT");
    console.log("Done.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

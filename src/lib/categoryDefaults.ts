// ─────────────────────────────────────────────────────────────────────────────
// Pre-built fallback product information for each category.
// Used when a product has no specifications / inTheBox / careInstructions added.
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryDefault {
    specifications: Record<string, string>;
    inTheBox: string[];
    careInstructions: string[];
    highlights: string[];
}

const categoryDefaults: Record<string, CategoryDefault> = {

    // ── 1. Jute Rug ────────────────────────────────────────────────────────────
    'jute-rug': {
        specifications: {
            Material: 'Natural Jute Fiber',
            Weave: 'Hand-woven flat weave',
            Thickness: '5–8 mm',
            Base: 'Non-slip latex backing',
            Suitable_For: 'Living room, bedroom, outdoor patio',
            Origin: 'Handmade in Bangladesh',
        },
        inTheBox: ['1 × Jute Rug', 'Care & usage guide card'],
        careInstructions: [
            'Shake or vacuum regularly to remove dust',
            'Spot clean with a damp cloth and mild soap',
            'Avoid prolonged exposure to direct sunlight',
            'Do not machine wash or tumble dry',
            'Lay flat to dry if wet',
        ],
        highlights: [
            '100% natural jute — eco-friendly & biodegradable',
            'Adds earthy texture to any room',
            'Durable and long-lasting with proper care',
        ],
    },

    // ── 2. Ladies' Bags and Purses ─────────────────────────────────────────────
    'ladies-bags-purses': {
        specifications: {
            Material: 'Jute / Fabric blend',
            Closure: 'Magnetic snap / Zipper (varies by product)',
            Inner_Lining: 'Cotton lining with inner pocket',
            Strap: 'Adjustable shoulder strap',
            Dimensions: 'Approx. 30 × 10 × 25 cm (W×D×H)',
            Handmade: 'Yes — locally crafted in Bangladesh',
        },
        inTheBox: ['1 × Ladies Bag / Purse', 'Dust bag for storage'],
        careInstructions: [
            'Wipe gently with a dry or slightly damp cloth',
            'Avoid overloading to maintain shape',
            'Store in the included dust bag when not in use',
            'Keep away from sharp objects and rough surfaces',
            'Do not wash with water or detergent',
        ],
        highlights: [
            'Handcrafted by Bangladeshi artisans',
            'Spacious interior with organized pockets',
            'Sustainable jute/fabric materials',
        ],
    },

    // ── 3. Planter Baskets ─────────────────────────────────────────────────────
    'planter-baskets': {
        specifications: {
            Material: 'Natural jute rope / woven grass',
            Type: 'Plant pot cover / cachepot',
            Sizes: 'Available in S / M / L',
            Waterproof: 'No — use with inner plastic pot',
            Suitable_For: 'Indoor plants, succulents, home decor',
            Origin: 'Handmade in Bangladesh',
        },
        inTheBox: ['1 × Planter Basket', 'Care instructions leaflet'],
        careInstructions: [
            'Always use a plastic or glazed inner pot to hold water',
            'Wipe the basket exterior with a dry cloth only',
            'Keep away from standing water to prevent mold',
            'Store in a dry, ventilated area when not in use',
        ],
        highlights: [
            'Natural, organic look for any living space',
            'Lightweight and easy to move',
            'Perfect gift for plant lovers',
        ],
    },

    // ── 4. Laundry Baskets ─────────────────────────────────────────────────────
    'laundry-baskets': {
        specifications: {
            Material: 'Woven jute / cotton rope',
            Capacity: 'Approx. 40–60 litres (varies by size)',
            Handles: '2 strong rope handles',
            Base: 'Reinforced flat base',
            Suitable_For: 'Laundry, storage, bedroom organization',
            Origin: 'Handmade in Bangladesh',
        },
        inTheBox: ['1 × Laundry Basket'],
        careInstructions: [
            'Wipe the exterior with a dry or slightly damp cloth',
            'Do not expose to water or damp clothes for extended periods',
            'Air out in sunlight occasionally to prevent musty odor',
            'Do not machine wash',
        ],
        highlights: [
            'Eco-friendly alternative to plastic laundry baskets',
            'Strong handles for easy carrying',
            'Fits neatly in bedroom or bathroom corners',
        ],
    },

    // ── 5. Shotoronji (Traditional Floor Mat) ─────────────────────────────────
    'shotoronji': {
        specifications: {
            Material: 'Cotton thread with reed/bamboo base',
            Weave: 'Traditional Bangladeshi Shotoronji weave',
            Pattern: 'Geometric / striped (varies per design)',
            Thickness: '6–10 mm',
            Suitable_For: 'Living room, prayer room, guest seating area',
            Origin: 'Handwoven in Bangladesh — centuries-old craft',
        },
        inTheBox: ['1 × Shotoronji Mat', 'Heritage craft story card'],
        careInstructions: [
            'Shake out or vacuum gently to remove dust',
            'Spot clean with a damp cloth — do not soak',
            'Dry in shade, away from direct sunlight to preserve color',
            'Roll up for storage — do not fold',
        ],
        highlights: [
            'Centuries-old traditional Bangladeshi art form',
            'Each piece is uniquely handwoven',
            'Adds cultural heritage to your home décor',
        ],
    },

    // ── 6. Dining Placemats ────────────────────────────────────────────────────
    'dining-placemats': {
        specifications: {
            Material: 'Natural jute / cotton blend',
            Dimensions: 'Approx. 30 × 45 cm (standard placemat size)',
            Heat_Resistance: 'Moderate — suitable for regular dinnerware',
            Sold_As: 'Set of 4 or 6 (check product listing)',
            Suitable_For: 'Dining table, kitchen, café décor',
            Origin: 'Handmade in Bangladesh',
        },
        inTheBox: ['Set of Dining Placemats (as per listing)'],
        careInstructions: [
            'Spot clean with a damp cloth and mild soap',
            'Lay flat to dry — do not wring',
            'Do not machine wash',
            'Iron on low heat if needed',
            'Avoid placing extremely hot cookware directly on the mat',
        ],
        highlights: [
            'Natural texture that elevates any table setting',
            'Protects your dining table from heat and spills',
            'Available in various woven patterns',
        ],
    },

    // ── 7. Wall Art ────────────────────────────────────────────────────────────
    'wall-art': {
        specifications: {
            Medium: 'Handcrafted jute / fabric / mixed media',
            Frame: 'Wooden frame (unless noted as unframed)',
            Hanging: 'Includes metal D-ring hook on back',
            Suitable_For: 'Living room, bedroom, office wall décor',
            Style: 'Handmade artisan — each piece is unique',
            Origin: 'Crafted by Bangladeshi artisans',
        },
        inTheBox: ['1 × Wall Art piece', 'Hanging kit (hook + nail)', 'Care card'],
        careInstructions: [
            'Dust gently with a dry soft cloth or feather duster',
            'Keep away from direct sunlight to prevent fading',
            'Avoid humid areas like bathrooms',
            'Do not wipe with wet cloth',
        ],
        highlights: [
            'One-of-a-kind handmade artisan artwork',
            'Adds warmth and culture to any wall',
            'Supports local Bangladeshi artisans',
        ],
    },

    // ── 8. Three-Piece Sets ────────────────────────────────────────────────────
    'three-piece-sets': {
        specifications: {
            Includes: 'Kameez (top), Salwar (trouser), Dupatta (scarf)',
            Fabric: 'Cotton / Voile / Lawn (varies by sub-type)',
            Craft: 'Batik / Block Print / Jomjom / Party Wear (as listed)',
            Fit: 'Regular / semi-tailored — check size chart',
            Occasion: 'Casual wear, Eid, festivals, parties',
            Origin: 'Handcrafted in Bangladesh',
        },
        inTheBox: ['1 × Kameez', '1 × Salwar', '1 × Dupatta'],
        careInstructions: [
            'Hand wash in cold water with mild detergent',
            'Do not bleach — colors may fade',
            'Iron on medium heat while slightly damp',
            'Dry in shade to preserve print/color',
            'Dry clean recommended for heavily embellished pieces',
        ],
        highlights: [
            'Ready-to-wear traditional Bangladeshi fashion',
            'Authentic batik/block print/jomjom craftsmanship',
            'Perfect for Eid, weddings, and casual occasions',
        ],
    },

    // ── 9. Bed Sheets ──────────────────────────────────────────────────────────
    'bed-sheets': {
        specifications: {
            Material: 'Pure cotton (200–400 thread count)',
            Set_Includes: '1 flat sheet + 2 pillow covers (or as listed)',
            Sizes: 'Single / Double / King — check listing',
            Weave: 'Plain weave / hand-embroidered (as listed)',
            Shrinkage: 'Pre-washed — minimal shrinkage',
            Origin: 'Made in Bangladesh',
        },
        inTheBox: ['1 × Bed Sheet', 'Pillow Covers (as per listing)', 'Folded in tissue packaging'],
        careInstructions: [
            'Machine wash in cold water on gentle cycle',
            'Use mild detergent — no bleach',
            'Tumble dry on low heat or line dry',
            'Iron on medium heat for a crisp finish',
            'Wash separately for the first time to prevent color bleed',
        ],
        highlights: [
            'Soft, breathable pure cotton fabric',
            'Available in hand-embroidered designs for a premium look',
            'Gets softer with every wash',
        ],
    },

    // ── 10. Nakshi Kantha ──────────────────────────────────────────────────────
    'nakshi-kantha': {
        specifications: {
            Material: 'Layered cotton cloth with silk/cotton thread embroidery',
            Technique: 'Traditional hand-stitched Nakshi Kantha embroidery',
            Pattern: 'Floral / geometric / narrative motifs (varies)',
            Dimensions: 'Approx. 150 × 200 cm (single) or as listed',
            Suitable_For: 'Quilt, throw blanket, wall hanging, decorative spread',
            Origin: 'Handstitched in rural Bangladesh — ancient tradition',
        },
        inTheBox: ['1 × Nakshi Kantha piece', 'Certificate of authenticity card'],
        careInstructions: [
            'Gentle hand wash in cold water only',
            'Use mild soap — no harsh detergents',
            'Do not wring — gently squeeze out water',
            'Dry flat in shade to prevent warping',
            'Iron on low heat on the reverse side to protect embroidery',
        ],
        highlights: [
            '300+ year old traditional embroidery art of Bangladesh',
            'Every stitch is done by hand — no two pieces are identical',
            'A treasured heirloom-quality piece',
            'Supports rural women artisans across Bangladesh',
        ],
    },

};

export default categoryDefaults;
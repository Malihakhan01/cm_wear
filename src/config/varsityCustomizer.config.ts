export interface VarsityPartsState {
  [key: string]: string;
  body: string;
  sleeves: string;
  pockets: string;
  collar: string;
  cuffs: string;
  waistband: string;
  buttons: string;
  patch: string;
}

export interface CustomLettersState {
  enabled: boolean;
  text: string; // Max 3 letters, uppercase only
  fontId: string;
  color: string; // Hex code of chosen shade
  borderColor: string; // Felt backing color
  craftStyle: "chenille" | "puff" | "twill" | "chainstitch";
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  placement?: "left-chest" | "right-chest" | "center-chest";
  view?: "front" | "back";
}

export interface CustomLogoState {
  enabled: boolean;
  url: string | null;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  scale: number; // 0.35 - 2.5
  rotation: number; // -180 to 180
  flippedH?: boolean;
  view?: "front" | "back";
}

export interface SampleLogoOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const SAMPLE_LOGOS: SampleLogoOption[] = [
  {
    id: "logo-cm",
    name: "CM Sports Wear Emblem",
    url: "/cm_logo/Red and White Wear Emblem.png",
    category: "Brand",
  },
  {
    id: "logo-tiger",
    name: "Varsity Tiger Crest",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23CA8A04' stroke='%230B0B0B' stroke-width='4'/%3E%3Cpath d='M30 35 L40 20 L50 30 L60 20 L70 35 L65 65 L50 82 L35 65 Z' fill='%230B0B0B'/%3E%3Cpath d='M42 45 L50 38 L58 45 L50 55 Z' fill='%23FFFFFF'/%3E%3Cpath d='M46 58 L54 58 L50 66 Z' fill='%23DC2626'/%3E%3Ccircle cx='40' cy='42' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='60' cy='42' r='3' fill='%23FFFFFF'/%3E%3C/svg%3E",
    category: "Mascot",
  },
  {
    id: "logo-star",
    name: "Streetwear Compass Star",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpolygon points='50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38' fill='%23DC2626' stroke='%23FFFFFF' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='12' fill='%230B0B0B' stroke='%23FFFFFF' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23FFFFFF'/%3E%3C/svg%3E",
    category: "Iconic",
  },
  {
    id: "logo-shield",
    name: "Heritage Atelier Shield",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L85 25 L85 60 C85 78 50 92 50 92 C50 92 15 78 15 60 L15 25 Z' fill='%23111B2C' stroke='%23CA8A04' stroke-width='4'/%3E%3Cpath d='M50 20 L75 32 L75 58 C75 72 50 82 50 82 C50 82 25 72 25 58 L25 32 Z' fill='%231E3A8A'/%3E%3Ctext x='50' y='58' font-family='Arial Black, sans-serif' font-size='22' font-weight='900' fill='%23FFFFFF' text-anchor='middle'%3ETI%3C/text%3E%3C/svg%3E",
    category: "Crest",
  },
];

export interface VarsityFont {
  id: string;
  name: string;
  family: string;
  category: string;
  preview: string;
  description: string;
}

export interface ColorShade {
  id: string;
  name: string;
  hex: string;
  tone: "light" | "vibrant" | "deep" | "dark";
  pantone?: string;
}

export interface ColorShadeFamily {
  familyName: string;
  familyCode: string;
  shades: ColorShade[];
}

export interface ButtonFinish {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export interface LiningOption {
  id: string;
  name: string;
  composition: string;
  season: string;
  imagePattern?: string;
  colorPreview: string;
}

export const VARSITY_FONTS: VarsityFont[] = [
  {
    id: "varsity-slab",
    name: "Varsity Athletic Slab",
    family: "'Alfa Slab One', Impact, sans-serif",
    category: "Collegiate Classic",
    preview: "TI",
    description: "Classic Ivy League letterman slab with bold geometry",
  },
  {
    id: "varsity-block",
    name: "Stadium Block Condensed",
    family: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
    category: "Athletic Block",
    preview: "TI",
    description: "Tall stadium display cut for high impact visibility",
  },
  {
    id: "varsity-serif",
    name: "Heritage Roman Serif",
    family: "'Cinzel', 'Playfair Display', Georgia, serif",
    category: "Royal Roman",
    preview: "TI",
    description: "Architectural chiseled serif with historic pedigree",
  },
  {
    id: "varsity-editorial",
    name: "Couture Editorial Serif",
    family: "'Playfair Display', Georgia, serif",
    category: "High Fashion",
    preview: "TI",
    description: "High-contrast editorial serif for luxury streetwear",
  },
  {
    id: "varsity-gothic",
    name: "Old English Street Gothic",
    family: "'UnifrakturMaguntia', 'Old English Text MT', cursive, serif",
    category: "Archive Gothic",
    preview: "TI",
    description: "90s archive blackletter calligraphy statement",
  },
  {
    id: "varsity-modern",
    name: "Bauhaus Cyber Sans",
    family: "'Unbounded', var(--font-geist-sans), sans-serif",
    category: "Modernist",
    preview: "TI",
    description: "Contemporary wide monospace aesthetic",
  },
];

export const LETTER_SHADE_FAMILIES: ColorShadeFamily[] = [
  {
    familyName: "Collegiate Gold & Amber",
    familyCode: "gold",
    shades: [
      { id: "gold-chalk", name: "Chalk Butter", hex: "#FEF08A", tone: "light", pantone: "Pantone 101 C" },
      { id: "gold-vibrant", name: "Athletic Varsity Gold", hex: "#FBBF24", tone: "vibrant", pantone: "Pantone 123 C" },
      { id: "gold-mustard", name: "Vintage Mustard", hex: "#CA8A04", tone: "deep", pantone: "Pantone 117 C" },
      { id: "gold-bronze", name: "Burnished Bronze", hex: "#854D0E", tone: "dark", pantone: "Pantone 7552 C" },
    ],
  },
  {
    familyName: "Crimson & Scarlet Shades",
    familyCode: "red",
    shades: [
      { id: "red-chalk", name: "Blush Coral", hex: "#FCA5A5", tone: "light", pantone: "Pantone 1765 C" },
      { id: "red-vibrant", name: "Harvard Racing Red", hex: "#DC2626", tone: "vibrant", pantone: "Pantone 186 C" },
      { id: "red-deep", name: "Vintage Burgundy", hex: "#991B1B", tone: "deep", pantone: "Pantone 7428 C" },
      { id: "red-wine", name: "Oxblood Merlot", hex: "#4A1521", tone: "dark", pantone: "Pantone 7421 C" },
    ],
  },
  {
    familyName: "Collegiate Royal & Navy",
    familyCode: "blue",
    shades: [
      { id: "blue-chalk", name: "Dusty Sky Blue", hex: "#7DA6C6", tone: "light", pantone: "Pantone 543 C" },
      { id: "blue-vibrant", name: "Cobalt Royal Blue", hex: "#1C4ED8", tone: "vibrant", pantone: "Pantone 2144 C" },
      { id: "blue-deep", name: "Deep Collegiate Indigo", hex: "#1E3A8A", tone: "deep", pantone: "Pantone 281 C" },
      { id: "blue-navy", name: "Archive Midnight Navy", hex: "#111B2C", tone: "dark", pantone: "Pantone 533 C" },
    ],
  },
  {
    familyName: "Ivy Forest & Olive",
    familyCode: "green",
    shades: [
      { id: "green-chalk", name: "Chalk Mint Sage", hex: "#86EFAC", tone: "light", pantone: "Pantone 579 C" },
      { id: "green-vibrant", name: "Hunter Varsity Green", hex: "#15803D", tone: "vibrant", pantone: "Pantone 348 C" },
      { id: "green-olive", name: "Military Olive Drab", hex: "#4E533B", tone: "deep", pantone: "Pantone 7771 C" },
      { id: "green-dark", name: "Deep Ivy Pine", hex: "#1E3326", tone: "dark", pantone: "Pantone 5535 C" },
    ],
  },
  {
    familyName: "Monochrome & Chalk",
    familyCode: "mono",
    shades: [
      { id: "mono-white", name: "Optic Snow White", hex: "#FFFFFF", tone: "light", pantone: "Bright White" },
      { id: "mono-ecru", name: "Raw Ecru / Bone", hex: "#F3EFE6", tone: "light", pantone: "Pantone 11-0601" },
      { id: "mono-grey", name: "Athletic Heather Grey", hex: "#9CA3AF", tone: "vibrant", pantone: "Cool Gray 7 C" },
      { id: "mono-charcoal", name: "Charcoal Graphite", hex: "#374151", tone: "deep", pantone: "Cool Gray 11 C" },
      { id: "mono-black", name: "Stealth Jet Black", hex: "#0B0B0B", tone: "dark", pantone: "Black 6 C" },
    ],
  },
  {
    familyName: "Earth & Vintage Leather",
    familyCode: "earth",
    shades: [
      { id: "earth-sand", name: "Dune Sand", hex: "#C7B89F", tone: "light", pantone: "Pantone 7529 C" },
      { id: "earth-camel", name: "Warm Saddle Camel", hex: "#A67B4F", tone: "vibrant", pantone: "Pantone 7562 C" },
      { id: "earth-rust", name: "Terracotta Rust", hex: "#C2410C", tone: "deep", pantone: "Pantone 7580 C" },
      { id: "earth-brown", name: "Espresso Dark Roast", hex: "#3D2E24", tone: "dark", pantone: "Pantone 412 C" },
    ],
  },
  {
    familyName: "Vibrant Fashion Accents",
    familyCode: "accent",
    shades: [
      { id: "accent-rose", name: "Dusty Rose Blush", hex: "#E8C5BE", tone: "light", pantone: "Pantone 7513 C" },
      { id: "accent-orange", name: "Safety Neon Orange", hex: "#EA580C", tone: "vibrant", pantone: "Pantone 021 C" },
      { id: "accent-purple", name: "Archive Lavender", hex: "#A799B7", tone: "deep", pantone: "Pantone 5295 C" },
      { id: "accent-lime", name: "Acid Cyber Lime", hex: "#84CC16", tone: "vibrant", pantone: "Pantone 382 C" },
    ],
  },
];

export const FELT_BORDER_SHADES = [
  { id: "felt-white", name: "Optic White Felt", hex: "#FFFFFF" },
  { id: "felt-ecru", name: "Vintage Ecru Felt", hex: "#F3EFE6" },
  { id: "felt-gold", name: "Varsity Gold Felt", hex: "#CA8A04" },
  { id: "felt-black", name: "Stealth Black Felt", hex: "#0B0B0B" },
  { id: "felt-crimson", name: "Crimson Red Felt", hex: "#DC2626" },
  { id: "felt-tonal", name: "Tone-on-Tone Match", hex: "tonal" },
];

export const CRAFT_TECHNIQUES = [
  {
    id: "chenille",
    name: "Chenille Looped Felt",
    badge: "Collegiate Classic",
    description: "Thick plush yarn pile on double layer wool felt backing",
  },
  {
    id: "puff",
    name: "High-Loft Puff",
    badge: "Dimensional",
    description: "Dense satin embroidery stitched over 3mm high-density foam",
  },
  {
    id: "twill",
    name: "Laser Tackle Twill",
    badge: "Pro Athletics",
    description: "Laser-cut athletic twill with zig-zag edge perimeter lock",
  },
  {
    id: "chainstitch",
    name: "Vintage Chainstitch",
    badge: "Artisanal",
    description: "Authentic single-needle looped chainstitch contouring",
  },
];

export const BUTTON_FINISHES: ButtonFinish[] = [
  { id: "silver", name: "Polished Chrome Silver", hex: "#E4E4E7", description: "Mirror-polished nickel chrome" },
  { id: "black", name: "Matte PVD Stealth Black", hex: "#18181B", description: "Ultra-matte anti-scratch PVD coating" },
  { id: "brass", name: "Antique Burnished Brass", hex: "#B45309", description: "Hand-patinated vintage brass" },
  { id: "gold", name: "Varsity 18K Gold", hex: "#EAB308", description: "Rich athletic championship gold electroplate" },
  { id: "white", name: "Enamel Optic White", hex: "#FFFFFF", description: "Baked enamel gloss coat" },
];

export const LINING_OPTIONS: LiningOption[] = [
  {
    id: "satin-black",
    name: "Diamond Quilted Black Satin",
    composition: "100% Cupro Satin / 120 GSM Polyfill",
    season: "Heavyweight Winter",
    colorPreview: "#171717",
  },
  {
    id: "tartan-plaid",
    name: "Heritage Crimson Tartan Plaid",
    composition: "100% Cotton Flannel / Brushed Weave",
    season: "All-Season Mid-Weight",
    colorPreview: "#7F1D1D",
  },
  {
    id: "silk-gold",
    name: "Champagne Gold Silk-Twill",
    composition: "Silk-Touch Bemberg Twill",
    season: "Lightweight Luxury",
    colorPreview: "#D97706",
  },
  {
    id: "sherpa-ecru",
    name: "High-Loft Sherpa Fleece",
    composition: "Thermal Sherpa Fleece / Heavy Hand",
    season: "Sub-Zero Thermal",
    colorPreview: "#EAE3D2",
  },
];

export const QUICK_MONOGRAM_PRESETS = ["TI", "NYC", "LA", "99", "USA", "A", "V", "B"];

export interface HeritageColorPreset<T = Record<string, string>> {
  name: string;
  tag: string;
  accent: string;
  colors: T;
}

export const COLOR_PRESETS: HeritageColorPreset<VarsityPartsState>[] = [
  {
    name: "Harvard Crimson",
    tag: "Crimson Body • Cream Sleeves • Noir Ribs • Welt Pocket",
    accent: "#DC2626",
    colors: {
      body: "#8B0000",
      sleeves: "#F5EBE1",
      pockets: "#8B0000",
      collar: "#1C1C1E",
      cuffs: "#1C1C1E",
      waistband: "#1C1C1E",
      buttons: "#FFFFFF",
      patch: "#8B0000",
    },
  },
  {
    name: "Stealth Noir",
    tag: "Noir Body • Charcoal Sleeves • Dark Ribs • Red Welt",
    accent: "#0B0B0B",
    colors: {
      body: "#0B0B0B",
      sleeves: "#2B2B2D",
      pockets: "#D10115",
      collar: "#141414",
      cuffs: "#141414",
      waistband: "#141414",
      buttons: "#1E1E1E",
      patch: "#7E7E7E",
    },
  },
  {
    name: "Ivy League",
    tag: "Pine Body • Vintage Oat Sleeves • Forest Ribs • Gold Welt",
    accent: "#1E3326",
    colors: {
      body: "#1B3B2B",
      sleeves: "#EAE3D2",
      pockets: "#D97706",
      collar: "#12241A",
      cuffs: "#12241A",
      waistband: "#12241A",
      buttons: "#FBBF24",
      patch: "#CA8A04",
    },
  },
  {
    name: "Collegiate Navy",
    tag: "Midnight Body • Pure White Sleeves • Royal Ribs • Ivory Welt",
    accent: "#111B2C",
    colors: {
      body: "#111B2C",
      sleeves: "#FFFFFF",
      pockets: "#F3EFE6",
      collar: "#1E3A8A",
      cuffs: "#1E3A8A",
      waistband: "#1E3A8A",
      buttons: "#E4E4E7",
      patch: "#1C4ED8",
    },
  },
  {
    name: "Vintage Burgundy",
    tag: "Wine Body • Bone Leather Sleeves • Dark Wine Ribs • Ecru Welt",
    accent: "#7F1D1D",
    colors: {
      body: "#5A121A",
      sleeves: "#EDE6D6",
      pockets: "#EDE6D6",
      collar: "#380C11",
      cuffs: "#380C11",
      waistband: "#380C11",
      buttons: "#FFFFFF",
      patch: "#5A121A",
    },
  },
  {
    name: "Golden State",
    tag: "Ochre Body • Dark Espresso Sleeves • Charcoal Ribs • Cream Welt",
    accent: "#C27803",
    colors: {
      body: "#C27803",
      sleeves: "#1E1B18",
      pockets: "#F5EBE1",
      collar: "#111111",
      cuffs: "#111111",
      waistband: "#111111",
      buttons: "#FBBF24",
      patch: "#C27803",
    },
  },
];

export const HOODIE_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Stealth Tri-Tone",
    tag: "Jet Body • Red Pocket • Charcoal Cap • Slate Sleeves",
    accent: "#1C1C1E",
    colors: {
      body: "#1C1C1E",
      pocket: "#D10115",
      hood: "#2C2C2E",
      sleeves: "#3A3A3C",
      cuffs: "#2C2C2E",
      waistband: "#2C2C2E",
    },
  },
  {
    name: "Chalk & Onyx",
    tag: "Chalk Body • Onyx Pocket • Jet Cap • Ecru Sleeves",
    accent: "#F4F3ED",
    colors: {
      body: "#F4F3ED",
      pocket: "#111111",
      hood: "#0B0B0B",
      sleeves: "#E2E0D6",
      cuffs: "#111111",
      waistband: "#111111",
    },
  },
  {
    name: "Forest & Ochre",
    tag: "Forest Body • Ochre Pocket • Pine Cap • Sage Sleeves",
    accent: "#1E3326",
    colors: {
      body: "#1E3326",
      pocket: "#D97706",
      hood: "#14241B",
      sleeves: "#2E4738",
      cuffs: "#14241B",
      waistband: "#14241B",
    },
  },
  {
    name: "Midnight Blue & Gold",
    tag: "Navy Body • Gold Pocket • Slate Cap • Royal Sleeves",
    accent: "#111B2C",
    colors: {
      body: "#111B2C",
      pocket: "#F59E0B",
      hood: "#1E293B",
      sleeves: "#1E3A8A",
      cuffs: "#111B2C",
      waistband: "#111B2C",
    },
  },
  {
    name: "Burgundy & Bone",
    tag: "Port Body • Bone Pocket • Maroon Cap • Crimson Sleeves",
    accent: "#60121D",
    colors: {
      body: "#60121D",
      pocket: "#F5EFE6",
      hood: "#400C13",
      sleeves: "#8C2433",
      cuffs: "#400C13",
      waistband: "#400C13",
    },
  },
  {
    name: "Monochrome Slate",
    tag: "Slate Body • Abyss Pocket • Stone Cap • Steel Sleeves",
    accent: "#334155",
    colors: {
      body: "#334155",
      pocket: "#0F172A",
      hood: "#475569",
      sleeves: "#64748B",
      cuffs: "#0F172A",
      waistband: "#0F172A",
    },
  },
];

export const EQUESTRIAN_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Tournament Royal Navy",
    tag: "Midnight Body • Optic Sleeves • Crimson Ribs • White Breeches",
    accent: "#111B2C",
    colors: {
      body: "#111B2C",
      sleeves: "#FFFFFF",
      ribs: "#D61C24",
      leggings: "#FFFFFF",
    },
  },
  {
    name: "Stealth Grand Prix",
    tag: "Onyx Body • Slate Sleeves • Crimson Ribs • Stealth Breeches",
    accent: "#0A0A0A",
    colors: {
      body: "#0A0A0A",
      sleeves: "#20201E",
      ribs: "#D61C24",
      leggings: "#0A0A0A",
    },
  },
  {
    name: "Hunter Derby & Camel",
    tag: "Pine Body • Dune Sleeves • Gold Ribs • Sand Breeches",
    accent: "#1B3B2B",
    colors: {
      body: "#1B3B2B",
      sleeves: "#EAE3D2",
      ribs: "#CA8A04",
      leggings: "#C7B89F",
    },
  },
  {
    name: "Monaco Bordeaux",
    tag: "Wine Body • Bone Sleeves • Deep Crimson Ribs • Jet Breeches",
    accent: "#5A121A",
    colors: {
      body: "#5A121A",
      sleeves: "#EDE6D6",
      ribs: "#A31017",
      leggings: "#111111",
    },
  },
  {
    name: "Arctic Blue & Bone",
    tag: "Bone Body • Royal Sleeves • Midnight Ribs • Navy Breeches",
    accent: "#1C4ED8",
    colors: {
      body: "#F4F4EF",
      sleeves: "#1C4ED8",
      ribs: "#111B2C",
      leggings: "#111B2C",
    },
  },
];

export const BASKETBALL_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Showtime Gold & Royal",
    tag: "Athletic Gold Jersey • Midnight Ribs • Gold Shorts",
    accent: "#CA8A04",
    colors: {
      jersey: "#CA8A04",
      body: "#CA8A04",
      ribs: "#111B2C",
      shorts: "#CA8A04",
    },
  },
  {
    name: "Championship Crimson & Onyx",
    tag: "Racing Crimson Jersey • Stealth Ribs • Stealth Shorts",
    accent: "#D61C24",
    colors: {
      jersey: "#D61C24",
      body: "#D61C24",
      ribs: "#0A0A0A",
      shorts: "#0A0A0A",
    },
  },
  {
    name: "Stealth Blackout Pro",
    tag: "Onyx Jersey • Charcoal Ribs • Onyx Shorts",
    accent: "#0A0A0A",
    colors: {
      jersey: "#0A0A0A",
      body: "#0A0A0A",
      ribs: "#20201E",
      shorts: "#0A0A0A",
    },
  },
  {
    name: "Celtic Pine & White",
    tag: "Forest Pine Jersey • Optic White Ribs • Forest Shorts",
    accent: "#1E3A2F",
    colors: {
      jersey: "#1E3A2F",
      body: "#1E3A2F",
      ribs: "#FFFFFF",
      shorts: "#1E3A2F",
    },
  },
  {
    name: "Optic White Home Court",
    tag: "Optic White Jersey • Crimson Ribs • White Shorts",
    accent: "#FFFFFF",
    colors: {
      jersey: "#FFFFFF",
      body: "#FFFFFF",
      ribs: "#D61C24",
      shorts: "#FFFFFF",
    },
  },
  {
    name: "Championship Royal Blue",
    tag: "Royal Blue Jersey • Gold Ribs • Royal Shorts",
    accent: "#1C4ED8",
    colors: {
      jersey: "#1C4ED8",
      body: "#1C4ED8",
      ribs: "#CA8A04",
      shorts: "#1C4ED8",
    },
  },
];

export const BASEBALL_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Classic Pinstripe White & Navy",
    tag: "White Jersey • White Sleeves • Navy Piping • White Pants • Navy Belt",
    accent: "#1E3A8A",
    colors: {
      jersey: "#FFFFFF",
      sleeves: "#FFFFFF",
      trim: "#1E3A8A",
      pants: "#FFFFFF",
      belt: "#1E3A8A",
    },
  },
  {
    name: "Vintage Cream & Maroon",
    tag: "Cream Jersey • Cream Sleeves • Maroon Piping • Cream Pants • Maroon Belt",
    accent: "#7F1D1D",
    colors: {
      jersey: "#F5F5DC",
      sleeves: "#F5F5DC",
      trim: "#7F1D1D",
      pants: "#F5F5DC",
      belt: "#7F1D1D",
    },
  },
  {
    name: "Midnight Pro & Crimson",
    tag: "Black Jersey • Black Sleeves • Red Piping • Black Pants • Red Belt",
    accent: "#D61C24",
    colors: {
      jersey: "#0B0B0B",
      sleeves: "#0B0B0B",
      trim: "#D61C24",
      pants: "#0B0B0B",
      belt: "#D61C24",
    },
  },
  {
    name: "Royal Blue & Athletic Gold",
    tag: "Royal Jersey • Royal Sleeves • Gold Piping • White Pants • Royal Belt",
    accent: "#1D4ED8",
    colors: {
      jersey: "#1D4ED8",
      sleeves: "#1D4ED8",
      trim: "#F59E0B",
      pants: "#FFFFFF",
      belt: "#1D4ED8",
    },
  },
  {
    name: "Forest Green & Gold",
    tag: "Forest Jersey • Forest Sleeves • Gold Piping • White Pants • Forest Belt",
    accent: "#14532D",
    colors: {
      jersey: "#14532D",
      sleeves: "#14532D",
      trim: "#EAB308",
      pants: "#FFFFFF",
      belt: "#14532D",
    },
  },
  {
    name: "Stealth Charcoal & Red",
    tag: "Charcoal Jersey • Dark Sleeves • Crimson Piping • Gray Pants • Dark Belt",
    accent: "#DC2626",
    colors: {
      jersey: "#374151",
      sleeves: "#1F2937",
      trim: "#DC2626",
      pants: "#E5E7EB",
      belt: "#1F2937",
    },
  },
];

export const ICE_HOCKEY_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Chicago Red & Obsidian",
    tag: "Red Jersey • Black Sleeves • Black Pants • Red Socks",
    accent: "#DC2626",
    colors: {
      jersey: "#DC2626",
      sleeves: "#0A0A0A",
      pants: "#0A0A0A",
      socks: "#DC2626",
    },
  },
  {
    name: "Toronto Maple Royal",
    tag: "Royal Jersey • White Sleeves • Royal Pants • Royal Socks",
    accent: "#1D4ED8",
    colors: {
      jersey: "#1D4ED8",
      sleeves: "#FFFFFF",
      pants: "#1D4ED8",
      socks: "#1D4ED8",
    },
  },
  {
    name: "Boston Gold & Black",
    tag: "Athletic Gold Jersey • Black Sleeves • Black Pants • Gold Socks",
    accent: "#EAB308",
    colors: {
      jersey: "#EAB308",
      sleeves: "#0A0A0A",
      pants: "#0A0A0A",
      socks: "#EAB308",
    },
  },
  {
    name: "Edmonton Navy & Tangerine",
    tag: "Deep Navy Jersey • Orange Sleeves • Navy Pants • Navy Socks",
    accent: "#EA580C",
    colors: {
      jersey: "#0F172A",
      sleeves: "#EA580C",
      pants: "#0F172A",
      socks: "#0F172A",
    },
  },
  {
    name: "Stealth Matte Blackout",
    tag: "Matte Black Jersey • Charcoal Sleeves • Black Pants • Black Socks",
    accent: "#27272A",
    colors: {
      jersey: "#121212",
      sleeves: "#27272A",
      pants: "#121212",
      socks: "#121212",
    },
  },
];

export const MARTIAL_ARTS_COLOR_PRESETS: HeritageColorPreset[] = [
  {
    name: "Traditional White & Black Belt",
    tag: "White Kimono • White Sleeves • Black Belt • White Pants",
    accent: "#0A0A0A",
    colors: {
      jacket: "#F8FAFC",
      sleeves: "#F8FAFC",
      belt: "#0A0A0A",
      pants: "#F8FAFC",
    },
  },
  {
    name: "Competition Royal & Black Belt",
    tag: "Royal Blue Gi • Royal Sleeves • Black Belt • Royal Pants",
    accent: "#1E3A8A",
    colors: {
      jacket: "#1E3A8A",
      sleeves: "#1E3A8A",
      belt: "#0A0A0A",
      pants: "#1E3A8A",
    },
  },
  {
    name: "Stealth Blackout & Red Belt",
    tag: "Triple Black Gi • Black Sleeves • Master Red Belt • Black Pants",
    accent: "#DC2626",
    colors: {
      jacket: "#0B0B0B",
      sleeves: "#0B0B0B",
      belt: "#DC2626",
      pants: "#0B0B0B",
    },
  },
  {
    name: "Judo Unbleached & Brown Belt",
    tag: "Natural Ecru Canvas • Ecru Sleeves • Brown Belt • Ecru Pants",
    accent: "#78350F",
    colors: {
      jacket: "#EAE3D2",
      sleeves: "#EAE3D2",
      belt: "#78350F",
      pants: "#EAE3D2",
    },
  },
  {
    name: "Cadet Navy & Purple Belt",
    tag: "Navy Gi • Navy Sleeves • Purple Rank Belt • Navy Pants",
    accent: "#7C3AED",
    colors: {
      jacket: "#1E293B",
      sleeves: "#1E293B",
      belt: "#7C3AED",
      pants: "#1E293B",
    },
  },
];




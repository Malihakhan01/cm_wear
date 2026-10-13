import { Category } from "@/types";

export const CATEGORIES_DATA: Category[] = [
  {
    id: "casual-wear",
    slug: "casual-wear",
    name: "Casual Wear",
    number: "01",
    shortDescription: "Heavyweight streetwear blanks, French terry hoodies, oversized tees, and tailored tracksuits.",
    description: "Engineered for international streetwear brands and boutique apparel labels. Produced with custom knit 240–500 GSM loopback French terry, comb-spun organic cotton, and specialized garment wash treatments.",
    heroImage: "/categories/Casual wear (1).png",
    subcategories: [
      { id: "t-shirts", slug: "t-shirts", name: "T-Shirts" },
      { id: "hoodies-sweatshirts", slug: "hoodies-sweatshirts", name: "Hoodies & Sweatshirts" },
      { id: "sweatpants", slug: "sweatpants", name: "Sweatpants" },
      { id: "cargo-pants", slug: "cargo-pants", name: "Cargo Pants" },
      { id: "shorts", slug: "shorts", name: "Shorts" },
      { id: "jackets", slug: "jackets", name: "Jackets" },
      { id: "tracksuits", slug: "tracksuits", name: "Tracksuits" },
      { id: "custom-private-label", slug: "custom-private-label", name: "Custom / Private Label Casual Wear" },
    ],
    technicalHighlights: [
      "240–500 GSM Combed Loopback French Terry",
      "Pigment Dye, Mineral Wash & Vintage Fade Finishes",
      "Twin-Needle Coverstitching & Herringbone Neck Taping",
      "Pre-Shrunk Organic Cotton with Minimal Torquing (<2%)",
    ],
    capabilities: [
      "Custom Sizing Tech Packs",
      "High-Density Screen Printing",
      "3D Silicone & Puff Embellishments",
      "Custom Woven Neck Labels & Recycled Polybags",
    ],
    faqs: [
      {
        question: "What is your minimum order quantity for custom streetwear blanks?",
        answer: "Our standard wholesale MOQ starts at 50 pieces per style/colorway, allowing blended size breakdowns (XS to XXL)."
      },
      {
        question: "Can you develop custom oversized silhouettes from our tech pack?",
        answer: "Yes. Our pattern engineers cut custom master patterns, run sample fittings, and grade sizes according to your exact spec sheets."
      }
    ]
  },
  {
    id: "equestrian-clothing",
    slug: "equestrian-clothing",
    name: "Equestrian Clothing",
    number: "02",
    shortDescription: "Luxury competition show jackets, technical silicone grip breeches, and aerodynamic sun-shirts.",
    description: "Precision-tailored equestrian apparel blending European luxury aesthetics with high-performance 4-way stretch microfibers. Engineered to withstand high-friction saddle wear while maintaining pristine tournament elegance.",
    heroImage: "/categories/Equestrian wear.png",
    subcategories: [
      { id: "riding-jackets", slug: "riding-jackets", name: "Riding Jackets" },
      { id: "riding-breeches", slug: "riding-breeches", name: "Riding Breeches" },
      { id: "riding-trousers", slug: "riding-trousers", name: "Riding Trousers" },
      { id: "polo-shirts", slug: "polo-shirts", name: "Polo Shirts" },
      { id: "competition-shirts", slug: "competition-shirts", name: "Competition Shirts" },
      { id: "riding-tops", slug: "riding-tops", name: "Riding Tops" },
      { id: "riding-vests", slug: "riding-vests", name: "Riding Vests" },
      { id: "base-layers", slug: "base-layers", name: "Base Layers" },
      { id: "training-wear", slug: "training-wear", name: "Training Wear" },
      { id: "competition-wear", slug: "competition-wear", name: "Competition Wear" },
      { id: "equestrian-team-wear", slug: "equestrian-team-wear", name: "Equestrian Team Wear" },
      { id: "custom-equestrian", slug: "custom-equestrian", name: "Custom Equestrian Apparel" },
    ],
    technicalHighlights: [
      "Italian 4-Way Technical Bonded Softshell (320 GSM)",
      "High-Density Silicone Hex-Grip Full & Knee Seats",
      "UPF 50+ UV Sun Protection Micro-Polyester",
      "Laser-Cut Breathable Underarm Ventilation Mesh",
    ],
    capabilities: [
      "Embossed Crest Embroidery",
      "Custom Branded Metal Press Snaps & Enamel Buttons",
      "Ergonomic Compression Seaming",
      "Water & Dirt-Repellent Nano DWR Finishes",
    ],
    faqs: [
      {
        question: "Do your riding breeches feature silicone full-seat grip?",
        answer: "Yes, we apply German polymer silicone in customized geometric patterns, dots, or custom brand logos that retain grip through 100+ wash cycles."
      }
    ]
  },
  {
    id: "ice-hockey",
    slug: "ice-hockey",
    name: "Ice Hockey",
    number: "03",
    shortDescription: "Sublimated pro-cut game jerseys, reinforced shell pants, and durable off-ice warmup kits.",
    description: "Tour-grade ice hockey uniforms constructed from puncture-resistant 220–280 GSM heavyweight polyester birds-eye mesh and durable dazzle shoulder panels. Triple-stitched fight straps and authentic tackle-twill numbering.",
    heroImage: "/categories/Teamsport Wear.png",
    subcategories: [
      { id: "ice-hockey-jerseys", slug: "ice-hockey-jerseys", name: "Ice Hockey Jerseys" },
      { id: "hockey-pants", slug: "hockey-pants", name: "Hockey Pants" },
      { id: "hockey-shorts", slug: "hockey-shorts", name: "Hockey Shorts" },
      { id: "hockey-jackets", slug: "hockey-jackets", name: "Hockey Jackets" },
      { id: "hockey-training-wear", slug: "hockey-training-wear", name: "Hockey Training Wear" },
      { id: "custom-hockey-team-kits", slug: "custom-hockey-team-kits", name: "Custom Hockey Team Kits" },
    ],
    technicalHighlights: [
      "250 GSM Puncture-Resistant K1 Birds-Eye Mesh",
      "Reinforced Double-Layer Elbow & Shoulder Panels",
      "Sublimated Multi-Panel Precision Color Fastness",
      "Commercial Fight Straps with Heavy-Duty Webbing",
    ],
    capabilities: [
      "Multi-Layer Laser-Cut Tackle Twill Embroidery",
      "Player Names, Numbers & Captain 'C/A' Patches",
      "Pantone-Matched Tournament Kits",
      "Goalie Cut, Forward Cut & Youth Patterns",
    ],
    faqs: [
      {
        question: "Can you supply authentic tackle-twill embroidery on hockey jerseys?",
        answer: "Yes, we stitch laser-cut multi-layer tackle twill crests with zigzag edge locking exactly like professional tournament uniforms."
      }
    ]
  },
  {
    id: "cycling",
    slug: "cycling",
    name: "Cycling",
    number: "04",
    shortDescription: "Aerodynamic race jerseys, Italian-padded bib shorts, and ultra-packable wind vests.",
    description: "Pro-peloton cycling kits engineered with aerodynamic dimpled sleeve mesh, moisture-wicking warp-knit Italian lycra, and multi-density ergonomic chamois padding for 7+ hour endurance rides.",
    heroImage: "/categories/Cyclist Conquering the Mountain Pass.png",
    subcategories: [
      { id: "cycling-jerseys", slug: "cycling-jerseys", name: "Cycling Jerseys" },
      { id: "cycling-bib-shorts", slug: "cycling-bib-shorts", name: "Cycling Bib Shorts" },
      { id: "cycling-shorts", slug: "cycling-shorts", name: "Cycling Shorts" },
      { id: "cycling-jackets", slug: "cycling-jackets", name: "Cycling Jackets" },
      { id: "cycling-vests", slug: "cycling-vests", name: "Cycling Vests" },
      { id: "cycling-base-layers", slug: "cycling-base-layers", name: "Cycling Base Layers" },
      { id: "cycling-team-kits", slug: "cycling-team-kits", name: "Cycling Team Kits" },
      { id: "custom-cycling-apparel", slug: "custom-cycling-apparel", name: "Custom Cycling Apparel" },
    ],
    technicalHighlights: [
      "Aero-Dimpled High-Velocity Sleeve Fabric",
      "Italian High-Density Ergonomic Gel Chamois (120kg/m³)",
      "YKK Vislon Full-Length Camlock Zippers",
      "Seamless Laser-Cut Silicone Microdot Leg Grippers",
    ],
    capabilities: [
      "Full Digital Italian Sublimation Ink (No Fading)",
      "3 Reinforced Rear Cargo Pockets + Zipped Security Pocket",
      "360° Reflective Luminescent Trims for Night Riding",
      "Custom Club & Corporate Fleet Branding",
    ],
    faqs: [
      {
        question: "What chamois pads do you insert into your bib shorts?",
        answer: "We offer anatomically sculpted 3D multi-density foam and gel chamois rated for 4-hour, 6-hour, and 8+ hour ultra-endurance rides."
      }
    ]
  },
  {
    id: "rugby",
    slug: "rugby",
    name: "Rugby",
    number: "05",
    shortDescription: "Tear-proof match jerseys, reinforced bar-tacked shorts, and all-weather training smocks.",
    description: "Heavy-duty rugby apparel engineered to endure scrum pressures and high-impact tackles. Manufactured using 280–320 GSM 4-way stretch polyester elastane with reinforced flatlock seams and bar-tacked stress anchors.",
    heroImage: "/categories/Confident Soccer Portrait with Ball.png",
    subcategories: [
      { id: "rugby-jerseys", slug: "rugby-jerseys", name: "Rugby Jerseys" },
      { id: "rugby-shorts", slug: "rugby-shorts", name: "Rugby Shorts" },
      { id: "rugby-training-wear", slug: "rugby-training-wear", name: "Rugby Training Wear" },
      { id: "rugby-jackets", slug: "rugby-jackets", name: "Rugby Jackets" },
      { id: "rugby-team-kits", slug: "rugby-team-kits", name: "Rugby Team Kits" },
      { id: "custom-rugby-apparel", slug: "custom-rugby-apparel", name: "Custom Rugby Apparel" },
    ],
    technicalHighlights: [
      "300 GSM Heavyweight Interlock Rip-Resistant Polyester",
      "Anti-Grab Ergonomic Mandarin & V-Neck Collar Construction",
      "Twin-Needle Flatlock Seaming with Heavy Nylon Filament",
      "High-Tension Silicone Grip Bands on Chest for Ball Handling",
    ],
    capabilities: [
      "Sublimated Club Crests & Dual Sponsor Layouts",
      "Lycra Gusset Insertions in Match Shorts",
      "Numbering & Team Roster Bundling",
      "Weatherproof Lined Smocks for Training Camps",
    ],
    faqs: [
      {
        question: "Can your rugby jerseys survive intense scrum contact?",
        answer: "Yes, our fabric is tensile tested with over 600N tear resistance, reinforced with 6-thread flatlock stitching and bar-tacked joins."
      }
    ]
  },
  {
    id: "basketball",
    slug: "basketball",
    name: "Basketball",
    number: "06",
    shortDescription: "Air-mesh reversible jerseys, court shorts with deep pockets, and warmup shooting shirts.",
    description: "Pro-style basketball game sets and court streetwear. Featuring ultra-breathable moisture-wicking micro-mesh, ribbed collar/armhole knit trims, and reinforced split-side hems for maximum agility.",
    heroImage: "/categories/Skyward Saintfour Basketball Portrait.png",
    subcategories: [
      { id: "basketball-jerseys", slug: "basketball-jerseys", name: "Basketball Jerseys" },
      { id: "basketball-shorts", slug: "basketball-shorts", name: "Basketball Shorts" },
      { id: "basketball-sets", slug: "basketball-sets", name: "Basketball Sets" },
      { id: "basketball-training-wear", slug: "basketball-training-wear", name: "Basketball Training Wear" },
      { id: "basketball-team-kits", slug: "basketball-team-kits", name: "Basketball Team Kits" },
      { id: "custom-basketball-apparel", slug: "custom-basketball-apparel", name: "Custom Basketball Apparel" },
    ],
    technicalHighlights: [
      "180–220 GSM Diamond Mesh & Micro-Eyelet Polyester",
      "Engineered Striped Rib Knit Arm & Collar Bindings",
      "Double-Layer Reversible Mesh Construction Option",
      "Moisture-Wicking Fast-Dry Aeration System",
    ],
    capabilities: [
      "Full Sublimation or Tackle Twill Appliqué",
      "Team Names, Roster Numbers & Front/Back Placement",
      "Custom Inseam Lengths (5\", 7\", 8.5\" Court Pro)",
      "Shooting Shirts & Snap-Button Tearaway Pants",
    ],
    faqs: [
      {
        question: "Do you supply customized reversible basketball uniforms?",
        answer: "Yes, we produce lightweight double-mesh reversible jerseys that keep players cool while offering home/away color schemes in a single garment."
      }
    ]
  },
  {
    id: "ski-wear",
    slug: "ski-wear",
    name: "Ski Wear",
    number: "07",
    shortDescription: "3-layer 20,000mm waterproof alpine jackets, insulated bib pants, and merino thermal base layers.",
    description: "Extreme alpine ski and snowboarding outerwear designed for sub-zero mountain environments. Engineered with 3-layer waterproof membranes, fully taped seams, water-resistant YKK Aquaguard zips, and synthetic thermal micro-insulation.",
    heroImage: "/categories/Outdoor.png",
    subcategories: [
      { id: "ski-jackets", slug: "ski-jackets", name: "Ski Jackets" },
      { id: "ski-pants", slug: "ski-pants", name: "Ski Pants" },
      { id: "ski-suits", slug: "ski-suits", name: "Ski Suits" },
      { id: "ski-bibs", slug: "ski-bibs", name: "Ski Bibs" },
      { id: "base-layers", slug: "base-layers", name: "Base Layers" },
      { id: "thermal-wear", slug: "thermal-wear", name: "Thermal Wear" },
      { id: "waterproof-ski-wear", slug: "waterproof-ski-wear", name: "Waterproof Ski Wear" },
      { id: "windproof-ski-wear", slug: "windproof-ski-wear", name: "Windproof Ski Wear" },
      { id: "custom-ski-apparel", slug: "custom-ski-apparel", name: "Custom Ski Apparel" },
    ],
    technicalHighlights: [
      "20,000mm Waterproof / 15,000g/m² Breathability Membrane",
      "100% Fully Heat-Sealed Waterproof Taped Seams",
      "PrimaLoft® Gold / 120 GSM Synthetic Micro-Fiber Fill",
      "YKK Aquaguard Matte Waterproof Zippers & Pit Zips",
    ],
    capabilities: [
      "Detachable Stretch Powder Skirts & Lycra Wrist Gaiters",
      "RECCO® Reflector Integration Options",
      "Reinforced Cordura Scuff Guards on Pant Hem",
      "Helmet-Compatible 3-Way Adjustable Storm Hoods",
    ],
    faqs: [
      {
        question: "Are your ski jackets fully seam-sealed for waterproof certification?",
        answer: "Yes, all outer shell garments undergo 3-bar hydrostatic pressure testing with heat-bonded sealing tape across every stitch line."
      }
    ]
  },
  {
    id: "go-karting-racing",
    slug: "go-karting-racing",
    name: "Go-Karting & Racing",
    number: "08",
    shortDescription: "Abrasion-resistant Cordura racing suits, pit-crew jackets, and ergonomic mechanics pants.",
    description: "Professional go-karting and automotive motorsport suits built from high-tensile 500D Cordura® and breathable poly-cotton linings. Designed with fully floating 360° shoulder gussets, lumbar stretch panels, and flame-retardant finishes.",
    heroImage: "/categories/Charles Leclerc Monza 2025.jpg",
    subcategories: [
      { id: "racing-suits", slug: "racing-suits", name: "Go-Karting Racing Suits" },
      { id: "racing-jackets", slug: "racing-jackets", name: "Racing Jackets" },
      { id: "racing-pants", slug: "racing-pants", name: "Racing Pants" },
      { id: "racing-team-apparel", slug: "racing-team-apparel", name: "Racing Team Apparel" },
      { id: "custom-racing-apparel", slug: "custom-racing-apparel", name: "Custom Racing Apparel" },
    ],
    technicalHighlights: [
      "Heavy-Duty 500D Abrasion-Resistant Cordura® Exterior",
      "360° Floating Shoulder Gussets with Elasticated Action Stretch",
      "Concealed Double-Slider Heavy YKK Racing Zipper",
      "Soft Toweling Moisture-Absorbent Interior Lining",
    ],
    capabilities: [
      "Sublimated Team Color Schemes & Sponsor Badges",
      "Direct High-Density Embroidery on Belt & Collar",
      "Custom CIK-FIA Level 2 Standard Pattern Specifications",
      "Full Team Ensembles: Suits, Paddock Vests & Mechanics Overalls",
    ],
    faqs: [
      {
        question: "Can you manufacture CIK-FIA style karting suits with multiple sponsor logos?",
        answer: "Yes, we produce custom-tailored 2-layer and 3-layer karting suits with precision embroidery and sublimated team sponsor panels."
      }
    ]
  },
  {
    id: "bavarian-wear",
    slug: "bavarian-wear",
    name: "Bavarian Wear",
    number: "09",
    shortDescription: "Traditional European Trachten bodices, Alpine-inspired embroidered garments, and folk festival apparel.",
    description: "Authentic Alpine and Bavarian Trachten apparel crafted with structured multi-panel silhouettes, ornamental floral embroidery, traditional metal clasps, and heritage trims. Engineered for festival collections, folk celebrations, cultural eventwear, and boutique fashion labels.",
    heroImage: "https://lightspeedsindustry.com/wp-content/uploads/2026/10/3a5a1e98-96ed-4ff2-8209-97088637b97e-1.jpg",
    subcategories: [
      { id: "trachten-bodice", slug: "trachten-bodice", name: "Trachten Bodice" },
      { id: "trachten-t-shirts", slug: "trachten-t-shirts", name: "Trachten T-shirts" },
    ],
    technicalHighlights: [
      "Structured Multi-Panel Fitted Silhouette with Flared Hem",
      "Fine Botanical & Floral Embroidery with Bar-Tack Reinforcement",
      "Antique Brass & Gold Decorative Clasps & Metal Loop Hardware",
      "Smooth Inner Lining & Contrast Piping Accents",
    ],
    capabilities: [
      "Custom Embroidery Artwork & Placement",
      "Traditional Metal Hardware & Button Customization",
      "OEM & Private Label Manufacturing with Custom Labels",
      "Full Pattern Grading across Custom Size Charts",
    ],
    faqs: [
      {
        question: "What is your MOQ for custom Trachten bodices and Bavarian apparel?",
        answer: "Our standard wholesale production starts at 50 pieces per style with mixed size grading."
      },
      {
        question: "Can we provide custom floral embroidery artwork or patterns?",
        answer: "Yes, our embroidery digitizers convert your vector graphics or physical swatches into high-density industrial stitch files."
      }
    ]
  },
  {
    id: "martial-arts",
    slug: "martial-arts",
    name: "Martial Arts",
    number: "10",
    shortDescription: "Championship Brazilian Jiu-Jitsu gis, traditional Karate and Taekwondo uniforms, Judo gis, and combat apparel.",
    description: "Championship-grade martial arts apparel and competition uniforms engineered from heavy pearl-weave cotton, ripstop pants, reinforced collar lapels, and IBJJF-compliant patterns. Designed for combat academies, dojos, fight clubs, and global martial arts brands.",
    heroImage: "/storage/products/aikido-uniform-15647-UFM6AhOV.jpg",
    subcategories: [
      { id: "martial-arts-uniforms", slug: "martial-arts-uniforms", name: "Martial Arts Uniforms" },
      { id: "aikido-uniforms", slug: "aikido-uniforms", name: "Aikido Uniforms" },
      { id: "jiu-jitsu-uniforms", slug: "jiu-jitsu-uniforms", name: "Jiu Jitsu Uniforms" },
      { id: "karate-uniforms", slug: "karate-uniforms", name: "Karate Uniforms" },
      { id: "taekwondo-uniforms", slug: "taekwondo-uniforms", name: "Taekwondo Uniforms" },
      { id: "judo-uniforms", slug: "judo-uniforms", name: "Judo Uniforms" },
      { id: "kung-fu-uniforms", slug: "kung-fu-uniforms", name: "Kung Fu Uniforms" },
      { id: "martial-arts-belts", slug: "martial-arts-belts", name: "Martial Arts Belts" },
      { id: "mma-gloves", slug: "mma-gloves", name: "MMA & Sparring Gloves" },
    ],
    technicalHighlights: [
      "450–550 GSM Preshrunk Pearl Weave Cotton Jacket",
      "Triple-Reinforced Stress Points & Quadruple Lapel Stitching",
      "10 oz Heavyweight Ripstop Pants with Bungee Drawcord",
      "IBJJF & WKF Competition Compliance Ready",
    ],
    capabilities: [
      "Custom Dojo & Academy Woven Patches & Direct Embroidery",
      "Sublimated Interior Rashguard Neck & Shoulder Linings",
      "Pantone Color Matching for Gi Fabrics & Contrast Stitching",
      "Custom Rank Belts & Heavyweight Polybag Packaging",
    ],
    faqs: [
      {
        question: "What is your MOQ for custom martial arts gis and uniforms?",
        answer: "Our standard wholesale production begins at 50 uniforms per design with blended size grading from A0 to A5 (or kids sizes M00 to M4)."
      },
      {
        question: "Are your uniforms compliant with international competition rules?",
        answer: "Yes, we engineer gis strictly to IBJJF, IJF, and WKF tournament regulations including sleeve clearance, lapel thickness, and fabric weave requirements."
      }
    ]
  },
];

import { Category, MainCategoryId } from "@/types";

export const CATEGORIES_DATA: Category[] = [
  {
    id: "team-sports-wear" as MainCategoryId,
    slug: "team-sports-wear",
    name: "Team Sports Wear",
    number: "01",
    shortDescription: "Pro-grade team uniforms, sublimation match jerseys, and technical kit sets for clubs and collegiate leagues.",
    description: "Factory direct team sportswear engineered with quick-dry 4-way micro-poly meshes, anti-bacterial moisture management, reinforced flatlock stitching, and vivid high-definition Italian sublimation printing.",
    heroImage: "/categories/teamsports_wear.png",
    subcategories: [
      { id: "ice-hockey", slug: "ice-hockey", name: "Ice Hockey" },
      { id: "soccer-football", slug: "soccer-football", name: "Soccer & Football" },
      { id: "american-football", slug: "american-football", name: "American Football" },
      { id: "basketball", slug: "basketball", name: "Basketball" },
      { id: "baseball-softball", slug: "baseball-softball", name: "Baseball & Softball" },
      { id: "cricket", slug: "cricket", name: "Cricket" },
      { id: "rugby", slug: "rugby", name: "Rugby" },
      { id: "lacrosse", slug: "lacrosse", name: "Lacrosse" },
      { id: "volleyball", slug: "volleyball", name: "Volleyball" },
      { id: "tennis-golf", slug: "tennis-golf", name: "Tennis & Golf" },
    ],
    technicalHighlights: [
      "180–330 GSM Air-Knit Mesh & Speed Poly Fabrications",
      "Reinforced Multi-Needle Coverstitch & Fight-Strap Attachment",
      "Italian Sublimation Ink (Anti-Bleed & UV 50+ Fade Resistant)",
      "High-Tension Bar-Tacked Stress Zones & Silicone Waistband Grips",
    ],
    capabilities: [
      "Custom Sublimated Team Kits & Roster Numbering",
      "Tackle Twill & Embroidered Crest Embellishments",
      "Low 30–50 Unit Wholesale MoQ for Club Programs",
      "Precision Grading for Men, Women & Youth Sizing",
    ],
    faqs: [
      {
        question: "Can you produce custom team kits with individual player names and numbers?",
        answer: "Yes, our full dye-sublimation process supports complete roster personalization with individual names, numbers, and sponsor badges with zero setup fees for roster changes."
      },
      {
        question: "What is the turnaround time for bulk club teamwear orders?",
        answer: "Standard production lead time is 14–18 business days after sample approval, with expedited 10-day rush options for tournament deadlines."
      }
    ]
  },
  {
    id: "martial-arts-combat-wear" as MainCategoryId,
    slug: "martial-arts-combat-wear",
    name: "Martial Arts & Combat Wear",
    number: "02",
    shortDescription: "Competition-grade BJJ Gis, reinforced MMA fight shorts, compression rash guards, and traditional martial arts doboks.",
    description: "Built for intense combat friction. Crafted using 350–550 GSM pearl weave cotton, triple-reinforced seam construction, antibacterial moisture-wicking compression spandex, and ripstop pant gussets.",
    heroImage: "/categories/martial arts.png",
    subcategories: [
      { id: "bjj-grappling", slug: "bjj-grappling", name: "BJJ & Grappling" },
      { id: "mma", slug: "mma", name: "MMA" },
      { id: "boxing-muay-thai", slug: "boxing-muay-thai", name: "Boxing & Muay Thai" },
      { id: "karate", slug: "karate", name: "Karate" },
      { id: "judo", slug: "judo", name: "Judo" },
      { id: "taekwondo", slug: "taekwondo", name: "Taekwondo" },
      { id: "wrestling", slug: "wrestling", name: "Wrestling" },
    ],
    technicalHighlights: [
      "350–550 GSM Pearl & Gold Weave 100% Combed Cotton",
      "220–260 GSM Polyester/Elastane 4-Way Stretch Compression",
      "Triple Seam Stitching with Heavy Bonded Nylon Threads",
      "Sublimated Interior Yoke Lining & Sublimated Rash Guards",
    ],
    capabilities: [
      "IBJJF & WKF Competition Compliance Spec Tailoring",
      "Custom High-Density Embroidered Direct Patches",
      "Silicone Grip Inner Elastic Waistband & Drawstrings",
      "Low 30 pc Minimum Order Quantity for Academies",
    ],
    faqs: [
      {
        question: "Are your BJJ gis compliant with IBJJF competition standards?",
        answer: "Yes, our pattern cuts and sleeve/pant measurements strictly meet official IBJJF regulations for competition approval."
      }
    ]
  },
  {
    id: "activewear-fitness" as MainCategoryId,
    slug: "activewear-fitness",
    name: "Activewear & Fitness",
    number: "03",
    shortDescription: "Seamless gym apparel, compression wear, athletic leggings, sports bras, and high-performance running tops.",
    description: "Designed for premium boutique gym brands and athleisure labels. Engineered with buttery-soft peached microfibers, squat-proof high-gauge knits, flat-seam construction, and moisture-wicking technology.",
    heroImage: "/categories/activewear.png",
    subcategories: [
      { id: "gym-training-wear", slug: "gym-training-wear", name: "Gym & Training Wear" },
      { id: "compression-wear", slug: "compression-wear", name: "Compression Wear" },
      { id: "womens-activewear", slug: "womens-activewear", name: "Women’s Activewear" },
      { id: "running-athletics", slug: "running-athletics", name: "Running & Athletics" },
      { id: "cycling-wear", slug: "cycling-wear", name: "Cycling Wear" },
    ],
    technicalHighlights: [
      "Squat-Proof 280–320 GSM Nylon/Spandex Interlock",
      "Flatlock Anti-Chafing Seams & Ergonomic Gusset Panels",
      "Peached Butter-Soft Finishes & Antimicrobial Shielding",
      "Laser-Cut Ventilation & Reflective Heat Transfers",
    ],
    capabilities: [
      "Custom Private Label Sizing & Tech Pack Development",
      "Seamless and Cut-and-Sew Activewear Manufacturing",
      "Heat-Transfer Neck Labels & Custom Branded Hardware",
      "Custom Compression Tiers (Mild, Moderate, Firm)",
    ],
    faqs: [
      {
        question: "Do you offer squat-proof leggings fabric testing?",
        answer: "Yes, all our activewear leggings use high-density 280+ GSM interlock knit fabrics tested under high stretch to guarantee 100% opacity."
      }
    ]
  },
  {
    id: "casual-lifestyle-wear" as MainCategoryId,
    slug: "casual-lifestyle-wear",
    name: "Casual & Lifestyle Wear",
    number: "04",
    shortDescription: "Heavyweight streetwear blanks, 450 GSM French terry hoodies, oversized drop-shoulder tees, and tailored tracksuits.",
    description: "Premium blanks manufactured for streetwear labels and luxury lifestyle brands. Featuring heavyweight combed cotton fleece, custom pigment dye washes, minimalist silhouettes, and durable double-needle construction.",
    heroImage: "/categories/casualwear.png",
    subcategories: [
      { id: "t-shirts-polo-shirts", slug: "t-shirts-polo-shirts", name: "T-Shirts & Polo Shirts" },
      { id: "hoodies-sweatshirts", slug: "hoodies-sweatshirts", name: "Hoodies & Sweatshirts" },
      { id: "tracksuits-matching-sets", slug: "tracksuits-matching-sets", name: "Tracksuits & Matching Sets" },
      { id: "pants-shorts", slug: "pants-shorts", name: "Pants & Shorts" },
    ],
    technicalHighlights: [
      "220–300 GSM Heavyweight Organic Cotton Single Jersey",
      "400–500 GSM Heavy Combed Cotton Loopback Fleece",
      "Vintage Garment Pigment Dyes & Mineral Washes",
      "Preshrunk Fabric with Minimal Residual Shrinkage (<2%)",
    ],
    capabilities: [
      "Custom Architectural Drop-Shoulder Patterns",
      "Screen Print, Puff Print & Tajima Embroidery",
      "Woven Damask Neck Labels & Hangtags",
      "Custom Color Lab Dip Pantone Matching",
    ],
    faqs: [
      {
        question: "Can you manufacture custom Pantone colors for hoodies?",
        answer: "Yes, we perform precise lab dip dye matching against Pantone TCX or PMS codes for orders of 50+ pieces per colorway."
      }
    ]
  },
  {
    id: "jackets-outerwear" as MainCategoryId,
    slug: "jackets-outerwear",
    name: "Jackets & Outerwear",
    number: "05",
    shortDescription: "Authentic wool and leather varsity jackets, technical softshells, windbreakers, and weather-shield winter outerwear.",
    description: "Artisanal outerwear engineering combining traditional wool Melton and full-grain genuine leather with modern weatherproofing membranes, taped zippers, and quilted thermal linings.",
    heroImage: "/categories/jacket wear.png",
    subcategories: [
      { id: "varsity-jackets", slug: "varsity-jackets", name: "Varsity Jackets" },
      { id: "leather-jackets", slug: "leather-jackets", name: "Leather Jackets" },
      { id: "softshell-jackets", slug: "softshell-jackets", name: "Softshell Jackets" },
      { id: "windbreakers", slug: "windbreakers", name: "Windbreakers" },
      { id: "winter-wear", slug: "winter-wear", name: "Winter Wear" },
      { id: "rainwear", slug: "rainwear", name: "Rainwear" },
    ],
    technicalHighlights: [
      "24 oz Virgin Melton Wool Body & Cowhide/Nappa Leather Arms",
      "3-Layer Bonded Softshell with 10,000mm Hydrostatic Head",
      "Diamond Quilted Satin & Thinsulate™ Thermal Insulation",
      "Heavy-Duty YKK Brass and Matte Black Snaps & Zippers",
    ],
    capabilities: [
      "Traditional Chenille Varsity Lettering & Felt Crests",
      "Precision Laser-Cut Leather Appliqué Embroidery",
      "Custom Stripe Knit Acrylic Ribbing for Cuffs and Collars",
      "Full Custom Outerwear Pattern Grading",
    ],
    faqs: [
      {
        question: "Can we customize the leather type and ribbing patterns on varsity jackets?",
        answer: "Yes, choose from full-grain cowhide, buttery lambskin, or vegan leather, combined with 100% custom-knit yarn-dyed rib patterns."
      }
    ]
  },
  {
    id: "kids-youth-wear" as MainCategoryId,
    slug: "kids-youth-wear",
    name: "Kids & Youth Wear",
    number: "06",
    shortDescription: "Junior team uniforms, youth activewear, cozy cotton hoodies, and durable training tracksuits.",
    description: "Built for agility, comfort, and active play. Skin-friendly hypoallergenic fabrics, non-toxic eco-certified inks, and reinforced seam construction to withstand rigorous sports and playground use.",
    heroImage: "/categories/kids wear.png",
    subcategories: [
      { id: "youth-team-uniforms", slug: "youth-team-uniforms", name: "Youth Team Uniforms" },
      { id: "kids-activewear", slug: "kids-activewear", name: "Kids’ Activewear" },
      { id: "kids-t-shirts", slug: "kids-t-shirts", name: "Kids’ T-Shirts" },
      { id: "kids-hoodies", slug: "kids-hoodies", name: "Kids’ Hoodies" },
      { id: "kids-tracksuits", slug: "kids-tracksuits", name: "Kids’ Tracksuits" },
    ],
    technicalHighlights: [
      "100% OEKO-TEX Standard 100 Certified Cotton",
      "Double-Reinforced Knees & Elastic Ribbed Waistbands",
      "Child-Safe Non-Toxic Certified Inks & Trims",
      "Smooth Flatlock Stitching to Prevent Skin Irritation",
    ],
    capabilities: [
      "Full Youth Size Scaling (Ages 4 to 16 / XS to XL Youth)",
      "Club & Academy Youth Team Kits with Roster Customization",
      "Safety-Compliant Zipper Pulls & Soft Drawcords",
    ],
    faqs: [
      {
        question: "Are your youth garments certified non-toxic?",
        answer: "All fabrics, dyes, and trims utilized in youth production strictly comply with international child safety standards and OEKO-TEX specifications."
      }
    ]
  },
  {
    id: "workwear-medical-wear" as MainCategoryId,
    slug: "workwear-medical-wear",
    name: "Workwear & Medical Wear",
    number: "07",
    shortDescription: "Antimicrobial medical scrubs, heavy-duty industrial work uniforms, and corporate utility polo shirts.",
    description: "Engineered for high-durability service in hospitals, clinics, factories, and utility logistics. Antimicrobial treated, fluid-repellent, autoclave washable, and reinforced at all stress joints.",
    heroImage: "/categories/work wear.png",
    subcategories: [
      { id: "medical-scrubs", slug: "medical-scrubs", name: "Medical Scrubs" },
      { id: "work-uniforms", slug: "work-uniforms", name: "Work Uniforms" },
      { id: "work-polo-shirts", slug: "work-polo-shirts", name: "Work Polo Shirts" },
    ],
    technicalHighlights: [
      "Polyester/Rayon/Spandex 4-Way Technical Scrub Twills",
      "SILVADUR™ Antimicrobial & Liquid-Repellent Finishes",
      "Industrial Polyester/Cotton 240–300 GSM Heavy Drill Canvas",
      "Reinforced Utility Pockets, Pen Slots & Badge Loops",
    ],
    capabilities: [
      "Institutional Uniform Supply Contracts & Batch Sizing",
      "Corporate High-Density Direct Embroidery & Badges",
      "Custom Pocket Configurations & Contrast Trim Stitching",
    ],
    faqs: [
      {
        question: "Can your medical scrubs endure commercial high-temperature laundering?",
        answer: "Yes, our medical-grade blends are engineered to withstand continuous commercial 60°C laundering with zero color fade or shrinkage."
      }
    ]
  },
  {
    id: "sports-accessories" as MainCategoryId,
    slug: "sports-accessories",
    name: "Sports Accessories",
    number: "08",
    shortDescription: "High-density team socks, reversible mesh training bibs, athletic caps, moisture headbands, and wristbands.",
    description: "Complete game-day accessories designed to complement full teamwear kits. High-stretch nylon/spandex athletic socks with arch compression, breathable training pinnies, and custom embroidered headwear.",
    heroImage: "/categories/Vibrant Multisport Gear Court Flat Lay.png",
    subcategories: [
      { id: "team-socks", slug: "team-socks", name: "Team Socks" },
      { id: "training-bibs", slug: "training-bibs", name: "Training Bibs" },
      { id: "caps", slug: "caps", name: "Caps" },
      { id: "headbands", slug: "headbands", name: "Headbands" },
      { id: "wristbands", slug: "wristbands", name: "Wristbands" },
    ],
    technicalHighlights: [
      "High-Density 168-Needle Jacquard Knit Compression Socks",
      "Breathable Lightweight 100 GSM Polyester Micro-Mesh Bibs",
      "6-Panel Structured Cotton Twill & Performance Tech Caps",
      "French Terry Cotton Moisture Absorbing Wrist & Headbands",
    ],
    capabilities: [
      "Custom Jacquard Woven Team Crests and Striping",
      "Reversible Double-Layer Contrast Training Bibs",
      "3D Puff Embroidery & Laser-Cut Velcro Adjusters on Caps",
    ],
    faqs: [
      {
        question: "Can you customize team socks with our club logo knit into the fabric?",
        answer: "Yes, our 168-needle computerized sock knitting machines knit your club emblem, initials, and custom stripes directly into the tube."
      }
    ]
  },
  {
    id: "gloves" as MainCategoryId,
    slug: "gloves",
    name: "Gloves",
    number: "09",
    shortDescription: "Specialized performance gloves for ice hockey, boxing, MMA, soccer goalkeeping, cricket, batting, and cycling.",
    description: "Crafted in the world capital of leather and sports craftsmanship. Engineered with anatomic multi-density EVA foam padding, premium latex grip palms, reinforced thumb locks, and ventilated mesh finger gussets.",
    heroImage: "/categories/gloves.png",
    subcategories: [
      { id: "ice-hockey-gloves", slug: "ice-hockey-gloves", name: "Ice Hockey Gloves" },
      { id: "goalkeeper-gloves", slug: "goalkeeper-gloves", name: "Goalkeeper Gloves" },
      { id: "cricket-batting-gloves", slug: "cricket-batting-gloves", name: "Cricket Batting Gloves" },
      { id: "baseball-batting-gloves", slug: "baseball-batting-gloves", name: "Baseball Batting Gloves" },
      { id: "boxing-gloves", slug: "boxing-gloves", name: "Boxing Gloves" },
      { id: "mma-gloves", slug: "mma-gloves", name: "MMA Gloves" },
      { id: "gym-weightlifting-gloves", slug: "gym-weightlifting-gloves", name: "Gym & Weightlifting Gloves" },
      { id: "cycling-gloves", slug: "cycling-gloves", name: "Cycling Gloves" },
      { id: "winter-gloves", slug: "winter-gloves", name: "Winter Gloves" },
      { id: "work-gloves", slug: "work-gloves", name: "Work Gloves" },
    ],
    technicalHighlights: [
      "Anatomic Multi-Layered High-Density Foam & Gel Inserts",
      "German Contact Latex Palms for Goalkeeper Precision Grip",
      "Full-Grain Cowhide, Goat Leather & Clarino Synthetic Suede",
      "Wide Wrap-Around Hook-and-Loop Wrist Stabilizer Bands",
    ],
    capabilities: [
      "Custom Club & Brand Screen Printing / Debossing / Embossing",
      "Ounce-Calibrated Production (10 oz, 12 oz, 14 oz, 16 oz Boxing)",
      "Ergonomic Pre-Curved Finger Patterns for Reduced Fatigue",
    ],
    faqs: [
      {
        question: "Do you supply professional tournament grade boxing gloves?",
        answer: "Yes, we manufacture multi-layer horsehair and high-density foam competition boxing gloves meeting international federation standards."
      }
    ]
  },
];

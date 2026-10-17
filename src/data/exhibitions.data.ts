export interface Exhibition {
  id: string;
  year: string;
  event: string;
  shortName: string;
  dates: string;
  city: string;
  country: string;
  venue: string;
  pavilion: string;
  booth: string;
  highlight: string;
  description: string;
  overview: string;
  image: string;
  gallery: string[];
  showcaseCategories: string[];
  technicalHighlights: string;
  commercialImpact: string;
  delegationDetails: string;
}

export const EXHIBITIONS_DATA: Exhibition[] = [
  {
    id: "ispo-2013",
    year: "2013",
    event: "ISPO Munich International Trade Fair",
    shortName: "ISPO Munich 2013",
    dates: "February 3–6, 2013",
    city: "Munich",
    country: "Germany",
    venue: "Messe München Exhibition Grounds",
    pavilion: "Official Pakistan Sports Pavilion",
    booth: "Hall C2, Stand 410",
    highlight: "European Brand Partnerships",
    description:
      "Featured presentation of high-performance technical ski wear, bonded softshell outerwear, and custom sublimation team sportswear at the world's leading sports business show.",
    overview:
      "ISPO Munich is the global pinnacle of sports business exhibitions, bringing together more than 2,800 international brands and 80,000 trade visitors. At ISPO 2013, CM SPORTS WEAR headlined the Sialkot manufacturing pavilion, demonstrating advanced multi-layer fabric bonding, seam-sealed alpine outerwear, and bespoke athletic sublimation solutions tailored to strict European performance benchmarks.",
    image: "/exhibitions/ISPO Munich 2013.jpg",
    gallery: [
      "/exhibitions/ISPO Munich 2013.jpg",
      "/exhibitions/2013 stand.jpg",
      "/exhibitions/2013 stand.jpg 2.jpg",
    ],
    showcaseCategories: [
      "Technical Ski & Snowboard Jackets",
      "3-Layer Bonded Windproof Softshells",
      "Seamless Sublimated Team Jerseys",
      "Thermal Insulation Base Layers",
      "Weather-Shield Winter Gloves",
    ],
    technicalHighlights:
      "Engineered with 10,000mm hydrostatic head waterproof membranes, breathability rating exceeding 8,000 g/m²/24h, fully taped waterproof seams, and ergonomic articulated sleeve patterns.",
    commercialImpact:
      "Secured 8 major OEM supply agreements with sporting goods distributors and alpine ski labels across Germany, Austria, Switzerland, and Scandinavia.",
    delegationDetails:
      "Executive booth team led by Senior Production Directors, featuring live physical fabric swatch libraries, GSM weigh scales, and on-site tech pack feasibility assessments.",
  },
  {
    id: "super-show-2007",
    year: "2007",
    event: "The Super Show USA",
    shortName: "The Super Show USA",
    dates: "January 18–21, 2007",
    city: "Atlanta / Orlando",
    country: "United States",
    venue: "Georgia World Congress Center",
    pavilion: "International Athletic Trade Pavilion",
    booth: "Hall B, Booth 2841",
    highlight: "USA Collegiate & League Exporters",
    description:
      "Major North American sports convention debut showcasing authentic baseball jerseys, heavyweight varsity jackets, and collegiate letterman jackets.",
    overview:
      "The Super Show USA served as North America’s premier sporting goods convention for over three decades, gathering thousands of athletic directors, university bookstore buyers, and team dealers. CM SPORTS WEAR showcased its iconic American athletic outerwear program, demonstrating unmatched capability in genuine Melton wool, top-grain cowhide leather, and handcrafted chenille embroidery.",
    image: "/exhibitions/Super Show  USA 2007.JPG",
    gallery: [
      "/exhibitions/Super Show  USA 2007.JPG",
      "/exhibitions/3.jpeg",
    ],
    showcaseCategories: [
      "500 GSM Melton Wool Varsity Jackets",
      "Top-Grain Cowhide Leather Sleeves",
      "Tackle-Twill Baseball Jerseys",
      "Breathable Pro Basketball Uniforms",
      "Custom Chenille Lettering & Patches",
    ],
    technicalHighlights:
      "Heavyweight 80/20 Melton wool composition, drum-dyed 1.2mm top-grain leather sleeves, yarn-dyed 2x2 ribbed collars/cuffs, and multi-layer zigzag tackle twill embroidery.",
    commercialImpact:
      "Established supply pipelines to over 30 regional US collegiate teamwear distributors and independent letterman apparel stores across the Midwest and Southern states.",
    delegationDetails:
      "Full display of over 120 custom garment samples, custom Pantone swatch rings, and direct factory-to-door CIF/DDP air freight arrangements for US buyers.",
  },
  {
    id: "expo-karachi-2008",
    year: "2008",
    event: "International Expo Karachi",
    shortName: "Expo Karachi 2008",
    dates: "October 20–24, 2008",
    city: "Karachi",
    country: "Pakistan",
    venue: "Karachi Expo Centre",
    pavilion: "Export Promotion Bureau / TDAP Pavilion",
    booth: "Hall 3, Stand E-14",
    highlight: "National Export Excellence",
    description:
      "Export Promotion Bureau premier manufacturing pavilion spotlighting Sialkot's vertical textile capabilities and worldwide sea freight logistics.",
    overview:
      "Organized by the Trade Development Authority of Pakistan (TDAP), Expo Karachi is the country's flagship multi-sector international trade fair. CM SPORTS WEAR was selected as a featured exhibitor in the National Textile & Sporting Goods Pavilion, demonstrating Sialkot’s world-renowned vertical integration to foreign diplomatic commercial delegations and international sourcing agents.",
    image: "/exhibitions/EXPO Karachi 2008.jpg",
    gallery: [
      "/exhibitions/EXPO Karachi 2008.jpg",
    ],
    showcaseCategories: [
      "Vertical Knitwear & Fleece Blanks",
      "Automated Laser Fabric Cutting",
      "Industrial High-Density Screen Printing",
      "Computerized Multi-Head Embroidery",
      "Export-Compliant Retail Packaging",
    ],
    technicalHighlights:
      "Full vertical production traceability, computer-assisted grading and pattern CAD, in-house laboratory color-matching, and compliance with international ISO 9001 and AQL 2.5 quality control standards.",
    commercialImpact:
      "Awarded Certificate of Export Recognition and conducted bilateral trade negotiations with commercial attachés and buying houses from 18+ countries.",
    delegationDetails:
      "Factory leadership team on site to coordinate container-load (FCL & LCL) shipping schedules via Karachi port to Europe and North America.",
  },
  {
    id: "ispo-2005",
    year: "2005",
    event: "ISPO Winter International Fair",
    shortName: "ISPO Winter 2005",
    dates: "February 6–9, 2005",
    city: "Munich",
    country: "Germany",
    venue: "Messe München International",
    pavilion: "Combat Sports & Martial Arts Pavilion",
    booth: "Hall B1, Stand 315",
    highlight: "Combat Sports & Teamwear",
    description:
      "Milestone European trade pavilion displaying pro fight sports equipment, martial arts Gis, and technical boxing gear to international distributors.",
    overview:
      "Marking CM SPORTS WEAR’s earliest major European exhibition appearance at ISPO Munich, the 2005 stand established our foothold across the European combat sports and martial arts industry. By showcasing authentic preshrunk Brazilian Jiu-Jitsu Gis, karate and judo uniforms, and competition boxing gloves, we proved that Sialkot manufacturing matches the strictest global competition standards.",
    image: "/exhibitions/ISPO Munich 2005.jpg",
    gallery: [
      "/exhibitions/ISPO Munich 2005.jpg",
      "/exhibitions/ISPO 098.jpg",
    ],
    showcaseCategories: [
      "550 GSM Pearl Weave BJJ Gis",
      "Heavyweight 14oz Canvas Karate Gis",
      "Pro Competition Boxing Gloves",
      "MMA Sparring Gloves & Shin Guards",
      "Custom Sublimated Fight Shorts",
    ],
    technicalHighlights:
      "Reinforced ripstop pants with quad-stitch stress seams, antimicrobial anti-odor collar padding, injection-molded multi-layer foam padding, and premium cowhide leather shells.",
    commercialImpact:
      "Initiated OEM manufacturing contracts with over 15 martial arts academy chains, gear wholesalers, and combat federations across the UK, France, Germany, and the Netherlands.",
    delegationDetails:
      "Interactive booth featuring physical strength-testing demonstrations, custom embroidery mockups, and low minimum order volume (MOQ) pilot programs.",
  },
  {
    id: "magic-las-vegas",
    year: "2018–2022",
    event: "Sourcing at MAGIC Las Vegas",
    shortName: "MAGIC Las Vegas",
    dates: "Bi-Annual (February & August)",
    city: "Las Vegas, Nevada",
    country: "United States",
    venue: "Las Vegas Convention Center (LVCC)",
    pavilion: "Global Sourcing Hall - Sialkot Delegation",
    booth: "South Hall, Booth 61402",
    highlight: "Premium Streetwear & Private Label",
    description:
      "Premier North American apparel sourcing pavilion showcasing heavyweight streetwear blanks, custom fleece hoodies, varsity outerwear, and fast-turnaround private label collections.",
    overview:
      "Sourcing at MAGIC in Las Vegas is the preeminent apparel trade event in North America, connecting global manufacturers with leading US retailers, streetwear founders, and fashion lifestyle brands. CM SPORTS WEAR’s dedicated stall featured hundreds of custom-dyed streetwear samples, varsity jackets, French terry hoodies, and full-package private label OEM programs.",
    image: "/exhibitions/magic pictures/stall pics (1).jpeg",
    gallery: [
      "/exhibitions/magic pictures/stall pics (1).jpeg",
      "/exhibitions/magic pictures/stall pics (4).jpeg",
      "/exhibitions/magic pictures/stall pics (7).jpeg",
      "/exhibitions/magic pictures/stall pics (10).jpeg",
      "/exhibitions/magic pictures/stall pics (12).jpeg",
      "/exhibitions/magic pictures/stall pics (14).jpeg",
    ],
    showcaseCategories: [
      "450+ GSM French Terry Luxury Hoodies",
      "Vintage Heavyweight Acid-Wash Tees",
      "Cut-and-Sew Fleece Sweats & Tracksuits",
      "Chenille Embroidered Varsity Outerwear",
      "Private Label Custom Woven Trims",
    ],
    technicalHighlights:
      "Custom Pantone yarn-dyeing, silicone hand-feel enzyme washing, oversized drop-shoulder boxy silhouettes, high-density puff screen printing, and bar-tack reinforced pocket seams.",
    commercialImpact:
      "Contracted ongoing seasonal cut-and-sew production for 50+ emerging and established direct-to-consumer (D2C) streetwear brands across North America.",
    delegationDetails:
      "Comprehensive live booth setup staffed by our product development engineers with on-site tech-pack intake, fabric weight swatches, and rapid 7-day prototype dispatch promises.",
  },
];

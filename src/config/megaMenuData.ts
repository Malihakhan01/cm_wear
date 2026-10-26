export interface ProductTypeItem {
  name: string;
  query: string; // e.g. "subcategory=slug"
  slugs: string[];
  productCount: number;
  isPending?: boolean;
}

export interface SubcategoryGroup {
  name: string;
  slug: string;
  productTypes: ProductTypeItem[];
}

export interface MegaMenuPillarData {
  id: string;
  slug: string;
  name: string;
  number: string;
  image: string;
  tagline: string;
  subcategories: string[];
  groups: SubcategoryGroup[];
}

export const MEGA_MENU_TAXONOMY: MegaMenuPillarData[] = [
  {
    "id": "team-sports-wear",
    "slug": "team-sports-wear",
    "name": "Team Sports Wear",
    "number": "01",
    "image": "/categories/teamsports_wear.png",
    "tagline": "High-performance team uniforms, match jerseys, and technical kits for professional athletics.",
    "subcategories": [
      "Ice Hockey",
      "Soccer & Football",
      "American Football",
      "Basketball",
      "Baseball & Softball",
      "Cricket",
      "Rugby",
      "Lacrosse",
      "Volleyball",
      "Tennis & Golf"
    ],
    "groups": [
      {
        "name": "Ice Hockey",
        "slug": "ice-hockey",
        "productTypes": [
          {
            "name": "Game Jerseys",
            "query": "subcategory=ice-hockey-game-jerseys",
            "slugs": [
              "ice-hockey-game-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Practice Jerseys",
            "query": "subcategory=practice-jerseys",
            "slugs": [
              "practice-jerseys"
            ],
            "productCount": 5
          },
          {
            "name": "Hockey Socks",
            "query": "subcategory=ice-hockey-hockey-socks",
            "slugs": [
              "ice-hockey-hockey-socks"
            ],
            "productCount": 0
          },
          {
            "name": "Shell Pants",
            "query": "subcategory=ice-hockey-shell-pants-1",
            "slugs": [
              "ice-hockey-shell-pants-1"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Soccer & Football",
        "slug": "soccer-football",
        "productTypes": [
          {
            "name": "Team Kits",
            "query": "subcategory=soccer-football-team-kits",
            "slugs": [
              "soccer-football-team-kits"
            ],
            "productCount": 0
          },
          {
            "name": "Jerseys",
            "query": "subcategory=soccer-football-jerseys",
            "slugs": [
              "soccer-football-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=soccer-football-shorts",
            "slugs": [
              "soccer-football-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Training Tops",
            "query": "subcategory=soccer-football-training-tops",
            "slugs": [
              "soccer-football-training-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Goalkeeper Uniforms",
            "query": "subcategory=soccer-football-goalkeeper-uniforms",
            "slugs": [
              "soccer-football-goalkeeper-uniforms"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "American Football",
        "slug": "american-football",
        "productTypes": [
          {
            "name": "Game Jerseys",
            "query": "subcategory=american-football-game-jerseys",
            "slugs": [
              "american-football-game-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Practice Jerseys",
            "query": "subcategory=american-football-practice-jerseys",
            "slugs": [
              "american-football-practice-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Football Pants",
            "query": "subcategory=american-football-football-pants",
            "slugs": [
              "american-football-football-pants"
            ],
            "productCount": 0
          },
          {
            "name": "Compression Tops",
            "query": "subcategory=american-football-compression-tops",
            "slugs": [
              "american-football-compression-tops"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Basketball",
        "slug": "basketball",
        "productTypes": [
          {
            "name": "Jerseys",
            "query": "subcategory=basketball-jerseys-1",
            "slugs": [
              "basketball-jerseys-1"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=basketball-shorts-1",
            "slugs": [
              "basketball-shorts-1"
            ],
            "productCount": 0
          },
          {
            "name": "Complete Uniforms",
            "query": "subcategory=basketball-complete-uniforms",
            "slugs": [
              "basketball-complete-uniforms"
            ],
            "productCount": 0
          },
          {
            "name": "Reversible Bibs",
            "query": "subcategory=basketball-reversible-bibs",
            "slugs": [
              "basketball-reversible-bibs"
            ],
            "productCount": 0
          },
          {
            "name": "Warm-Up Suits",
            "query": "subcategory=basketball-warm-up-suits-1",
            "slugs": [
              "basketball-warm-up-suits-1"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Baseball & Softball",
        "slug": "baseball-softball",
        "productTypes": [
          {
            "name": "Button-Up Jerseys",
            "query": "subcategory=baseball-softball-button-up-jerseys",
            "slugs": [
              "baseball-softball-button-up-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Pullover Jerseys",
            "query": "subcategory=baseball-softball-pullover-jerseys",
            "slugs": [
              "baseball-softball-pullover-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Pants",
            "query": "subcategory=baseball-softball-pants",
            "slugs": [
              "baseball-softball-pants"
            ],
            "productCount": 0
          },
          {
            "name": "Training Shirts",
            "query": "subcategory=baseball-softball-training-shirts",
            "slugs": [
              "baseball-softball-training-shirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Cricket",
        "slug": "cricket",
        "productTypes": [
          {
            "name": "Match Shirts",
            "query": "subcategory=cricket-match-shirts",
            "slugs": [
              "cricket-match-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "T20 Jerseys",
            "query": "subcategory=cricket-t20-jerseys",
            "slugs": [
              "cricket-t20-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Trousers",
            "query": "subcategory=cricket-trousers",
            "slugs": [
              "cricket-trousers"
            ],
            "productCount": 0
          },
          {
            "name": "Training Kits",
            "query": "subcategory=cricket-training-kits",
            "slugs": [
              "cricket-training-kits"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Rugby",
        "slug": "rugby",
        "productTypes": [
          {
            "name": "Match Jerseys",
            "query": "subcategory=rugby-match-jerseys",
            "slugs": [
              "rugby-match-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=rugby-shorts-1",
            "slugs": [
              "rugby-shorts-1"
            ],
            "productCount": 0
          },
          {
            "name": "Training Tops",
            "query": "subcategory=rugby-training-tops",
            "slugs": [
              "rugby-training-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Team Kits",
            "query": "subcategory=rugby-team-kits-1",
            "slugs": [
              "rugby-team-kits-1"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Lacrosse",
        "slug": "lacrosse",
        "productTypes": [
          {
            "name": "Game Jerseys",
            "query": "subcategory=lacrosse-game-jerseys",
            "slugs": [
              "lacrosse-game-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=lacrosse-shorts",
            "slugs": [
              "lacrosse-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Practice Pinnies",
            "query": "subcategory=lacrosse-practice-pinnies",
            "slugs": [
              "lacrosse-practice-pinnies"
            ],
            "productCount": 0
          },
          {
            "name": "Team Kits",
            "query": "subcategory=lacrosse-team-kits",
            "slugs": [
              "lacrosse-team-kits"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Volleyball",
        "slug": "volleyball",
        "productTypes": [
          {
            "name": "Jerseys",
            "query": "subcategory=volleyball-jerseys",
            "slugs": [
              "volleyball-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=volleyball-shorts-1",
            "slugs": [
              "volleyball-shorts-1"
            ],
            "productCount": 0
          },
          {
            "name": "Team Kits",
            "query": "subcategory=volleyball-team-kits",
            "slugs": [
              "volleyball-team-kits"
            ],
            "productCount": 0
          },
          {
            "name": "Training Tops",
            "query": "subcategory=volleyball-training-tops",
            "slugs": [
              "volleyball-training-tops"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Tennis & Golf",
        "slug": "tennis-golf",
        "productTypes": [
          {
            "name": "Polo Shirts",
            "query": "subcategory=polo-shirts",
            "slugs": [
              "polo-shirts"
            ],
            "productCount": 5
          },
          {
            "name": "Performance Tops",
            "query": "subcategory=tennis-golf-performance-tops",
            "slugs": [
              "tennis-golf-performance-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Shorts",
            "query": "subcategory=tennis-golf-shorts",
            "slugs": [
              "tennis-golf-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Skirts",
            "query": "subcategory=skirts",
            "slugs": [
              "skirts"
            ],
            "productCount": 1
          },
          {
            "name": "Skorts",
            "query": "subcategory=tennis-golf-skorts",
            "slugs": [
              "tennis-golf-skorts"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "martial-arts-combat-wear",
    "slug": "martial-arts-combat-wear",
    "name": "Martial Arts & Combat Wear",
    "number": "02",
    "image": "/categories/martial arts.png",
    "tagline": "Championship BJJ gis, fight rash guards, compression singlets, and combat apparel.",
    "subcategories": [
      "BJJ & Grappling",
      "MMA",
      "Boxing & Muay Thai",
      "Karate",
      "Judo",
      "Taekwondo",
      "Wrestling"
    ],
    "groups": [
      {
        "name": "BJJ & Grappling",
        "slug": "bjj-grappling",
        "productTypes": [
          {
            "name": "BJJ Gis",
            "query": "subcategory=bjj-grappling-bjj-gis",
            "slugs": [
              "bjj-grappling-bjj-gis"
            ],
            "productCount": 0
          },
          {
            "name": "Rash Guards",
            "query": "subcategory=bjj-grappling-rash-guards",
            "slugs": [
              "bjj-grappling-rash-guards"
            ],
            "productCount": 0
          },
          {
            "name": "Grappling Shorts",
            "query": "subcategory=bjj-grappling-grappling-shorts",
            "slugs": [
              "bjj-grappling-grappling-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Spats",
            "query": "subcategory=bjj-grappling-spats",
            "slugs": [
              "bjj-grappling-spats"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "MMA",
        "slug": "mma",
        "productTypes": [
          {
            "name": "Fight Shorts",
            "query": "subcategory=mma-fight-shorts",
            "slugs": [
              "mma-fight-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Rash Guards",
            "query": "subcategory=mma-rash-guards",
            "slugs": [
              "mma-rash-guards"
            ],
            "productCount": 0
          },
          {
            "name": "Compression Shorts",
            "query": "subcategory=mma-compression-shorts",
            "slugs": [
              "mma-compression-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Training Shirts",
            "query": "subcategory=mma-training-shirts",
            "slugs": [
              "mma-training-shirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Boxing & Muay Thai",
        "slug": "boxing-muay-thai",
        "productTypes": [
          {
            "name": "Boxing Shorts",
            "query": "subcategory=boxing-muay-thai-boxing-shorts",
            "slugs": [
              "boxing-muay-thai-boxing-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Muay Thai Shorts",
            "query": "subcategory=boxing-muay-thai-muay-thai-shorts",
            "slugs": [
              "boxing-muay-thai-muay-thai-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Boxing Singlets",
            "query": "subcategory=boxing-muay-thai-boxing-singlets",
            "slugs": [
              "boxing-muay-thai-boxing-singlets"
            ],
            "productCount": 0
          },
          {
            "name": "Training Tracksuits",
            "query": "subcategory=boxing-muay-thai-training-tracksuits",
            "slugs": [
              "boxing-muay-thai-training-tracksuits"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Karate",
        "slug": "karate",
        "productTypes": [
          {
            "name": "Training Gis",
            "query": "subcategory=karate-training-gis",
            "slugs": [
              "karate-training-gis"
            ],
            "productCount": 0
          },
          {
            "name": "Competition Gis",
            "query": "subcategory=karate-competition-gis",
            "slugs": [
              "karate-competition-gis"
            ],
            "productCount": 0
          },
          {
            "name": "Belts",
            "query": "subcategory=karate-belts",
            "slugs": [
              "karate-belts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Judo",
        "slug": "judo",
        "productTypes": [
          {
            "name": "Training Gis",
            "query": "subcategory=judo-training-gis",
            "slugs": [
              "judo-training-gis"
            ],
            "productCount": 0
          },
          {
            "name": "Competition Gis",
            "query": "subcategory=judo-competition-gis",
            "slugs": [
              "judo-competition-gis"
            ],
            "productCount": 0
          },
          {
            "name": "Belts",
            "query": "subcategory=judo-belts",
            "slugs": [
              "judo-belts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Taekwondo",
        "slug": "taekwondo",
        "productTypes": [
          {
            "name": "Training Doboks",
            "query": "subcategory=taekwondo-training-doboks",
            "slugs": [
              "taekwondo-training-doboks"
            ],
            "productCount": 0
          },
          {
            "name": "Competition Doboks",
            "query": "subcategory=taekwondo-competition-doboks",
            "slugs": [
              "taekwondo-competition-doboks"
            ],
            "productCount": 0
          },
          {
            "name": "Belts",
            "query": "subcategory=taekwondo-belts",
            "slugs": [
              "taekwondo-belts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Wrestling",
        "slug": "wrestling",
        "productTypes": [
          {
            "name": "Singlets",
            "query": "subcategory=wrestling-singlets",
            "slugs": [
              "wrestling-singlets"
            ],
            "productCount": 0
          },
          {
            "name": "Compression Tops",
            "query": "subcategory=wrestling-compression-tops",
            "slugs": [
              "wrestling-compression-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Training Shorts",
            "query": "subcategory=wrestling-training-shorts",
            "slugs": [
              "wrestling-training-shorts"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "activewear-fitness",
    "slug": "activewear-fitness",
    "name": "Activewear & Fitness",
    "number": "03",
    "image": "/categories/activewear.png",
    "tagline": "Engineered 4-way stretch gym wear, compression layers, and women’s performance activewear.",
    "subcategories": [
      "Gym & Training Wear",
      "Compression Wear",
      "Women’s Activewear",
      "Running & Athletics",
      "Cycling Wear"
    ],
    "groups": [
      {
        "name": "Gym & Training Wear",
        "slug": "gym-training-wear",
        "productTypes": [
          {
            "name": "Gym T-Shirts",
            "query": "subcategory=gym-training-wear-gym-t-shirts",
            "slugs": [
              "gym-training-wear-gym-t-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Tank Tops",
            "query": "subcategory=gym-training-wear-tank-tops",
            "slugs": [
              "gym-training-wear-tank-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Stringers",
            "query": "subcategory=gym-training-wear-stringers",
            "slugs": [
              "gym-training-wear-stringers"
            ],
            "productCount": 0
          },
          {
            "name": "Training Shorts",
            "query": "subcategory=gym-training-wear-training-shorts",
            "slugs": [
              "gym-training-wear-training-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Joggers",
            "query": "subcategory=gym-training-wear-joggers",
            "slugs": [
              "gym-training-wear-joggers"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Compression Wear",
        "slug": "compression-wear",
        "productTypes": [
          {
            "name": "Short-Sleeve Tops",
            "query": "subcategory=compression-wear-short-sleeve-tops",
            "slugs": [
              "compression-wear-short-sleeve-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Long-Sleeve Tops",
            "query": "subcategory=compression-wear-long-sleeve-tops",
            "slugs": [
              "compression-wear-long-sleeve-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Compression Shorts",
            "query": "subcategory=compression-shorts",
            "slugs": [
              "compression-shorts"
            ],
            "productCount": 5
          },
          {
            "name": "Full-Length Tights",
            "query": "subcategory=compression-wear-full-length-tights",
            "slugs": [
              "compression-wear-full-length-tights"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Women’s Activewear",
        "slug": "womens-activewear",
        "productTypes": [
          {
            "name": "Sports Bras",
            "query": "subcategory=womens-activewear-sports-bras",
            "slugs": [
              "womens-activewear-sports-bras"
            ],
            "productCount": 0
          },
          {
            "name": "Leggings",
            "query": "subcategory=womens-activewear-leggings",
            "slugs": [
              "womens-activewear-leggings"
            ],
            "productCount": 0
          },
          {
            "name": "Workout Shorts",
            "query": "subcategory=womens-activewear-workout-shorts",
            "slugs": [
              "womens-activewear-workout-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Tank Tops",
            "query": "subcategory=womens-activewear-tank-tops",
            "slugs": [
              "womens-activewear-tank-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Matching Sets",
            "query": "subcategory=womens-activewear-matching-sets",
            "slugs": [
              "womens-activewear-matching-sets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Running & Athletics",
        "slug": "running-athletics",
        "productTypes": [
          {
            "name": "Running Singlets",
            "query": "subcategory=running-athletics-running-singlets",
            "slugs": [
              "running-athletics-running-singlets"
            ],
            "productCount": 0
          },
          {
            "name": "Performance Shirts",
            "query": "subcategory=running-athletics-performance-shirts",
            "slugs": [
              "running-athletics-performance-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Running Shorts",
            "query": "subcategory=running-athletics-running-shorts",
            "slugs": [
              "running-athletics-running-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Track Uniforms",
            "query": "subcategory=running-athletics-track-uniforms",
            "slugs": [
              "running-athletics-track-uniforms"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Cycling Wear",
        "slug": "cycling-wear",
        "productTypes": [
          {
            "name": "Cycling Jerseys",
            "query": "subcategory=cycling-wear-cycling-jerseys",
            "slugs": [
              "cycling-wear-cycling-jerseys"
            ],
            "productCount": 0
          },
          {
            "name": "Cycling Shorts",
            "query": "subcategory=cycling-shorts",
            "slugs": [
              "cycling-shorts"
            ],
            "productCount": 5
          },
          {
            "name": "Bib Shorts",
            "query": "subcategory=cycling-wear-bib-shorts",
            "slugs": [
              "cycling-wear-bib-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Cycling Jackets",
            "query": "subcategory=cycling-wear-cycling-jackets",
            "slugs": [
              "cycling-wear-cycling-jackets"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "casual-lifestyle-wear",
    "slug": "casual-lifestyle-wear",
    "name": "Casual & Lifestyle Wear",
    "number": "04",
    "image": "/categories/casualwear.png",
    "tagline": "Heavyweight 450 GSM French terry hoodies, crewnecks, oversized tees, and tailored tracksuits.",
    "subcategories": [
      "T-Shirts & Tops",
      "Hoodies & Sweatshirts",
      "Tracksuits & Matching Sets",
      "Pants & Bottoms"
    ],
    "groups": [
      {
        "name": "T-Shirts & Tops",
        "slug": "t-shirts-tops",
        "productTypes": [
          {
            "name": "Crew-Neck T-Shirts",
            "query": "subcategory=t-shirts-tops-crew-neck-t-shirts",
            "slugs": [
              "t-shirts-tops-crew-neck-t-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "V-Neck T-Shirts",
            "query": "subcategory=t-shirts-tops-v-neck-t-shirts",
            "slugs": [
              "t-shirts-tops-v-neck-t-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Oversized T-Shirts",
            "query": "subcategory=t-shirts-tops-oversized-t-shirts",
            "slugs": [
              "t-shirts-tops-oversized-t-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Polo Shirts",
            "query": "subcategory=t-shirts-tops-polo-shirts",
            "slugs": [
              "t-shirts-tops-polo-shirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Hoodies & Sweatshirts",
        "slug": "hoodies-sweatshirts",
        "productTypes": [
          {
            "name": "Pullover Hoodies",
            "query": "subcategory=hoodies-sweatshirts-pullover-hoodies",
            "slugs": [
              "hoodies-sweatshirts-pullover-hoodies"
            ],
            "productCount": 0
          },
          {
            "name": "Zip-Up Hoodies",
            "query": "subcategory=hoodies-sweatshirts-zip-up-hoodies",
            "slugs": [
              "hoodies-sweatshirts-zip-up-hoodies"
            ],
            "productCount": 0
          },
          {
            "name": "Oversized Hoodies",
            "query": "subcategory=hoodies-sweatshirts-oversized-hoodies",
            "slugs": [
              "hoodies-sweatshirts-oversized-hoodies"
            ],
            "productCount": 0
          },
          {
            "name": "Crew-Neck Sweatshirts",
            "query": "subcategory=hoodies-sweatshirts-crew-neck-sweatshirts",
            "slugs": [
              "hoodies-sweatshirts-crew-neck-sweatshirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Tracksuits & Matching Sets",
        "slug": "tracksuits-sets",
        "productTypes": [
          {
            "name": "Training Tracksuits",
            "query": "subcategory=tracksuits-sets-training-tracksuits",
            "slugs": [
              "tracksuits-sets-training-tracksuits"
            ],
            "productCount": 0
          },
          {
            "name": "Sweat Suits",
            "query": "subcategory=sweat-suits",
            "slugs": [
              "sweat-suits"
            ],
            "productCount": 9
          },
          {
            "name": "Hoodie & Jogger Sets",
            "query": "subcategory=tracksuits-sets-hoodie-jogger-sets",
            "slugs": [
              "tracksuits-sets-hoodie-jogger-sets"
            ],
            "productCount": 0
          },
          {
            "name": "Sweatshirt & Shorts Sets",
            "query": "subcategory=tracksuits-sets-sweatshirt-shorts-sets",
            "slugs": [
              "tracksuits-sets-sweatshirt-shorts-sets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Pants & Bottoms",
        "slug": "pants-bottoms",
        "productTypes": [
          {
            "name": "Joggers",
            "query": "subcategory=pants-bottoms-joggers",
            "slugs": [
              "pants-bottoms-joggers"
            ],
            "productCount": 0
          },
          {
            "name": "Sweatpants",
            "query": "subcategory=sweatpants",
            "slugs": [
              "sweatpants"
            ],
            "productCount": 0
          },
          {
            "name": "Track Pants",
            "query": "subcategory=pants-bottoms-track-pants",
            "slugs": [
              "pants-bottoms-track-pants"
            ],
            "productCount": 0
          },
          {
            "name": "Casual Shorts",
            "query": "subcategory=pants-bottoms-casual-shorts",
            "slugs": [
              "pants-bottoms-casual-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Cargo Pants",
            "query": "subcategory=cargo-pants",
            "slugs": [
              "cargo-pants"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "jackets-outerwear",
    "slug": "jackets-outerwear",
    "name": "Jackets & Outerwear",
    "number": "05",
    "image": "/categories/jacket wear.png",
    "tagline": "Authentic wool & leather varsity jackets, technical softshells, windbreakers, and weather armor.",
    "subcategories": [
      "Varsity Jackets",
      "Leather Jackets",
      "Softshell Jackets",
      "Windbreakers",
      "Winter Wear",
      "Rainwear"
    ],
    "groups": [
      {
        "name": "Varsity Jackets",
        "slug": "varsity-jackets",
        "productTypes": [
          {
            "name": "Wool Varsity Jackets",
            "query": "subcategory=wool-varsity-jackets",
            "slugs": [
              "wool-varsity-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Fleece Varsity Jackets",
            "query": "subcategory=fleece-varsity-jackets",
            "slugs": [
              "fleece-varsity-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Leather-Sleeve Varsity Jackets",
            "query": "subcategory=leather-sleeve-varsity-jackets",
            "slugs": [
              "leather-sleeve-varsity-jackets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Leather Jackets",
        "slug": "leather-jackets",
        "productTypes": [
          {
            "name": "Biker Jackets",
            "query": "subcategory=leather-jackets-biker-jackets",
            "slugs": [
              "leather-jackets-biker-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Bomber Jackets",
            "query": "subcategory=leather-jackets-bomber-jackets",
            "slugs": [
              "leather-jackets-bomber-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Casual Leather Jackets",
            "query": "subcategory=casual-leather-jackets",
            "slugs": [
              "casual-leather-jackets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Softshell Jackets",
        "slug": "softshell-jackets",
        "productTypes": [
          {
            "name": "Full-Zip Softshell Jackets",
            "query": "subcategory=full-zip-softshell-jackets",
            "slugs": [
              "full-zip-softshell-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Hooded Softshell Jackets",
            "query": "subcategory=hooded-softshell-jackets",
            "slugs": [
              "hooded-softshell-jackets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Windbreakers",
        "slug": "windbreakers",
        "productTypes": [
          {
            "name": "Hooded Windbreakers",
            "query": "subcategory=hooded-windbreakers",
            "slugs": [
              "hooded-windbreakers"
            ],
            "productCount": 0
          },
          {
            "name": "Full-Zip Windbreakers",
            "query": "subcategory=full-zip-windbreakers",
            "slugs": [
              "full-zip-windbreakers"
            ],
            "productCount": 0
          },
          {
            "name": "Pullover Windbreakers",
            "query": "subcategory=pullover-windbreakers",
            "slugs": [
              "pullover-windbreakers"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Winter Wear",
        "slug": "winter-wear",
        "productTypes": [
          {
            "name": "Puffer Jackets",
            "query": "subcategory=puffer-jackets",
            "slugs": [
              "puffer-jackets"
            ],
            "productCount": 4
          },
          {
            "name": "Fleece Jackets",
            "query": "subcategory=winter-wear-fleece-jackets",
            "slugs": [
              "winter-wear-fleece-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Thermal Tops",
            "query": "subcategory=winter-wear-thermal-tops",
            "slugs": [
              "winter-wear-thermal-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Thermal Bottoms",
            "query": "subcategory=winter-wear-thermal-bottoms",
            "slugs": [
              "winter-wear-thermal-bottoms"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Rainwear",
        "slug": "rainwear",
        "productTypes": [
          {
            "name": "Rain Jackets",
            "query": "subcategory=rainwear-rain-jackets",
            "slugs": [
              "rainwear-rain-jackets"
            ],
            "productCount": 0
          },
          {
            "name": "Waterproof Pants",
            "query": "subcategory=rainwear-waterproof-pants",
            "slugs": [
              "rainwear-waterproof-pants"
            ],
            "productCount": 0
          },
          {
            "name": "Rain Suits",
            "query": "subcategory=rainwear-rain-suits",
            "slugs": [
              "rainwear-rain-suits"
            ],
            "productCount": 0
          },
          {
            "name": "Lightweight Rain Shells",
            "query": "subcategory=rainwear-lightweight-rain-shells",
            "slugs": [
              "rainwear-lightweight-rain-shells"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "kids-youth-wear",
    "slug": "kids-youth-wear",
    "name": "Kids & Youth Wear",
    "number": "06",
    "image": "/categories/kids_wear.png",
    "tagline": "High-durability youth athletics, team kits, sublimated jerseys, and everyday fleece sets.",
    "subcategories": [
      "Youth Team Uniforms",
      "Kids’ Activewear",
      "Kids’ T-Shirts",
      "Kids’ Hoodies",
      "Kids’ Tracksuits"
    ],
    "groups": [
      {
        "name": "Youth Team Uniforms",
        "slug": "youth-team-uniforms",
        "productTypes": [
          {
            "name": "Hockey Uniforms",
            "query": "subcategory=youth-team-uniforms-hockey-uniforms",
            "slugs": [
              "youth-team-uniforms-hockey-uniforms"
            ],
            "productCount": 0
          },
          {
            "name": "Soccer Kits",
            "query": "subcategory=youth-team-uniforms-soccer-kits",
            "slugs": [
              "youth-team-uniforms-soccer-kits"
            ],
            "productCount": 0
          },
          {
            "name": "Basketball Uniforms",
            "query": "subcategory=youth-team-uniforms-basketball-uniforms",
            "slugs": [
              "youth-team-uniforms-basketball-uniforms"
            ],
            "productCount": 0
          },
          {
            "name": "Baseball Uniforms",
            "query": "subcategory=youth-team-uniforms-baseball-uniforms",
            "slugs": [
              "youth-team-uniforms-baseball-uniforms"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Kids’ Activewear",
        "slug": "kids-activewear",
        "productTypes": [
          {
            "name": "Training Shirts",
            "query": "subcategory=kids-activewear-training-shirts",
            "slugs": [
              "kids-activewear-training-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Training Shorts",
            "query": "subcategory=kids-activewear-training-shorts",
            "slugs": [
              "kids-activewear-training-shorts"
            ],
            "productCount": 0
          },
          {
            "name": "Leggings",
            "query": "subcategory=kids-activewear-leggings",
            "slugs": [
              "kids-activewear-leggings"
            ],
            "productCount": 0
          },
          {
            "name": "Joggers",
            "query": "subcategory=kids-activewear-joggers",
            "slugs": [
              "kids-activewear-joggers"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Kids’ T-Shirts",
        "slug": "kids-t-shirts",
        "productTypes": [
          {
            "name": "Crew-Neck T-Shirts",
            "query": "subcategory=kids-t-shirts-crew-neck-t-shirts",
            "slugs": [
              "kids-t-shirts-crew-neck-t-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Polo Shirts",
            "query": "subcategory=kids-t-shirts-polo-shirts",
            "slugs": [
              "kids-t-shirts-polo-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Printed T-Shirts",
            "query": "subcategory=kids-t-shirts-printed-t-shirts",
            "slugs": [
              "kids-t-shirts-printed-t-shirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Kids’ Hoodies",
        "slug": "kids-hoodies",
        "productTypes": [
          {
            "name": "Pullover Hoodies",
            "query": "subcategory=kids-hoodies-pullover-hoodies",
            "slugs": [
              "kids-hoodies-pullover-hoodies"
            ],
            "productCount": 0
          },
          {
            "name": "Zip-Up Hoodies",
            "query": "subcategory=kids-hoodies-zip-up-hoodies",
            "slugs": [
              "kids-hoodies-zip-up-hoodies"
            ],
            "productCount": 0
          },
          {
            "name": "Sweatshirts",
            "query": "subcategory=kids-hoodies-sweatshirts",
            "slugs": [
              "kids-hoodies-sweatshirts"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Kids’ Tracksuits",
        "slug": "kids-tracksuits",
        "productTypes": [
          {
            "name": "Training Tracksuits",
            "query": "subcategory=kids-tracksuits-training-tracksuits",
            "slugs": [
              "kids-tracksuits-training-tracksuits"
            ],
            "productCount": 0
          },
          {
            "name": "Hoodie & Jogger Sets",
            "query": "subcategory=kids-tracksuits-hoodie-jogger-sets",
            "slugs": [
              "kids-tracksuits-hoodie-jogger-sets"
            ],
            "productCount": 0
          },
          {
            "name": "Sweat Suits",
            "query": "subcategory=kids-tracksuits-sweat-suits",
            "slugs": [
              "kids-tracksuits-sweat-suits"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "workwear-medical-wear",
    "slug": "workwear-medical-wear",
    "name": "Workwear & Medical Wear",
    "number": "07",
    "image": "/categories/safety_wear.png",
    "tagline": "Antimicrobial hospital scrubs, certified industrial work uniforms, and corporate embroidered polos.",
    "subcategories": [
      "Medical Scrubs",
      "Work Uniforms",
      "Work Polo Shirts"
    ],
    "groups": [
      {
        "name": "Medical Scrubs",
        "slug": "medical-scrubs",
        "productTypes": [
          {
            "name": "Scrub Tops",
            "query": "subcategory=medical-scrubs-scrub-tops",
            "slugs": [
              "medical-scrubs-scrub-tops"
            ],
            "productCount": 0
          },
          {
            "name": "Scrub Pants",
            "query": "subcategory=medical-scrubs-scrub-pants",
            "slugs": [
              "medical-scrubs-scrub-pants"
            ],
            "productCount": 0
          },
          {
            "name": "Complete Scrub Sets",
            "query": "subcategory=medical-scrubs-complete-scrub-sets",
            "slugs": [
              "medical-scrubs-complete-scrub-sets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Work Uniforms",
        "slug": "work-uniforms",
        "productTypes": [
          {
            "name": "Work Shirts",
            "query": "subcategory=work-uniforms-work-shirts",
            "slugs": [
              "work-uniforms-work-shirts"
            ],
            "productCount": 0
          },
          {
            "name": "Work Trousers",
            "query": "subcategory=work-uniforms-work-trousers",
            "slugs": [
              "work-uniforms-work-trousers"
            ],
            "productCount": 0
          },
          {
            "name": "Work Jackets",
            "query": "subcategory=work-uniforms-work-jackets",
            "slugs": [
              "work-uniforms-work-jackets"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Work Polo Shirts",
        "slug": "work-polo-shirts",
        "productTypes": [
          {
            "name": "Short-Sleeve Polos",
            "query": "subcategory=work-polo-shirts-short-sleeve-polos",
            "slugs": [
              "work-polo-shirts-short-sleeve-polos"
            ],
            "productCount": 0
          },
          {
            "name": "Long-Sleeve Polos",
            "query": "subcategory=work-polo-shirts-long-sleeve-polos",
            "slugs": [
              "work-polo-shirts-long-sleeve-polos"
            ],
            "productCount": 0
          },
          {
            "name": "Embroidered Logo Polos",
            "query": "subcategory=work-polo-shirts-embroidered-logo-polos",
            "slugs": [
              "work-polo-shirts-embroidered-logo-polos"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "sports-accessories",
    "slug": "sports-accessories",
    "name": "Sports Accessories",
    "number": "08",
    "image": "/categories/accessories.png",
    "tagline": "Technical sports socks, breathable mesh training bibs, moisture-wicking headbands, and caps.",
    "subcategories": [
      "Team Socks",
      "Training Bibs",
      "Caps",
      "Headbands",
      "Wristbands"
    ],
    "groups": [
      {
        "name": "Team Socks",
        "slug": "team-socks",
        "productTypes": [
          {
            "name": "Hockey Socks",
            "query": "subcategory=team-socks-hockey-socks",
            "slugs": [
              "team-socks-hockey-socks"
            ],
            "productCount": 0
          },
          {
            "name": "Soccer Socks",
            "query": "subcategory=team-socks-soccer-socks",
            "slugs": [
              "team-socks-soccer-socks"
            ],
            "productCount": 0
          },
          {
            "name": "Training Socks",
            "query": "subcategory=team-socks-training-socks",
            "slugs": [
              "team-socks-training-socks"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Training Bibs",
        "slug": "training-bibs",
        "productTypes": [
          {
            "name": "Single-Layer Bibs",
            "query": "subcategory=training-bibs-single-layer-bibs",
            "slugs": [
              "training-bibs-single-layer-bibs"
            ],
            "productCount": 0
          },
          {
            "name": "Reversible Bibs",
            "query": "subcategory=training-bibs-reversible-bibs",
            "slugs": [
              "training-bibs-reversible-bibs"
            ],
            "productCount": 0
          },
          {
            "name": "Mesh Bibs",
            "query": "subcategory=training-bibs-mesh-bibs",
            "slugs": [
              "training-bibs-mesh-bibs"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Caps",
        "slug": "caps",
        "productTypes": [
          {
            "name": "Baseball Caps",
            "query": "subcategory=baseball-caps",
            "slugs": [
              "baseball-caps"
            ],
            "productCount": 0
          },
          {
            "name": "Trucker Caps",
            "query": "subcategory=trucker-caps",
            "slugs": [
              "trucker-caps"
            ],
            "productCount": 0
          },
          {
            "name": "Sports Visors",
            "query": "subcategory=caps-sports-visors",
            "slugs": [
              "caps-sports-visors"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Headbands",
        "slug": "headbands",
        "productTypes": [
          {
            "name": "Sports Headbands",
            "query": "subcategory=sports-headbands",
            "slugs": [
              "sports-headbands"
            ],
            "productCount": 0
          },
          {
            "name": "Running Headbands",
            "query": "subcategory=running-headbands",
            "slugs": [
              "running-headbands"
            ],
            "productCount": 0
          },
          {
            "name": "Winter Headbands",
            "query": "subcategory=winter-headbands",
            "slugs": [
              "winter-headbands"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Wristbands",
        "slug": "wristbands",
        "productTypes": [
          {
            "name": "Sweatbands",
            "query": "subcategory=wristbands-sweatbands",
            "slugs": [
              "wristbands-sweatbands"
            ],
            "productCount": 0
          },
          {
            "name": "Embroidered Wristbands",
            "query": "subcategory=embroidered-wristbands",
            "slugs": [
              "embroidered-wristbands"
            ],
            "productCount": 0
          },
          {
            "name": "Printed Wristbands",
            "query": "subcategory=printed-wristbands",
            "slugs": [
              "printed-wristbands"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  },
  {
    "id": "gloves",
    "slug": "gloves",
    "name": "Gloves",
    "number": "09",
    "image": "/categories/gloves.png",
    "tagline": "Pro-grade competition fight gloves, hockey mitts, grip goalkeeper gloves, and thermal winter gloves.",
    "subcategories": [
      "Ice Hockey Gloves",
      "Goalkeeper Gloves",
      "Cricket Batting Gloves",
      "Baseball Batting Gloves",
      "Boxing Gloves",
      "MMA Gloves",
      "Gym & Weightlifting Gloves",
      "Cycling Gloves",
      "Winter Gloves",
      "Work Gloves"
    ],
    "groups": [
      {
        "name": "Ice Hockey Gloves",
        "slug": "ice-hockey-gloves",
        "productTypes": [
          {
            "name": "Youth Hockey Gloves",
            "query": "subcategory=youth-hockey-gloves",
            "slugs": [
              "youth-hockey-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Senior Hockey Gloves",
            "query": "subcategory=senior-hockey-gloves",
            "slugs": [
              "senior-hockey-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Practice Hockey Gloves",
            "query": "subcategory=practice-hockey-gloves",
            "slugs": [
              "practice-hockey-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Goalkeeper Gloves",
        "slug": "goalkeeper-gloves",
        "productTypes": [
          {
            "name": "Training Gloves",
            "query": "subcategory=training-gloves",
            "slugs": [
              "training-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Match Gloves",
            "query": "subcategory=match-gloves",
            "slugs": [
              "match-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Finger-Protection Gloves",
            "query": "subcategory=finger-protection-gloves",
            "slugs": [
              "finger-protection-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Cricket Batting Gloves",
        "slug": "cricket-batting-gloves",
        "productTypes": [
          {
            "name": "Youth Batting Gloves",
            "query": "subcategory=youth-batting-gloves",
            "slugs": [
              "youth-batting-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Adult Batting Gloves",
            "query": "subcategory=adult-batting-gloves",
            "slugs": [
              "adult-batting-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Training Batting Gloves",
            "query": "subcategory=training-batting-gloves",
            "slugs": [
              "training-batting-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Baseball Batting Gloves",
        "slug": "baseball-batting-gloves",
        "productTypes": [
          {
            "name": "Youth Batting Gloves",
            "query": "subcategory=baseball-batting-gloves-youth-batting-gloves",
            "slugs": [
              "baseball-batting-gloves-youth-batting-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Adult Batting Gloves",
            "query": "subcategory=baseball-batting-gloves-adult-batting-gloves",
            "slugs": [
              "baseball-batting-gloves-adult-batting-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Boxing Gloves",
        "slug": "boxing-gloves",
        "productTypes": [
          {
            "name": "Training Gloves",
            "query": "subcategory=boxing-gloves-training-gloves",
            "slugs": [
              "boxing-gloves-training-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Sparring Gloves",
            "query": "subcategory=sparring-gloves",
            "slugs": [
              "sparring-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Bag Gloves",
            "query": "subcategory=bag-gloves",
            "slugs": [
              "bag-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "MMA Gloves",
        "slug": "mma-gloves",
        "productTypes": [
          {
            "name": "Competition Gloves",
            "query": "subcategory=competition-gloves",
            "slugs": [
              "competition-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Sparring Gloves",
            "query": "subcategory=mma-gloves-sparring-gloves",
            "slugs": [
              "mma-gloves-sparring-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Training Gloves",
            "query": "subcategory=mma-gloves-training-gloves",
            "slugs": [
              "mma-gloves-training-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Gym & Weightlifting Gloves",
        "slug": "gym-weightlifting-gloves",
        "productTypes": [
          {
            "name": "Fingerless Gym Gloves",
            "query": "subcategory=fingerless-gym-gloves",
            "slugs": [
              "fingerless-gym-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Full-Finger Gym Gloves",
            "query": "subcategory=full-finger-gym-gloves",
            "slugs": [
              "full-finger-gym-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Wrist-Support Gloves",
            "query": "subcategory=wrist-support-gloves",
            "slugs": [
              "wrist-support-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Cycling Gloves",
        "slug": "cycling-gloves",
        "productTypes": [
          {
            "name": "Short-Finger Cycling Gloves",
            "query": "subcategory=short-finger-cycling-gloves",
            "slugs": [
              "short-finger-cycling-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Full-Finger Cycling Gloves",
            "query": "subcategory=full-finger-cycling-gloves",
            "slugs": [
              "full-finger-cycling-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Winter Cycling Gloves",
            "query": "subcategory=winter-cycling-gloves",
            "slugs": [
              "winter-cycling-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Winter Gloves",
        "slug": "winter-gloves",
        "productTypes": [
          {
            "name": "Fleece Gloves",
            "query": "subcategory=fleece-gloves",
            "slugs": [
              "fleece-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Insulated Gloves",
            "query": "subcategory=insulated-gloves",
            "slugs": [
              "insulated-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Touchscreen Gloves",
            "query": "subcategory=touchscreen-gloves",
            "slugs": [
              "touchscreen-gloves"
            ],
            "productCount": 0
          }
        ]
      },
      {
        "name": "Work Gloves",
        "slug": "work-gloves",
        "productTypes": [
          {
            "name": "General Work Gloves",
            "query": "subcategory=general-work-gloves",
            "slugs": [
              "general-work-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Leather Work Gloves",
            "query": "subcategory=leather-work-gloves",
            "slugs": [
              "leather-work-gloves"
            ],
            "productCount": 0
          },
          {
            "name": "Grip Gloves",
            "query": "subcategory=grip-gloves",
            "slugs": [
              "grip-gloves"
            ],
            "productCount": 0
          }
        ]
      }
    ]
  }
];

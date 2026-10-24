const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

// Read the taxonomy compiled from megaMenuData.ts or json
const taxonomy = [
  {
    id: "team-sports-wear",
    slug: "team-sports-wear",
    name: "Team Sports Wear",
    number: "01",
    image: "/categories/teamsports_wear.png",
    tagline: "High-performance team uniforms, match jerseys, and technical kits for professional athletics.",
    subcategories: [
      "Ice Hockey", "Soccer & Football", "American Football", "Basketball",
      "Baseball & Softball", "Cricket", "Rugby", "Lacrosse", "Volleyball", "Tennis & Golf"
    ],
    groups: [
      {
        name: "Ice Hockey",
        slug: "ice-hockey",
        productTypes: [
          { name: "Game Jerseys (Sublimated & Tackle Twill)", query: "subcategory=sublimated-game-jerseys,tackle-twill-embroidered-jerseys", slugs: ["sublimated-game-jerseys", "tackle-twill-embroidered-jerseys"], productCount: 10 },
          { name: "Practice Jerseys", query: "subcategory=practice-jerseys", slugs: ["practice-jerseys"], productCount: 5 },
          { name: "Hockey Socks", query: "subcategory=socks&q=hockey", slugs: ["socks"], productCount: 0, isPending: true },
          { name: "Shell Pants & Pant Shells", query: "subcategory=hockey-pant-shells,hockey-pants", slugs: ["hockey-pant-shells", "hockey-pants"], productCount: 2 }
        ]
      },
      {
        name: "Soccer & Football",
        slug: "soccer-football",
        productTypes: [
          { name: "Team Kits & Uniform Sets", query: "subcategory=soccer-team-kits,soccer-sets,soccer-uniforms,soccer-uniform", slugs: ["soccer-team-kits", "soccer-sets", "soccer-uniforms", "soccer-uniform"], productCount: 20 },
          { name: "Match & Custom Soccer Jerseys", query: "subcategory=custom-soccer-jerseys,soccerfootball", slugs: ["custom-soccer-jerseys", "soccerfootball"], productCount: 6 },
          { name: "Shorts", query: "subcategory=soccer-shorts", slugs: ["soccer-shorts"], productCount: 1 },
          { name: "Training Tops & Coach Uniforms", query: "subcategory=training-bibs,coach-uniforms", slugs: ["training-bibs", "coach-uniforms"], productCount: 20 },
          { name: "Goalkeeper Jerseys & Wear", query: "subcategory=goalkeeper-jerseys,goalkeeper-wear", slugs: ["goalkeeper-jerseys", "goalkeeper-wear"], productCount: 2 }
        ]
      },
      {
        name: "American Football",
        slug: "american-football",
        productTypes: [
          { name: "Game Jerseys & Team Uniforms", query: "subcategory=american-footbal-uniform,american-football-uniform", slugs: ["american-footbal-uniform", "american-football-uniform"], productCount: 2 },
          { name: "Practice Jerseys", query: "subcategory=american-footbal-uniform", slugs: ["american-footbal-uniform"], productCount: 2 },
          { name: "Football Pants", query: "subcategory=american-footbal-uniform&q=pants", slugs: ["american-footbal-uniform"], productCount: 0, isPending: true },
          { name: "Compression Tops", query: "subcategory=compression-shirts", slugs: ["compression-shirts"], productCount: 5 }
        ]
      },
      {
        name: "Basketball",
        slug: "basketball",
        productTypes: [
          { name: "Complete Uniforms & Sets", query: "subcategory=basketball-uniform,basketball", slugs: ["basketball-uniform", "basketball"], productCount: 8 },
          { name: "Jerseys", query: "subcategory=basketball-jerseys", slugs: ["basketball-jerseys"], productCount: 2 },
          { name: "Shorts", query: "subcategory=basketball-shorts", slugs: ["basketball-shorts"], productCount: 1 },
          { name: "Reversible Bibs", query: "subcategory=training-bibs", slugs: ["training-bibs"], productCount: 5 },
          { name: "Warm-Up Suits & Team Kits", query: "subcategory=basketball-warm-up-suits,basketball-team-kits", slugs: ["basketball-warm-up-suits", "basketball-team-kits"], productCount: 2 }
        ]
      },
      {
        name: "Baseball & Softball",
        slug: "baseball-softball",
        productTypes: [
          { name: "Button-Up Jerseys", query: "subcategory=baseball-jeresy", slugs: ["baseball-jeresy"], productCount: 3 },
          { name: "Pullover Jerseys", query: "subcategory=baseball-jeresy,baseball", slugs: ["baseball-jeresy", "baseball"], productCount: 3 },
          { name: "Pants", query: "subcategory=baseball-pants", slugs: ["baseball-pants"], productCount: 2 },
          { name: "Training Shirts & Gear Sets", query: "subcategory=baseball-hoodies,baseball-gear,baseball-equipment-set,baseball-uniform", slugs: ["baseball-hoodies", "baseball-gear", "baseball-equipment-set", "baseball-uniform"], productCount: 8 }
        ]
      },
      {
        name: "Cricket",
        slug: "cricket",
        productTypes: [
          { name: "Match Shirts", query: "subcategory=cricket-uniform", slugs: ["cricket-uniform"], productCount: 12 },
          { name: "T20 Jerseys", query: "subcategory=cricket-uniform", slugs: ["cricket-uniform"], productCount: 12 },
          { name: "Trousers", query: "subcategory=cricket-uniform", slugs: ["cricket-uniform"], productCount: 12 },
          { name: "Training Kits", query: "subcategory=cricket-uniform", slugs: ["cricket-uniform"], productCount: 12 }
        ]
      },
      {
        name: "Rugby",
        slug: "rugby",
        productTypes: [
          { name: "Match Jerseys", query: "subcategory=rugby-uniform", slugs: ["rugby-uniform"], productCount: 4 },
          { name: "Shorts", query: "subcategory=rugby-uniform", slugs: ["rugby-uniform"], productCount: 4 },
          { name: "Training Tops", query: "subcategory=rugby-uniform", slugs: ["rugby-uniform"], productCount: 4 },
          { name: "Team Kits", query: "subcategory=rugby-uniform", slugs: ["rugby-uniform"], productCount: 4 }
        ]
      },
      {
        name: "Lacrosse",
        slug: "lacrosse",
        productTypes: [
          { name: "Game Jerseys", query: "subcategory=lacrosse", slugs: ["lacrosse"], productCount: 6 },
          { name: "Shorts", query: "subcategory=lacrosse", slugs: ["lacrosse"], productCount: 6 },
          { name: "Practice Pinnies", query: "subcategory=lacrosse", slugs: ["lacrosse"], productCount: 6 },
          { name: "Team Kits", query: "subcategory=lacrosse", slugs: ["lacrosse"], productCount: 6 }
        ]
      },
      {
        name: "Volleyball",
        slug: "volleyball",
        productTypes: [
          { name: "Team Kits & Match Uniforms", query: "subcategory=volleyball-uniform,volleyball", slugs: ["volleyball-uniform", "volleyball"], productCount: 29 },
          { name: "Jerseys", query: "subcategory=volleyball-jersey", slugs: ["volleyball-jersey"], productCount: 2 },
          { name: "Shorts & Spandex", query: "subcategory=volleyball-shorts,volleyball-shorts-spandex", slugs: ["volleyball-shorts", "volleyball-shorts-spandex"], productCount: 4 },
          { name: "Training Tops & Wear", query: "subcategory=volleyball-training-wear,volleyball-accessories", slugs: ["volleyball-training-wear", "volleyball-accessories"], productCount: 3 }
        ]
      },
      {
        name: "Tennis & Golf",
        slug: "tennis-golf",
        productTypes: [
          { name: "Polo Shirts & Match Tops", query: "subcategory=polo-shirts,polo", slugs: ["polo-shirts", "polo"], productCount: 12 },
          { name: "Performance Tops & Golf Wear", query: "subcategory=tennis,golf", slugs: ["tennis", "golf"], productCount: 24 },
          { name: "Shorts & Tennis Bottoms", query: "subcategory=shorts,tennis", slugs: ["shorts", "tennis"], productCount: 40 },
          { name: "Skirts & Skorts", query: "subcategory=skirts", slugs: ["skirts"], productCount: 1 }
        ]
      }
    ]
  },

  {
    id: "martial-arts-combat-wear",
    slug: "martial-arts-combat-wear",
    name: "Martial Arts & Combat Wear",
    number: "02",
    image: "/categories/martial arts.png",
    tagline: "Championship BJJ gis, fight rash guards, compression singlets, and combat apparel.",
    subcategories: [
      "BJJ & Grappling", "MMA", "Boxing & Muay Thai", "Karate", "Judo", "Taekwondo", "Wrestling"
    ],
    groups: [
      {
        name: "BJJ & Grappling",
        slug: "bjj-grappling",
        productTypes: [
          { name: "BJJ Gis", query: "subcategory=jiu-jitsu", slugs: ["jiu-jitsu"], productCount: 12 },
          { name: "Rash Guards & Combat Training Tops", query: "subcategory=combat-training-wear,combat-sports", slugs: ["combat-training-wear", "combat-sports"], productCount: 143 },
          { name: "Grappling Shorts", query: "subcategory=combat-teamwear", slugs: ["combat-teamwear"], productCount: 5 },
          { name: "Spats & Compression Tights", query: "subcategory=compression-pants", slugs: ["compression-pants"], productCount: 5 }
        ]
      },
      {
        name: "MMA",
        slug: "mma",
        productTypes: [
          { name: "Fight Shorts (Full Contact & Kick Boxing)", query: "subcategory=full-contact,kick-boxing", slugs: ["full-contact", "kick-boxing"], productCount: 20 },
          { name: "Rash Guards", query: "subcategory=combat-sports", slugs: ["combat-sports"], productCount: 138 },
          { name: "Compression Shorts", query: "subcategory=compression-shorts", slugs: ["compression-shorts"], productCount: 5 },
          { name: "Training Shirts", query: "subcategory=combat-training-wear", slugs: ["combat-training-wear"], productCount: 5 }
        ]
      },
      {
        name: "Boxing & Muay Thai",
        slug: "boxing-muay-thai",
        productTypes: [
          { name: "Boxing Shorts", query: "subcategory=boxing", slugs: ["boxing"], productCount: 10 },
          { name: "Muay Thai Shorts", query: "subcategory=muay-thai", slugs: ["muay-thai"], productCount: 12 },
          { name: "Boxing Singlets", query: "subcategory=boxing", slugs: ["boxing"], productCount: 10 },
          { name: "Training Tracksuits", query: "subcategory=combat-teamwear", slugs: ["combat-teamwear"], productCount: 5 }
        ]
      },
      {
        name: "Karate",
        slug: "karate",
        productTypes: [
          { name: "Training Gis", query: "subcategory=karate", slugs: ["karate"], productCount: 14 },
          { name: "Competition Gis", query: "subcategory=karate", slugs: ["karate"], productCount: 14 },
          { name: "Belts", query: "subcategory=karate", slugs: ["karate"], productCount: 14 }
        ]
      },
      {
        name: "Judo",
        slug: "judo",
        productTypes: [
          { name: "Training Gis", query: "subcategory=judo-uniform", slugs: ["judo-uniform"], productCount: 14 },
          { name: "Competition Gis", query: "subcategory=judo-uniform", slugs: ["judo-uniform"], productCount: 14 },
          { name: "Belts", query: "subcategory=judo-uniform", slugs: ["judo-uniform"], productCount: 14 }
        ]
      },
      {
        name: "Taekwondo",
        slug: "taekwondo",
        productTypes: [
          { name: "Training Doboks", query: "subcategory=taekwondo", slugs: ["taekwondo"], productCount: 12 },
          { name: "Competition Doboks", query: "subcategory=taekwondo", slugs: ["taekwondo"], productCount: 12 },
          { name: "Belts", query: "subcategory=taekwondo", slugs: ["taekwondo"], productCount: 12 }
        ]
      },
      {
        name: "Wrestling",
        slug: "wrestling",
        productTypes: [
          { name: "Singlets & Wrestling Uniforms", query: "subcategory=wresting-uniform,wrestling", slugs: ["wresting-uniform", "wrestling"], productCount: 11 },
          { name: "Compression Tops", query: "subcategory=compression-shirts", slugs: ["compression-shirts"], productCount: 5 },
          { name: "Training Shorts", query: "subcategory=compression-shorts", slugs: ["compression-shorts"], productCount: 5 }
        ]
      }
    ]
  },

  {
    id: "activewear-fitness",
    slug: "activewear-fitness",
    name: "Activewear & Fitness",
    number: "03",
    image: "/categories/activewear.png",
    tagline: "Engineered 4-way stretch gym wear, compression layers, and women’s performance activewear.",
    subcategories: [
      "Gym & Training Wear", "Compression Wear", "Women’s Activewear", "Running & Athletics", "Cycling Wear"
    ],
    groups: [
      {
        name: "Gym & Training Wear",
        slug: "gym-training-wear",
        productTypes: [
          { name: "Gym T-Shirts & Technical Tees", query: "subcategory=fitness-apparel,t-shirts", slugs: ["fitness-apparel", "t-shirts"], productCount: 58 },
          { name: "Tank Tops", query: "subcategory=fitness-apparel", slugs: ["fitness-apparel"], productCount: 36 },
          { name: "Stringers", query: "subcategory=fitness-apparel", slugs: ["fitness-apparel"], productCount: 36 },
          { name: "Training Shorts & Gym Bottoms", query: "subcategory=compression-shorts,shorts", slugs: ["compression-shorts", "shorts"], productCount: 27 },
          { name: "Joggers & Training Trousers", query: "subcategory=training-trousers,trousers", slugs: ["training-trousers", "trousers"], productCount: 15 }
        ]
      },
      {
        name: "Compression Wear",
        slug: "compression-wear",
        productTypes: [
          { name: "Short-Sleeve Tops", query: "subcategory=compression-shirts", slugs: ["compression-shirts"], productCount: 5 },
          { name: "Long-Sleeve Tops & Base Layers", query: "subcategory=compression-shirts,base-layers", slugs: ["compression-shirts", "base-layers"], productCount: 10 },
          { name: "Compression Shorts", query: "subcategory=compression-shorts", slugs: ["compression-shorts"], productCount: 5 },
          { name: "Full-Length Tights & Pants", query: "subcategory=compression-pants,cycling-bib-tights", slugs: ["compression-pants", "cycling-bib-tights"], productCount: 10 }
        ]
      },
      {
        name: "Women’s Activewear",
        slug: "womens-activewear",
        productTypes: [
          { name: "Sports Bras", query: "subcategory=bras-legging", slugs: ["bras-legging"], productCount: 5 },
          { name: "Leggings", query: "subcategory=bras-legging", slugs: ["bras-legging"], productCount: 5 },
          { name: "Workout Shorts", query: "subcategory=compression-shorts", slugs: ["compression-shorts"], productCount: 5 },
          { name: "Tank Tops", query: "subcategory=yoga-wear", slugs: ["yoga-wear"], productCount: 2 },
          { name: "Matching Sets", query: "subcategory=fitness-sets", slugs: ["fitness-sets"], productCount: 5 }
        ]
      },
      {
        name: "Running & Athletics",
        slug: "running-athletics",
        productTypes: [
          { name: "Running Singlets", query: "subcategory=running-wear", slugs: ["running-wear"], productCount: 4 },
          { name: "Performance Shirts & Athletics", query: "subcategory=running-wear,athletic-uniforms", slugs: ["running-wear", "athletic-uniforms"], productCount: 9 },
          { name: "Running Shorts & Athletics Bottoms", query: "subcategory=running-wear,shorts", slugs: ["running-wear", "shorts"], productCount: 26 },
          { name: "Track Uniforms", query: "subcategory=track-field-hurdling", slugs: ["track-field-hurdling"], productCount: 5 }
        ]
      },
      {
        name: "Cycling Wear",
        slug: "cycling-wear",
        productTypes: [
          { name: "Cycling Jerseys & Shirts", query: "subcategory=cycling-shirts,cycling-uniform", slugs: ["cycling-shirts", "cycling-uniform"], productCount: 23 },
          { name: "Cycling Shorts", query: "subcategory=cycling-shorts", slugs: ["cycling-shorts"], productCount: 5 },
          { name: "Bib Shorts", query: "subcategory=cycling-bib-tights", slugs: ["cycling-bib-tights"], productCount: 5 },
          { name: "Cycling Jackets", query: "subcategory=cycling-uniform", slugs: ["cycling-uniform"], productCount: 18 }
        ]
      }
    ]
  },

  {
    id: "casual-lifestyle-wear",
    slug: "casual-lifestyle-wear",
    name: "Casual & Lifestyle Wear",
    number: "04",
    image: "/categories/casualwear.png",
    tagline: "Heavyweight 450 GSM French terry hoodies, crewnecks, oversized tees, and tailored tracksuits.",
    subcategories: [
      "T-Shirts & Tops", "Hoodies & Sweatshirts", "Tracksuits & Matching Sets", "Pants & Bottoms"
    ],
    groups: [
      {
        name: "T-Shirts & Tops",
        slug: "t-shirts-tops",
        productTypes: [
          { name: "Crew-Neck T-Shirts", query: "subcategory=t-shirts", slugs: ["t-shirts"], productCount: 22 },
          { name: "V-Neck T-Shirts", query: "subcategory=t-shirts", slugs: ["t-shirts"], productCount: 22 },
          { name: "Oversized T-Shirts", query: "subcategory=t-shirts", slugs: ["t-shirts"], productCount: 22 },
          { name: "Polo Shirts", query: "subcategory=polo-shirts", slugs: ["polo-shirts"], productCount: 6 }
        ]
      },
      {
        name: "Hoodies & Sweatshirts",
        slug: "hoodies-sweatshirts",
        productTypes: [
          { name: "Pullover Hoodies", query: "subcategory=hoodies", slugs: ["hoodies"], productCount: 19 },
          { name: "Zip-Up Hoodies", query: "subcategory=hoodies", slugs: ["hoodies"], productCount: 19 },
          { name: "Oversized Hoodies", query: "subcategory=hoodies", slugs: ["hoodies"], productCount: 19 },
          { name: "Crew-Neck Sweatshirts & Sweaters", query: "subcategory=sweat-shirts,sweat-shirt,sweaters", slugs: ["sweat-shirts", "sweat-shirt", "sweaters"], productCount: 21 }
        ]
      },
      {
        name: "Tracksuits & Matching Sets",
        slug: "tracksuits-sets",
        productTypes: [
          { name: "Training Tracksuits", query: "subcategory=track-suits", slugs: ["track-suits"], productCount: 5 },
          { name: "Sweat Suits", query: "subcategory=sweat-suits", slugs: ["sweat-suits"], productCount: 9 },
          { name: "Hoodie & Jogger Sets", query: "subcategory=sweat-suits", slugs: ["sweat-suits"], productCount: 9 },
          { name: "Sweatshirt & Shorts Sets", query: "subcategory=sweat-suits", slugs: ["sweat-suits"], productCount: 9 }
        ]
      },
      {
        name: "Pants & Bottoms",
        slug: "pants-bottoms",
        productTypes: [
          { name: "Joggers & Pants", query: "subcategory=pants,trousers", slugs: ["pants", "trousers"], productCount: 19 },
          { name: "Sweatpants", query: "subcategory=sweat-pants", slugs: ["sweat-pants"], productCount: 5 },
          { name: "Track Pants", query: "subcategory=training-trousers", slugs: ["training-trousers"], productCount: 5 },
          { name: "Casual Shorts", query: "subcategory=shorts", slugs: ["shorts"], productCount: 22 },
          { name: "Cargo Pants & Denim Jeans", query: "subcategory=pants,denim-jeans", slugs: ["pants", "denim-jeans"], productCount: 14 }
        ]
      }
    ]
  },

  {
    id: "jackets-outerwear",
    slug: "jackets-outerwear",
    name: "Jackets & Outerwear",
    number: "05",
    image: "/categories/jacket wear.png",
    tagline: "Authentic wool & leather varsity jackets, technical softshells, windbreakers, and weather armor.",
    subcategories: [
      "Varsity Jackets", "Leather Jackets", "Softshell Jackets", "Windbreakers", "Winter Wear", "Rainwear"
    ],
    groups: [
      {
        name: "Varsity Jackets",
        slug: "varsity-jackets",
        productTypes: [
          { name: "Wool Varsity Jackets", query: "subcategory=jackets", slugs: ["jackets"], productCount: 17 },
          { name: "Fleece Varsity Jackets", query: "subcategory=jackets", slugs: ["jackets"], productCount: 17 },
          { name: "Leather-Sleeve Varsity Jackets", query: "subcategory=leather-jackets", slugs: ["leather-jackets"], productCount: 5 }
        ]
      },
      {
        name: "Leather Jackets",
        slug: "leather-jackets",
        productTypes: [
          { name: "Biker Jackets", query: "subcategory=leather-jackets", slugs: ["leather-jackets"], productCount: 5 },
          { name: "Bomber Jackets", query: "subcategory=bomber-jackets", slugs: ["bomber-jackets"], productCount: 5 },
          { name: "Casual Leather Jackets & Vests", query: "subcategory=leather-jackets,leather-vests", slugs: ["leather-jackets", "leather-vests"], productCount: 9 }
        ]
      },
      {
        name: "Softshell Jackets",
        slug: "softshell-jackets",
        productTypes: [
          { name: "Full-Zip Softshell & Coach Jackets", query: "subcategory=jackets,coach-jackets", slugs: ["jackets", "coach-jackets"], productCount: 22 },
          { name: "Hooded Softshell Jackets", query: "subcategory=jackets", slugs: ["jackets"], productCount: 17 }
        ]
      },
      {
        name: "Windbreakers",
        slug: "windbreakers",
        productTypes: [
          { name: "Hooded Windbreakers", query: "subcategory=wind-breaker-set", slugs: ["wind-breaker-set"], productCount: 9 },
          { name: "Full-Zip Windbreakers", query: "subcategory=wind-breaker-set", slugs: ["wind-breaker-set"], productCount: 9 },
          { name: "Pullover Windbreakers", query: "subcategory=wind-breaker-set", slugs: ["wind-breaker-set"], productCount: 9 }
        ]
      },
      {
        name: "Winter Wear",
        slug: "winter-wear",
        productTypes: [
          { name: "Puffer Jackets", query: "subcategory=puffer-jackets", slugs: ["puffer-jackets"], productCount: 5 },
          { name: "Fleece Jackets & Coats", query: "subcategory=sweaters,coats", slugs: ["sweaters", "coats"], productCount: 19 },
          { name: "Thermal Tops", query: "subcategory=base-layers", slugs: ["base-layers"], productCount: 5 },
          { name: "Thermal Bottoms", query: "subcategory=compression-pants", slugs: ["compression-pants"], productCount: 5 }
        ]
      },
      {
        name: "Rainwear",
        slug: "rainwear",
        productTypes: [
          { name: "Rain Jackets", query: "subcategory=safety-rain-wear", slugs: ["safety-rain-wear"], productCount: 5 },
          { name: "Waterproof Pants", query: "subcategory=safety-rain-wear", slugs: ["safety-rain-wear"], productCount: 5 },
          { name: "Rain Suits", query: "subcategory=safety-rain-wear", slugs: ["safety-rain-wear"], productCount: 5 },
          { name: "Lightweight Rain Shells", query: "subcategory=safety-rain-wear", slugs: ["safety-rain-wear"], productCount: 5 }
        ]
      }
    ]
  },

  {
    id: "kids-youth-wear",
    slug: "kids-youth-wear",
    name: "Kids & Youth Wear",
    number: "06",
    image: "/categories/kids wear.png",
    tagline: "Durable, junior-cut athletic teamwear, activewear, training hoodies, and tracksuits.",
    subcategories: [
      "Youth Team Uniforms", "Kids’ Activewear", "Kids’ T-Shirts", "Kids’ Hoodies", "Kids’ Tracksuits"
    ],
    groups: [
      {
        name: "Youth Team Uniforms",
        slug: "youth-team-uniforms",
        productTypes: [
          { name: "Hockey Uniforms", query: "subcategory=ice-hockey-clothing&q=youth", slugs: ["ice-hockey-clothing"], productCount: 0, isPending: true },
          { name: "Soccer Kits", query: "subcategory=soccer-uniform&q=youth", slugs: ["soccer-uniform"], productCount: 0, isPending: true },
          { name: "Basketball Uniforms", query: "subcategory=basketball-uniform&q=youth", slugs: ["basketball-uniform"], productCount: 0, isPending: true },
          { name: "Baseball Uniforms", query: "subcategory=baseball-uniform&q=youth", slugs: ["baseball-uniform"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Kids’ Activewear",
        slug: "kids-activewear",
        productTypes: [
          { name: "Training Shirts", query: "subcategory=fitness-apparel&q=kids", slugs: ["fitness-apparel"], productCount: 0, isPending: true },
          { name: "Training Shorts", query: "subcategory=shorts&q=kids", slugs: ["shorts"], productCount: 0, isPending: true },
          { name: "Leggings", query: "subcategory=bras-legging&q=kids", slugs: ["bras-legging"], productCount: 0, isPending: true },
          { name: "Joggers", query: "subcategory=training-trousers&q=kids", slugs: ["training-trousers"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Kids’ T-Shirts",
        slug: "kids-t-shirts",
        productTypes: [
          { name: "Crew-Neck T-Shirts", query: "subcategory=t-shirts&q=kids", slugs: ["t-shirts"], productCount: 0, isPending: true },
          { name: "Polo Shirts", query: "subcategory=polo-shirts&q=kids", slugs: ["polo-shirts"], productCount: 0, isPending: true },
          { name: "Printed T-Shirts", query: "subcategory=t-shirts&q=printed", slugs: ["t-shirts"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Kids’ Hoodies",
        slug: "kids-hoodies",
        productTypes: [
          { name: "Pullover Hoodies", query: "subcategory=hoodies&q=kids", slugs: ["hoodies"], productCount: 0, isPending: true },
          { name: "Zip-Up Hoodies", query: "subcategory=hoodies&q=zip", slugs: ["hoodies"], productCount: 0, isPending: true },
          { name: "Sweatshirts", query: "subcategory=sweat-shirts&q=kids", slugs: ["sweat-shirts"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Kids’ Tracksuits",
        slug: "kids-tracksuits",
        productTypes: [
          { name: "Training Tracksuits", query: "subcategory=track-suits&q=kids", slugs: ["track-suits"], productCount: 0, isPending: true },
          { name: "Hoodie & Jogger Sets", query: "subcategory=sweat-suits&q=kids", slugs: ["sweat-suits"], productCount: 0, isPending: true },
          { name: "Sweat Suits", query: "subcategory=sweat-suits&q=junior", slugs: ["sweat-suits"], productCount: 0, isPending: true }
        ]
      }
    ]
  },

  {
    id: "workwear-medical-wear",
    slug: "workwear-medical-wear",
    name: "Workwear & Medical Wear",
    number: "07",
    image: "/categories/work wear.png",
    tagline: "Antimicrobial medical scrubs, industrial work uniforms, and corporate utility polo shirts.",
    subcategories: [
      "Medical Scrubs", "Work Uniforms", "Work Polo Shirts"
    ],
    groups: [
      {
        name: "Medical Scrubs",
        slug: "medical-scrubs",
        productTypes: [
          { name: "Scrub Tops", query: "subcategory=scrub-suit", slugs: ["scrub-suit"], productCount: 19 },
          { name: "Scrub Pants", query: "subcategory=scrub-suit", slugs: ["scrub-suit"], productCount: 19 },
          { name: "Complete Scrub Sets", query: "subcategory=scrub-suit", slugs: ["scrub-suit"], productCount: 19 }
        ]
      },
      {
        name: "Work Uniforms",
        slug: "work-uniforms",
        productTypes: [
          { name: "Work Shirts & Coverall Suits", query: "subcategory=shirts,safety-suits,safety-coveralls", slugs: ["shirts", "safety-suits", "safety-coveralls"], productCount: 15 },
          { name: "Work Trousers", query: "subcategory=trousers", slugs: ["trousers"], productCount: 10 },
          { name: "Work Jackets & High-Vis Vests", query: "subcategory=safety-wear,vests", slugs: ["safety-wear", "vests"], productCount: 79 }
        ]
      },
      {
        name: "Work Polo Shirts",
        slug: "work-polo-shirts",
        productTypes: [
          { name: "Short-Sleeve Polos", query: "subcategory=polo-shirts", slugs: ["polo-shirts"], productCount: 6 },
          { name: "Long-Sleeve Polos", query: "subcategory=polo-shirts", slugs: ["polo-shirts"], productCount: 6 },
          { name: "Embroidered Logo Polos", query: "subcategory=polo-shirts", slugs: ["polo-shirts"], productCount: 6 }
        ]
      }
    ]
  },

  {
    id: "sports-accessories",
    slug: "sports-accessories",
    name: "Sports Accessories",
    number: "08",
    image: "/categories/Vibrant Multisport Gear Court Flat Lay.png",
    tagline: "Essential on-field gear: high-density team socks, reversible training bibs, caps, and bands.",
    subcategories: [
      "Team Socks", "Training Bibs", "Caps", "Headbands", "Wristbands"
    ],
    groups: [
      {
        name: "Team Socks",
        slug: "team-socks",
        productTypes: [
          { name: "Hockey Socks", query: "subcategory=socks", slugs: ["socks"], productCount: 10 },
          { name: "Soccer Socks", query: "subcategory=socks", slugs: ["socks"], productCount: 10 },
          { name: "Training Socks", query: "subcategory=socks", slugs: ["socks"], productCount: 10 }
        ]
      },
      {
        name: "Training Bibs",
        slug: "training-bibs",
        productTypes: [
          { name: "Single-Layer Bibs", query: "subcategory=training-bibs", slugs: ["training-bibs"], productCount: 5 },
          { name: "Reversible Bibs", query: "subcategory=training-bibs", slugs: ["training-bibs"], productCount: 5 },
          { name: "Mesh Bibs", query: "subcategory=training-bibs", slugs: ["training-bibs"], productCount: 5 }
        ]
      },
      {
        name: "Caps",
        slug: "caps",
        productTypes: [
          { name: "Baseball Caps & Honours Caps", query: "subcategory=caps,honours-caps", slugs: ["caps", "honours-caps"], productCount: 15 },
          { name: "Trucker Caps", query: "subcategory=caps", slugs: ["caps"], productCount: 5 },
          { name: "Sports Visors", query: "subcategory=visor", slugs: ["visor"], productCount: 4 }
        ]
      },
      {
        name: "Headbands",
        slug: "headbands",
        productTypes: [
          { name: "Sports Headbands & Headwear", query: "subcategory=head-wear,headwear", slugs: ["head-wear", "headwear"], productCount: 10 },
          { name: "Running Headbands", query: "subcategory=headwear", slugs: ["headwear"], productCount: 5 },
          { name: "Winter Headbands, Beanies & Masks", query: "subcategory=beanie,balaclavas-ski-masks", slugs: ["beanie", "balaclavas-ski-masks"], productCount: 12 }
        ]
      },
      {
        name: "Wristbands",
        slug: "wristbands",
        productTypes: [
          { name: "Sweatbands", query: "subcategory=fitness-accessories", slugs: ["fitness-accessories"], productCount: 33 },
          { name: "Embroidered Wristbands", query: "subcategory=fitness-accessories", slugs: ["fitness-accessories"], productCount: 33 },
          { name: "Printed Wristbands", query: "subcategory=fitness-accessories", slugs: ["fitness-accessories"], productCount: 33 }
        ]
      }
    ]
  },

  {
    id: "gloves",
    slug: "gloves",
    name: "Gloves",
    number: "09",
    image: "/categories/gloves.png",
    tagline: "Specialized performance gloves for ice hockey, boxing, MMA, goalkeeper, batting, and cycling.",
    subcategories: [
      "Ice Hockey Gloves", "Goalkeeper Gloves", "Cricket Batting Gloves", "Baseball Batting Gloves",
      "Boxing Gloves", "MMA Gloves", "Gym & Weightlifting Gloves", "Cycling Gloves", "Winter Gloves", "Work Gloves"
    ],
    groups: [
      {
        name: "Ice Hockey Gloves",
        slug: "ice-hockey-gloves",
        productTypes: [
          { name: "Youth Hockey Gloves", query: "subcategory=gloves&q=hockey", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Senior Hockey Gloves", query: "subcategory=gloves&q=hockey", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Practice Hockey Gloves", query: "subcategory=gloves&q=hockey", slugs: ["gloves"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Goalkeeper Gloves",
        slug: "goalkeeper-gloves",
        productTypes: [
          { name: "Training Gloves", query: "subcategory=gloves&q=goalkeeper", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Match Gloves", query: "subcategory=gloves&q=goalkeeper", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Finger-Protection Gloves", query: "subcategory=gloves&q=protection", slugs: ["gloves"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Cricket Batting Gloves",
        slug: "cricket-batting-gloves",
        productTypes: [
          { name: "Youth Batting Gloves", query: "subcategory=gloves&q=cricket", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Adult Batting Gloves", query: "subcategory=gloves&q=cricket", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Training Batting Gloves", query: "subcategory=gloves&q=cricket", slugs: ["gloves"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Baseball Batting Gloves",
        slug: "baseball-batting-gloves",
        productTypes: [
          { name: "Youth Batting Gloves", query: "subcategory=gloves&q=baseball", slugs: ["gloves"], productCount: 0, isPending: true },
          { name: "Adult Batting Gloves", query: "subcategory=gloves&q=baseball", slugs: ["gloves"], productCount: 0, isPending: true }
        ]
      },
      {
        name: "Boxing Gloves",
        slug: "boxing-gloves",
        productTypes: [
          { name: "Training Gloves & Boxing Gear", query: "subcategory=boxing,gloves", slugs: ["boxing", "gloves"], productCount: 108 },
          { name: "Sparring Gloves", query: "subcategory=boxing", slugs: ["boxing"], productCount: 10 },
          { name: "Bag Gloves", query: "subcategory=boxing", slugs: ["boxing"], productCount: 10 }
        ]
      },
      {
        name: "MMA Gloves",
        slug: "mma-gloves",
        productTypes: [
          { name: "Competition Gloves & Combat Handwear", query: "subcategory=combat-sports,gloves", slugs: ["combat-sports", "gloves"], productCount: 236 },
          { name: "Sparring Gloves", query: "subcategory=combat-sports", slugs: ["combat-sports"], productCount: 138 },
          { name: "Training Gloves", query: "subcategory=combat-sports", slugs: ["combat-sports"], productCount: 138 }
        ]
      },
      {
        name: "Gym & Weightlifting Gloves",
        slug: "gym-weightlifting-gloves",
        productTypes: [
          { name: "Fingerless Gym Gloves", query: "subcategory=weightlifting-gloves", slugs: ["weightlifting-gloves"], productCount: 6 },
          { name: "Full-Finger Gym Gloves", query: "subcategory=weightlifting-gloves", slugs: ["weightlifting-gloves"], productCount: 6 },
          { name: "Wrist-Support Gloves", query: "subcategory=weightlifting-gloves", slugs: ["weightlifting-gloves"], productCount: 6 }
        ]
      },
      {
        name: "Cycling Gloves",
        slug: "cycling-gloves",
        productTypes: [
          { name: "Short-Finger Cycling Gloves", query: "subcategory=custom-cycling-gloves", slugs: ["custom-cycling-gloves"], productCount: 6 },
          { name: "Full-Finger Cycling Gloves", query: "subcategory=custom-cycling-gloves", slugs: ["custom-cycling-gloves"], productCount: 6 },
          { name: "Winter Cycling Gloves", query: "subcategory=custom-cycling-gloves", slugs: ["custom-cycling-gloves"], productCount: 6 }
        ]
      },
      {
        name: "Winter Gloves",
        slug: "winter-gloves",
        productTypes: [
          { name: "Fleece Gloves & Snow Mittens", query: "subcategory=snow-glove,mittens-glove", slugs: ["snow-glove", "mittens-glove"], productCount: 11 },
          { name: "Insulated Gloves", query: "subcategory=snow-glove", slugs: ["snow-glove"], productCount: 6 },
          { name: "Touchscreen Gloves", query: "subcategory=snow-glove", slugs: ["snow-glove"], productCount: 6 }
        ]
      },
      {
        name: "Work Gloves",
        slug: "work-gloves",
        productTypes: [
          { name: "General Work Gloves", query: "subcategory=safety-gloves", slugs: ["safety-gloves"], productCount: 4 },
          { name: "Leather Work Gloves", query: "subcategory=leather-gloves", slugs: ["leather-gloves"], productCount: 5 },
          { name: "Grip & Cut-Resistant Gloves", query: "subcategory=custom-cut-resistant,safety-gloves", slugs: ["custom-cut-resistant", "safety-gloves"], productCount: 9 }
        ]
      }
    ]
  }
];

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

async function main() {
  console.log('Deploying 9-pillar 3-level Header Mega Menu to Live Database...');
  const jsonPayload = JSON.stringify(taxonomy);
  const tempFile = path.resolve(__dirname, '../taxonomy_payload.json');
  fs.writeFileSync(tempFile, jsonPayload, 'utf8');

  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connection established.');
  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  await new Promise((resolve, reject) => {
    sftp.fastPut(tempFile, `${REMOTE_BACKEND}/taxonomy_payload.json`, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ Taxonomy payload uploaded to live server.');

  const phpCommand = `
    cd ${REMOTE_BACKEND} && php -r "
      require 'vendor/autoload.php';
      \\$app = require_once 'bootstrap/app.php';
      \\$app->make(Illuminate\\\\Contracts\\\\Console\\\\Kernel::class)->bootstrap();
      \\$json = file_get_contents('taxonomy_payload.json');
      \\$data = json_decode(\\$json, true);
      App\\\\Models\\\\Setting::set('header_mega_menu', \\$data, 'appearance', 'json');
      echo 'SUCCESS: header_mega_menu updated in live DB with ' . count(\\$data) . ' pillars!\\\\n';
      unlink('taxonomy_payload.json');
    " && php artisan cache:clear && php artisan config:clear
  `;

  await new Promise((resolve, reject) => {
    conn.exec(phpCommand, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed with ${code}`)));
    });
  });

  conn.end();
  fs.unlinkSync(tempFile);
  console.log('\n✓ Live Database successfully updated with Client\'s 3-Level Mega Menu!');
}

main().catch(console.error);

# CM SPORTS WEAR — Performance Apparel & OEM Manufacturing Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Facility](https://img.shields.io/badge/Facility-SCCI%20%26%20PHMA%20Certified-red?style=flat)](https://github.com/Malihakhan01/cm_wear)
[![Standard](https://img.shields.io/badge/QC%20Standard-AQL%202.5-black?style=flat)](https://github.com/Malihakhan01/cm_wear)

**CM SPORTS WEAR** (Care Master Sports Wear) is an advanced vertical export manufacturer of technical athletic clothing, combat sportswear, teamwear, outerwear, and private-label apparel based in Sialkot, Pakistan. This portal provides an interactive B2B/B2C manufacturing experience for global sportswear labels, sporting clubs, retail brands, and international distributors.

---

## 🌟 Core Features

### 1. Interactive 3D/2D Apparel Customizer Studio (`/customize/[slug]`)
- **Real-Time Fabric & Color Grading:** Customize garment panels, collar, cuffs, and trim with CM signature palettes and Pantone PMS dye matching.
- **Monogram & Embroidery Generator:** Live multi-font text preview with automated stitch simulation, scale adjustments, and position mapping.
- **Dynamic Size Breakdown Matrix:** Split orders across size tiers (`XS` to `3XL`) with instant total piece and unit pricing calculation.
- **Sample Ordering & RFQ Handoff:** Instantly add customized prototypes to cart or submit as technical factory tech-packs.

### 2. 9 Specialized Apparel Categories (`/catalog`)
Full filterable catalog supporting the 9 Care Master manufacturing pillars:
1. **01 Team Sports Wear:** Ice Hockey, Soccer, Basketball, American Football, Baseball, Cricket, Rugby, Volleyball, Tennis, Cheerleading.
2. **02 Martial Arts & Combat Wear:** Boxing, MMA, Brazilian Jiu-Jitsu (BJJ), Judo, Karate, Taekwondo, Kickboxing, Muay Thai, Wrestling.
3. **03 Activewear & Fitness:** Gym & Training, Yoga & Pilates, Technical Compression Wear, Athleisure.
4. **04 Casual & Lifestyle Wear:** Premium Heavyweight French Terry Hoodies (450 GSM), Streetwear Tees, Polos, Loungewear.
5. **05 Jackets & Outerwear:** 24 oz Melton Wool Varsity Jackets, Bonded Softshell Jackets, Puffer Coats, Windbreakers.
6. **06 Kids & Youth Wear:** Youth Sports Uniforms, Kids Activewear, Coordinated School & Club Wear.
7. **07 Workwear & Medical Wear:** Medical Scrubs & Lab Coats, High-Visibility Safety Apparel, Industrial Uniforms.
8. **08 Sports Accessories:** Multisport Court Gear, Sports Bags, Headwear, Socks & Performance Sleeves.
9. **09 Gloves:** Performance Sports Gloves, Fitness & Weightlifting Gloves, Safety & Tactical Gloves.

### 3. Factory Publications & Verified Credentials
- **Official PDF Catalogs (`/catalogs`):** 8 high-resolution master publications covering Teamwear, Ice Hockey, Varsity Jackets, Martial Arts, Boxing, Fitness, Compression Wear, and Tactical Workwear.
- **Legal Certifications (`/certifications`):** Direct verified accreditation PDFs from the Sialkot Chamber of Commerce & Industry (SCCI), Pakistan Hosiery Manufacturers & Exporters Association (PHMA), and Surgical Association.

### 4. Sialkot Campus Virtual Tour & Global Exhibitions
- **Production Video Tour:** Interactive station video player showcasing raw pattern cutting, computerized Tajima embroidery, optical needle detection, and cleanroom export packaging.
- **Two Decades of Trade Exhibitions:** Historical archive highlighting international stands at ISPO Munich (2005 & 2013), The Super Show USA (2007), and Expo Karachi.

### 5. Dual Purchasing Modes (Wholesale vs. Retail)
- **Wholesale Mode:** Activates factory tiered pricing (Tier 1: 50–199 pcs, Tier 2: 200–499 pcs, Tier 3: 500–2,500+ pcs) with volume discount incentives.
- **Retail Mode:** Single-piece sample pricing for prototype development and showroom validation.

### 6. B2B Factory Quotation Wizard (`/request-quote`)
- Interactive multi-step RFQ wizard with automated volume discount pricing.
- Integrated file upload pipeline for vector artworks (`.ai`, `.eps`, `.pdf`) and measurement tech-packs.
- Direct lead handoff to factory sales technicians via WhatsApp and automated inquiry emails.

### 7. Live Production & Shipment Tracker (`/track-order`)
- Track manufacturing milestones across 10 vertical factory stages:
  - CAD Pattern Development → Yarn Knitting → CNC Cutting → Sublimation / Printing → Tajima Embroidery → Stitching → Needle Scan Inspection → Custom Packaging → Export Customs Dispatch.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router with Turbopack) |
| **UI Library** | React 19 (Server & Client Components) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 + Industrial Theme Tokens |
| **State Management** | Zustand (`useCartStore`, `useCustomizerStore`, `useStoreModeStore`, `useHeaderStore`) |
| **Backend API Core** | Laravel 11 + Eloquent ORM + MySQL (`http://localhost:8000/api/v1`) |
| **Admin Panel** | Laravel Blade Admin Dashboard (`http://localhost:8000/admin`) |
| **3D & Canvas** | HTML5 Canvas / Three.js |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
CM_SPORTS_WEAR/
├── src/
│   ├── app/                           # Next.js App Router Pages
│   │   ├── page.tsx                   # Homepage (Hero, 3D Showcase, Categories, Tour, Exhibitions)
│   │   ├── catalog/page.tsx           # 9-Category Filterable Catalog
│   │   ├── catalogs/page.tsx          # 8 Official PDF Download Catalogs
│   │   ├── certifications/page.tsx    # SCCI & PHMA Accreditation Credentials
│   │   ├── customize/                 # Interactive Customizer Studio Engine
│   │   ├── products/[slug]/page.tsx   # Detailed Product Spec Sheets
│   │   ├── request-quote/page.tsx     # B2B Factory Quote Estimator
│   │   ├── manufacturing/page.tsx     # Factory Campus Capabilities
│   │   ├── private-label/page.tsx     # OEM Branding (Labels, Tags, Hardware)
│   │   ├── wholesale/page.tsx         # Volume Tiers & Direct Contracts
│   │   ├── track-order/page.tsx       # Live Shipment & Production Tracker
│   │   ├── about/page.tsx             # Sialkot Heritage, Campus Specs, Verticals
│   │   └── contact/page.tsx           # Contact Form & Sialkot Head Office
│   ├── components/
│   │   ├── layout/                    # Header (Emblem Logo + Centered Nav), Footer
│   │   ├── navigation/                # ProductsMegaMenu, MobileMenuDrawer
│   │   ├── homepage/                  # Hero, Categories, ProductionTour, Exhibitions
│   │   └── common/                    # SearchModal, TechPackModal, SaveDesignModal
│   ├── stores/                        # Zustand Global Stores
│   ├── data/                          # 9-Pillar Category Specifications
│   ├── services/                      # API Clients, Customizer Engine, Quotes, Tracking
│   └── config/                        # Site configuration & Commercial Terms
├── public/                            # Static assets, catalogs, certificates, videos
├── backend/                           # Laravel 11 API Backend & Admin Portal
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm:** v9.x or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Malihakhan01/cm_wear.git
   cd cm_wear
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production
```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Lint codebase
npm run lint
```

---

## 🌐 Commercial & Export Logistics

CM SPORTS WEAR delivers worldwide under standard international commercial terms (Incoterms 2020):
- **EXW (Ex Works):** Factory pick-up at our Sialkot campus.
- **FOB (Free on Board):** Delivered to Sialkot/Lahore International Airport or Karachi Seaport.
- **CIF (Cost, Insurance & Freight):** Freight and marine transit insurance covered to your destination port.
- **DDP (Delivered Duty Paid):** Turnkey door-to-door delivery with destination customs clearance and import duties handled.

---

## 🏭 Factory & Contact Information

- **Company:** CM SPORTS WEAR (Care Master)
- **Head Office / Factory:** Taj Palace, Khadim Ali Road, Sialkot 51310, Pakistan
- **Phone Lines:** `+92-52-3252464` / `+92-52-3558586`
- **WhatsApp Support:** `+92 300 6124640`
- **Email:** `info@cmsportswear.com`
- **Quality Standard:** SCCI & PHMA Certified / AQL 2.5 Audit Protocol

---

© 2026 CM SPORTS WEAR. All Rights Reserved. Engineered in Sialkot, Pakistan.

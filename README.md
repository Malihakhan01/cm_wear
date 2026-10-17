# TAWFIQ INDUSTRIES — Performance Apparel & OEM Manufacturing Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Facility](https://img.shields.io/badge/Facility-ISO%209001%3A2015-red?style=flat)](https://tawfiqindustries.com)
[![Standard](https://img.shields.io/badge/QC%20Standard-AQL%202.5-black?style=flat)](https://tawfiqindustries.com)

**TAWFIQ INDUSTRIES (PVT) LTD.** is a vertical export manufacturer of technical athletic clothing, performance activewear, equestrian garments, and custom team kits based in the Sialkot Industrial Zone, Pakistan. This portal provides an interactive B2B/B2C manufacturing experience for global sportswear brands, startup capsule releases, athletic federations, and wholesale distributors.

---

## 🌟 Core Features

### 1. Interactive 3D/2D Apparel Customizer Studio (`/customize/[slug]`)
- **Real-Time Fabric & Color Grading:** Customize garment panels, collar, cuffs, and trim with hex palettes and Pantone PMS dye matching.
- **Monogram & Embroidery Generator:** Live multi-font text preview with automated stitch simulation, scale adjustments, and position mapping.
- **Dynamic Size Breakdown Matrix:** Split orders across 8 size tiers (`XS` to `3XL`) with instant total piece and unit pricing calculation.
- **Sample Ordering & RFQ Handoff:** Instantly add customized prototypes to cart or submit as technical factory tech-packs.

### 2. 8 Specialized Apparel Categories (`/catalog`)
Full filterable catalog supporting category, subcategory, MOQ, customizable status, and 3D availability:
1. **01 Casual Wear:** Heavyweight French Terry Hoodies (450 GSM), Streetwear Tees, Cargo Pants, Tracksuits.
2. **02 Equestrian Clothing:** Tailored Show Jackets, 4-Way Bonded Softshell Breeches, Silicone Full-Seat Trousers.
3. **03 Ice Hockey Uniforms:** Pro Tournament Jerseys, Tackle Twill Cresting, Fight Straps, K1 Birds-Eye Mesh.
4. **04 Cycling Engineering:** Aerodynamic Speedsuits, Warp-Knit Lycra Bibs, 8-Hour Chamois Density Gel Pads.
5. **05 Basketball Uniforms:** Reversible Mesh Uniforms, Pro Sublimation Kits, Shooting Shirts.
6. **06 Rugby Kits:** 320 GSM Tear-Resistant Seams, Ergonomic Y-Neck Collars, Reinforced Flatlock Stitching.
7. **07 Ski & Snowboard Outerwear:** 3-Layer 20,000mm Hydrostatic Waterproof Shells, Sealed Taped Seams.
8. **08 Go-Karting & Racing Suits:** 500D Cordura Abrasion-Resistant Shells, 360° Floating Gussets (CIK-FIA Norms).

### 3. Dual Purchasing Modes (Wholesale vs. Retail)
- **Wholesale Mode:** Activates factory tiered pricing (Tier 1: 50–199 pcs, Tier 2: 200–499 pcs, Tier 3: 500–2,500+ pcs) with strict MOQ rules and volume discount incentives.
- **Retail Mode:** Single-piece sample pricing for prototype development and showroom validation.

### 4. B2B Factory Quotation Wizard (`/request-quote`)
- Interactive multi-step RFQ wizard with automated volume discount pricing.
- Integrated file upload pipeline for vector artworks (`.ai`, `.eps`, `.pdf`) and measurement tech-packs.
- Direct lead handoff to factory sales technicians via WhatsApp and automated inquiry emails.

### 5. Live Production & Shipment Tracker (`/track-order`)
- Track manufacturing milestones across 10 vertical factory stages:
  - CAD Pattern Development → Yarn Knitting → CNC Cutting → Printing/Sublimation → Tajima Embroidery → Stitching → Needle Scan Inspection → Custom Packaging → Export Customs Dispatch.

### 6. Responsive Desktop Mega Menu & Mobile Drawer
- **Desktop Navbar:** Direct catalog navigation on `Products` click with an independent hover/click mega menu dropdown.
- **Mobile Menu Drawer:** Refined technical typography (`text-xs font-mono`), compact pricing mode switcher, direct catalog links with collapsible category accordions, and sticky bottom quick action CTAs (Request Factory Quote + WhatsApp).

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 (Server & Client Components) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 + Custom Industrial Aesthetic Tokens |
| **State Management** | Zustand (`useCartStore`, `useCustomizerStore`, `useStoreModeStore`, `useHeaderStore`) |
| **Backend API Core** | Laravel 11 + Eloquent ORM + MySQL (`http://localhost:8000/api/v1`) |
| **Admin Panel** | Laravel Blade Admin Dashboard (`http://localhost:8000/admin`) |
| **3D & Canvas** | HTML5 Canvas / Three.js |
| **Icons** | Lucide React |
| **FX & Animations** | GSAP, Canvas Confetti |

---

## 🔗 Full-Stack Backend Integration

The frontend seamlessly communicates with the **Laravel 11 Backend** located in `backend/`:
- **API Spec & Docs:** [`backend/FRONTEND_INTEGRATION.md`](./backend/FRONTEND_INTEGRATION.md)
- **Active Endpoints:**
  - `POST /api/v1/inquiries/rfq` — B2B Quotation Wizard submissions from `/request-quote` & Customizer.
  - `POST /api/v1/customizer/save` & `GET /api/v1/customizer/{code}` — Saves & retrieves 3D/2D apparel designs.
  - `GET /api/v1/track/{orderNumber}` — Real-time 10-stage production & shipment milestone tracking.
  - `GET /api/v1/health` — Connection health check.
  - `GET /api/v1/products` & `GET /api/v1/categories` — Live catalog synchronization.
- **Offline Resilience:** All frontend services feature automated fallbacks so the site functions smoothly whether the backend server is online or offline.

## 📁 Project Structure

```
CM_SPORTS_WEAR/
├── src/
│   ├── app/                           # Next.js App Router Pages
│   │   ├── page.tsx                   # Homepage (Hero, 3D Demo, Categories, Story)
│   │   ├── catalog/page.tsx           # Product Catalog & Category Filters
│   │   ├── customize/
│   │   │   ├── page.tsx               # Redirects to /customize/custom-hoodie
│   │   │   └── [slug]/page.tsx        # Interactive Customizer Studio
│   │   ├── products/[slug]/page.tsx   # Detailed Product Tech Sheets
│   │   ├── request-quote/page.tsx     # B2B Factory Quote Estimator
│   │   ├── manufacturing/page.tsx     # 8-Stage Vertical Production Facility
│   │   ├── private-label/page.tsx     # OEM Branding (Labels, Tags, Hardware)
│   │   ├── wholesale/page.tsx         # Volume Tiers & Direct Contracts
│   │   ├── track-order/page.tsx       # Live Shipment & Production Tracker
│   │   ├── resources/page.tsx         # Textile Science Blueprints
│   │   ├── about/page.tsx             # Heritage, Campus, ISO Credentials
│   │   └── contact/page.tsx           # Contact Form & Factory Logistics
│   ├── components/
│   │   ├── layout/                    # Header, Footer, Top Banners
│   │   ├── navigation/                # ProductsMegaMenu, MobileMenuDrawer
│   │   ├── homepage/                  # HeroSection, CategoryGrid, CustomizerDemo
│   │   ├── catalog/                   # ProductCard, CategoryTemplates
│   │   ├── cart/                      # CartDrawer (Slide-over with size matrix)
│   │   └── common/                    # SearchModal, Notification Badges
│   ├── stores/                        # Zustand Global Stores
│   ├── data/                          # Products & Categories static datasets
│   ├── services/                      # Customizer engine, Quotes, Tracking APIs
│   └── config/                        # Site configuration & export commercial terms
├── public/                            # Static assets, category photography, logo
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
   git clone https://github.com/Malihakhan01/Tawfiq_industry.git
   cd Tawfiq_industry
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

Tawfiq Industries delivers worldwide under standard international commercial terms (Incoterms):
- **EXW (Ex Works):** Factory pick-up at our Sialkot facility.
- **FOB (Free on Board):** Delivered to Sialkot/Lahore Airport or Karachi Seaport.
- **CIF (Cost, Insurance & Freight):** Freight and transit insurance covered to your destination port.
- **DDP (Delivered Duty Paid):** Turnkey door-to-door delivery with destination customs clearance and import duties handled.

---

## 🏭 Factory & Contact Information

- **Company:** TAWFIQ INDUSTRIES (PVT) LTD.
- **Facility Address:** PO SAME 51310, ADDHA, Daska Rd, Beerh, Sialkot, 51310, Pakistan
- **Coordinates:** 32.4945° N, 74.5229° E
- **WhatsApp Support:** `+92 348 4552164`
- **Email:** `info@tawfiqindustry.com`
- **Quality Standard:** ISO 9001:2015 / AQL 2.5 Inspection

---

© 2026 TAWFIQ INDUSTRIES (PVT) LTD. All Rights Reserved. Engineered in Sialkot, Pakistan.

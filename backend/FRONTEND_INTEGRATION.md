# CM SPORTS WEAR — Frontend Integration Blueprint

This document specifies the technical architecture and API contracts linking the **Next.js 16 Frontend** (`http://localhost:3000`) with this **Laravel 11 Backend API Core** (`http://localhost:8000`).

---

## 1. Network Topology & Environment Configuration

| Service | Environment URL | Technology | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | `http://localhost:3000` | Next.js 16 + React 19 + TypeScript | Customer-facing customizer studio, catalog, RFQ wizard, tracking portal |
| **Backend API** | `http://localhost:8000/api/v1` | Laravel 11 + Eloquent ORM + MySQL | RESTful API core, database transactions, order tracking state, RFQ storage |
| **Admin Panel** | `http://localhost:8000/admin` | Laravel Blade + Tailwind CSS | Factory floor administration, RFQ reviews, WooCommerce product CSV imports, Kanban |

### Configuration Files
- **Frontend Environment:** `.env.local`
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
  NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
  ```
- **Backend Environment:** `backend/.env`
  ```env
  APP_URL=http://localhost:8000
  FRONTEND_URL=http://localhost:3000
  SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
  ```
- **Backend CORS:** `backend/config/cors.php`
  - Explicitly configured to accept CORS preflight and requests from `http://localhost:3000`.

---

## 2. API Endpoints & Frontend Handlers

### A. RFQ & Manufacturing Quotes
- **Frontend Source:** `src/services/quotes.service.ts` (`/request-quote` & Customizer checkout)
- **Backend Route:** `POST /api/v1/inquiries/rfq`
- **Backend Controller:** `App\Http\Controllers\Api\InquiryApiController::storeRfq`
- **Payload Schema:**
  ```json
  {
    "inquiry_type": "bulk_manufacturing",
    "full_name": "Marcus Vance",
    "email": "procurement@brand.com",
    "company": "Vance Atelier Corp",
    "phone": "+1 212 555 0192",
    "country": "United States",
    "quantity": 250,
    "target_price": 28.50,
    "target_lead_days": 18,
    "incoterm": "FOB",
    "message": "Specifications for 450 GSM French Terry Hoodies with 3D puff embroidery",
    "items": [...],
    "requirements": {
      "fabrics": "100% Combed Loopback French Terry",
      "services": ["Embroidery", "Custom Packaging"],
      "techPackAvailable": true
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Your manufacturing quote inquiry has been received.",
    "rfq_number": "RFQ-2026-98104"
  }
  ```

### B. 2D/3D Customizer State Engine
- **Frontend Source:** `src/services/customizer.service.ts` (`/customize/[slug]`)
- **Backend Routes:**
  - `POST /api/v1/customizer/save` (`CustomizerApiController::save`)
  - `GET /api/v1/customizer/{code}` (`CustomizerApiController::show`)
- **Payload Schema:**
  ```json
  {
    "product_id": 1,
    "design_name": "Stealth Black Hooded Sweatshirt",
    "parts_colors": {
      "body": "#0B0B0B",
      "hood": "#222224",
      "sleeves": "#0B0B0B",
      "rib": "#0B0B0B"
    },
    "monogram_state": {
      "text": "TI",
      "font": "font-street",
      "threadColor": "#FF333D"
    },
    "preview_front": "data:image/png;base64,...",
    "preview_back": "data:image/png;base64,..."
  }
  ```

### C. Live Production & Shipment Tracker
- **Frontend Source:** `src/services/tracking.service.ts` (`/track-order`)
- **Backend Route:** `GET /api/v1/track/{orderNumber}`
- **Backend Controller:** `App\Http\Controllers\Api\V1\OrderTrackingApiController::track`
- **Response Data:**
  ```json
  {
    "success": true,
    "data": {
      "order_number": "SF-849201",
      "status": "In Production",
      "current_stage": "Embellishment, Sublimation & Tajima Embroidery",
      "total_quantity": 450,
      "incoterms": "Air Express Priority (DHL)",
      "tracking_number": "DHL-9840294104",
      "created_at": "2026-09-20T10:00:00Z",
      "milestones": [...]
    }
  }
  ```

### D. Contact Messages & Inquiries
- **Frontend Source:** `src/app/contact/page.tsx`
- **Backend Route:** `POST /api/v1/inquiries/contact`
- **Backend Controller:** `App\Http\Controllers\Api\InquiryApiController::storeContact`

### E. Products & Categories Taxonomy
- **Frontend Source:** `src/services/products.service.ts`, `src/services/categories.service.ts`
- **Backend Routes:**
  - `GET /api/v1/products`
  - `GET /api/v1/products/{slug}`
  - `GET /api/v1/categories`
  - `GET /api/v1/categories/{slug}`

---

## 3. How to Run Frontend & Backend Concurrently

### Terminal 1: Backend (Laravel API Server)
```bash
cd backend
php artisan serve --port=8000
```

### Terminal 2: Frontend (Next.js Application)
```bash
npm run dev
```

The Next.js client automatically communicates with `http://localhost:8000/api/v1`. If the backend server is temporarily paused, the frontend includes built-in offline fallbacks to ensure client-side stability.

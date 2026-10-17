# CM SPORTS WEAR — Backend API & Factory Management Core

```
Backend Framework: Laravel 11 + Eloquent ORM + MySQL
API Version: v1 (/api/v1)
Connected Frontend: Next.js 16 (App Router) at http://localhost:3000
Full Documentation: See FRONTEND_INTEGRATION.md
```

This backend application powers the **CM SPORTS WEAR** enterprise ecosystem:
- Serves RESTful endpoints to the **Next.js 16 Frontend Customizer & Catalog**.
- Houses the **B2B RFQ & Quote Processing Engine**.
- Manages **Live Factory Floor Production Order Tracking**.
- Provides a centralized **Admin Dashboard** for product catalog management and WooCommerce CSV imports.

---

## 🔗 Attached Frontend Integration

The active frontend application is located in the root directory (`./`) and connects to this backend via:

- **Base API URL:** `http://localhost:8000/api/v1`
- **Frontend URL:** `http://localhost:3000`
- **Integration Spec:** [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

### Key Connected Endpoints
| Feature | Endpoint | Method | Role |
| :--- | :--- | :--- | :--- |
| **API Health** | `/api/v1/health` | `GET` | Health check and frontend connection verification |
| **Products** | `/api/v1/products` | `GET` | Catalog products with categories & wholesale tiers |
| **Product Detail** | `/api/v1/products/{slug}` | `GET` | Single product tech specifications |
| **Categories** | `/api/v1/categories` | `GET` | 8 Specialized sports apparel categories |
| **Customizer Save** | `/api/v1/customizer/save` | `POST` | Saves 3D/2D customizer configuration & preview |
| **Customizer Load** | `/api/v1/customizer/{code}` | `GET` | Retrieves saved customizer design tech-pack |
| **Order Tracking** | `/api/v1/track/{orderNumber}`| `GET` | 10-Stage production & shipment tracking status |
| **B2B RFQ Quotes** | `/api/v1/inquiries/rfq` | `POST` | Bulk manufacturing quotation wizard submissions |
| **Contact Messages**| `/api/v1/inquiries/contact`| `POST` | Factory customer service messages |
| **Newsletter** | `/api/v1/inquiries/newsletter`| `POST` | Sialkot export report subscriptions |

---

## ⚙️ Running Locally

### 1. Backend Server (Port 8000)
```bash
cd backend
php artisan serve --port=8000
```

### 2. Frontend Server (Port 3000)
```bash
cd ..
npm run dev
```

### 3. Admin Panel
- **URL:** `http://localhost:8000/admin`
- **Features:** Production Kanban, RFQ review, WooCommerce catalog sync, and Tech Pack inspector.

---

## 🛡️ CORS Configuration
CORS is configured in `config/cors.php` and `.env` (`FRONTEND_URL=http://localhost:3000`) to permit credentials and requests from the Next.js client.

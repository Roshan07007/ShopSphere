# 🛒 ShopSphere - Premium 3D Full-Stack E-Commerce Platform (India Edition)

> **ShopSphere** is a premium, futuristic, 3D full-stack e-commerce web platform engineered for the **Indian market**, built with **React 18 + Vite**, **Framer Motion**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB + Mongoose**.

Featuring realistic Indian Rupee (₹) pricing, 3D tilt interactions, glassmorphic UI, Indian address management with all 36 States/UTs, UPI/Card/NetBanking/COD checkout, real-time milestone order tracking, customer review management, and an executive administrative management console.

---

## 🌟 Key Features & Indian Market Localization

### 🇮🇳 Indian E-Commerce Features & Localization
- **Currency & Formatting**: Indian Rupee (`₹`) throughout product listings, carts, invoices, and dashboards using `Intl.NumberFormat('en-IN')`.
- **Realistic Indian Market Pricing**:
  - Electronics: ₹1,499 – ₹89,999 *(Sony ANC Headphones at ₹26,999, MacBook Air M3 at ₹89,999, Apple Watch Ultra 2 at ₹74,999)*
  - Fashion: ₹499 – ₹5,999 *(Oversized Tees at ₹1,499, Japanese Raw Denim at ₹4,499)*
  - Footwear: ₹799 – ₹7,999 *(Air Jordan Retro High at ₹6,499, UltraBoost Light at ₹5,999)*
  - Home & Living: ₹299 – ₹19,999 *(Ceramic Oil Diffusers, Minimalist Nordic Lamps)*
  - Accessories, Beauty & Sports
- **Indian Address & Form Standards**:
  - Full Name, 10-Digit Mobile (+91), Flat/Building, Street/Area/Locality, Landmark, City, State dropdown (all 36 States & UTs), and 6-digit PIN code delivery estimator.
- **Indian Payment Methods**:
  - **UPI** (Google Pay, PhonePe, Paytm, BHIM with dynamic QR code & VPA simulator).
  - **Credit/Debit Cards** (RuPay, Visa, MasterCard with live 3D card preview).
  - **Net Banking** (HDFC, ICICI, SBI, Axis, Kotak, PNB).
  - **Cash on Delivery (COD)** with zero-fee delivery verification.
- **Indian Taxes & Free Delivery**: 18% standard GST itemization, ₹999 free delivery threshold, and coupons (`SAVE10`, `SPHERE20`, `WELCOME500`, `FESTIVE15`).

---

### 🔮 3D Visuals, Motion & Design System
- **3D Tilt Interaction**: Custom `TiltCard.jsx` powered by Framer Motion spring physics and specular glare layer.
- **3D Hero Section**: Parallax floating product showcases, animated gradient meshes, and live INR metrics.
- **3D Quick View Modal**: Interactive product preview modal with thumbnail switcher, PIN code checker, and 1-click cart addition.
- **3D Order Milestone Tracker**: Interactive `TimelineTracker.jsx` displaying:
  $$\text{Order Placed} \longrightarrow \text{Confirmed} \longrightarrow \text{Processing} \longrightarrow \text{Shipped} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- **Glassmorphism & Depth**: Multi-layer frosted glass panels, ambient gradient blobs (`AmbientGlow.jsx`), and smooth transitions.
- **Dark & Light Mode**: High-contrast, radiant theme engine with persisted user preference.

---

### 🛡️ Executive Admin Console
- **KPI Metrics Overview**: Real-time cards for Gross Revenue in ₹, Total Orders, Active Catalog Items, and Registered Customers.
- **Inventory CRUD**: Manage products, pricing in ₹, stock counts, tags, specs, and badges (`Featured`, `Trending`, `Bestseller`, `New Arrival`).
- **Category Taxonomies**: Add, edit, and organize product departments with banner imagery.
- **Order Logistics Pipeline**: Advance tracking milestones (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered` ➔ `Cancelled`), assign courier notes, and verify payments.
- **User Directory**: View registered customers, inspect address books, and toggle administrator roles.

---

## 🧰 Technology Stack

### Frontend
- **React.js (v18+)** with **Vite**
- **Framer Motion** (3D physics, spring transforms, specular glare, enter/exit animations)
- **Tailwind CSS** (Custom theme tokens, saffron & emerald accents, glassmorphic utilities)
- **React Router (v6)** (Client-side routing with protected customer & admin routes)
- **Axios** (Configured with request/response JWT interceptors)
- **Lucide React** (Vector icons)
- **Canvas Confetti** (Order placement celebration)

### Backend
- **Node.js (ES Modules)** & **Express.js**
- **MongoDB** & **Mongoose** (ODM with models, schemas, validations, and references)
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for salted password hashing
- **CORS**, **Morgan**, **dotenv**
- **Zero-Setup Database Engine**: Automatically connects to any standard `MONGODB_URI` or embeds `mongodb-memory-server` if local MongoDB is offline.

---

## 🚀 Step-by-Step Local Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)

---

### Step 1: Clone or Navigate to Project Root
```bash
cd CodeAlpha_Ecommerce_Store
```

---

### Step 2: Set Up & Start Backend Server

1. Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Configure environment variables in `backend/.env` (defaults are pre-configured):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere_db
JWT_SECRET=shopsphere_jwt_super_secret_key_2026_production
JWT_EXPIRE=30d
NODE_ENV=development
```

4. Populate realistic Indian demo products, categories, users, and orders:
```bash
npm run seed
```

5. Run the backend server:
```bash
npm run dev
```
> The API server will start on **`http://localhost:5000`**.

---

### Step 3: Set Up & Start Frontend Web Application

1. Open a **second terminal** and navigate to the `frontend` directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```
> The application will start on **`http://localhost:5173`**.

4. Open your browser and navigate to:
```
http://localhost:5173
```

---

### Step 4: Run Automated Verification Tests

To run the complete automated 19-test full-stack integration test suite:
```bash
cd backend
node test-e2e.js
```

To run the production build verification:
```bash
cd frontend
npm run build
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `john@example.com` | `User@123` | Storefront, Wishlist, Cart, Checkout, Order Tracking |
| **Demo Administrator** | `admin@shopsphere.com` | `Admin@123` | Full Storefront + Admin Dashboard, Products, Orders, Users |

> **Note**: Both the Login and Register pages include **1-Click Quick Fill** buttons for instant demo testing!

---

## 🎟️ Active Demo Promo Coupons

| Coupon Code | Discount | Terms |
| :--- | :--- | :--- |
| `SAVE10` | **10% OFF** | All catalog items |
| `SPHERE20` | **20% OFF** | Flat 20% storewide |
| `WELCOME500` | **₹500 OFF** | Minimum cart value ₹1,999 |
| `FESTIVE15` | **15% OFF** | Special festive offer |

---

## 📁 Project Architecture Directory Map

```
CodeAlpha_Ecommerce_Store/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB & in-memory fallback connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile, addresses
│   │   ├── productController.js  # Catalog, search, filters, reviews CRUD
│   │   ├── categoryController.js # Category departments CRUD
│   │   ├── cartController.js     # Cart synchronization & discounts
│   │   ├── wishlistController.js # Wishlist toggle & items
│   │   ├── orderController.js    # Order placement, Indian addresses, tracking
│   │   ├── adminController.js    # Analytics, stats, user management
│   │   └── contactController.js  # Inquiries & newsletter
│   ├── middleware/
│   │   ├── auth.js               # JWT auth & admin guard
│   │   └── errorHandler.js       # 404 & centralized error handler
│   ├── models/
│   │   ├── User.js               # User & Indian address schema
│   │   ├── Product.js            # Product & reviews reference
│   │   ├── Category.js           # Category taxonomy schema
│   │   ├── Cart.js               # Persistent cart schema
│   │   ├── Wishlist.js           # Persistent wishlist schema
│   │   ├── Order.js              # Order, paymentMethod & tracking history
│   │   └── Review.js             # Verified buyer review schema
│   ├── routes/                   # Express REST API route definitions
│   ├── utils/
│   │   ├── seedData.js           # Realistic INR products & categories
│   │   └── seeder.js             # Database seeding script
│   ├── server.js                 # Main server entrypoint
│   └── test-e2e.js               # 19-test automated test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # TiltCard, AmbientGlow, TimelineTracker, Modals
│   │   │   ├── layout/           # Sticky Navbar, Footer with Indian payments
│   │   │   ├── product/          # ProductCard, QuickViewModal, ReviewSection
│   │   │   └── cart/             # Slide-over drawer
│   │   ├── context/              # Auth, Cart, Wishlist, Theme, Toast providers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # 3D Hero, Deals, Categories, Newsletter
│   │   │   ├── ShopPage.jsx      # Multi-faceted filter catalog in ₹
│   │   │   ├── ProductDetailsPage.jsx # 3D image gallery, pincode, reviews
│   │   │   ├── CartPage.jsx      # Cart, ₹999 progress, coupon chips, GST
│   │   │   ├── CheckoutPage.jsx  # 4-Step Indian checkout (UPI, Card, COD)
│   │   │   ├── MyOrdersPage.jsx  # Milestone tracking & GST receipt
│   │   │   ├── WishlistPage.jsx  # 3D saved items
│   │   │   ├── ProfilePage.jsx   # Indian address manager & security
│   │   │   ├── LoginPage.jsx     # Split-screen 3D glassmorphic sign in
│   │   │   ├── RegisterPage.jsx  # Split-screen 3D sign up with +91 phone
│   │   │   └── admin/            # Dashboard, Products, Orders, Users, Categories
│   │   ├── services/api.js       # Axios HTTP client
│   │   └── utils/formatPrice.js  # INR formatter, PIN & Indian state helpers
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚖️ License
Released under the MIT License. Developed with precision by the ShopSphere Engineering Team.

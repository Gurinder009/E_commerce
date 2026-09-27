# ShopSphere - Next-Generation Multi-Vendor E-Commerce Marketplace

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest_Testing-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker Ready](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> **B.Tech CSE Final-Year Major Project**: A production-grade, multi-vendor e-commerce marketplace platform built with end-to-end Role-Based Access Control (RBAC), real-time WebSockets, live analytics, dynamic pricing, discount coupons, return/refund management, and PDF invoice generation.

---

## 🌟 Demo Credentials (1-Click Viva Login)

The platform comes pre-seeded with rich Indian e-commerce catalog items, multiple seller storefronts, and verified users:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@shopsphere.demo` | `Admin@12345` | Global oversight, vendor approval, user moderation, returns, taxonomy, coupons |
| **🏪 SELLER** | `seller@shopsphere.demo` | `Seller@12345` | Storefront management, product catalog, orders, stock alerts, seller coupons |
| **🛍️ CUSTOMER** | `customer@shopsphere.demo` | `Customer@12345` | Product discovery, wishlist, cart, checkout, payments, RMA returns, invoices |

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Capabilities by Role](#-key-capabilities-by-role)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Directory Structure](#-directory-structure)
6. [Quick Start & Installation](#-quick-start--installation)
7. [API Endpoints Overview](#-api-endpoints-overview)
8. [Database Schema & ER Design](#-database-schema--er-design)
9. [Smart Modules (Recommendation & Forecasting)](#-smart-modules)
10. [Automated Testing](#-automated-testing)
11. [Docker Deployment](#-docker-deployment)
12. [B.Tech Final-Year Viva Defense Guide](#-btech-final-year-viva-defense-guide)

---

## 🚀 Project Overview

**ShopSphere** solves the fragmentation and vendor-barrier challenges of modern e-commerce by providing an open, scalable, multi-tenant marketplace where independent merchants can register, undergo administrative compliance verification, launch branded storefronts, and sell products in INR (₹) with real-time stock tracking and automated invoice generation.

### Core Highlights:
- **Zero-Friction Local Development**: Automatically spins up an embedded in-memory MongoDB server if local `mongod` is absent, auto-seeding 56 products, 8 categories, 26 accounts, 15 orders, and coupons on first launch.
- **Production RBAC**: Strict JWT-based role separation preventing privilege escalation between `CUSTOMER`, `SELLER`, and `ADMIN`.
- **Dynamic Cart & Tax Engine**: Handles 18% GST calculation, free shipping thresholds, coupon discount validations (percentage vs fixed caps), and live inventory deductions.
- **Real-Time Notifications**: Socket.IO integration for instant order status transitions, vendor alerts, and stock warnings.
- **PDF Invoice Generation**: Server-side vector PDF generation using `pdfkit` complete with itemized GST breakdown, delivery addresses, and SKU barcodes.

---

## 👥 Key Capabilities by Role

### 🛍️ Customer Experience
- **Interactive Home & Catalog**: Hero carousels, categorized discovery, featured grids, trending items, and flash deals.
- **Multi-Faceted Search**: Instant keyword search, brand checkboxes, category selection, price range sliders, minimum rating filters, and sorting (price low-high, high-low, rating, newest).
- **Rich Product Detail**: Multi-angle image galleries, stock status badges, specification tables, ratings breakdown, and verified customer reviews.
- **Cart & Wishlist**: Persistent cart, stock validation, promo code application, and wishlist toggle.
- **Checkout & Multi-Address**: Saved address book, Cash on Delivery (COD) and Online Payment simulation with Razorpay/Stripe readiness.
- **Order Tracking & RMA**: Live order timeline (`PLACED` → `CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED`), single-click PDF invoice download, and return request submission.

### 🏪 Seller Dashboard (`/seller`)
- **Executive Analytics**: Gross sales, order volume, catalog count, low-stock alerts, and daily sales charts with Recharts.
- **Catalog Management**: Add/edit/delete products with multiple image URLs, categories, specifications, SKUs, and pricing.
- **Inventory Control**: Live stock adjustments, low-stock triggers (≤ 5 units), and out-of-stock badges.
- **Order Fulfillment**: Track order items, update order transition (`PROCESSING` → `SHIPPED`), and print customer shipping labels.
- **Promotional Coupons**: Issue custom store promo codes with expiry dates and minimum spend limits.

### 👑 Admin Control Panel (`/admin`)
- **Platform Analytics**: Total GMV, net revenue, monthly trends, category share pie charts, and platform health telemetry.
- **Vendor Moderation**: Review seller applications, verify GSTIN/documents, and approve, reject, or suspend seller accounts.
- **User Governance**: Search and toggle user account statuses (Active / Suspended) across all customer accounts.
- **Product & Category Taxonomy**: Marketplace catalog moderation, category CRUD with banner image attachments, and product deletion.
- **Returns & Refunds**: Review return reasons, approve/reject RMA requests, and trigger automatic refunds.
- **Review Moderation**: Flagged review moderation queue with automatic product rating recalculation upon deletion.

---

## 🏛️ System Architecture

ShopSphere follows a clean, decoupled 3-tier architecture with separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    React 18 Client (SPA)                    │
│    Vite • TypeScript • Tailwind CSS • Lucide • Recharts     │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
         REST HTTP / JSON                 Socket.IO
               │                              │
┌──────────────▼──────────────────────────────┴───────────────┐
│                 Node.js / Express API Server                │
│    TypeScript • JWT Auth • Zod Validation • Helmet • CORS   │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Middleware  │   Services    │    Sockets   │
│  - Auth       │  - protect   │   - Email     │  - OrderEvt  │
│  - Product    │  - authorize │   - Invoice   │  - StockEvt  │
│  - Cart/Order │  - rateLimit │   - Recomm.   │  - Alerts    │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
          Mongoose ODM                   Mongoose ODM
               │                              │
┌──────────────▼──────────────────────────────┴───────────────┐
│                       Database Layer                        │
│          MongoDB / Embedded MongoMemoryServer               │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend:
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 (Dark Mode enabled via `class` strategy)
- **State & Context**: Context API (`Auth`, `Cart`, `Wishlist`, `Theme`, `Socket`)
- **Routing**: React Router DOM v6 with nested layout routes and protected role guards
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with request/response interceptors

### Backend:
- **Runtime**: Node.js v20+ with Express.js & TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Stateless JWT (`jsonwebtoken`) + `bcryptjs` password hashing
- **Security**: Helmet, Express Rate Limiter, CORS, Data Sanitization
- **Real-Time**: Socket.IO
- **PDF Generation**: PDFKit (vector graphics, itemized GST tables)

---

## 📂 Directory Structure

```
E_commerce/
│
├── client/                     # Frontend Application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── api/                # API client definitions
│   │   ├── components/         # Reusable UI components
│   │   │   ├── cart/           # CartDrawer, CartItemCard
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute, Modals
│   │   │   └── product/        # ProductCard, RatingStars
│   │   ├── context/            # Global React Context providers
│   │   ├── layouts/            # MainLayout, SellerLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Dashboard & Governance Pages
│   │   │   ├── auth/           # Login, Register, Forgot Password
│   │   │   ├── customer/       # Home, Products, Detail, Cart, Checkout, Orders
│   │   │   └── seller/         # Seller Dashboard, Products, Inventory, Orders
│   │   ├── services/           # Axios HTTP client configuration
│   │   ├── types/              # Domain interfaces & TypeScript types
│   │   ├── utils/              # Formatting helpers & toast utilities
│   │   ├── App.tsx             # Route declarations & provider assembly
│   │   ├── index.css           # Tailwind CSS directives & theme classes
│   │   └── main.tsx            # React DOM root entry point
│   ├── Dockerfile              # Production Nginx Dockerfile
│   └── package.json
│
├── server/                     # Backend API Application
│   ├── src/
│   │   ├── __tests__/          # Jest & Supertest integration test suite
│   │   ├── config/             # DB & Environment configurations
│   │   ├── controllers/        # Express request handlers
│   │   ├── middleware/         # Auth, RBAC, error handler, rate limiter
│   │   ├── models/             # Mongoose schemas (15 models)
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # PDF invoice, notification, recommendation
│   │   ├── types/              # Backend TypeScript types
│   │   ├── utils/              # Seed script, JWT tokens, response helpers
│   │   └── app.ts              # Express application & HTTP server
│   ├── Dockerfile              # Node.js production Dockerfile
│   └── package.json
│
├── shared/                     # Shared TypeScript types
├── docker-compose.yml          # Full multi-container Docker stack
├── .dockerignore
└── package.json                # Monorepo workspaces config
```

---

## ⚡ Quick Start & Installation

### Prerequisites:
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9.x or higher)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere

# Install dependencies for monorepo, server, and client in one step:
npm install
```

### 2. Start the Application
Run both backend and frontend concurrently:

```bash
# Terminal 1 - Start Backend (Runs on http://localhost:5000)
npm run dev --workspace=server

# Terminal 2 - Start Frontend (Runs on http://localhost:5173)
npm run dev --workspace=client
```

*Note: The server detects if MongoDB is locally absent and automatically boots an embedded in-memory database pre-seeded with 56 products, sellers, and admin accounts!*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime & health status |
| `POST` | `/api/auth/register` | Public | Register new customer or seller |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | User | Get current session profile |
| `GET` | `/api/products` | Public | Search, filter, paginate catalog items |
| `GET` | `/api/products/:id` | Public | Retrieve full product specifications & seller info |
| `GET` | `/api/categories` | Public | List categories with product counts |
| `GET` | `/api/cart` | Customer | Fetch current customer cart & tax calculation |
| `POST` | `/api/cart/items` | Customer | Add product to cart with quantity validation |
| `POST` | `/api/coupons/validate`| Customer | Validate promo code and calculate discount |
| `POST` | `/api/orders` | Customer | Create order with stock reservation |
| `GET` | `/api/orders/:id/invoice`| Customer | Download vector PDF invoice |
| `GET` | `/api/seller/dashboard`| Seller | Seller revenue, orders, stock metrics |
| `GET` | `/api/admin/dashboard-stats`| Admin | Platform GMV, orders, user distribution |
| `PUT` | `/api/admin/sellers/:id/status`| Admin | Approve/Reject vendor storefront |

---

## 🧪 Automated Testing

ShopSphere includes an automated Jest and Supertest integration test suite covering authentication, RBAC authorization, discovery endpoints, cart workflows, and coupon calculations:

```bash
# Run backend test suite
npm test --workspace=server
```

**Test Coverage Summary:**
- ✅ `GET /api/health` returns 200 ONLINE
- ✅ `GET /api/categories` returns category taxonomy
- ✅ `GET /api/products` returns paginated catalog
- ✅ `POST /api/auth/login` verifies customer and admin demo credentials
- ✅ `POST /api/auth/login` rejects invalid passwords with 401
- ✅ `GET /api/admin/dashboard-stats` rejects unauthenticated users with 401
- ✅ `GET /api/admin/dashboard-stats` enforces RBAC (403 for Customer, 200 for Admin)
- ✅ `POST /api/coupons/validate` validates codes and computes discounts
- ✅ `GET /api/cart` computes accurate taxes and subtotal

---

## 🐳 Docker Deployment

To launch the complete platform including MongoDB, Node.js API server, and Nginx-powered React client:

```bash
# Build and run all services
docker-compose up --build -d

# View running containers
docker-compose ps

# Stop containers
docker-compose down
```

- **Frontend**: Accessible at `http://localhost` (Port 80)
- **Backend API**: Accessible at `http://localhost:5000` (Port 5000)
- **MongoDB**: Internal network on port 27017

---

## 🎓 B.Tech Final-Year Viva Defense Guide

### 1. Abstract
*ShopSphere is an enterprise-grade multi-vendor e-commerce platform developed to democratize digital retail for small and mid-sized enterprises. Built using the MERN stack with TypeScript, the system integrates Role-Based Access Control, automated invoice generation, real-time stock reconciliation, and coupon validation algorithms.*

### 2. Frequently Asked Viva Questions & Model Answers

**Q1: How did you implement Role-Based Access Control (RBAC)?**  
*Answer:* RBAC is enforced at both the client and server levels. In the backend, a JWT payload encodes the user's `role` (`CUSTOMER`, `SELLER`, `ADMIN`). Protected routes pass through `protect` (verifies token integrity and expiration) followed by `authorize('ADMIN')` (restricting execution based on roles). In the frontend, a React `ProtectedRoute` wrapper inspects the user's context role and redirects unauthorized visits.

**Q2: How is concurrency and stock overbooking prevented during checkout?**  
*Answer:* When an order is placed (`POST /api/orders`), the backend performs atomic stock verification on each item. If any item's requested quantity exceeds available stock, the transaction aborts with an HTTP 400 error. Upon confirmation, stock is decremented atomically using MongoDB's `$inc: { stock: -qty }`.

**Q3: How does the system generate invoices?**  
*Answer:* Using the `pdfkit` streaming library. When a customer clicks "Download Invoice", `GET /api/orders/:id/invoice` streams a dynamically generated vector PDF containing the ShopSphere logo, itemized table of goods, 18% GST calculation, shipping address, and seller details.

**Q4: How does ShopSphere handle offline or missing third-party services?**  
*Answer:* Through modular service adapters. If MongoDB is not installed locally, `mongodb-memory-server` creates an in-memory database instance automatically. Similarly, payment processing features a seamless fallback mode that simulates the Razorpay/Stripe handshake without needing active credit cards or live API keys.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

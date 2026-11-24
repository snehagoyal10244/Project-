# NOVARA Luxury E-Commerce Platform — Backend Service

A secure, high-performance REST API backend built for the **NOVARA** Atelier luxury shopping experience.

---

## 🛠️ Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose
- **Authentication**: JSON Web Tokens (JWT) + HTTP-Only Cookies
- **Security**: bcryptjs password hashing, Express input validation, CORS protection
- **Architecture**: Modular Controller-Service-Model-Route architecture

---

## 📁 Architecture & File Structure

```
backend/
├── config/
│   └── db.js                 # Reusable MongoDB Atlas connection logic
├── controllers/
│   ├── adminController.js    # Admin analytics, order oversight & customer CRM
│   ├── authController.js     # Register, login, logout, me, forgot/reset password
│   ├── categoryController.js # Category retrieval & admin CRUD
│   ├── cartController.js     # Server-side bag calculation & promo codes
│   ├── orderController.js    # Order creation, inventory validation & tracking
│   ├── productController.js  # Product querying, filters, search & admin CRUD
│   ├── reviewController.js   # Product reviews & automated average rating updates
│   ├── userController.js     # User profile, shipping address & password updates
│   └── wishlistController.js # Saved acquisitions & move-to-bag operations
├── middleware/
│   ├── adminMiddleware.js    # Admin role verification
│   ├── authMiddleware.js     # Bearer token & cookie JWT protection
│   └── errorMiddleware.js    # Centralized notFound & errorHandler
├── models/
│   ├── Cart.js               # User bag schema with item subtotals
│   ├── Category.js           # Category slug, display name & description
│   ├── Order.js              # Order with tracking number, timeline & courier
│   ├── Product.js            # Product pricing, stock, colors, images & tags
│   ├── Review.js             # Unique compound product/user index reviews
│   ├── User.js               # Salted bcrypt hash, roles, addresses & reset tokens
│   └── Wishlist.js           # Product references for user wishlists
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   ├── userRoutes.js
│   └── wishlistRoutes.js
├── scripts/
│   └── seedProducts.js       # Production seed script with Stitch catalog & accounts
├── utils/
│   └── generateToken.js      # JWT signing utility
├── .env.example              # Template environment configuration
├── .gitignore
├── package.json
└── server.js                 # Express application initialization & middleware
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Inside the `backend/` folder, create a `.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas URI (or local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/novara_db?retryWrites=true&w=majority

# Security Keys
JWT_SECRET=novara_super_secret_jwt_key_atelier_2025_luxury_platform
JWT_EXPIRE=30d
COOKIE_SECRET=novara_cookie_atelier_secret_key_98421
```

### 2. Seed Realistic Catalog & Accounts
Populate the database with the NOVARA product collection, curated reviews, and pre-configured accounts:
```bash
npm run seed
```

**Pre-configured Seed Accounts:**
- **Atelier Admin**:
  - Email: `admin@novara.com`
  - Password: `NovaraAdmin@2025`
  - Privileges: Full Administrative Suite
- **Collector / Client**:
  - Email: `eleanor.vane@atelier-vane.com`
  - Password: `password123`
  - Order Reference: `#NVR-98421-E`
  - Tracking ID: `TRK-NV-8842-IT`

### 3. Start Backend Server
```bash
# Production mode
npm start

# Development mode (with live watch)
npm run dev
```
The server will boot on `http://localhost:5000`. Test the health endpoint:
```
GET http://localhost:5000/api/health
```

---

## 🌐 API Endpoints Reference

### User Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user account | Public |
| POST | `/api/auth/login` | Login with email & password | Public |
| POST | `/api/auth/logout` | Clear auth cookies | Authenticated |
| GET | `/api/auth/me` | Fetch currently authenticated user | Authenticated |
| POST | `/api/auth/forgot-password`| Request password reset token | Public |
| PUT | `/api/auth/reset-password/:token` | Set new password with token | Public |

### Products (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | Query products (supports search, category, price, sort) | Public |
| GET | `/api/products/:id` | Get product details by ID | Public |
| GET | `/api/products/slug/:slug` | Get product details by slug | Public |
| POST | `/api/products` | Create new luxury piece | Admin |
| PUT | `/api/products/:id` | Update product information | Admin |
| DELETE | `/api/products/:id` | Remove product | Admin |

### Shopping Bag (`/api/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/cart` | Get current user's shopping bag | Authenticated |
| POST | `/api/cart/add` | Add product to bag with color/size | Authenticated |
| PUT | `/api/cart/update` | Update item quantity in bag | Authenticated |
| DELETE | `/api/cart/remove/:itemId` | Remove item from bag | Authenticated |
| DELETE | `/api/cart/clear` | Clear shopping bag | Authenticated |
| POST | `/api/cart/apply-promo` | Apply discount code (`NOVARA20`, `NOVARA35`, `NOVARA15`) | Authenticated |

### Orders & Tracking (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders` | Place order (validates stock, decrements inventory) | Authenticated |
| GET | `/api/orders/my-orders` | Retrieve authenticated user's order history | Authenticated |
| GET | `/api/orders/:id` | Get specific order dossier | Authenticated |
| GET | `/api/orders/track/:orderNumber` | Public tracking by order reference (`#NVR-98421-E`) | Public |
| PUT | `/api/orders/:id/cancel` | Cancel eligible pending order | Authenticated |
| PUT | `/api/orders/:id/status` | Update dispatch status & tracking ID | Admin |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/wishlist` | Get user's saved wishlist | Authenticated |
| POST | `/api/wishlist/toggle` | Toggle item saved state | Authenticated |
| DELETE | `/api/wishlist/:productId` | Remove item from wishlist | Authenticated |
| POST | `/api/wishlist/move-to-cart/:productId` | Transfer wishlist item into bag | Authenticated |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/stats` | Live revenue, order counts, product & customer statistics | Admin |
| GET | `/api/admin/orders` | Full order management view | Admin |
| GET | `/api/admin/customers`| Client directory and purchase history | Admin |

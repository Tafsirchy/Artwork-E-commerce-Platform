# Artwork E-Commerce Platform: Implementation Plan

## Design System: "Modern Art Gallery"
**Core Idea:** “A quiet gallery space where the walls (UI) disappear and the art becomes the focus.”
**Philosophy:** “Let the artwork speak, UI supports silently”
**Style:** Minimal, warm, premium, artistic

### 1. Core Palette
- **Primary (Ink Black):** `#1C1C1C`
- **Canvas (Main BG):** `#F5F1EB`
- **Surface (Cards):** `#FFFFFF`
- **Soft Surface:** `#FAF8F5`
- **Accent (Terracotta):** `#D97757`
- **Accent Soft:** `#F2C6B6`
- **Luxury Highlight (Gold):** `#C8A96A`
- **Text Primary:** `#1A1A1A`
- **Text Secondary:** `#6B7280`
- **Border:** `#E5E0D8`
- **Divider:** `#EFEAE3`

### 2. Dark Mode (Premium Touch)
- **Backgrounds:** bg-main `#121212`, bg-card `#1E1E1E`
- **Text:** text-primary `#F5F5F5`, text-muted `#A1A1AA`
- **Accents:** accent `#D97757`, gold `#C8A96A`, border `#2A2A2A`

### 3. Tailwind Configuration Snippet
```javascript
theme: { 
  extend: { 
    colors: { 
      gallery: { 
        bg: "#F5F1EB", surface: "#FFFFFF", soft: "#FAF8F5", 
        primary: "#1C1C1C", accent: "#D97757", gold: "#C8A96A", 
        text: "#1A1A1A", muted: "#6B7280", border: "#E5E0D8", 
      } 
    } 
  } 
}
```

### 4. Implementation Rules & UI Roles
- **Avoid:** Bright UI backgrounds, heavy colored cards, and strong gradients.
- **Use:** White/soft neutral surfaces, thin borders, soft shadows, and sparingly use gold for a premium feel.
- **Product Card:** `bg-[#FFFFFF]`, `border-[#E5E0D8]`, hover `scale(1.03)` with shadow `0 10px 30px rgba(0,0,0,0.08)`.
- **Buttons:** Add to Cart `bg-[#1C1C1C]` text `#FFFFFF`, hover `bg-[#000000]`.
- **Navbar:** `bg-[rgba(245,241,235,0.8)]` with `backdrop-blur` and `border-b-[#E5E0D8]`.
- **Micro-interactions:** Hovering cards causes subtle lift and shadow; buttons darken slightly. Success toasts `#4CAF50`, error `#EF4444`.

---

## Phase 0: Planning & Environment Setup
**Objective:** Establish the development environment, monorepo structure, and initial tooling to ensure the team can build without friction.

**Features/Modules:**
- ✅ Project root initialization
- ✅ Monorepo structure (frontend, backend, shared, docs)
- ✅ Environment variables strategy
- ✅ Version control setup

**Implementation Tasks:**
- ✅ 1. Initialize a Git repository and define the `.gitignore`.
- ✅ 2. Set up the monorepo root folder structure (`frontend/`, `backend/`, `shared/`, `docs/`).
- ✅ 3. **Frontend:** Bootstrap the Next.js app using `npx create-next-app@latest frontend` (configure for App Router, Tailwind). Install ShadCN UI, Framer Motion, Zustand, and React Toastify.
- ✅ 4. **Backend:** Initialize Node.js in the backend folder (`npm init -y`). Install core dependencies (Express, Mongoose, dotenv, cors, helmet, morgan).
- ✅ 5. Define `.env.example` files for both frontend and backend to document required variables (DB URI, JWT Secret, Stripe Keys, Email Config).
- ✅ 6. Set up basic linting (ESLint) and formatting (Prettier) rules to ensure code consistency.

**Folder Structure Involved:**
* `/` (Root Monorepo)
* `/frontend`
* `/backend`
* `/docs` (Store SRS, ERD, DFD here)

**Definition of Done (DoD):** Both frontend (`npm run dev`) and backend (`node server.js`) servers start successfully locally without errors, and the folder structure aligns with the architectural specification.

---

## Phase 1: Core Foundation (Auth, Database, Configs)
**Objective:** Build the backbone of the application. Set up the database connection, implement robust authentication/authorization, and establish the API communication layer.

**Features/Modules:**
- ✅ MongoDB Connection
- ✅ User Model & Auth System (JWT, bcrypt)
- ✅ Frontend Auth State (Zustand) & API Service wrapper

**Implementation Tasks:**
- ✅ 1. **Backend Configs:** Implement `backend/src/config/db.js` using Mongoose to connect to MongoDB. Set up basic Express app configuration (`app.js`) with CORS and JSON parsing.
- ✅ 2. **Models:** Create the `User.js` model with fields for name, email, password, and role (`admin` or `customer`).
- ✅ 3. **Auth Logic:**
    - ✅ Create `utils/hashPassword.js` and `utils/generateToken.js`.
    - ✅ Implement `authController.js` (Register, Login, GetUserProfile).
    - ✅ Set up `authRoutes.js` and integrate into `app.js`.
- ✅ 4. **Security Middlewares:** Implement `authMiddleware.js` (validates JWT) and `adminMiddleware.js` (checks user role).
- ✅ 5. **Frontend API Layer:** Create `frontend/lib/api.js` using Axios/fetch to set up base URLs and interceptors for attaching the JWT token to requests.
- ✅ 6. **Frontend Auth State:** Implement `store/authStore.js` (Zustand) to manage user login state.
- ✅ 7. **Frontend Auth UI:** Build the Login (`app/(auth)/login/page.jsx`) and Register pages, integrating form validation and connecting to the backend API.

**Folder Structure Involved:**
* `backend/src/config/`, `backend/src/models/`, `backend/src/controllers/`, `backend/src/middlewares/`
* `frontend/app/(auth)/`, `frontend/lib/`, `frontend/store/`

**Definition of Done (DoD):** A user can register, log in, receive a JWT, and access a protected route. State is persisted across page reloads on the frontend.

---

## Phase 2: Feature Modules (Products & Cart)
**Objective:** Develop the core e-commerce capabilities—browsing artworks and managing the shopping cart.

**Features/Modules:**
- ✅ Product System (CRUD, Image Upload)
- ✅ Persistent Cart System
- ✅ Frontend Product Browsing & Cart State

**Implementation Tasks:**
- ✅ 1. **Product Model:** Create `Product.js` (title, description, price, image URL, stock, creator).
- ✅ 2. **Image Uploads:** Implement `uploadMiddleware.js` using Multer to handle artwork image uploads to the `backend/uploads/` directory. Configure Express to serve static files from this folder.
- ✅ 3. **Product API:** Build `productController.js` and `productRoutes.js`. Admin routes (Create, Update, Delete) protected by `adminMiddleware`. Public routes (GetAll, GetSingle).
- ✅ 4. **Cart Backend:** Create `Cart.js` model. Implement `cartController.js` to sync cart items with the database for logged-in users (persistent cart).
- ✅ 5. **Frontend Product UI:** Build `ProductCard.jsx`, `app/(shop)/products/page.jsx` (listing), and `app/(shop)/products/[id]/page.jsx` (details). Use ShadCN and Framer Motion for aesthetics.
- ✅ 6. **Frontend Cart Integration:** Implement `store/cartStore.js`. Build `app/(shop)/cart/page.jsx`. Sync local cart state with the backend `cartController` when a user adds/removes items.

**Folder Structure Involved:**
* `backend/src/routes/`, `backend/src/controllers/`, `backend/src/models/`, `backend/uploads/`
* `frontend/app/(shop)/`, `frontend/components/product/`, `frontend/components/cart/`

**Definition of Done (DoD):** Admins can upload and manage products. Customers can view products, add them to a cart, and the cart persists in the database.

---

## Phase 3: Advanced Features / Integrations (Checkout, Stripe, Maps)
**Objective:** Implement the end-to-end checkout flow, integrating third-party services for payments and location tracking.

**Features/Modules:**
- ✅ Order System & State Machine
- ✅ Stripe Payment Integration
- ✅ OpenStreetMap (Delivery Location)

**Implementation Tasks:**
- ✅ 1. **Order Architecture:** Create `Order.js` model containing order items, shipping address (including lat/lng), payment status, and order status.
- ✅ 2. **Map Integration:** Implement `MapPicker.jsx` using React Leaflet and OpenStreetMap. Embed this in the `app/(shop)/checkout/page.jsx` to capture exact delivery coordinates.
- ✅ 3. **Stripe Setup:** Configure `backend/src/config/stripe.js`. Implement `paymentController.js` to create a Stripe Payment Intent.
- ✅ 4. **Checkout Flow (Frontend):** Build the checkout page. Process: Capture Address (Map) -> Select Payment Method (COD or Card) -> Trigger Stripe Elements -> Place Order.
- ✅ 5. **Order Processing:** Implement `orderController.js`. If Stripe is successful (verified via Webhook), mark order as `Paid`. Clear the user's cart in the DB.
- ✅ 6. **Stripe Webhook:** Create a dedicated route to listen for Stripe Webhook events (`payment_intent.succeeded`) to securely confirm payments independent of the client.

**Folder Structure Involved:**
* `backend/src/services/paymentService.js`, `backend/src/controllers/paymentController.js`, `backend/src/controllers/orderController.js`
* `frontend/app/(shop)/checkout/`, `frontend/components/map/`, `frontend/lib/stripe.js`

**Definition of Done (DoD):** A user can complete checkout. Paid orders appear in the database with exact map coordinates, and the cart is emptied.

---

## Phase 4: Utilities & Post-Order Actions (Emails & Invoices)
**Objective:** Close the loop on the user experience by providing order confirmations, invoices, and administrative oversight.

**Features/Modules:**
- ✅ Nodemailer Email System
- ✅ PDF Invoice Generation
- ✅ Admin Dashboard

**Implementation Tasks:**
- ✅ 1. **Email Configuration:** Set up `backend/src/config/mailer.js` and `mailService.js` using Nodemailer (configure with SMTP, e.g., Gmail or SendGrid).
- ✅ 2. **Invoice Generation:** Implement `backend/utils/invoiceGenerator.js` using `pdfkit`. Generate a beautifully formatted PDF containing order details and the user's details.
- ✅ 3. **Post-Order Hook:** Hook the `mailService` into the successful order creation flow. Email the generated PDF invoice to the user.
- ✅ 4. **Download Endpoint:** Create `GET /api/orders/:id/invoice` to allow users to download their invoice later.
- ✅ 5. **Admin Dashboard:** Build `app/(admin)/dashboard/page.jsx` and `app/(admin)/orders/page.jsx` on the frontend. Allow admins to view all orders, update order statuses (Processing, Shipped, Delivered), and manage products.

**Folder Structure Involved:**
* `backend/src/utils/invoiceGenerator.js`, `backend/src/services/mailService.js`
* `frontend/app/(admin)/`

**Definition of Done (DoD):** Upon order completion, an email with a PDF invoice is received. Admins can view and manage all system data via the dashboard.

---

## Phase 5: Optimization & Security
**Objective:** Harden the application against vulnerabilities and ensure smooth performance for real-world usage.

**Features/Modules:**
- ✅ Security Middlewares & Validation
- ✅ Performance Tuning

**Implementation Tasks:**
- ✅ 1. **Input Validation:** Added `express-validator` to backend auth/product routes to sanitize and validate all incoming request bodies.
- ✅ 2. **Global Error Handling:** Implemented `errorMiddleware.js` — stack traces hidden in production, clean JSON errors returned.
- ✅ 3. **Rate Limiting:** Applied `express-rate-limit` on authentication routes (20 req / 15 min) to prevent brute-force attacks.
- ✅ 4. **Frontend Optimization:** `<Image />` component used strictly across all artwork pages for lazy loading and WebP conversion.
- ✅ 5. **UI Polish:** Implemented `ProductCardSkeleton.jsx` for loading states. Added `PageTransition.jsx` (Framer Motion) for smooth page-to-page animations. Built full-featured `Navbar.jsx` with mobile menu. Built premium animated `HomePage` with hero, features strip, and CTA.

**Definition of Done (DoD):** Application passes standard vulnerability scans. Lighthouse performance score is >90.

---

## Phase 6: Testing & QA
**Objective:** Validate system integrity against the SRS and ensure reliability.

**Implementation Tasks:**
- ✅ 1. **API Testing:** Implemented integration tests for Auth, Products, and Cart using Jest + Supertest + MongoDB Memory Server. 10/10 tests passed.
- ✅ 2. **Manual QA:** Verified registration, login, product browsing, cart persistence, and admin panel navigation.
- ✅ 3. **Traceability Matrix:** All core requirements (Auth, Shop, Cart, Stripe Checkout, Map, Invoices) are implemented and verified.

---

## Phase 7: Deployment & Productionization
**Objective:** Launch the application to a live environment.

**Implementation Tasks:**
- [ ] 1. **Cloud Storage:** Move from local `uploads/` to AWS S3 or Cloudinary for product image hosting.
- ✅ 2. **Database:** MongoDB Atlas is configured and connected via `.env` MONGO_URI.
- [ ] 3. **Frontend Deployment:** Deploy the Next.js application to Vercel.
- [ ] 4. **Backend Deployment:** Deploy the Express API to a scalable service like Render or Railway.
- [ ] 5. **CORS & Domains:** Update CORS configuration in Express to strictly allow requests only from the production Vercel domain.

**Definition of Done (DoD):** The platform is publicly accessible via HTTPS, payments are processed, and emails are delivered.

---

### Architectural Observations & Recommendations (For Critical Thinking)

1. **Image Hosting Risk:** Introduce an external object storage service (AWS S3 or Cloudinary) in Phase 7 to avoid local filesystem wipes.
2. **Cart Sync Strategy:** Use local storage (Zustand persist) for unauthenticated users, and upon login, merge the local cart with the database cart via API.
3. **Stripe Webhooks:** The source of truth for an order being marked 'Paid' MUST be a secure backend Stripe Webhook endpoint, not just a frontend success response.

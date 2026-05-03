# Bristiii - Modern Art Gallery & E-Commerce Platform
A premium, full-stack art gallery application built with Next.js 16 and Express 5, featuring a minimalist museum-grade aesthetic, generative art experiences, secure checkout, and comprehensive curator tools.

`Next.js` `React` `TailwindCSS` `Express` `MongoDB` `Stripe`

🎯 Project Description
**Bristiii** is a sophisticated art gallery platform designed to elevate the online art acquisition experience. It transforms the traditional e-commerce interface into a quiet, immersive gallery space where the art remains the primary focus. Beyond simple transactions, Bristiii features interactive generative art components like "The Breathing Canopy" and "Live Pencil Sketch," providing users with a unique digital atmosphere while they browse, wishlist, and purchase curated artworks.

✨ Implemented Features
🌐 Public Features
**Landing Page** - An immersive "Gallery Entrance" featuring 11 artistic sections:
- **Hero Section** - Minimalist gallery entrance with smooth GSAP transitions.
- **Offer Slider** - Promotional marquee for featured collections.
- **Featured Artwork** - A curated grid of premium picks.
- **Live Pencil Sketch** - Interactive digital sketch animation ("The Living Artwork").
- **Tree Canvas** - Generative particle engine ("The Breathing Canopy").
- **Artistic Shelf** - Interactive 3D-style collection explorer.
- **Artist Story** - In-depth narrative about the creative vision.
- **Value Section** - Highlighting the platform's commitment to quality.
- **Testimonials** - Client experiences presented in a premium layout.
- **CTA & Newsletter** - Elegant prompts for engagement and updates.

**Art Exploration** - Comprehensive artwork catalog:
- **Search & Filtering** - Filter by category, price, and artist.
- **Artwork Details** - High-fidelity images, detailed specifications, and curatorial descriptions.
- **Interactive Reviews** - Star ratings and customer feedback for each piece.

🔐 Authentication System
- **Google OAuth Integration** - Seamless one-tap login via `@react-oauth/google`.
- **Email/Password Auth** - Secure credentials-based login and registration.
- **JWT Session Management** - Secure token-based authentication for all protected routes.
- **Password Recovery** - Forgot/Reset password flow with secure email links.
- **Protected Routes** - Middleware-guarded paths for users and administrators.

🛒 Shopping Features
- **Artistic Cart** - Persistent cart management powered by Zustand.
- **Wishlist** - Save favorite pieces to a personal collection for later acquisition.
- **Checkout Flow** - Secure multi-step checkout process.
- **Stripe Integration** - Real-time credit/debit card processing for secure transactions.
- **Order Management** - Automated order generation and status tracking.
- **Invoice Generation** - PDF-based artistic certificates of acquisition via PDFKit.

👤 Curator & User Dashboards
**Customer Dashboard:**
- **Order History** - Detailed view of past acquisitions.
- **Profile Management** - Update personal details and shipping information.
- **Wishlist Overview** - Quick access to saved artworks.

**Admin (Curator) Dashboard:**
- **Product Management** - Full CRUD for gallery inventory.
- **Order Oversight** - Track and manage all platform sales.
- **Blog Management** - Create and edit gallery stories and news.
- **Promo Management** - Create and track promotional campaigns.
- **Message Center** - Manage contact inquiries from prospective collectors.

🛠️ Technology Stack
Frontend
- **Framework:** Next.js 16.2.4 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4 with `@tailwindcss/postcss`
- **Animations:** GSAP 3.15 & Framer Motion 12.38
- **State Management:** Zustand 5.0
- **Components:** shadcn/ui & Lucide React
- **Authentication:** Google OAuth & Custom JWT
- **Notifications:** React Toastify
- **Utilities:** axios, clsx, tailwind-merge

Backend
- **Server:** Express.js 5.2.1
- **Database:** MongoDB with Mongoose 9.6
- **Security:** bcrypt, helmet, express-rate-limit
- **Auth:** jsonwebtoken & google-auth-library
- **Payment:** Stripe API
- **Files:** Multer for artwork uploads
- **Mailing:** Nodemailer
- **PDFs:** PDFKit for invoices

📁 Project Structure
```
Artwork-E-Commerce-Platform/
├── frontend/                 # Next.js Application
│   ├── app/                 # App Router (auth, shop, admin, dashboard)
│   ├── components/          # UI, Home, Shared, & Page-specific components
│   ├── lib/                 # Shared utilities and API clients
│   ├── store/               # Zustand state stores (cart, user)
│   └── public/              # Static assets and images
│
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Auth and validation guards
│   │   ├── services/        # Business logic (Stripe, Email)
│   │   └── utils/           # Helper functions
│   └── uploads/             # Stored artwork images
│
└── shared/                   # Shared configurations/types
```

🚀 Setup & Installation
Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Stripe Account (API Keys)
- Google Cloud Console (OAuth Client ID)

Step 1: Setup Backend
1. Navigate to `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` file from `.env.example` and fill in credentials.
3. Start the server:
   ```bash
   npm run dev
   ```

Step 2: Setup Frontend
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env.local` and add `NEXT_PUBLIC_API_URL` and Google/Stripe keys.
3. Start the development server:
   ```bash
   npm run dev
   ```

🗺️ Routes Summary
Public Routes
- `/` - Immersive Landing Page
- `/products` - Artwork Catalog
- `/products/[id]` - Detailed Artwork View
- `/about` - Gallery Story
- `/blog` - News and Artistic Insights

Protected Routes
- `/cart` - Acquisition Basket
- `/wishlist` - Private Collection
- `/checkout` - Secure Payment Flow
- `/dashboard` - User Overview
- `/admin` - Curator Control Panel

🔧 Development Workflow
**Concurrent Development:**
Run both servers simultaneously for full functionality:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

📊 API Filtering
`GET /api/products` supports: `category`, `search`, `minPrice`, `maxPrice`, `sort`.

🌟 Future Enhancements
- **AR View** - Visualizing artwork in user's space.
- **Auction System** - Real-time bidding for rare pieces.
- **Artist Portfolios** - Dedicated pages for independent creators.
- **Multi-currency Support** - Global pricing options.

📄 License
This project is licensed under the ISC License.

👨💻 Author
Built with ❤️ for the Art & Tech Community.

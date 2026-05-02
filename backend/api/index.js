const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config();

const connectDB = require("../src/config/db");
// 🚀 Vercel optimization: Connect to DB immediately
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      console.error("CORS Error: Origin", origin, "not allowed");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts, please try again after 15 minutes." },
});

// Stripe Webhook (Must be before express.json)
const { stripeWebhook } = require("../src/controllers/orderController");
app.post("/api/orders/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());

// API Routes
app.use("/api/auth", authLimiter, require("../src/routes/authRoutes"));
app.use("/api/products", require("../src/routes/productRoutes"));
app.use("/api/products/:id/reviews", require("../src/routes/productReviewRoutes"));
app.use("/api/cart", require("../src/routes/cartRoutes"));
app.use("/api/orders", require("../src/routes/orderRoutes"));
app.use("/api/promotions", require("../src/routes/promotionRoutes"));
app.use("/api/reviews", require("../src/routes/reviewRoutes"));
app.use("/api/home-config", require("../src/routes/homeConfigRoutes"));
app.use("/api/blogs", require("../src/routes/blogRoutes"));
app.use("/api/contacts", require("../src/routes/contactRoutes"));

// Serve static files (uploads)
// 🚀 Vercel fix: Use absolute path and check existence
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Base Route
app.get("/", (req, res) => {
  res.send("Bristiii Artwork Gallery API is running...");
});

// Error Handlers
const { notFound, errorHandler } = require("../src/middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

module.exports = app;

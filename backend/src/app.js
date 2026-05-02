const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config();

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
const { stripeWebhook } = require("./controllers/orderController");
app.post("/api/orders/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());

// API Routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/products/:id/reviews", require("./routes/productReviewRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/promotions", require("./routes/promotionRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/home-config", require("./routes/homeConfigRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Base Route
app.get("/", (req, res) => {
  res.send("Bristiii Artwork Gallery API is running...");
});

// Error Handlers
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

module.exports = app;

// Production Optimized Build - May 2026
// This is the clean, high-performance version of the Artwork E-Commerce API.
const app = require("../src/app");

// 🚀 Database connection assurance for Vercel Serverless
// Although src/app.js calls connectDB() at the top level, 
// some serverless environments benefit from an explicit connection check 
// in the request lifecycle to handle cold starts and dropped connections.
const connectDB = require("../src/config/db");

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;

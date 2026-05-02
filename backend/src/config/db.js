const mongoose = require("mongoose");

/**
 * 🚀 High-Performance Serverless Connection Caching
 * We cache the connection promise globally to ensure that multiple
 * concurrent requests during a cold start don't initiate separate
 * connection attempts, which significantly reduces latency.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Re-enable to prevent race conditions during cold starts
      serverSelectionTimeoutMS: 10000, 
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected (New Session)");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Database Connected Successfully");
  } catch (e) {
    cached.promise = null;
    console.error("❌ DATABASE CONNECTION ERROR DETAILS:");
    console.error(`- Message: ${e.message}`);
    console.error(`- Code: ${e.code || "N/A"}`);
    
    // Sanitize URI for safe logging to check format
    const sanitizedUri = process.env.MONGO_URI 
      ? process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@") 
      : "UNDEFINED";
    console.error(`- Sanitized URI: ${sanitizedUri}`);
    
    throw new Error(`Database Error: ${e.message}`);
  }

  return cached.conn;
};

module.exports = connectDB;

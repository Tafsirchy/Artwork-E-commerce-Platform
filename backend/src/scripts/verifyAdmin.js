const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

// Use raw model to bypass pre-save hooks
const RawUser = mongoose.model("User", userSchema);

const verifyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected.\n");

    const user = await RawUser.findOne({ email: "admin@bristiii.com" });

    if (!user) {
      console.log("❌ No user found with email: admin@bristiii.com");
      console.log("→ Running fix: creating admin now...");
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      await RawUser.create({
        name: "Head Curator",
        email: "admin@bristiii.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin created successfully!");
    } else {
      console.log("✅ Admin user FOUND:");
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password hash: ${user.password.slice(0, 20)}...`);
      
      // Test password comparison
      const match = await bcrypt.compare("admin123", user.password);
      console.log(`\n🔑 Password "admin123" matches: ${match ? "✅ YES" : "❌ NO"}`);

      if (!match) {
        console.log("\n→ Password mismatch detected! Fixing now...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        await RawUser.updateOne({ email: "admin@bristiii.com" }, { $set: { password: hashedPassword, role: "admin" } });
        console.log("✅ Password reset directly in database (bypassing hooks).");
        
        // Verify again
        const updatedUser = await RawUser.findOne({ email: "admin@bristiii.com" });
        const verify = await bcrypt.compare("admin123", updatedUser.password);
        console.log(`   Re-verification: ${verify ? "✅ Password now works!" : "❌ Still broken"}`);
      }
    }

    // List ALL admin accounts
    const allAdmins = await RawUser.find({ role: "admin" }).select("email name role");
    console.log("\n📋 All admin accounts in database:");
    allAdmins.forEach(a => console.log(`   - ${a.email} (${a.name})`));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

verifyAdmin();

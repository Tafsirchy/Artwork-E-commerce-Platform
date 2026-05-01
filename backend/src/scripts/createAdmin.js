const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    const adminEmail = "admin@bristiii.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin already exists. Updating password...");
      adminExists.password = "admin123";
      adminExists.role = "admin";
      await adminExists.save();
    } else {
      await User.create({
        name: "Head Curator",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log("Admin user created successfully!");
    }

    console.log("Credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: admin123");
    
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

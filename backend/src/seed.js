/**
 * ============================================================
 * 🌱 SEED SCRIPT — Artwork E-Commerce Platform
 * ============================================================
 * Run: node src/seed.js
 * Run with --destroy: node src/seed.js --destroy
 * ============================================================
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Promotion = require("./models/Promotion");

// ─────────────────────────────────────────────
// 0. PROMOTIONS (Coupons & Offers)
// ─────────────────────────────────────────────
const promotions = [
  { title: "Summer Solstice Sale", code: "SUMMER24", discount: "20% OFF", type: "Global" },
  { title: "First Acquisition", code: "WELCOME", discount: "$50 OFF", type: "New Member" },
  { title: "Architectural Series", code: "ARCHI15", discount: "15% OFF", type: "Category" },
  { title: "Curator's Flash Sale", code: "FLASH25", discount: "25% OFF", type: "Limited Time" },
  { title: "Collector's Anniversary", code: "BRISTIII_5", discount: "10% OFF", type: "Loyalty" },
];

// ─────────────────────────────────────────────
// 1. USERS
// ─────────────────────────────────────────────
const users = [
  { name: "Admin Gallery", email: "admin@bristiii.com", password: "admin1234", role: "admin" },
  { name: "Elena Marchetti", email: "elena@example.com", password: "password123", role: "customer" },
  { name: "James Okoye", email: "james@example.com", password: "password123", role: "customer" },
  { name: "Sofia Andreou", email: "sofia@example.com", password: "password123", role: "customer" },
];

// ─────────────────────────────────────────────
// 2. PRODUCTS (Artworks)
// colorConcept: dominant hex colors of the artwork
// ─────────────────────────────────────────────
const products = [
  {
    title: "Celestial Bloom",
    description:
      "A mesmerising explosion of cosmic colour, this piece captures the birth of a nebula in oils. The swirling galaxies of pigment seem to breathe and pulse, inviting deep contemplation on the infinite scale of the universe.",
    price: 2400,
    offerPrice: 1900,
    imageUrl: "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Elias Vance",
    category: "Abstract",
    colorConcept: ["#8A2BE2", "#FF69B4", "#00CED1", "#FFD700", "#1E90FF"],
  },
  {
    title: "The Silent Canvas",
    description:
      "Minimalism at its apex. A vast, contemplative field of muted grey is interrupted by a single, perfect horizontal line — a meditation on tension, rest, and the space between thought and action.",
    price: 1850,
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Sarah Thorne",
    category: "Minimalism",
    colorConcept: ["#A9A9A9", "#D3D3D3", "#F5F5F5", "#696969"],
  },
  {
    title: "Golden Hour",
    description:
      "Capturing the fleeting alchemy of late afternoon light, this expressionist work explodes with cadmium yellow and raw sienna. The brushwork is urgent, almost feverish — a record of a single, irrepeatable moment.",
    price: 3100,
    imageUrl: "https://images.unsplash.com/photo-1614519679749-3189ec5687d9?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Julian Reed",
    category: "Expressionism",
    colorConcept: ["#FFD700", "#FF8C00", "#FF4500", "#FFA500", "#FFEC8B"],
  },
  {
    title: "Midnight Whisper",
    description:
      "A hauntingly beautiful portrait of a woman in shadow. The figure emerges from a deep, velvety darkness in the tradition of the Old Masters, yet the fractured geometry of the face places it firmly in the modern era.",
    price: 4200,
    offerPrice: 3500,
    imageUrl: "https://images.unsplash.com/photo-1740510294148-2b8f82471496?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Clara Bell",
    category: "Modern",
    colorConcept: ["#191970", "#4B0082", "#2F4F4F", "#708090", "#C0C0C0"],
  },
  {
    title: "Forest Reverie",
    description:
      "Dappled light filters through ancient canopy in this luminous landscape. The artist spent three seasons in the Scottish Highlands to capture this specific quality of green — alive, wet, and impossibly deep.",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Liam Ashford",
    category: "Landscape",
    colorConcept: ["#228B22", "#006400", "#32CD32", "#8FBC8F", "#556B2F"],
  },
  {
    title: "Urban Solitude",
    description:
      "A lone figure crosses a rain-slicked street at 3am. The reflections multiply endlessly into the dark wet asphalt, questioning the nature of identity and isolation in the modern metropolis.",
    price: 3600,
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Mia Chen",
    category: "Contemporary",
    colorConcept: ["#2F4F4F", "#708090", "#B0C4DE", "#4682B4", "#1C1C1C"],
  },
  {
    title: "Terracotta Dream",
    description:
      "Inspired by ancient pottery and the rich earth tones of the Moroccan desert, this abstract work explores the tactile and the timeless. The artist mixed actual clay dust into her pigments for an unprecedented textural depth.",
    price: 1950,
    imageUrl: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=800&q=80",
    stock: 2,
    creator: "Amara Diallo",
    category: "Abstract",
    colorConcept: ["#E2725B", "#C04000", "#CD853F", "#D2691E", "#A0522D"],
  },
  {
    title: "The Cartographer",
    description:
      "Intricate ink lines map an imaginary continent across a vast sheet of Japanese washi paper. Every mountain range, river delta, and coastline is invented, yet the whole reads with the weighty authority of a historical atlas.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    stock: 3,
    creator: "Hiroshi Yamamoto",
    category: "Illustration",
    colorConcept: ["#F5DEB3", "#DEB887", "#8B4513", "#000000", "#2E8B57"],
  },
  {
    title: "Sea Glass",
    description:
      "An achingly serene seascape painted on a warm summer morning. The horizon line sits extraordinarily low, leaving the viewer adrift in an enormous, almost photographic sky of pearl and turquoise.",
    price: 5500,
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Nora Fitzgerald",
    category: "Landscape",
    colorConcept: ["#00CED1", "#40E0D0", "#87CEEB", "#E0F8FF", "#1E90FF"],
  },
  {
    title: "Crimson Interior",
    description:
      "A Matisse-like interior flooded with a deep, theatrical red. The flatness of the colour and the bold black outlines of the furniture recall the Fauvist revolution — joyful, sensuous, and completely unapologetic.",
    price: 3800,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Pablo Vidal",
    category: "Fauvism",
    colorConcept: ["#DC143C", "#B22222", "#FF6347", "#FF0000", "#8B0000"],
  },
  {
    title: "Drift",
    description:
      "Layers of translucent wax (encaustic medium) build up like geological strata, creating a surface of extraordinary depth. The blues and whites suggest both arctic ice and open ocean, caught in a permanent, luminous suspension.",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    stock: 1,
    creator: "Ingrid Halvorsen",
    category: "Mixed Media",
    colorConcept: ["#1E90FF", "#00BFFF", "#ADD8E6", "#F0F8FF", "#4169E1"],
  },
  {
    title: "The Observer",
    description:
      "A monumental charcoal drawing of a single human eye, rendered with such precision and sensitivity that it seems to belong to a specific, known person. Who is watching whom? The question is the point.",
    price: 900,
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80",
    stock: 5,
    creator: "Zara Phillips",
    category: "Drawing",
    colorConcept: ["#1C1C1C", "#696969", "#A9A9A9", "#FFFFFF", "#4A4A4A"],
  },
];

// ─────────────────────────────────────────────
// 3. SEED LOGIC
// ─────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("✅ MongoDB Connected");

    const destroy = process.argv.includes("--destroy");

    if (destroy) {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
      console.log("🗑️  All existing data wiped.");
      await mongoose.disconnect();
      return;
    }

    // ── Hash passwords manually (pre-save hook won't run with insertMany)
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    // ── Wipe old data then insert fresh
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Promotion.deleteMany({});

    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(products);
    const createdPromotions = await Promotion.insertMany(promotions);

    console.log(`👤 ${createdUsers.length} users seeded`);
    console.log(`🎨 ${createdProducts.length} artworks seeded`);
    console.log(`🎟️  ${createdPromotions.length} promotions seeded`);

    // ── Seed some realistic orders
    const customer1 = createdUsers.find((u) => u.email === "elena@example.com");
    const customer2 = createdUsers.find((u) => u.email === "james@example.com");

    const p1 = createdProducts[0]; // Celestial Bloom
    const p2 = createdProducts[2]; // Golden Hour
    const p3 = createdProducts[4]; // Forest Reverie
    const p4 = createdProducts[8]; // Sea Glass

    const orders = [
      {
        user: customer1._id,
        orderItems: [
          { product: p1._id, title: p1.title, quantity: 1, price: p1.price, imageUrl: p1.imageUrl },
        ],
        shippingAddress: {
          address: "14 Via Roma", city: "Florence", postalCode: "50100",
          country: "Italy", location: { lat: 43.7696, lng: 11.2558 },
        },
        paymentMethod: "Card",
        paymentResult: {
          id: "pi_mock_001", status: "succeeded",
          update_time: new Date().toISOString(), email_address: customer1.email,
        },
        itemsPrice: p1.price, shippingPrice: 0, totalPrice: p1.price,
        isPaid: true, paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isDelivered: true, deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer1._id,
        orderItems: [
          { product: p2._id, title: p2.title, quantity: 1, price: p2.price, imageUrl: p2.imageUrl },
        ],
        shippingAddress: {
          address: "14 Via Roma", city: "Florence", postalCode: "50100",
          country: "Italy", location: { lat: 43.7696, lng: 11.2558 },
        },
        paymentMethod: "Card",
        itemsPrice: p2.price, shippingPrice: 25, totalPrice: p2.price + 25,
        isPaid: false, isDelivered: false,
      },
      {
        user: customer2._id,
        orderItems: [
          { product: p3._id, title: p3.title, quantity: 1, price: p3.price, imageUrl: p3.imageUrl },
          { product: p4._id, title: p4.title, quantity: 1, price: p4.price, imageUrl: p4.imageUrl },
        ],
        shippingAddress: {
          address: "221B Baker Street", city: "London", postalCode: "NW1 6XE",
          country: "United Kingdom", location: { lat: 51.5074, lng: -0.1278 },
        },
        paymentMethod: "COD",
        itemsPrice: p3.price + p4.price, shippingPrice: 50, totalPrice: p3.price + p4.price + 50,
        isPaid: false, isDelivered: false,
      },
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`📦 ${createdOrders.length} orders seeded`);

    console.log("\n════════════════════════════════════");
    console.log("🌱 DATABASE SEEDED SUCCESSFULLY");
    console.log("════════════════════════════════════");
    console.log("Admin    ➜  admin@bristiii.com  /  admin1234");
    console.log("Customer ➜  elena@example.com   /  password123");
    console.log("Customer ➜  james@example.com   /  password123");
    console.log("════════════════════════════════════\n");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();

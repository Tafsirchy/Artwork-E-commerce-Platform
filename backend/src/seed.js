/**
 * ============================================================
 * 🌱 SEED SCRIPT — Artwork E-Commerce Platform (Curated 34)
 * ============================================================
 * All products mapped to 6 Core Categories for the Tree Layout
 * Includes 20 Curated Collector Reviews (Voices of the Incurious)
 * Run: node src/seed.js
 * ============================================================
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Promotion = require("./models/Promotion");
const Review = require("./models/Review");

// ─────────────────────────────────────────────
// 0. PROMOTIONS
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
// 2. PRODUCTS (34 Artworks mapped to 6 Categories)
// ─────────────────────────────────────────────
const products = [
  {
    title: "Celestial Bloom",
    description: "A mesmerising explosion of cosmic colour, capturing the birth of a nebula in oils.",
    price: 2400,
    imageUrl: "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?auto=format&fit=crop&w=800&q=80",
    stock: 1, creator: "Elias Vance", category: "Abstract",
    colorConcept: ["#8A2BE2", "#FF69B4", "#00CED1"]
  },
  {
    title: "Terracotta Dream",
    description: "Inspired by ancient pottery and rich earth tones of the Moroccan desert.",
    price: 1950,
    imageUrl: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=80",
    stock: 2, creator: "Amara Diallo", category: "Abstract",
    colorConcept: ["#E2725B", "#C04000", "#CD853F"]
  },
  {
    title: "Urban Solitude",
    description: "A lone figure crosses a rain-slicked street at 3am, reflecting isolation.",
    price: 3600,
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&q=80&w=600",
    stock: 1, creator: "Mia Chen", category: "Modern",
    colorConcept: ["#2F4F4F", "#708090", "#1C1C1C"]
  },
  {
    title: "Golden Hour",
    description: "Capturing the fleeting alchemy of late afternoon light with cadmium yellow.",
    price: 3100,
    imageUrl: "https://images.unsplash.com/photo-1614519679749-3189ec5687d9?auto=format&fit=crop&w=800&q=80",
    stock: 1, creator: "Julian Reed", category: "Expressionism",
    colorConcept: ["#FFD700", "#FF8C00", "#FF4500"]
  },
  {
    title: "Midnight Whisper",
    description: "A hauntingly beautiful portrait of a woman in deep, velvety darkness.",
    price: 4200,
    imageUrl: "https://images.unsplash.com/photo-1740510294148-2b8f82471496?auto=format&fit=crop&w=800&q=80",
    stock: 1, creator: "Clara Bell", category: "Modern",
    colorConcept: ["#191970", "#4B0082", "#2F4F4F"]
  },
  {
    title: "Shadows of Truth",
    description: "A dark, moody photography series exploring hidden urban corners.",
    price: 1100,
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80",
    stock: 10, creator: "Mark Shadow", category: "Modern",
    colorConcept: ["#1C1C1C", "#363636", "#696969"]
  },
  {
    title: "Julian Estebán",
    description: "Soft morning light breaking through the morning mist in orange and gold.",
    price: 2900,
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&q=80&w=600",
    stock: 1, creator: "Julian Reed", category: "Landscape",
    colorConcept: ["#FFBF00", "#FF8C00", "#FF4500"]
  },
  {
    title: "Eleanor Rigby",
    description: "A bronze sculpture capturing the fluidity of time in a single loop.",
    price: 6800,
    imageUrl: "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&q=80&w=600",
    stock: 1, creator: "Soren Kuhl", category: "Abstract",
    colorConcept: ["#8B4513", "#A0522D", "#D2B48C"]
  },
  {
    title: "Aetherial Echo",
    description: "A digital exploration of sound waves translated into light and shadow.",
    price: 1450,
    imageUrl: "https://images.unsplash.com/photo-1743265105419-797a12700bfd?q=80&w=1493&auto=format&fit=crop",
    stock: 5, creator: "Soren Kuhl", category: "Modern",
    colorConcept: ["#6A5ACD", "#87CEEB", "#F0F8FF"]
  },
  {
    title: "Basalt Rhythms",
    description: "Inspired by the jagged coastlines and volcanic textures of the North.",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1733576951147-54abea938f60?q=80&w=1241&auto=format&fit=crop",
    stock: 1, creator: "Liam Ashford", category: "Landscape",
    colorConcept: ["#2F4F4F", "#708090", "#1C1C1C"]
  },
  {
    title: "The Silent Watcher",
    description: "A minimal portrait focusing on the heavy atmosphere of anticipation.",
    price: 3100,
    imageUrl: "https://images.unsplash.com/photo-1733255024933-ac33ade38511?q=80&w=835&auto=format&fit=crop",
    stock: 2, creator: "Clara Bell", category: "Modern",
    colorConcept: ["#DCDCDC", "#A9A9A9", "#696969"]
  },
  {
    title: "Fractured Dawn",
    description: "Abstract morning light breaking through geometric architectural shapes.",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1700605293721-1573ff30a0e4?q=80&w=742&auto=format&fit=crop",
    stock: 3, creator: "Elias Vance", category: "Abstract",
    colorConcept: ["#FFD700", "#FFA500", "#F5DEB3"]
  },
  {
    title: "Submerged Vision",
    description: "An underwater perspective exploring the distortion of reality through fluid.",
    price: 2600,
    imageUrl: "https://images.unsplash.com/photo-1751574979393-798cf0623df8?q=80&w=799&auto=format&fit=crop",
    stock: 1, creator: "Nora Fitzgerald", category: "Landscape",
    colorConcept: ["#00CED1", "#1E90FF", "#00BFFF"]
  },
  {
    title: "Concrete Jungle",
    description: "A contemporary take on urban density and the overlap of structural lines.",
    price: 1950,
    imageUrl: "https://images.unsplash.com/photo-1700605295317-4a266ea62400?q=80&w=1073&auto=format&fit=crop",
    stock: 4, creator: "Mia Chen", category: "Modern",
    colorConcept: ["#778899", "#2F4F4F", "#C0C0C0"]
  },
  {
    title: "Petal Symphony",
    description: "Delicate floral abstractions focusing on the kinetic energy of blooming.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1741723972198-659a2b181d09?q=80&w=725&auto=format&fit=crop",
    stock: 10, creator: "Elena Marchetti", category: "Expressionism",
    colorConcept: ["#FFB6C1", "#FF69B4", "#FFF0F5"]
  },
  {
    title: "Iron Heart",
    description: "A raw study of metal oxidation and the beauty of industrial decay.",
    price: 4500,
    imageUrl: "https://images.unsplash.com/photo-1751578777361-b360c4326583?q=80&w=1004&auto=format&fit=crop",
    stock: 1, creator: "Jack Irons", category: "Abstract",
    colorConcept: ["#8B4513", "#A0522D", "#CD853F"]
  },
  {
    title: "Whispers in Wax",
    description: "Encaustic medium layered to create a sense of ancient, forgotten maps.",
    price: 2400,
    imageUrl: "https://images.unsplash.com/photo-1748202621835-bc4e0581e5e4?q=80&w=1134&auto=format&fit=crop",
    stock: 1, creator: "Ingrid Halvorsen", category: "Abstract",
    colorConcept: ["#F5F5DC", "#DEB887", "#8B4513"]
  },
  {
    title: "Lunar Path",
    description: "A night-scape capturing the silver reflections of the moon on open water.",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1742648308982-2bb04fd8cc62?q=80&w=1036&auto=format&fit=crop",
    stock: 1, creator: "Nora Fitzgerald", category: "Landscape",
    colorConcept: ["#191970", "#4682B4", "#B0C4DE"]
  },
  {
    title: "Obsidian Flow",
    description: "A glass-like surface reflecting the kinetic motion of dark energy.",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1748287443977-bcba144c2e13?q=80&w=1079&auto=format&fit=crop",
    stock: 2, creator: "Elias Vance", category: "Abstract",
    colorConcept: ["#000000", "#1C1C1C", "#363636"]
  },
  {
    title: "Golden Thread",
    description: "A minimalist study of connectivity and the single point of contact.",
    price: 1550,
    imageUrl: "https://images.unsplash.com/photo-1733004441403-2fa108958e78?q=80&w=811&auto=format&fit=crop",
    stock: 3, creator: "Sarah Thorne", category: "Minimalism",
    colorConcept: ["#FFD700", "#FFFFFF", "#F5F5F5"]
  },
  {
    title: "Primal Rust",
    description: "Abstract exploration of elemental change and the passage of time.",
    price: 2100,
    imageUrl: "https://images.unsplash.com/photo-1748202621971-2f3dd29777c7?q=80&w=909&auto=format&fit=crop",
    stock: 1, creator: "Marcus Reel", category: "Modern",
    colorConcept: ["#B22222", "#8B0000", "#CD5C5C"]
  },
  {
    title: "Curator's Muse",
    description: "A premium photography piece capturing the elegance of gallery spaces.",
    price: 5500,
    imageUrl: "https://plus.unsplash.com/premium_photo-1682125227290-f62abb91ed5b?q=80&w=880&auto=format&fit=crop",
    stock: 1, creator: "Mark Shadow", category: "Modern",
    colorConcept: ["#FDF5E6", "#FAEBD7", "#D2B48C"]
  },
  {
    title: "Neon Horizon",
    description: "A digital landscape envisioning the edge of a virtual civilization.",
    price: 1250,
    imageUrl: "https://images.unsplash.com/photo-1751003801746-b222dd5b7751?q=80&w=1025&auto=format&fit=crop",
    stock: 10, creator: "Kenji Sato", category: "Modern",
    colorConcept: ["#FF00FF", "#8A2BE2", "#0000FF"]
  },
  {
    title: "Steel Reverie",
    description: "Large scale metal installation exploring the softness of industrial shapes.",
    price: 9200,
    imageUrl: "https://images.unsplash.com/photo-1751031388324-062abdeef672?q=80&w=1150&auto=format&fit=crop",
    stock: 1, creator: "Jack Irons", category: "Abstract",
    colorConcept: ["#C0C0C0", "#B0C4DE", "#778899"]
  },
  {
    title: "Midnight Oil",
    description: "Thick impasto strokes capturing the frantic energy of late-night creation.",
    price: 3800,
    imageUrl: "https://images.unsplash.com/photo-1733004441474-eb393a695005?q=80&w=697&auto=format&fit=crop",
    stock: 1, creator: "Elias Vance", category: "Expressionism",
    colorConcept: ["#191970", "#000080", "#2F4F4F"]
  },
  {
    title: "Glass Wings",
    description: "Fragile structural lines exploring the balance of strength and vulnerability.",
    price: 2700,
    imageUrl: "https://images.unsplash.com/photo-1745758278648-873757cf8af5?q=80&w=1028&auto=format&fit=crop",
    stock: 2, creator: "Soren Kuhl", category: "Illustration",
    colorConcept: ["#F0F8FF", "#E6E6FA", "#D8BFD8"]
  },
  {
    title: "Void Symphony",
    description: "Minimalist black on black texture exploring the depth of silence.",
    price: 2000,
    imageUrl: "https://images.unsplash.com/photo-1748287444125-fddb850727e9?q=80&w=782&auto=format&fit=crop",
    stock: 1, creator: "Sarah Thorne", category: "Minimalism",
    colorConcept: ["#000000", "#080808", "#121212"]
  },
  {
    title: "Amber Grid",
    description: "Structural lines over warm gradients, reflecting urban architecture.",
    price: 1650,
    imageUrl: "https://images.unsplash.com/photo-1734984361605-7be177d61425?q=80&w=676&auto=format&fit=crop",
    stock: 3, creator: "Hiroshi Yamamoto", category: "Illustration",
    colorConcept: ["#FFBF00", "#FF8C00", "#CD853F"]
  },
  {
    title: "Static Pulse",
    description: "A contemporary study of movement in a frozen, pixelated state.",
    price: 1350,
    imageUrl: "https://images.unsplash.com/photo-1737043256487-18feca304edb?q=80&w=1094&auto=format&fit=crop",
    stock: 5, creator: "Digi Aris", category: "Modern",
    colorConcept: ["#708090", "#778899", "#FFFFFF"]
  },
  {
    title: "Indigo Depths",
    description: "Deep oceanic gradients exploring the unseen world below.",
    price: 3400,
    imageUrl: "https://images.unsplash.com/photo-1737043256511-eb518499ef12?q=80&w=931&auto=format&fit=crop",
    stock: 1, creator: "Liam Ashford", category: "Landscape",
    colorConcept: ["#00008B", "#0000CD", "#4169E1"]
  },
  {
    title: "Alchemist's Gold",
    description: "Premium study of material value and the transmutation of form.",
    price: 7200,
    imageUrl: "https://plus.unsplash.com/premium_photo-1711987284105-00134bc26c54?q=80&w=1233&auto=format&fit=crop",
    stock: 1, creator: "Pablo Vidal", category: "Modern",
    colorConcept: ["#D4AF37", "#FFD700", "#B8860B"]
  },
  {
    title: "Broken Horizon",
    description: "A fractured landscape series exploring the fragility of the natural world.",
    price: 1900,
    imageUrl: "https://images.unsplash.com/photo-1748288166817-ceda20ad849d?q=80&w=719&auto=format&fit=crop",
    stock: 4, creator: "Liam Ashford", category: "Landscape",
    colorConcept: ["#8FBC8F", "#2E8B57", "#006400"]
  },
  {
    title: "Crimson Flow",
    description: "Fluid abstract work focusing on the warmth of deep red pigments.",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1737043257397-9d4a50cc9ac8?q=80&w=809&auto=format&fit=crop",
    stock: 1, creator: "Marcus Reel", category: "Abstract",
    colorConcept: ["#DC143C", "#8B0000", "#FF4500"]
  },
  {
    title: "Shadow Play",
    description: "Minimalist photography exploring the interaction of light and hard edges.",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1731271326531-3f8e9ba7e66e?q=80&w=810&auto=format&fit=crop",
    stock: 12, creator: "Mark Shadow", category: "Modern",
    colorConcept: ["#1C1C1C", "#696969", "#FFFFFF"]
  },
];

// ─────────────────────────────────────────────
// 3. REVIEWS (20 Collector Chronicels)
// ─────────────────────────────────────────────
const reviews = [
  { name: "Jonathan Vance", role: "Art Collector", stars: 5, content: "The delivery process was impeccable. The painting arrived in perfect condition and the tracking was incredibly accurate.", artImage: products[0].imageUrl },
  { name: "Sarah Jenkins", role: "Interior Designer", stars: 5, content: "Bristiii is my go-to for original pieces. The curation is world-class and the checkout experience is the smoothest I've used.", artImage: products[1].imageUrl },
  { name: "Marcus Thorne", role: "First-time Buyer", stars: 5, content: "I was nervous about buying art online, but the certificate of authenticity and the detailed artist stories gave me full confidence.", artImage: products[2].imageUrl },
  { name: "Eleanor Rigby", role: "Gallerist", stars: 5, content: "The lighting and presentation of the digital gallery are stunning. It captures the soul of the work better than any other platform.", artImage: products[3].imageUrl },
  { name: "Julian Estebán", role: "Private Investor", stars: 5, content: "An investment in beauty that appreciates. The advisory team helped me secure a piece that has already grown in value.", artImage: products[4].imageUrl },
  { name: "Clara Oswald", role: "Creative Director", stars: 5, content: "Finally, an art platform that understands the intersection of technology and fine art. Purely sophisticated.", artImage: products[5].imageUrl },
  { name: "Soren Kuhl", role: "Sculptor", stars: 5, content: "Seeing my work presented alongside such masters is an honor. The high-resolution zoom does justice to every chisel mark.", artImage: products[6].imageUrl },
  { name: "Amara Diallo", role: "Pottery Artist", stars: 5, content: "The color accuracy on this site is phenomenal. What I saw on screen is exactly what I received in the mail.", artImage: products[7].imageUrl },
  { name: "Mia Chen", role: "Urban Photographer", stars: 5, content: "The customer dashboard is so intuitive. I love how I can track my acquisition history and download high-res certificates.", artImage: products[8].imageUrl },
  { name: "Liam Ashford", role: "Nature Lover", stars: 5, content: "The 'Explore the Collection' tree is a work of art in itself. It makes discovering new pieces a meditative journey.", artImage: products[9].imageUrl },
  { name: "Nora Fitzgerald", role: "Oceanographer", stars: 5, content: "The transparency regarding provenance is what set this gallery apart. I feel like I'm part of the artwork's history.", artImage: products[10].imageUrl },
  { name: "Elias Vance", role: "Digital Artist", stars: 5, content: "Technologically, this is the most advanced gallery I've partnered with. The Stripe integration is flawless.", artImage: products[11].imageUrl },
  { name: "Sarah Thorne", role: "Minimalist Enthusiast", stars: 5, content: "Simplicity is the ultimate sophistication, and this gallery's UI embodies that perfectly. A joy to browse.", artImage: products[12].imageUrl },
  { name: "Marcus Reel", role: "Contemporary Critic", stars: 5, content: "A refreshing take on the e-commerce experience. It feels more like a private viewing than a shop.", artImage: products[13].imageUrl },
  { name: "Kenji Sato", role: "Tech Visionary", stars: 5, content: "The speed and responsiveness of the platform, even with high-res imagery, is a technical feat. Impressive.", artImage: products[14].imageUrl },
  { name: "Elena Marchetti", role: "Floral Designer", stars: 5, content: "The newsletter insights are actually valuable. I've learned so much about the artists behind my favorite pieces.", artImage: products[15].imageUrl },
  { name: "Jack Irons", role: "Industrial Designer", stars: 5, content: "Robust, elegant, and secure. The attention to detail in the packaging reflects the quality of the art itself.", artImage: products[16].imageUrl },
  { name: "Ingrid Halvorsen", role: "Curator", stars: 5, content: "Bristiii has bridged the gap between physical and digital art ownership. The authentication process is ironclad.", artImage: products[17].imageUrl },
  { name: "Pablo Vidal", role: "Estate Manager", stars: 5, content: "Managing large collections for clients is easy with the admin dashboard. The order tracking is world-class.", artImage: products[18].imageUrl },
  { name: "Zara Phillips", role: "Fashion Editor", stars: 5, content: "Stunning aesthetics. The site doesn't just sell art; it sells a lifestyle. I'm obsessed with the minimalist vibe.", artImage: products[19].imageUrl },
];

// ─────────────────────────────────────────────
// 4. SEED LOGIC
// ─────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Full Platform Injection");

    // ── Hash passwords
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
    await Review.deleteMany({});

    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(products);
    const createdPromotions = await Promotion.insertMany(promotions);
    const createdReviews = await Review.insertMany(reviews);

    // ── Seed Home Config (Featured Section)
    const HomeConfig = require("./models/HomeConfig");
    await HomeConfig.deleteMany({});
    await HomeConfig.create({
      section: "featured",
      productIds: createdProducts.slice(0, 4).map(p => p._id)
    });

    console.log(`👤 ${createdUsers.length} users seeded`);
    console.log(`🎨 ${createdProducts.length} artworks seeded`);
    console.log(`🎟️  ${createdPromotions.length} promotions seeded`);
    console.log(`⭐ ${createdReviews.length} reviews seeded`);

    // ── Seed some orders
    const customer1 = createdUsers.find((u) => u.email === "elena@example.com");
    const p1 = createdProducts[0];
    
    await Order.create({
      user: customer1._id,
      orderItems: [{ product: p1._id, title: p1.title, quantity: 1, price: p1.price, imageUrl: p1.imageUrl }],
      shippingAddress: {
        address: "14 Via Roma", city: "Florence", postalCode: "50100", country: "Italy",
        location: { lat: 43.7696, lng: 11.2558 }
      },
      paymentMethod: "Card",
      itemsPrice: p1.price, shippingPrice: 0, totalPrice: p1.price,
      isPaid: true, paidAt: new Date(), isDelivered: true, deliveredAt: new Date(),
    });

    console.log(`📦 Orders seeded`);
    console.log("\n🌱 PLATFORM FULLY SYNCED (34 ARTWORKS + 20 REVIEWS)");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();

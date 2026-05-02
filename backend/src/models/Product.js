const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    stock: { type: Number, required: true, default: 1 },
    creator: { type: String, required: true },
    category: { type: String, required: true, default: "Painting" },
    // 🎨 Color Concept — dominant hex colors used in the artwork
    colorConcept: {
      type: [String],
      default: [],
      // e.g. ["#FF4500", "#1E90FF", "#FFD700"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

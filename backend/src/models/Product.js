const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 },
    creator: { type: String, required: true }, // The artist's name
    category: { type: String, required: true, default: "Painting" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

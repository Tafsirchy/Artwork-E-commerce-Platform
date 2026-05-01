const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discount: { type: String, required: true }, // e.g., "20% OFF" or "$50 OFF"
  type: { type: String, required: true }, // e.g., "Global", "New Member", "Category"
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);

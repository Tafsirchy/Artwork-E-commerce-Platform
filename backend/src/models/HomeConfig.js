const mongoose = require("mongoose");

const homeConfigSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true }, // e.g. "featured"
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const HomeConfig = mongoose.model("HomeConfig", homeConfigSchema);
module.exports = HomeConfig;

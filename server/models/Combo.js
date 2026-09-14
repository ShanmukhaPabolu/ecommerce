const mongoose = require("mongoose");

const ComboSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    productSlugs: { type: [String], default: [] }, // products included in the combo
    price: { type: Number, required: true }, // bundled price (should be < sum of parts)
    occasion: { type: String, default: "" }, // e.g. "Diwali", "Everyday", "Gifting"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combo", ComboSchema);

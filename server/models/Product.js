const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    // false by default — only set to true when we can confirm the reviewer actually purchased
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, default: "Naik Foods" },
    tagline: { type: String, default: "" },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // single source of truth — no ₹0 products
    compareAtPrice: { type: Number, default: null }, // original price, for discount %
    weight: { type: String, default: "" }, // e.g. "180g"
    image: { type: String, default: "" },
    images: { type: [String], default: [] }, // gallery images
    stock: { type: Number, default: 20, min: 0 },
    salesCount: { type: Number, default: 0 }, // actual units sold — used for Best Sellers sort
    isActive: { type: Boolean, default: true },
    dietaryType: { type: String, enum: ["Veg", "Non-Veg", "Vegan", "Not Specified"], default: "Not Specified" },
    tags: { type: [String], default: [] },
    spiceLevel: { type: String, enum: ["Mild", "Medium", "Spicy", "None"], default: "None" },
    description: { type: String, default: "" },
    nutrition: {
      servingSize: { type: String, default: "" },
      calories: { type: Number, default: null },
      protein: { type: String, default: "" },
      carbs: { type: String, default: "" },
      fat: { type: String, default: "" },
      ingredients: { type: String, default: "" },
      allergens: { type: String, default: "" },
      shelfLife: { type: String, default: "" },
      storageInstructions: { type: String, default: "" },
    },
    // Slugs of products commonly bought together — drives the FBT section on the product page
    frequentlyBoughtWith: { type: [String], default: [] },
    reviews: { type: [ReviewSchema], default: [] },
    linkedRecipeSlug: { type: String, default: null },
  },
  { timestamps: true }
);

ProductSchema.virtual("avgRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

ProductSchema.virtual("discountPercent").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

ProductSchema.virtual("inStock").get(function () {
  return (this.stock ?? 0) > 0;
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", ProductSchema);

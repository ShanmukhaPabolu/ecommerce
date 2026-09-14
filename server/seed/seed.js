require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Combo = require("../models/Combo");
const { products, combos } = require("./seedData");

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env — cannot seed.");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB. Seeding...");

  await Product.deleteMany({});
  await Combo.deleteMany({});

  await Product.insertMany(products);
  await Combo.insertMany(combos);

  console.log(`Seeded ${products.length} products and ${combos.length} combos.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

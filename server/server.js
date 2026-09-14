require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", productRoutes);
app.use("/api", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: global.MOCK_MODE ? "Zero-setup mock mode" : "MongoDB mode" });
});

async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("No MONGO_URI found — starting in MOCK MODE with in-memory seed data.");
    console.log("To use a real database: set MONGO_URI in .env, then run `npm run seed`.");
    global.MOCK_MODE = true;
  } else {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB.");
      global.MOCK_MODE = false;
    } catch (err) {
      console.error("MongoDB connection failed, falling back to MOCK MODE:", err.message);
      global.MOCK_MODE = true;
    }
  }

  app.listen(PORT, () => {
    console.log(`Naik Foods API running on http://localhost:${PORT} (${global.MOCK_MODE ? "mock mode" : "mongodb"})`);
  });
}

start();

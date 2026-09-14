const mongoose = require("mongoose");

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `NF-${year}-${rand}`;
}

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      default: generateOrderNumber,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
    },
    address: {
      line: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        slug: { type: String },
        name: { type: String },
        price: { type: Number },
        qty: { type: Number },
        weight: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "COD"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

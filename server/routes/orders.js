const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// In-memory store for mock mode (no DB)
const mockOrders = [];

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `NF-${year}-${rand}`;
}

function validateOrderPayload(body) {
  const errors = [];
  if (!body.customer?.name?.trim()) errors.push("Customer name is required.");
  if (!body.customer?.mobile?.trim()) errors.push("Mobile number is required.");
  if (!/^\d{10}$/.test((body.customer?.mobile || "").trim()))
    errors.push("Mobile must be a valid 10-digit number.");
  if (!body.customer?.email?.trim()) errors.push("Email is required.");
  if (!body.address?.line?.trim()) errors.push("Delivery address is required.");
  if (!body.address?.city?.trim()) errors.push("City is required.");
  if (!body.address?.state?.trim()) errors.push("State is required.");
  if (!/^\d{6}$/.test((body.address?.pincode || "").trim()))
    errors.push("Pincode must be a valid 6-digit code.");
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0)
    errors.push("Order must contain at least one item.");
  if (!body.paymentMethod || !["UPI", "Card", "COD"].includes(body.paymentMethod))
    errors.push("Payment method must be UPI, Card, or COD.");
  if (!body.subtotal || Number(body.subtotal) <= 0)
    errors.push("Subtotal must be greater than 0.");
  return errors;
}

// POST /api/orders
router.post("/orders", async (req, res) => {
  const errors = validateOrderPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Order validation failed.", errors });
  }

  const { customer, address, items, subtotal, deliveryFee, total, paymentMethod } = req.body;

  try {
    if (global.MOCK_MODE) {
      const order = {
        orderNumber: generateOrderNumber(),
        customer,
        address,
        items,
        subtotal,
        deliveryFee: deliveryFee ?? 0,
        total,
        paymentMethod,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };
      mockOrders.push(order);
      return res.status(201).json({ success: true, order });
    }

    const order = await Order.create({
      customer,
      address,
      items,
      subtotal,
      deliveryFee: deliveryFee ?? 0,
      total,
      paymentMethod,
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderNumber — look up a specific order
router.get("/orders/:orderNumber", async (req, res) => {
  try {
    if (global.MOCK_MODE) {
      const order = mockOrders.find((o) => o.orderNumber === req.params.orderNumber);
      if (!order) return res.status(404).json({ error: "Order not found." });
      return res.json({ order });
    }
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

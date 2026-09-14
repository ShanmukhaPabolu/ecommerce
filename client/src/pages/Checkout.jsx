import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, FREE_DELIVERY_THRESHOLD } from "../context/CartContext.jsx";
import { createOrder } from "../api/api.js";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const TRACKING_STEPS = [
  { icon: "✓", label: "Order Placed" },
  { icon: "📋", label: "Confirmed" },
  { icon: "👨‍🍳", label: "Preparing" },
  { icon: "🚚", label: "Shipped" },
  { icon: "🏠", label: "Delivered" },
];

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, clearCart, cartSavings } = useCart();
  const [form, setForm] = useState({
    name: "", mobile: "", email: "",
    address: "", city: "", state: "", pincode: "",
    paymentMethod: "COD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState(null);

  // ── Order Confirmation ────────────────────────────────────────────────────
  if (orderResult) {
    return (
      <div className="container section" style={{ maxWidth: 660 }}>
        <div className="order-confirmation">
          <div className="oc-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p className="oc-number">Order # <strong>{orderResult.orderNumber}</strong></p>
          <p className="oc-note">
            A confirmation email would normally be sent to <strong>{orderResult.customer?.email}</strong>.
            Your order is being prepared and will be dispatched within 24 hours.
          </p>

          {/* Order Tracking Timeline */}
          <div className="oc-tracking">
            {TRACKING_STEPS.map((s, i) => (
              <div key={i} className={`oc-track-step ${i === 0 ? "active" : ""}`}>
                <div className="oc-track-icon">{s.icon}</div>
                <span className="oc-track-label">{s.label}</span>
                {i < TRACKING_STEPS.length - 1 && <div className="oc-track-line" />}
              </div>
            ))}
          </div>

          <div className="oc-details">
            <div className="oc-row"><span>Subtotal</span><span>₹{orderResult.subtotal}</span></div>
            {cartSavings > 0 && (
              <div className="oc-row" style={{ color: "var(--green-dark)" }}>
                <span>Product savings</span><span>−₹{cartSavings}</span>
              </div>
            )}
            <div className="oc-row"><span>Delivery</span><span>{orderResult.deliveryFee === 0 ? "Free" : `₹${orderResult.deliveryFee}`}</span></div>
            <div className="oc-row oc-total"><span>Total Paid</span><span>₹{orderResult.total}</span></div>
            <div className="oc-row"><span>Payment Method</span><span>{orderResult.paymentMethod}</span></div>
            <div className="oc-row"><span>Estimated Delivery</span><span>2–5 business days</span></div>
          </div>
          <div className="oc-address">
            <strong>Deliver to:</strong><br />
            {orderResult.customer?.name} · {orderResult.customer?.mobile}<br />
            {orderResult.address?.line}, {orderResult.address?.city}, {orderResult.address?.state} — {orderResult.address?.pincode}
          </div>
          <Link to="/store" className="btn btn-primary" style={{ marginTop: 24, justifyContent: "center" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty Cart Guard ──────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container section" style={{ maxWidth: 560, textAlign: "center" }}>
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add a few products before checking out.</p>
          <Link to="/store" className="btn btn-primary" style={{ marginTop: 16 }}>Shop Products</Link>
        </div>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        customer: { name: form.name, mobile: form.mobile, email: form.email },
        address: { line: form.address, city: form.city, state: form.state, pincode: form.pincode },
        items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty, weight: i.weight })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: form.paymentMethod,
      };
      const result = await createOrder(payload);
      clearCart();
      setOrderResult(result.order);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section">
      <h2 style={{ marginBottom: 28 }}>Checkout</h2>
      <div className="checkout-layout">
        {/* ── Form ── */}
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          {/* Section 1: Contact */}
          <div className="form-section">
            <h4 className="form-section-title">
              <span className="form-section-num">1</span> Contact Information
            </h4>
            <input
              placeholder="Full Name *"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <div className="form-row-2">
              <input
                placeholder="Mobile (10 digits) *"
                required
                maxLength={10}
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="form-section">
            <h4 className="form-section-title">
              <span className="form-section-num">2</span> Delivery Address
            </h4>
            <textarea
              placeholder="House/Flat, Street, Area *"
              rows={2}
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <div className="form-row-2">
              <input
                placeholder="City *"
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <select required value={form.state} onChange={(e) => update("state", e.target.value)}>
                <option value="">Select State *</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <input
              placeholder="Pincode (6 digits) *"
              required
              maxLength={6}
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
              style={{ maxWidth: 180 }}
            />
          </div>

          {/* Section 3: Payment */}
          <div className="form-section">
            <h4 className="form-section-title">
              <span className="form-section-num">3</span> Payment Method
            </h4>
            <div className="payment-options">
              {[
                { value: "COD", label: "💵 Cash on Delivery", desc: "Pay when your order arrives" },
                { value: "UPI", label: "📱 UPI", desc: "GPay, PhonePe, Paytm, etc." },
                { value: "Card", label: "💳 Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
              ].map((opt) => (
                <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={() => update("paymentMethod", opt.value)}
                  />
                  <div>
                    <strong>{opt.label}</strong>
                    <small>{opt.desc}</small>
                  </div>
                </label>
              ))}
            </div>
            <p className="prototype-note">
              ⚠ No real payment gateway is connected. No money will be charged.
            </p>
          </div>

          {error && <div className="error-box" style={{ padding: "12px 16px", marginBottom: 12 }}>{error}</div>}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {submitting ? "Placing Order…" : `Place Order — ₹${total}`}
          </button>
        </form>

        {/* ── Order Summary (Sticky) ── */}
        <div className="checkout-summary-sticky">
          <div className="checkout-summary">
            <h4>Order Summary</h4>
            <div className="checkout-items-list">
              {items.map((item) => (
                <div className="co-item" key={item.slug}>
                  <img src={item.image} alt={item.name} />
                  <div className="co-item-body">
                    <span className="co-item-name">{item.name}</span>
                    <span className="co-item-weight">{item.weight} × {item.qty}</span>
                  </div>
                  <strong>₹{item.price * item.qty}</strong>
                </div>
              ))}
            </div>
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "14px 0" }} />
            <div className="row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {cartSavings > 0 && (
              <div className="row" style={{ color: "var(--green-dark)", fontSize: 13 }}>
                <span>You save</span><span>−₹{cartSavings}</span>
              </div>
            )}
            <div className="row">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <span style={{ color: "var(--green-dark)", fontWeight: 700 }}>Free</span> : `₹${deliveryFee}`}</span>
            </div>
            {deliveryFee > 0 && (
              <p style={{ fontSize: 12.5, color: "var(--olive)", margin: "4px 0 10px" }}>
                Add ₹{Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)} more to unlock free delivery.
              </p>
            )}
            <div className="row total-row"><span>Total</span><span>₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

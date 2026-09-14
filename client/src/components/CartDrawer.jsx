import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, FREE_DELIVERY_THRESHOLD } from "../context/CartContext.jsx";
import { fetchProducts } from "../api/api.js";

export default function CartDrawer({ onClose }) {
  const {
    items,
    updateQty,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    amountToFreeDelivery,
    freeDeliveryProgress,
    addToCart,
    deliverySavings,
  } = useCart();
  const [upsellProducts, setUpsellProducts] = useState([]);
  const navigate = useNavigate();

  // Smarter upsell: prefer products in the same categories/tags as cart items,
  // not simply the cheapest products. This ties recommendations to cart context.
  useEffect(() => {
    if (amountToFreeDelivery <= 0 || items.length === 0) {
      setUpsellProducts([]);
      return;
    }
    fetchProducts({ inStock: "true" })
      .then((d) => {
        const cartSlugs = new Set(items.map((i) => i.slug));
        const cartCategories = new Set(items.map((i) => i.category).filter(Boolean));
        const cartTags = new Set(items.flatMap((i) => i.tags || []).filter(Boolean));

        const scored = d.products
          .filter((p) => !cartSlugs.has(p.slug) && p.inStock)
          .map((p) => {
            let score = 0;
            if (cartCategories.has(p.category)) score += 30;
            const sharedTags = (p.tags || []).filter((t) => cartTags.has(t)).length;
            score += sharedTags * 10;
            // Small bonus if the product's price can help bridge the gap
            if (p.price > 0 && p.price <= amountToFreeDelivery) score += 5;
            score += (p.salesCount || 0) / 20; // popularity tie-breaker
            return { p, score };
          })
          .sort((a, b) => b.score - a.score || a.p.price - b.p.price)
          .slice(0, 3)
          .map((x) => x.p);

        setUpsellProducts(scored);
      })
      .catch(() => setUpsellProducts([]));
  }, [amountToFreeDelivery, items]);

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Cart {items.length > 0 && <span className="cart-count-pill">{items.reduce((s, i) => s + i.qty, 0)} items</span>}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {/* Free Delivery Progress */}
        {items.length > 0 && (
          <div className="cart-delivery-progress">
            <div className="cdp-text">
              {amountToFreeDelivery > 0 ? (
                <>Add <strong>₹{amountToFreeDelivery}</strong> more for <span className="cdp-free">FREE DELIVERY</span></>
              ) : (
                <strong className="cdp-unlocked">🎉 FREE DELIVERY UNLOCKED</strong>
              )}
            </div>
            <div className="cdp-track">
              <div className="cdp-fill" style={{ width: `${freeDeliveryProgress}%` }} />
            </div>
            {deliverySavings > 0 && (
              <div className="cdp-savings-text">You saved ₹{deliverySavings} on delivery.</div>
            )}
          </div>
        )}

        <div className="cart-items">
          {items.length === 0 && (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty.</p>
              <button className="btn btn-outline" onClick={onClose}>Continue Shopping</button>
            </div>
          )}

          {items.map((item) => {
            const atStockLimit = item.qty >= (item.stock ?? 99);
            return (
              <div className="cart-line" key={item.slug}>
                <img src={item.image} alt={item.name} />
                <div className="cart-line-body">
                  <strong className="cart-item-name">{item.name}</strong>
                  <div className="cart-item-weight">{item.weight}</div>
                  <div className="cart-item-footer">
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.slug, item.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.slug, item.qty + 1)}
                        disabled={atStockLimit}
                        aria-label="Increase quantity"
                        title={atStockLimit ? `Only ${item.stock} available` : ""}
                      >
                        +
                      </button>
                    </div>
                    <strong className="cart-item-total">₹{item.price * item.qty}</strong>
                  </div>
                  {atStockLimit && (
                    <div className="stock-limit-note">Max available: {item.stock}</div>
                  )}
                </div>
                <button className="icon-btn cart-remove-btn" onClick={() => removeFromCart(item.slug)} aria-label={`Remove ${item.name}`}>✕</button>
              </div>
            );
          })}

          {/* Upsell — only when below free delivery threshold */}
          {items.length > 0 && upsellProducts.length > 0 && (
            <div className="cart-upsell">
              <div className="cart-upsell-heading">
                You're ₹{amountToFreeDelivery} away — add one of these:
              </div>
              {upsellProducts.map((p) => (
                <div className="upsell-item" key={p.slug}>
                  <img src={p.image} alt={p.name} />
                  <div className="upsell-details">
                    <span className="upsell-name">{p.name}</span>
                    <span className="upsell-reason">{p.recommendationReason || "Pairs well with your cart"}</span>
                    <span className="upsell-price">₹{p.price}</span>
                  </div>
                  <button className="add-btn" onClick={() => addToCart(p)}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-rows">
              <div className="row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="row"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="free-label">Free</span> : `₹${deliveryFee}`}</span></div>
              <div className="row total-row"><span>Total</span><span>₹{total}</span></div>
            </div>
            {deliveryFee > 0 && (
              <p className="cart-free-hint">Add ₹{amountToFreeDelivery} more to unlock free delivery (min. ₹{FREE_DELIVERY_THRESHOLD})</p>
            )}
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

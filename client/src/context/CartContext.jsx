import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// FREE DELIVERY THRESHOLD — single source of truth for the ₹999 rule.
// Change this one constant if the business rule changes; every UI that reads it
// will update automatically.
// ─────────────────────────────────────────────────────────────────────────────
export const FREE_DELIVERY_THRESHOLD = 999;
export const DELIVERY_FEE = 40;

// Alias kept for backward compatibility with any component that imported the old name.
export const DELIVERY_FREE_THRESHOLD = FREE_DELIVERY_THRESHOLD;

export function CartProvider({ children }) {
  // Each item: { slug, name, price, weight, image, category, tags, stock, qty }
  const [items, setItems] = useState([]);

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      const maxQty = product.stock ?? 99;
      if (existing) {
        if (existing.qty >= maxQty) return prev; // already at stock limit
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: Math.min(i.qty + 1, maxQty) } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice || product.price,
          weight: product.weight || "",
          image: product.image || "",
          category: product.category || "",
          tags: product.tags || [],
          stock: maxQty,
          qty: 1,
        },
      ];
    });
  }

  function updateQty(slug, qty) {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.slug !== slug);
      return prev.map((i) => {
        if (i.slug !== slug) return i;
        const maxQty = i.stock ?? 99;
        return { ...i, qty: Math.min(qty, maxQty) };
      });
    });
  }

  function removeFromCart(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const cartSavings = useMemo(() => items.reduce((sum, i) => sum + ((i.compareAtPrice > i.price ? i.compareAtPrice - i.price : 0) * i.qty), 0), [items]);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const deliverySavings = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0 ? DELIVERY_FEE : 0;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  const value = {
    items,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    cartSavings,
    deliverySavings,
    total: subtotal + deliveryFee,
    amountToFreeDelivery,
    freeDeliveryProgress,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

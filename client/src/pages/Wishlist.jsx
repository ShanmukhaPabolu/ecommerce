import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  function handleAddAll() {
    items.forEach((p) => addToCart(p));
  }

  if (items.length === 0) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <div className="empty-state">
          <div style={{ fontSize: 56, marginBottom: 16 }}>♡</div>
          <h3>Your wishlist is empty</h3>
          <p>Save products you love for later — tap the heart icon on any product.</p>
          <Link to="/store" className="btn btn-primary" style={{ marginTop: 20 }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>My Wishlist</h2>
          <p>{items.length} saved product{items.length !== 1 ? "s" : ""}</p>
        </div>
        {items.length > 1 && (
          <button className="btn btn-primary" onClick={handleAddAll}>
            Add All to Cart
          </button>
        )}
      </div>
      <div className="product-grid">
        {items.map((p) => (
          <ProductCard product={p} key={p.slug} />
        ))}
      </div>
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          className="btn btn-outline"
          style={{ fontSize: 13 }}
          onClick={() => items.forEach((i) => removeFromWishlist(i.slug))}
        >
          Clear Wishlist
        </button>
      </div>
    </div>
  );
}

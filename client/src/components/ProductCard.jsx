import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart, updateQty, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  
  const outOfStock = product.inStock === false || product.stock === 0;
  const lowStock = !outOfStock && product.stock > 0 && product.stock <= 8;
  const wishlisted = isWishlisted(product.slug);
  
  // Quick Add
  const cartItem = items.find(i => i.slug === product.slug);
  const qtyInCart = cartItem ? cartItem.qty : 0;
  
  const isBestSeller = product.salesCount > 50;
  const isCustomerFav = product.avgRating >= 4.5 && product.reviewCount >= 10;
  const isNew = !isBestSeller && !isCustomerFav && product.tags?.includes("New");

  function handleAdd(e) {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product);
    showToast(`✓ ${product.name} added to cart`, "View Cart", null, () => window.dispatchEvent(new Event('open-cart')));
  }

  function handleInc(e) {
    e.preventDefault();
    if (qtyInCart < (product.stock ?? 99)) {
      updateQty(product.slug, qtyInCart + 1);
    }
  }

  function handleDec(e) {
    e.preventDefault();
    updateQty(product.slug, qtyInCart - 1);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  return (
    <div className={`product-card ${outOfStock ? "out-of-stock-card" : ""} premium-card`}>
      <Link to={`/product/${product.slug}`}>
        <div className="product-thumb">
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy" 
            onError={(e) => { e.target.onerror = null; e.target.src = "/images/product-pickle.png"; }} 
          />
          <div className="product-tags">
            {product.discountPercent > 0 && (
              <span className="tag-pill discount-pill">{product.discountPercent}% OFF</span>
            )}
            {isBestSeller && <span className="tag-pill best-seller-pill">BEST SELLER</span>}
            {!isBestSeller && isCustomerFav && <span className="tag-pill customer-fav-pill">CUSTOMER FAVOURITE</span>}
            {isNew && <span className="tag-pill new-pill">NEW</span>}
            {lowStock && <span className="tag-pill low-stock-pill" style={{background: 'var(--error)', color: '#fff'}}>LOW STOCK</span>}
          </div>
          {outOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
          <button
            className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
            onClick={handleWishlist}
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>
      </Link>
      <div className="product-body">
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-tagline">{product.tagline}</p>
        
        {product.reviewCount > 0 ? (
          <span className="product-rating">★ {product.avgRating} ({product.reviewCount})</span>
        ) : (
          <span className="product-rating no-reviews" style={{color: 'var(--olive)', fontStyle: 'italic'}}>New · Be the first to review</span>
        )}
        
        <div className="product-footer">
          <span className="price">
            ₹{product.price} <small>/ {product.weight}</small>
            {product.compareAtPrice > product.price && (
              <small className="compare-price">₹{product.compareAtPrice}</small>
            )}
          </span>
          {qtyInCart > 0 ? (
            <div className="qty-quick-control">
              <button onClick={handleDec} aria-label="Decrease">−</button>
              <span>{qtyInCart}</span>
              <button 
                onClick={handleInc} 
                disabled={qtyInCart >= (product.stock ?? 99)} 
                aria-label="Increase"
              >
                +
              </button>
            </div>
          ) : (
            <button className="add-btn" onClick={handleAdd} disabled={outOfStock}>
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

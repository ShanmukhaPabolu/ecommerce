import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, addReview, fetchRecommendations, fetchProduct as fetchProductBySlug } from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

function StarRating({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

function saveRecentlyViewed(product) {
  try {
    const prev = JSON.parse(localStorage.getItem("nf_recently_viewed") || "[]");
    const item = {
      slug: product.slug, name: product.name, image: product.image,
      price: product.price, weight: product.weight, category: product.category,
      tagline: product.tagline, avgRating: product.avgRating,
      reviewCount: product.reviewCount, discountPercent: product.discountPercent,
      compareAtPrice: product.compareAtPrice, inStock: product.inStock,
      stock: product.stock, tags: product.tags || [],
    };
    const updated = [item, ...prev.filter((p) => p.slug !== product.slug)].slice(0, 8);
    localStorage.setItem("nf_recently_viewed", JSON.stringify(updated));
  } catch { /* localStorage unavailable */ }
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [fbtProducts, setFbtProducts] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setActiveImage(0);
    setPincodeResult(null);
    setFbtProducts([]);
    setQty(1);

    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        saveRecentlyViewed(p);
      })
      .catch(() => setNotFound(true));

    fetchRecommendations(slug)
      .then((d) => setRecommendations(d.recommendations || []))
      .catch(() => setRecommendations([]));
  }, [slug]);

  useEffect(() => {
    if (!product?.frequentlyBoughtWith?.length) return;
    const slugsToFetch = product.frequentlyBoughtWith.slice(0, 2);
    Promise.all(slugsToFetch.map((s) => fetchProductBySlug(s).catch(() => null)))
      .then((results) => setFbtProducts(results.filter(Boolean)))
      .catch(() => setFbtProducts([]));
  }, [product]);

  if (notFound) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h3>Product unavailable</h3>
          <p>
            This product doesn't exist or may have been removed.{" "}
            <button className="link-more" style={{ background: "none", border: "none" }} onClick={() => navigate("/store")}>
              Back to shop →
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section">
        <div className="pd-layout">
          <div className="skeleton-block" style={{ aspectRatio: 1, borderRadius: 8 }} />
          <div>
            <div className="skeleton-block skeleton-line" style={{ width: "30%" }} />
            <div className="skeleton-block skeleton-line" style={{ width: "70%", height: 32, marginTop: 10 }} />
            <div className="skeleton-block skeleton-line" style={{ width: "40%", marginTop: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  const outOfStock = product.inStock === false || product.stock === 0;
  const lowStock = !outOfStock && product.stock > 0 && product.stock <= 8;
  const gallery = product.images?.length > 0 ? product.images : [product.image];
  const wishlisted = isWishlisted(product.slug);
  const totalReviews = product.reviewCount ?? product.reviews?.length ?? 0;

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await addReview(slug, reviewForm);
      setProduct(updated);
      setReviewForm({ name: "", rating: 5, comment: "" });
      showToast("Review submitted successfully");
    } catch (err) {
      showToast(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddToCart() {
    if (outOfStock) return;
    const effectiveQty = Math.min(qty, product.stock ?? 99);
    for (let i = 0; i < effectiveQty; i++) addToCart(product);
    showToast(`✓ ${product.name} added to cart`, "View Cart", null, () => window.dispatchEvent(new Event('open-cart')));
  }

  function handleBuyNow() {
    if (outOfStock) return;
    const effectiveQty = Math.min(qty, product.stock ?? 99);
    for (let i = 0; i < effectiveQty; i++) addToCart(product);
    navigate("/checkout");
  }

  function handleAddAllFBT() {
    addToCart(product);
    fbtProducts.forEach((p) => addToCart(p));
    showToast(`✓ ${1 + fbtProducts.length} items added to cart`, "View Cart", null, () => window.dispatchEvent(new Event('open-cart')));
  }

  function checkPincode(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult({ ok: false, message: "Enter a valid 6-digit pincode." });
      return;
    }
    // Simple demo serviceability logic
    setPincodeResult({
      ok: true,
      message: `Delivery available: Estimated 2–5 business days to ${pincode}.`,
    });
  }

  const sortedReviews = [...(product.reviews || [])].sort((a, b) => {
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: (product.reviews || []).filter((r) => r.rating === star).length,
  }));
  const fbtTotal = product.price + fbtProducts.reduce((s, p) => s + p.price, 0);

  return (
    <div className="container section">
      {/* ── Main Product Layout ── */}
      <div className="pd-layout">
        {/* Left: Gallery */}
        <div>
          <div className="pd-gallery">
            <img src={gallery[activeImage]} alt={product.name} />
          </div>
          {gallery.length > 1 && (
            <div className="pd-thumbs">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb-btn ${i === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="pd-info">
          <span className="product-cat">{product.category}</span>
          <h1 style={{ fontSize: 30, marginTop: 4 }}>{product.name}</h1>
          <p className="pd-tagline">{product.tagline}</p>

          {/* Meta badges */}
          <div className="pd-badges">
            {product.weight && <span className="pd-badge">⚖️ {product.weight}</span>}
            {product.spiceLevel && product.spiceLevel !== "None" && <span className="pd-badge spice">🌶️ {product.spiceLevel}</span>}
            {product.dietaryType && product.dietaryType !== "Not Specified" && (
              <span className={`pd-badge dietary ${product.dietaryType === "Non-Veg" ? "non-veg" : "veg"}`}>
                {product.dietaryType === "Non-Veg" ? "🔴" : "🟢"} {product.dietaryType}
              </span>
            )}
            {product.nutrition?.shelfLife && (
              <span className="pd-badge">📦 {product.nutrition.shelfLife.split(".")[0]}</span>
            )}
          </div>

          {/* Rating */}
          <div className="pd-meta-row">
            {product.avgRating > 0 ? (
              <span className="stars">★ {product.avgRating} · {totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
            ) : (
              <span style={{ color: "var(--olive)" }}>New · Be the first to review</span>
            )}
          </div>

          {/* Price */}
          <div className="pd-price">
            ₹{product.price}
            {product.compareAtPrice > product.price && (
              <>
                <span className="pd-compare-price">₹{product.compareAtPrice}</span>
                <span className="pd-discount-badge">{product.discountPercent}% off</span>
              </>
            )}
          </div>

          {/* Stock */}
          {outOfStock ? (
            <span className="stock-tag out-of-stock-tag">✕ Out of Stock</span>
          ) : lowStock ? (
            <span className="stock-tag low-stock-tag">⚠ Only {product.stock} left in stock</span>
          ) : (
            <span className="stock-tag">✓ In Stock — ships within 24 hours</span>
          )}

          {/* Qty + CTA */}
          <div className="qty-row">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={outOfStock}>−</button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(q + 1, product.stock ?? 99))}
                disabled={outOfStock || qty >= (product.stock ?? 99)}
                title={qty >= (product.stock ?? 99) ? `Maximum available: ${product.stock}` : ""}
              >
                +
              </button>
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock}>
              {outOfStock ? "Out of Stock" : `Add to Cart — ₹${product.price * qty}`}
            </button>
            <button className="btn btn-outline" onClick={handleBuyNow} disabled={outOfStock}>
              Buy Now
            </button>
          </div>
          {qty >= (product.stock ?? 99) && !outOfStock && (
            <p style={{ fontSize: 12, color: "var(--clay-dark)", marginTop: -10 }}>
              Maximum available quantity: {product.stock}
            </p>
          )}

          {/* Sticky Mobile Bar */}
          <div className="mobile-sticky-cta">
             <button className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock}>
               {outOfStock ? "Out of Stock" : `Add to Cart — ₹${product.price * qty}`}
             </button>
          </div>

          {/* Wishlist */}
          <button
            className={`wishlist-full-btn ${wishlisted ? "wishlisted" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            {wishlisted ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
          </button>

          {/* Trust Signals */}
          <div className="trust-signals">
            <span>✓ Secure checkout</span>
            <span>✓ Freshly packed</span>
            <span>✓ Quality ingredients</span>
            <span>🚚 Free delivery above ₹999</span>
          </div>
        </div>
      </div>

      {/* ── Frequently Bought Together ── */}
      {fbtProducts.length > 0 && (
        <div className="fbt-section">
          <h3>Frequently Bought Together</h3>
          <div className="fbt-grid">
            <div className="fbt-item">
              <div className="fbt-img-wrap">
                <img src={product.image} alt={product.name} />
                <span className="fbt-check">✓</span>
              </div>
              <p className="fbt-name">{product.name}</p>
              <p className="fbt-price">₹{product.price}</p>
            </div>
            {fbtProducts.map((p) => (
              <React.Fragment key={p.slug}>
                <span className="fbt-plus">+</span>
                <div className="fbt-item">
                  <div className="fbt-img-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <p className="fbt-name">{p.name}</p>
                  <p className="fbt-price">₹{p.price}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="fbt-actions">
            <span className="fbt-total">
              Bundle Total: <strong>₹{fbtTotal}</strong>
            </span>
            <button className="btn btn-primary" onClick={handleAddAllFBT}>
              Add All to Cart
            </button>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="tabs">
        <button className={`tab-btn ${tab === "description" ? "active" : ""}`} onClick={() => setTab("description")}>Description</button>
        <button className={`tab-btn ${tab === "nutrition" ? "active" : ""}`} onClick={() => setTab("nutrition")}>Ingredients &amp; Nutrition</button>
        <button className={`tab-btn ${tab === "delivery" ? "active" : ""}`} onClick={() => setTab("delivery")}>Delivery</button>
        <button className={`tab-btn ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>Reviews ({totalReviews})</button>
      </div>

      {tab === "description" && (
        <div className="tab-panel">
          <p>{product.description}</p>
        </div>
      )}

      {tab === "nutrition" && (
        <div className="tab-panel">
          <table className="nutrition-table">
            <tbody>
              {product.nutrition?.servingSize && <tr><td>Serving size</td><td>{product.nutrition.servingSize}</td></tr>}
              {product.nutrition?.calories != null && <tr><td>Calories per serving</td><td>{product.nutrition.calories} kcal</td></tr>}
              {product.nutrition?.protein && <tr><td>Protein</td><td>{product.nutrition.protein}</td></tr>}
              {product.nutrition?.carbs && <tr><td>Carbohydrates</td><td>{product.nutrition.carbs}</td></tr>}
              {product.nutrition?.fat && <tr><td>Fat</td><td>{product.nutrition.fat}</td></tr>}
              {product.nutrition?.shelfLife && <tr><td>Shelf life</td><td>{product.nutrition.shelfLife}</td></tr>}
            </tbody>
          </table>
          {product.nutrition?.ingredients && (
            <p style={{ marginTop: 20 }}><strong>Ingredients:</strong> {product.nutrition.ingredients}</p>
          )}
          {product.nutrition?.allergens && (
            <p style={{ marginTop: 8, color: "var(--clay-dark)" }}><strong>Allergen note:</strong> {product.nutrition.allergens}</p>
          )}
          {product.nutrition?.storageInstructions && (
            <p style={{ marginTop: 8, color: "var(--olive)" }}><strong>Storage:</strong> {product.nutrition.storageInstructions}</p>
          )}
        </div>
      )}

      {tab === "delivery" && (
        <div className="tab-panel" style={{ maxWidth: 480 }}>
          <p style={{ marginBottom: 14 }}>Enter your pincode to check estimated delivery time.</p>
          <form onSubmit={checkPincode} style={{ display: "flex", gap: 10 }}>
            <input
              className="pincode-input"
              placeholder="6-digit pincode"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            />
            <button className="btn btn-primary" type="submit">Check</button>
          </form>
          {pincodeResult && (
            <p style={{ marginTop: 12, color: pincodeResult.ok ? "var(--green-dark)" : "var(--error)", fontWeight: 600 }}>
              {pincodeResult.message}
            </p>
          )}
          <ul className="bullet-list" style={{ marginTop: 20 }}>
            <li>Free delivery on orders above ₹999</li>
            <li>Dispatched from Pune within 24 hours</li>
            <li>Cash on delivery available on most pincodes</li>
          </ul>
          <p style={{ fontSize: 12, color: "var(--olive)", marginTop: 12 }}>
            * Delivery estimates are indicative. Actual delivery time may vary by location.
          </p>
        </div>
      )}

      {tab === "reviews" && (
        <div className="tab-panel" style={{ maxWidth: 680 }}>
          {totalReviews > 0 && (
            <div className="review-summary">
              <div className="review-summary-score">
                <strong>{product.avgRating}</strong>
                <StarRating rating={product.avgRating} />
                <span>{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
              </div>
              <div className="review-distribution">
                {distribution.map((d) => (
                  <div className="review-dist-row" key={d.star}>
                    <span>{d.star}★</span>
                    <div className="review-dist-track">
                      <div className="review-dist-fill" style={{ width: `${totalReviews ? (d.count / totalReviews) * 100 : 0}%` }} />
                    </div>
                    <span>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalReviews === 0 && (
            <p style={{ color: "var(--olive)" }}>No reviews yet — be the first to try it and share your thoughts.</p>
          )}

          {totalReviews > 0 && (
            <div className="review-sort-row">
              <span>Sort by:</span>
              <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          )}

          {sortedReviews.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-head">
                <span className="review-name">
                  {r.name}
                  {r.verifiedPurchase === true && (
                    <span className="verified-badge">✓ Verified Purchase</span>
                  )}
                </span>
                <StarRating rating={r.rating} />
              </div>
              <p style={{ margin: 0, fontSize: 14.5 }}>{r.comment}</p>
              {r.createdAt && (
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
              )}
            </div>
          ))}

          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h4 style={{ marginBottom: 12 }}>Write a Review</h4>
            <input
              placeholder="Your name"
              required
              value={reviewForm.name}
              onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
            />
            <select value={reviewForm.rating} onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
              ))}
            </select>
            <textarea
              placeholder="Share your experience with this product"
              rows={3}
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            />
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* ── You May Also Like ── */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <div className="section-head">
            <div>
              <h2 style={{ fontSize: 22 }}>You may also like</h2>
              <p>Hand-picked recommendations based on your current product.</p>
            </div>
          </div>
          <div className="product-grid">
            {recommendations.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

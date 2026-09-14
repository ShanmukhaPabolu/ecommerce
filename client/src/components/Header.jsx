import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { fetchSuggestions } from "../api/api.js";

export default function Header({ onOpenCart }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, subtotal } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Debounced typeahead — waits 300ms after the user stops typing before hitting the API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query)
        .then((d) => setSuggestions(d.suggestions || []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToSearch(q) {
    setShowSuggestions(false);
    if (q.trim()) navigate(`/store?search=${encodeURIComponent(q.trim())}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    goToSearch(query);
  }

  function handleSuggestionClick(s) {
    setShowSuggestions(false);
    setQuery("");
    navigate(`/product/${s.slug}`);
  }

  return (
    <>
      <div className="topbar">
        <div className="container">
          {/* ₹999 is the centrally-configured free delivery threshold */}
          <span>🚚 Free delivery above ₹999 &nbsp;·&nbsp; Same-day dispatch from Pune</span>
          <div className="topbar-links">
            <span>+91 97300 46247</span>
            <span>9 AM – 10 PM Daily</span>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="header-inner container">
          <button className="hamburger-btn" onClick={() => setMobileNavOpen((v) => !v)} aria-label="Toggle menu">
            ☰
          </button>
          <Link to="/" className="logo">
            Naik<span>Foods</span>
          </Link>
          <nav className="nav">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/store" className={location.pathname.startsWith("/store") ? "active" : ""}>Shop</Link>
            <Link to="/combos" className={location.pathname === "/combos" ? "active" : ""}>Gift Boxes</Link>
            <Link to="/recipes" className={location.pathname === "/recipes" ? "active" : ""}>Recipes</Link>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
          </nav>

          <div className="search-box-wrap" ref={boxRef}>
            <form className="search-box" onSubmit={handleSearch}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search for pickle, chakali, mukhwas…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                aria-label="Search products"
              />
            </form>
            {showSuggestions && query.trim() && (
              <div className="search-suggestions">
                {suggestions.length === 0 && (
                  <div className="search-suggestion-empty">
                    <span>No exact matches — press Enter to search anyway</span>
                  </div>
                )}
                {suggestions.map((s) => (
                  <button key={s.slug} className="search-suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    <img src={s.image} alt="" />
                    <span>
                      <strong>{s.name}</strong>
                      <small>{s.category}</small>
                    </span>
                    <span className="suggestion-price">₹{s.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="header-icons">
            <button
              className="icon-btn wishlist-icon-btn"
              title="Wishlist"
              onClick={() => navigate("/wishlist")}
              aria-label="View wishlist"
            >
              {wishlistCount > 0 ? "♥" : "♡"}
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>
            <button className={`icon-btn cart-btn-header ${itemCount > 0 ? "has-items" : ""}`} title="Cart" onClick={onOpenCart} aria-label="View cart">
              🛒
              {itemCount > 0 && <span className="cart-header-text">{itemCount} items · ₹{subtotal}</span>}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="mobile-nav" onClick={() => setMobileNavOpen(false)}>
            <Link to="/">Home</Link>
            <Link to="/store">Shop</Link>
            <Link to="/combos">Gift Boxes</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/about">About</Link>
            <Link to="/wishlist">Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
          </nav>
        )}
      </header>
    </>
  );
}

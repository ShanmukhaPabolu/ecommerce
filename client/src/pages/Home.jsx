import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import ShopSmarter from "../components/ShopSmarter.jsx";

const OCCASIONS = [
  { id: "tea-time", label: "☕ Tea Time", emoji: "☕", desc: "Crunchy chakalis, bhel & chips", link: "/store?category=Snacks+and+Namkeen", color: "#FFF8F0" },
  { id: "gifting", label: "🎁 Gifting", emoji: "🎁", desc: "Curated hampers for every occasion", link: "/combos", color: "#FFF0F8" },
  { id: "everyday", label: "🍽 Everyday Meals", emoji: "🍽", desc: "Pickles, chutneys & ready mixes", link: "/store?category=Pickles+%26+Condiments", color: "#F0FFF4" },
  { id: "build-box", label: "📦 Build Your Own Box", emoji: "📦", desc: "Customise your perfect assortment", link: "/build-box", color: "#F0F4FF" },
];

const HERO_SLIDES = [
  {
    image: "/images/hero.png",
    eyebrow: "AUTHENTIC MAHARASHTRIAN FLAVOURS",
    headline: "The Heart of Authentic Maharashtra",
    subtext: "Traditional flavours from Vidarbha & Konkan, brought to your kitchen.",
    ctaText: "Shop Collection",
    ctaLink: "/store",
    ctaText2: "Explore Pickles",
    ctaLink2: "/store?category=Pickles+%26+Condiments",
    trustLine: "4.8 ★ from 500+ food lovers",
    splitLayout: true
  },
  {
    image: "/images/category-pickles.png",
    eyebrow: "TRADITIONAL & TANGY",
    headline: "Pickles Made with Love",
    subtext: "Our signature sun-dried pickles are crafted using traditional family recipes and 100% natural spices without any preservatives.",
    ctaText: "Explore Pickles",
    ctaLink: "/store?category=Pickles+%26+Condiments",
    splitLayout: false
  },
  {
    image: "/images/product-snack.png",
    eyebrow: "PERFECT TEA-TIME",
    headline: "Crunchy Namkeen & Snacks",
    subtext: "Discover the perfect crunch for your evening chai with our wholesome, small-batch Maharashtrian snacks.",
    ctaText: "Shop Snacks",
    ctaLink: "/store?category=Snacks+and+Namkeen",
    splitLayout: false
  },
  {
    image: "/images/category-mukhvas.png",
    eyebrow: "AFTER MEAL ESSENTIAL",
    headline: "Digestives & Mukhwas",
    subtext: "Refresh your palate and aid digestion with our unique, flavorful blends of traditional Indian after-meal mints.",
    ctaText: "View Collection",
    ctaLink: "/store?category=Mukhvas+%26+Digestives",
    splitLayout: false
  }
];

const CATEGORY_IMAGES = {
  "Snacks and Namkeen": "/images/product-snack.png",
  "Pickles & Condiments": "/images/category-pickles.png",
  "Mukhvas & Digestives": "/images/category-mukhvas.png",
  "Dry/Instant Grocery": "/images/category-grocery.png",
};

const TRUST_ITEMS = [
  { icon: "🌿", label: "No Preservatives" },
  { icon: "🏠", label: "Small Batch Made" },
  { icon: "⭐", label: "4.8+ Rated" },
  { icon: "🚚", label: "Free above ₹999" },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts({ sort: "best_selling" })
      .then((d) => setBestSellers(d.products.slice(0, 4)))
      .catch(() => setBestSellers([]));

    fetchCategories()
      .then((d) => setCategories(d.categories))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div>
      {/* 1. HERO */}
      <HeroCarousel slides={HERO_SLIDES} />

      {/* 2. TRUST / BENEFITS */}
      <div className="trust-bar">
        <div className="container trust-bar-inner">
          {TRUST_ITEMS.map((t) => (
            <div className="trust-item" key={t.label}>
              <span className="trust-icon">{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SHOP BY OCCASION */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Shop by Occasion</h2>
            <p>Find exactly what you need, for any moment.</p>
          </div>
        </div>
        <div className="occasions-grid">
          {OCCASIONS.map((o) => (
            <Link to={o.link} key={o.id} className="occasion-card" style={{ background: o.color }}>
              <span className="occasion-emoji">{o.emoji}</span>
              <h3 className="occasion-label">{o.label}</h3>
              <p className="occasion-desc">{o.desc}</p>
              <span className="occasion-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Shop by Category</h2>
            <p>Explore our curated selection of regional Maharashtrian delights.</p>
          </div>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link to={`/store?category=${encodeURIComponent(c.name)}`} className="cat-card premium-cat-card" key={c.name}>
              <div className="cat-card-img-wrap">
                <img
                  src={CATEGORY_IMAGES[c.name] || "/images/product-pickle.png"}
                  alt={c.name}
                  className="cat-card-img"
                />
              </div>
              <div className="cat-card-overlay">
                <div className="cat-card-info">
                  <span className="cat-card-title">{c.name}</span>
                  <span className="cat-card-count">{c.count} products</span>
                </div>
                <span className="cat-card-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="section container" style={{ background: "transparent", paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Best Sellers</h2>
            <p>Our most popular products — ranked by actual orders placed.</p>
          </div>
          <Link to="/store?sort=best_selling" className="link-more">View all →</Link>
        </div>
        <div className="product-grid">
          {bestSellers.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        </div>
      </section>

      {/* 5. SHOP SMARTER */}
      <ShopSmarter />

      {/* 6. RECIPES */}
      <section className="section" style={{ background: "var(--green-pale)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 28 }}>Cooking a family recipe?</h2>
            <p style={{ color: "var(--olive)", marginTop: 8, fontSize: 16 }}>
              Browse our recipe collection and add every Naik Foods ingredient to your cart in one click.
            </p>
          </div>
          <Link to="/recipes" className="btn btn-primary">Explore Recipes</Link>
        </div>
      </section>

      {/* 7. GIFT BOXES */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Gift Boxes</h2>
            <p>Curated hampers for festivals, family visits, and special occasions.</p>
          </div>
          <Link to="/combos" className="link-more">View hampers →</Link>
        </div>
        <div className="gift-boxes-preview combo-grid">
           {/* Static preview for home page */}
           <div className="combo-card">
              <img src="/images/product-snack.png" alt="Festival Box" />
              <div>
                <span className="combo-occasion">FESTIVALS</span>
                <h3 style={{fontSize: 18, marginBottom: 8}}>The Vidarbha Special Box</h3>
                <p style={{color: 'var(--olive)', fontSize: 14, marginBottom: 12}}>A complete assortment of spicy, tangy, and sweet regional favorites.</p>
                <Link to="/combos" className="btn btn-outline" style={{padding: '8px 16px', fontSize: 13}}>Shop Box</Link>
              </div>
           </div>
           <div className="combo-card">
              <img src="/images/product-pickle.png" alt="Pickle Sampler" />
              <div>
                <span className="combo-occasion">SAMPLER</span>
                <h3 style={{fontSize: 18, marginBottom: 8}}>Konkan Pickle Sampler</h3>
                <p style={{color: 'var(--olive)', fontSize: 14, marginBottom: 12}}>Four distinct mini-jars of our best-selling sun-dried pickles.</p>
                <Link to="/combos" className="btn btn-outline" style={{padding: '8px 16px', fontSize: 13}}>Shop Box</Link>
              </div>
           </div>
        </div>
      </section>

      {/* 8. WHY NAIK FOODS */}
      <section className="section" style={{ background: "#f9fbf8", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container why-naik-foods">
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--clay)", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>OUR PROMISE</span>
            <h2 style={{ fontSize: 32, margin: "12px 0 20px" }}>Why choose Naik Foods?</h2>
            <p style={{ fontSize: 16, color: "var(--olive)", lineHeight: 1.6 }}>We believe that the best flavors come from the most authentic processes. That means sun-drying our pickles, hand-pounding our spices, and using recipes passed down for generations. No shortcuts, no artificial colors, and no chemical preservatives. Ever.</p>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS */}
      <section className="section container">
         <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 32 }}>Loved by 500+ families</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, color: "var(--clay)", fontSize: 20, margin: "12px 0" }}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
         </div>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
           {[
             { name: "Priya S.", text: "The garlic pickle tastes exactly like how my grandmother used to make it. Absolutely delicious and perfectly spiced.", prod: "Garlic Pickle" },
             { name: "Rahul M.", text: "Finally found an authentic Maharashtrian snack brand that doesn't load everything with palm oil. The Chakali is incredible.", prod: "Bhajani Chakali" },
             { name: "Anita K.", text: "Their delivery was prompt and the packaging was excellent. You can tell they care deeply about quality.", prod: "Everyday Snack Box" }
           ].map((r, i) => (
             <div key={i} style={{ background: "var(--paper)", border: "1px solid var(--border)", padding: 24, borderRadius: "var(--radius-m)" }}>
               <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>"{r.text}"</p>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <strong style={{ fontSize: 14 }}>{r.name}</strong>
                 <span style={{ fontSize: 12, color: "var(--olive)" }}>on {r.prod}</span>
               </div>
             </div>
           ))}
         </div>
      </section>

      {/* 10. BRAND STORY */}
      <section className="section container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", paddingBottom: 80 }}>
         <div style={{ borderRadius: "var(--radius-m)", overflow: "hidden" }}>
           <img src="/images/hero.png" alt="Naik Foods Kitchen" style={{ width: "100%", height: 300, objectFit: "cover" }} />
         </div>
       <div>
           <span style={{ color: "var(--clay-dark)", fontWeight: 600, fontSize: 13, letterSpacing: "0.05em" }}>OUR ROOTS</span>
           <h2 style={{ fontSize: 32, margin: "12px 0 20px" }}>From our kitchen to yours.</h2>
           <p style={{ fontSize: 16, color: "var(--olive)", lineHeight: 1.7, marginBottom: 24 }}>
             Naik Foods was born from a simple belief: the best food comes from honest ingredients and time-tested recipes. 
             Rooted in the culinary heritage of Vidarbha and Konkan, we bring you flavours that have been part of Maharashtrian 
             kitchens for generations — sun-dried in the summer sun, hand-ground with traditional spices, and packed with love 
             from our small-batch facility in Pune.
           </p>
           <Link to="/about" className="link-more" style={{ fontSize: 16 }}>Read our full story →</Link>
         </div>
      </section>
    </div>
  );
}

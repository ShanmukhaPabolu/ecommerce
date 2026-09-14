import React, { useEffect, useState } from "react";
import { fetchCombos } from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";

// Per-card Add feedback — each combo tracks its own "added" state independently
function ComboCard({ c, onAdd }) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    onAdd(c);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="combo-card" key={c.slug}>
      <img src={c.image} alt={c.name} />
      <div>
        <span className="combo-occasion">{c.occasion}</span>
        <h3 style={{ fontSize: 17, marginBottom: 6 }}>{c.name}</h3>
        <p style={{ fontSize: 13.5, color: "var(--olive)", marginBottom: 10 }}>{c.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="price">₹{c.price}</span>
          <button
            className={`add-btn ${added ? "added" : ""}`}
            onClick={handleClick}
            style={{ minWidth: 80 }}
          >
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCombos().then((d) => setCombos(d.combos));
  }, []);

  function handleAdd(combo) {
    addToCart({ slug: combo.slug, name: combo.name, price: combo.price, weight: "Gift Box", image: combo.image });
  }

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Curated Gift Boxes</h2>
          <p>Hand-picked combos at a bundled price — great for gifting or trying a bit of everything.</p>
        </div>
      </div>
      <div className="combo-grid">
        {combos.map((c) => (
          <ComboCard key={c.slug} c={c} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}

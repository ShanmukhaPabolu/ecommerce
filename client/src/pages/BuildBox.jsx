import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const STEPS = [
  { id: "pickle", label: "🫙 Pick a Pickle", category: "Pickles & Condiments", desc: "Sun-dried or oil-based — your call." },
  { id: "snack", label: "🍘 Pick a Snack", category: "Snacks and Namkeen", desc: "Crunchy, flavourful, and freshly made." },
  { id: "mukhwas", label: "🌿 Pick a Mukhwas", category: "Mukhvas & Digestives", desc: "A perfect after-meal refresher." },
];

export default function BuildBox() {
  const [products, setProducts] = useState({});
  const [selected, setSelected] = useState({ pickle: null, snack: null, mukhwas: null });
  const [step, setStep] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadAll() {
      const results = {};
      await Promise.all(
        STEPS.map(async (s) => {
          try {
            const d = await fetchProducts({ category: s.category });
            results[s.id] = (d.products || []).filter(p => p.inStock !== false);
          } catch {
            results[s.id] = [];
          }
        })
      );
      setProducts(results);
    }
    loadAll();
  }, []);

  function pickItem(stepId, product) {
    setSelected(prev => ({ ...prev, [stepId]: product }));
  }

  function handleAddBox() {
    const items = Object.values(selected).filter(Boolean);
    if (items.length === 0) return;
    items.forEach(p => addToCart(p));
    showToast(
      `✓ Your custom box (${items.length} items) added to cart`,
      "View Cart",
      null,
      () => window.dispatchEvent(new Event("open-cart"))
    );
  }

  const boxTotal = Object.values(selected).filter(Boolean).reduce((sum, p) => sum + p.price, 0);
  const filledSteps = Object.values(selected).filter(Boolean).length;

  return (
    <div className="container section">
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="product-cat">PERSONALISE YOUR ORDER</span>
        <h1 style={{ fontSize: 36, marginTop: 8, marginBottom: 12 }}>Build Your Own Box</h1>
        <p style={{ color: "var(--olive)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
          Hand-pick your favourite pickle, snack, and mukhwas. We'll pack it as your personal Naik Foods assortment.
        </p>
      </div>

      {/* Step Tabs */}
      <div className="box-builder-steps">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`box-step-tab ${step === i ? "active" : ""} ${selected[s.id] ? "done" : ""}`}
            onClick={() => setStep(i)}
          >
            <span className="box-step-num">{selected[s.id] ? "✓" : i + 1}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Current Step */}
      <div className="box-builder-step-content">
        <div className="box-step-header">
          <h2>{STEPS[step].label}</h2>
          <p>{STEPS[step].desc}</p>
        </div>
        <div className="box-picker-grid">
          {(products[STEPS[step].id] || []).map((p) => {
            const isSelected = selected[STEPS[step].id]?.slug === p.slug;
            return (
              <button
                key={p.slug}
                className={`box-picker-card ${isSelected ? "selected" : ""}`}
                onClick={() => pickItem(STEPS[step].id, p)}
              >
                <div className="box-picker-img">
                  <img src={p.image} alt={p.name} />
                  {isSelected && <div className="box-picker-check">✓</div>}
                </div>
                <div className="box-picker-info">
                  <strong>{p.name}</strong>
                  <span>{p.weight}</span>
                  <span className="box-picker-price">₹{p.price}</span>
                </div>
              </button>
            );
          })}
          {(products[STEPS[step].id] || []).length === 0 && (
            <p style={{ color: "var(--olive)", padding: "20px 0" }}>Loading…</p>
          )}
        </div>
        <div className="box-step-nav">
          {step > 0 && (
            <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>← Previous</button>
          )}
          {step < STEPS.length - 1 && (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!selected[STEPS[step].id]}
            >
              Next Step →
            </button>
          )}
        </div>
      </div>

      {/* Box Summary */}
      <div className="box-summary">
        <h3>Your Box</h3>
        <div className="box-summary-items">
          {STEPS.map(s => (
            <div key={s.id} className={`box-summary-item ${selected[s.id] ? "filled" : "empty"}`}>
              {selected[s.id] ? (
                <>
                  <img src={selected[s.id].image} alt={selected[s.id].name} />
                  <div>
                    <span className="box-summary-cat">{s.label}</span>
                    <strong>{selected[s.id].name}</strong>
                    <span>₹{selected[s.id].price}</span>
                  </div>
                  <button
                    className="box-remove-btn"
                    onClick={() => setSelected(prev => ({ ...prev, [s.id]: null }))}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <div className="box-empty-slot">?</div>
                  <span style={{ color: "var(--olive)" }}>Choose {s.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="box-summary-footer">
          {boxTotal > 0 && (
            <span className="box-summary-total">Box Total: <strong>₹{boxTotal}</strong></span>
          )}
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
            onClick={handleAddBox}
            disabled={filledSteps === 0}
          >
            {filledSteps === 0
              ? "Pick your items above"
              : filledSteps < STEPS.length
              ? `Add ${filledSteps} item${filledSteps > 1 ? "s" : ""} to Cart`
              : "Add Full Box to Cart 🎁"}
          </button>
          {filledSteps > 0 && filledSteps < STEPS.length && (
            <p style={{ fontSize: 12.5, color: "var(--olive)", textAlign: "center", marginTop: 8 }}>
              You can add a partial box — or keep choosing to complete it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

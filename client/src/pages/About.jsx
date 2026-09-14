import React from "react";

export default function About() {
  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <h2 style={{ fontSize: 30, marginBottom: 16 }}>About Naik Foods</h2>
      <p style={{ color: "var(--olive)", fontSize: 16, lineHeight: 1.8 }}>
        This is the Naik Foods storefront, built as part of the BNV
        Full Stack MERN Intern task. It keeps the brand's identity — Maharashtrian food from
        Vidarbha & Konkan, sold from a real Pune store — while fixing usability gaps found in the
        live site: a working search bar, correct and consistent pricing, real nutrition and
        allergen information, a genuine review system, category and price filters, a fairer
        tiered delivery threshold, and curated gift-box bundles.
      </p>
    </div>
  );
}

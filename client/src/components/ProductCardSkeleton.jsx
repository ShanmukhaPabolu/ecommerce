import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton-block skeleton-thumb" />
      <div className="product-body">
        <div className="skeleton-block skeleton-line" style={{ width: "40%" }} />
        <div className="skeleton-block skeleton-line" style={{ width: "80%" }} />
        <div className="skeleton-block skeleton-line" style={{ width: "60%" }} />
        <div className="product-footer">
          <div className="skeleton-block skeleton-line" style={{ width: 50 }} />
          <div className="skeleton-block skeleton-line" style={{ width: 60 }} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

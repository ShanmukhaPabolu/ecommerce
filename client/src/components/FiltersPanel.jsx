import React from "react";

const ALL_TAGS = ["Healthy", "Vegan", "Traditional", "Gluten-Free", "Kids Favourite", "Preservative-Free", "Coastal"];
const RATINGS = [4, 3, 2];

export default function FiltersPanel({ categories, filters, setFilters, mobileOpen, onCloseMobile }) {
  function toggleTag(tag) {
    setFilters((f) => ({ ...f, tag: f.tag === tag ? "" : tag }));
  }

  function clearAll() {
    setFilters({ category: "", minPrice: "", maxPrice: "", tag: "", minRating: "", inStock: false });
  }

  const activeCount = [filters.category, filters.minPrice, filters.maxPrice, filters.tag, filters.minRating, filters.inStock].filter(
    Boolean
  ).length;

  const body = (
    <>
      <div className="filters-panel-head">
        <h4 style={{ margin: 0 }}>Filters</h4>
        {activeCount > 0 && (
          <button className="clear-filters-btn" onClick={clearAll}>Clear all</button>
        )}
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={!filters.category}
            onChange={() => setFilters((f) => ({ ...f, category: "" }))}
          />
          All Categories
        </label>
        {categories.map((c) => (
          <label className="filter-option" key={c}>
            <input
              type="radio"
              name="category"
              checked={filters.category === c}
              onChange={() => setFilters((f) => ({ ...f, category: c }))}
            />
            {c}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Price Range (₹)</h4>
        <div className="range-row">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>Customer Rating</h4>
        <label className="filter-option">
          <input type="radio" name="rating" checked={!filters.minRating} onChange={() => setFilters((f) => ({ ...f, minRating: "" }))} />
          Any rating
        </label>
        {RATINGS.map((r) => (
          <label className="filter-option" key={r}>
            <input
              type="radio"
              name="rating"
              checked={String(filters.minRating) === String(r)}
              onChange={() => setFilters((f) => ({ ...f, minRating: r }))}
            />
            {"★".repeat(r)}
            {"☆".repeat(5 - r)} & up
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Availability</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))}
          />
          In stock only
        </label>
      </div>

      <div className="filter-group">
        <h4>Dietary / Tags</h4>
        {ALL_TAGS.map((tag) => (
          <label className="filter-option" key={tag}>
            <input type="checkbox" checked={filters.tag === tag} onChange={() => toggleTag(tag)} />
            {tag}
          </label>
        ))}
      </div>
    </>
  );

  return (
    <>
      <aside className="filters-panel desktop-only">{body}</aside>

      {mobileOpen && (
        <>
          <div className="filters-drawer-backdrop" onClick={onCloseMobile} />
          <aside className="filters-panel filters-drawer-mobile">
            <div className="filters-drawer-header">
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button className="icon-btn" onClick={onCloseMobile}>✕</button>
            </div>
            {body}
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={onCloseMobile}>
              Show Results
            </button>
          </aside>
        </>
      )}
    </>
  );
}

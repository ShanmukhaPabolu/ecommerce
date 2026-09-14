import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton.jsx";

export default function Store() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    tag: "",
    minRating: "",
    inStock: false,
  });
  const search = searchParams.get("search") || "";

  useEffect(() => {
    fetchCategories()
      .then((d) => setCategories(d.categories.map(c => typeof c === 'object' ? c.name : c)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ search, sort, ...filters, inStock: filters.inStock ? "true" : "" })
      .then((d) => setProducts(d.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, sort, filters]);

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>{search ? `Results for "${search}"` : "Shop All Products"}</h2>
          <p>Browse authentic Maharashtrian snacks, pickles, sweets, and staples.</p>
        </div>
      </div>

      <div className="store-layout">
        <button className="mobile-filter-btn mobile-only" onClick={() => setMobileFiltersOpen(true)}>
          ⚙ Filters
        </button>

        <FiltersPanel
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <div>
          <div className="store-toolbar">
            <span className="results-count">
              {loading ? "Searching…" : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
            </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">{search ? "Relevance" : "Newest first"}</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="best_selling">Best Selling</option>
            </select>
          </div>

          {loading && <ProductGridSkeleton count={8} />}

          {!loading && error && (
            <div className="empty-state">
              <h3>Something went wrong</h3>
              <p>{error}. Please try again in a moment.</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <h3>No products found for "{search || "your filters"}"</h3>
              <p>Try another search term or clear your filters.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard product={p} key={p.slug} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

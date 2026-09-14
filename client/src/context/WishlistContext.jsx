import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "nf_wishlist";

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  // Each item is a minimal product snapshot: { slug, name, image, price, weight, category }
  const [items, setItems] = useState(readStorage);

  // Persist to localStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage may be unavailable in private browsing — fail silently
    }
  }, [items]);

  function addToWishlist(product) {
    setItems((prev) => {
      if (prev.find((i) => i.slug === product.slug)) return prev; // already in list
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          image: product.image || "",
          price: product.price,
          weight: product.weight || "",
          category: product.category || "",
          tagline: product.tagline || "",
          avgRating: product.avgRating ?? 0,
          reviewCount: product.reviewCount ?? 0,
          discountPercent: product.discountPercent ?? 0,
          compareAtPrice: product.compareAtPrice ?? null,
          inStock: product.inStock ?? true,
          stock: product.stock ?? 99,
          tags: product.tags || [],
        },
      ];
    });
  }

  function removeFromWishlist(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function toggleWishlist(product) {
    const isIn = items.some((i) => i.slug === product.slug);
    if (isIn) removeFromWishlist(product.slug);
    else addToWishlist(product);
  }

  function isWishlisted(slug) {
    return items.some((i) => i.slug === slug);
  }

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

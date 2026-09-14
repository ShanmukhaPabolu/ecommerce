const BASE = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null)
  ).toString();
  const res = await fetch(`${BASE}/products${query ? `?${query}` : ""}`);
  return handle(res);
}

export async function fetchProduct(slug) {
  const res = await fetch(`${BASE}/products/${slug}`);
  return handle(res);
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/categories`);
  return handle(res);
}

export async function fetchCombos() {
  const res = await fetch(`${BASE}/combos`);
  return handle(res);
}

export async function fetchSuggestions(q) {
  if (!q || !q.trim()) return { suggestions: [] };
  const res = await fetch(`${BASE}/products/search/suggestions?q=${encodeURIComponent(q)}`);
  return handle(res);
}

export async function fetchRecommendations(slug) {
  const res = await fetch(`${BASE}/products/${slug}/recommendations`);
  return handle(res);
}

export async function addReview(slug, review) {
  const res = await fetch(`${BASE}/products/${slug}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  return handle(res);
}

export async function createOrder(orderData) {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return handle(res);
}

export async function fetchOrder(orderNumber) {
  const res = await fetch(`${BASE}/orders/${orderNumber}`);
  return handle(res);
}

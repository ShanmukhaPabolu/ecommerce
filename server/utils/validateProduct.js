// A product must not be allowed to become active/published unless it passes all of these checks.
// Used by POST /api/products and PUT /api/products/:slug before anything is saved.
function validateProduct(data) {
  const errors = [];

  if (!data.name || !String(data.name).trim()) errors.push("Product name is required.");
  if (!data.category || !String(data.category).trim()) errors.push("Category is required.");
  if (!data.description || !String(data.description).trim()) errors.push("Description is required.");

  if (data.price === undefined || data.price === null || data.price === "") {
    errors.push("Price is required.");
  } else if (Number(data.price) <= 0) {
    errors.push("Price must be greater than 0.");
  }

  if (data.stock === undefined || data.stock === null || data.stock === "") {
    errors.push("Stock value is required.");
  } else if (Number.isNaN(Number(data.stock)) || Number(data.stock) < 0) {
    errors.push("Stock must be a non-negative number.");
  }

  const hasImage = data.image || (Array.isArray(data.images) && data.images.length > 0);
  if (!hasImage) errors.push("At least one product image is required.");

  if (data.compareAtPrice !== undefined && data.compareAtPrice !== null && data.compareAtPrice !== "") {
    if (Number(data.compareAtPrice) <= Number(data.price || 0)) {
      errors.push("Compare-at price must be greater than the selling price.");
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateProduct };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProduct } from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

const RECIPES = [
  {
    slug: "quick-thalipith-breakfast",
    title: "Quick Thalipith Breakfast",
    image: "/images/recipe-thalipith.png",
    time: "15 mins",
    servings: "2–3",
    description:
      "A nourishing Maharashtrian breakfast made in minutes using Naik Foods' ready bhajni mix. Just add water, chopped onion, and your favourite toppings — no grinding or soaking required.",
    ingredients: [
      "1 cup Naik Foods Methi Thalipith Bhajni",
      "1 small onion, finely chopped",
      "1–2 green chillies, chopped",
      "Fresh coriander, chopped",
      "Salt to taste",
      "Oil for cooking",
    ],
    steps: [
      "Mix bhajni, onion, chillies, coriander, and salt in a bowl.",
      "Add water gradually to make a soft, non-sticky dough.",
      "Flatten onto a greased pan or baking paper and make a hole in the centre.",
      "Cook on medium flame with a drizzle of oil for 3–4 minutes each side.",
      "Serve hot with curd, butter, or pickle.",
    ],
    productSlugs: ["methi-thalipith-bhajni", "aam-ka-achaar"],
  },
  {
    slug: "konkan-pickle-rice-bowl",
    title: "Konkan Pickle Rice Bowl",
    image: "/images/recipe-pickle-rice.png",
    time: "10 mins",
    servings: "2",
    description:
      "Simple, satisfying Konkan comfort food — steamed rice paired with authentic Naik Foods pickles and a side of crispy snacks for texture. The ultimate weeknight dinner.",
    ingredients: [
      "2 cups hot steamed rice",
      "2 tsp Aam Ka Achaar or Lasun Loncha",
      "1 tbsp ghee",
      "Crispy snacks like Corn Chakali for the side",
      "Papad (optional)",
    ],
    steps: [
      "Steam rice until fluffy.",
      "Drizzle ghee on hot rice and mix well.",
      "Serve with a generous spoonful of pickle on the side.",
      "Add Corn Chakali or Jwari Bhel for crunch.",
      "Finish with a piece of papad for the full experience.",
    ],
    productSlugs: ["aam-ka-achaar", "lasun-loncha", "corn-chakali"],
  },
  {
    slug: "healthy-tea-time-snacks",
    title: "Healthy Tea-Time Snack Platter",
    image: "/images/recipe-snack-platter.png",
    time: "5 mins",
    servings: "4",
    description:
      "A vibrant Maharashtrian snack platter perfect for chai time. Light, nutritious, and endlessly snackable — no cooking required. Great for guests too.",
    ingredients: [
      "Naik Foods Beetroot Chips",
      "Corn Chakali",
      "Jwari Bhel",
      "Hot masala chai",
      "Sliced ginger and mint (optional garnish)",
    ],
    steps: [
      "Arrange Beetroot Chips, Corn Chakali, and Jwari Bhel in small bowls.",
      "Brew a strong cup of masala chai.",
      "Serve together — the crunch of the snacks pairs perfectly with the warmth of chai.",
    ],
    productSlugs: ["beetroot-chips", "corn-chakali", "jwari-bhel"],
  },
];

function RecipeCard({ recipe }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Promise.all(recipe.productSlugs.map((s) => fetchProduct(s).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)));
  }, [recipe.productSlugs]);

  function handleAddAll() {
    products.forEach((p) => addToCart(p));
    showToast(`✓ ${products.length} ingredients added to cart`, "View Cart", null, () => window.dispatchEvent(new Event('open-cart')));
  }

  const recipeTotal = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="recipe-card">
      <div className="recipe-img-wrap">
        <img src={recipe.image} alt={recipe.title} loading="lazy" />
        <div className="recipe-meta-overlay">
          <span>⏱ {recipe.time}</span>
          <span>👥 {recipe.servings} servings</span>
        </div>
      </div>
      <div className="recipe-body">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-desc">{recipe.description}</p>

        <button className="recipe-toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Hide steps ▲" : "View recipe ▼"}
        </button>

        {expanded && (
          <div className="recipe-steps">
            <h4>Ingredients</h4>
            <ul className="recipe-ingredient-list">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
            <h4>Steps</h4>
            <ol className="recipe-steps-list">
              {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}

        {/* Linked Naik Foods Products */}
        {products.length > 0 && (
          <div className="recipe-products">
            <p className="recipe-products-label">Naik Foods products used:</p>
            <div className="recipe-product-chips">
              {products.map((p) => (
                <Link key={p.slug} to={`/product/${p.slug}`} className="recipe-product-chip">
                  <img src={p.image} alt={p.name} />
                  <span>{p.name}</span>
                  <strong>₹{p.price}</strong>
                </Link>
              ))}
            </div>
            <div className="recipe-buy-actions" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <span className="recipe-total">Recipe Total: <strong>₹{recipeTotal}</strong></span>
              <button className="btn btn-primary" onClick={handleAddAll}>
                Add {products.length === 1 ? "Ingredient" : `All ${products.length} Ingredients`} to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Recipes() {
  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Naik Foods Recipe Journal</h2>
          <p>Traditional Maharashtrian recipes using our authentic ingredients. Add all ingredients to your cart in one click.</p>
        </div>
      </div>
      <div className="recipes-grid">
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

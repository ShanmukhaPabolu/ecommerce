import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import DeliveryStrip from "./components/DeliveryStrip.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Store from "./pages/Store.jsx";
import Combos from "./pages/Combos.jsx";
import About from "./pages/About.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Recipes from "./pages/Recipes.jsx";
import Checkout from "./pages/Checkout.jsx";
import BuildBox from "./pages/BuildBox.jsx";

import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCartOpen(true);
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />
      <DeliveryStrip />
      
      <main className="main-content">
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/build-box" element={<BuildBox />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
        </ErrorBoundary>
      </main>

      <Footer />

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}

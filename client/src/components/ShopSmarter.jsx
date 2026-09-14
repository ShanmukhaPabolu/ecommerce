import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ShopSmarter() {
  const [recs, setRecs] = useState([]);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts({ maxPrice: 200, inStock: true })
      .then(d => setRecs(d.products.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="section container shop-smarter-section">
      <div className="shop-smarter-header">
        <span className="fire-badge">🔥 SHOP SMARTER</span>
        <h2>Build a better cart.</h2>
        <p>Get personalized recommendations based on what you're already buying to help you unlock free delivery faster.</p>
      </div>

      <div className="shop-smarter-demo">
        <div className="ss-cart-card">
          <div className="ss-cart-header">
            <span>Your cart</span>
            <strong>₹750 / ₹999</strong>
          </div>
          <div className="ss-progress-bar">
            <div className="ss-progress-fill" style={{ width: '75%' }}></div>
          </div>
          <p className="ss-unlock-text">
            <strong>₹249</strong> more to unlock <span>FREE DELIVERY</span>
          </p>

          <div className="ss-recs">
            <p className="ss-recs-title">Recommended for your cart</p>
            <div className="ss-recs-grid">
              {recs.map(p => (
                <div className="ss-rec-card" key={p.slug}>
                  <img src={p.image || '/images/product-pickle.png'} alt={p.name} />
                  <div className="ss-rec-info">
                    <span className="ss-rec-name">{p.name}</span>
                    <span className="ss-rec-price">₹{p.price}</span>
                  </div>
                  <button 
                    className="ss-rec-add"
                    onClick={() => {
                      addToCart(p);
                      showToast(`✓ ${p.name} added to cart`, "View Cart", null, () => window.dispatchEvent(new Event('open-cart')));
                    }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

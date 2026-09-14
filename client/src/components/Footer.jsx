import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo" style={{ color: "#fff", marginBottom: 12 }}>
            Naik<span style={{ color: "#e4a15f" }}>Foods</span>
          </div>
          <p style={{ fontSize: 14, opacity: 0.8, maxWidth: 260 }}>
            Authentic flavors from Vidarbha & Konkan, delivered with love.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/store">Snacks & Namkeen</Link></li>
            <li><Link to="/store">Pickles & Condiments</Link></li>
            <li><Link to="/store">Sweets & Bakery</Link></li>
            <li><Link to="/combos">Gift Boxes</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/store">Shop</Link></li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4>Visit Our Store</h4>
          <ul>
            <li>Seva Mitra Mandal Chowk, Shukrawar Peth, Pune 411002</li>
            <li>+91 97300 46247</li>
            <li>9 AM – 10 PM Daily</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Naik Foods</span>
        <span>Built for the BNV Full Stack MERN Intern Task</span>
      </div>
    </footer>
  );
}

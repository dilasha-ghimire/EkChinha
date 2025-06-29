import React from "react";
import "./App.css";

function App() {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <img src="/logo.png" alt="EkChinha Logo" className="logo" />
        <span className="brand-name">EkChinha</span>
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <img src="/search-icon.png" alt="Search Icon" />
        </div>
        <button className="login-btn">Login</button>
      </header>

      {/* Hero Banner */}
      <section className="hero">
        <img src="/banner.jpg" alt="Hero Banner" />
      </section>

      {/* Best Selling Products */}
      <section className="section">
        <h2>Best Selling Products</h2>
        <div className="product-grid">
          {[
            "Bamboo Bottle",
            "Lokta Paper Notebook",
            "Bamboo Brush",
            "Pashmina Shawl",
          ].map((item, i) => (
            <div key={i} className="card">
              <div className="image-placeholder"></div>
              <p>{item}</p>
              <button className="view-btn">View More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized Gift Boxes */}
      <section className="section">
        <h2>Personalized Gift Boxes</h2>
        <div className="giftbox-grid">
          <div className="giftbox">
            <h3>Meeting Your Old Friend After Long</h3>
            <p>Total Items: 3</p>
            <div className="thumbs">
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
            </div>
            <button className="view-btn">View More</button>
          </div>
          <div className="giftbox">
            <h3>Rejuvenate Retreat</h3>
            <p>Total Items: 4</p>
            <div className="thumbs">
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
            </div>
            <button className="view-btn">View More</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <h2>Why Choose Us?</h2>
        <div className="why-box">
          <h3>GENUINE NEPALI CRAFTSMANSHIP, GUARANTEED</h3>
          <p>
            We exclusively offer products that are authentically Nepali —
            handcrafted, culturally rooted, and ethically sourced.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <img src="/logo.png" alt="Logo" className="footer-logo" />
          <span className="footer-brand">EkChinha</span>
          <div className="footer-text">
            <p>Email: ekchinha2025@gmail.com</p>
            <p>Address: Gyaneshwor, Kathmandu</p>
            <p>Phone: +977 01-5360000 | +977 9851000000</p>
          </div>
        </div>
        <p className="footer-copy">© 2025, EkChinha</p>
      </footer>
    </div>
  );
}

export default App;

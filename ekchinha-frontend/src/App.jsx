import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Update for production

function App() {
  const [products, setProducts] = useState([]);
  const [giftboxes, setGiftboxes] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Product fetch error:", err));

    axios
      .get(`${BASE_URL}/api/cart-gift-box/admin`)
      .then((res) => setGiftboxes(res.data))
      .catch((err) => console.error("Giftbox fetch error:", err));
  }, []);

  const scrollAmount = 300;

  const scrollLeft = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.scrollLeft === 0) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
        <div className="section-content product-section-content">
          <h2>Best Selling Products</h2>
          <div className="carousel-wrapper">
            <button
              className="scroll-btn left"
              onClick={() => scrollLeft("product-carousel")}
            >
              <img src="/left-arrow.png" alt="Left" />
            </button>

            <div className="carousel-container" id="product-carousel">
              {products.map((item) => (
                <div key={item._id} className="card">
                  <img
                    src={`${BASE_URL}/assets/${item.image}`}
                    alt={item.name}
                    className="image-placeholder"
                  />
                  <p>{item.name}</p>
                  <button className="view-btn">View More</button>
                </div>
              ))}
            </div>

            <button
              className="scroll-btn right"
              onClick={() => scrollRight("product-carousel")}
            >
              <img src="/right-arrow.png" alt="Right" />
            </button>
          </div>
        </div>
      </section>

      {/* Personalized Gift Boxes */}
      <section className="section">
        <div className="section-content giftbox-section-content">
          <h2>Personalized Gift Boxes</h2>
          <div className="carousel-wrapper">
            <button
              className="scroll-btn left"
              onClick={() => scrollLeft("giftbox-carousel")}
            >
              <img src="/left-arrow.png" alt="Left" />
            </button>

            <div className="carousel-container" id="giftbox-carousel">
              {giftboxes.map((box) => (
                <div key={box._id} className="giftbox">
                  <h3>{box.name}</h3>
                  <p>Total Items: {box.items.length}</p>
                  <div className="thumbs">
                    {box.items.map((item) => (
                      <img
                        key={item._id}
                        src={`${BASE_URL}/assets/${item.image}`}
                        alt={item.name}
                        className="thumb"
                      />
                    ))}
                  </div>
                  <button className="view-btn">View More</button>
                </div>
              ))}
            </div>

            <button
              className="scroll-btn right"
              onClick={() => scrollRight("giftbox-carousel")}
            >
              <img src="/right-arrow.png" alt="Right" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="section-content">
          <h2>Why Choose Us?</h2>
          <div className="why-box">
            <h3>GENUINE NEPALI CRAFTSMANSHIP, GUARANTEED</h3>
            <p>
              We exclusively offer products that are authentically Nepali —
              handcrafted, culturally rooted, and ethically sourced.
            </p>
          </div>
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

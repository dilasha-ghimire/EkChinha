import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import WhyChooseUs from "./WhyChooseUs";
import Login from "./Login";

const BASE_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [giftboxes, setGiftboxes] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGiftboxes = giftboxes.filter((box) =>
    box.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="homepage">
            <header className="header">
              <img src="/logo.webp" alt="EkChinha Logo" className="logo" />
              <span className="brand-name">EkChinha</span>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img
                  src="/search.png"
                  alt="Search Icon"
                  className="search-icon"
                />
              </div>
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
            </header>

            <section className="hero-container">
              <div className="hero-box">
                {[1, 2, 3, 4].map((num, index) => (
                  <img
                    key={num}
                    src={`/img-${num}.png`}
                    alt={`Slide ${num}`}
                    className={`hero-slide ${
                      index === currentSlide ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            </section>

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
                    {filteredProducts.map((item) => (
                      <div key={item._id} className="card">
                        <img
                          src={`${BASE_URL}/assets/${item.image}`}
                          alt={item.name}
                          className="image-placeholder"
                        />
                        <p>{item.name}</p>
                        <button className="view-btn product-view-btn">
                          View More
                        </button>
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
                    {filteredGiftboxes.map((box) => (
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
                        <button className="view-btn giftbox-view-btn">
                          View More
                        </button>
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

            <WhyChooseUs />

            <footer className="footer">
              <div className="footer-main">
                <div className="footer-row1">
                  <img src="/logo.webp" alt="Logo" className="footer-logo" />
                  <span className="footer-brand">EkChinha</span>
                </div>
                <div className="footer-row2">
                  <div className="footer-info-item">
                    <img src="/unread-message.png" alt="Email" />
                    <span>ekchinha2025@gmail.com</span>
                  </div>
                  <div className="footer-info-item">
                    <img src="/pin.png" alt="Location" />
                    <span>Gyaneshwor, Kathmandu</span>
                  </div>
                  <div className="footer-info-item">
                    <img src="/telephone.png" alt="Phone" />
                    <span>+977 01-5360000 | +977 9851000000</span>
                  </div>
                </div>
              </div>
              <div className="footer-copy-wrapper">
                <p className="footer-copy">Copyright © 2025, EkChinha</p>
              </div>
            </footer>
          </div>
        }
      />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

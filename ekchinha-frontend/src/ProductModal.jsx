import React, { useState, useEffect } from "react";
import "./ProductModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

function ProductModal({ product, onClose }) {
  const [giftBoxName, setGiftBoxName] = useState("");
  const [activeTab, setActiveTab] = useState("product");
  const [error, setError] = useState("");
  const [existingBoxes, setExistingBoxes] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  if (!product) return null;

  const stockLabel = product.stock <= 10 ? "Limited Stock" : "In Stock";

  useEffect(() => {
    const fetchBoxes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${BASE_URL}/cart-gift-box`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingBoxes(res.data);
      } catch (err) {
        console.error("Failed to fetch gift boxes:", err);
      }
    };

    fetchBoxes();
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelectBox = (id) => {
    setSelectedBoxId(id);
    setGiftBoxName("");
    setShowDropdown(false);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/login");
    }

    if (!giftBoxName.trim() && !selectedBoxId) {
      return setError("Enter a name or choose an existing gift box.");
    }

    try {
      if (selectedBoxId) {
        // Add to existing box
        await axios.patch(
          `${BASE_URL}/cart-gift-box/${selectedBoxId}/add`,
          { product_id: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new box
        await axios.post(
          `${BASE_URL}/cart-gift-box`,
          {
            name: giftBoxName,
            items: [product._id],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setError("");
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err);
      setError("Failed to add to cart. Try again.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          <img src="/purple-close.png" alt="Close" />
        </button>

        <div className="modal-content">
          {/* Left Column */}
          <div className="left-column">
            <div className="image-wrapper">
              <img
                src={`http://localhost:5000/assets/${product.image}`}
                alt={product.name}
                className="modal-img"
              />
            </div>

            <div className="product-header-row">
              <p className="stock">{stockLabel}</p>
              <img src="/heart.png" alt="Wishlist" className="wishlist-icon" />
            </div>

            <h2 className="product-title">
              <span className="product-label">Name of Product:</span>
              <br />
              {product.name}
            </h2>
          </div>

          {/* Right Column */}
          <div className="modal-info">
            <div className="modal-tabs">
              <span
                className={`tab ${activeTab === "product" ? "active" : ""}`}
                onClick={() => setActiveTab("product")}
              >
                Product Description
              </span>
              <span
                className={`tab ${activeTab === "artisan" ? "active" : ""}`}
                onClick={() => setActiveTab("artisan")}
              >
                Artisan Description
              </span>
            </div>

            <div className="details-section">
              {activeTab === "product" ? (
                <>
                  <div>
                    <h3>Details</h3>
                    <p>{product.details || "No description available."}</p>
                  </div>

                  <div>
                    <h3>Price</h3>
                    <p>Rs. {product.price}</p>
                  </div>

                  <div className="gift-box-section">
                    <h3>
                      Name Your Gift Box
                      <input
                        type="text"
                        value={giftBoxName}
                        onChange={(e) => {
                          setGiftBoxName(e.target.value);
                          setSelectedBoxId("");
                        }}
                      />
                    </h3>

                    <div className="product-dropdown-container">
                      <p
                        className="product-dropdown-label"
                        onClick={toggleDropdown}
                      >
                        Choose from existing Gift Boxes{" "}
                        <span className="arrow">▼</span>
                      </p>

                      {showDropdown && (
                        <div className="product-dropdown-list">
                          {existingBoxes.map((box) => (
                            <div
                              key={box._id}
                              className={`product-dropdown-item ${
                                selectedBoxId === box._id ? "selected" : ""
                              }`}
                              onClick={() => handleSelectBox(box._id)}
                            >
                              {box.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {error && <p className="error-text">{error}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3>Product Significance</h3>
                    <p>{product.product_significance}</p>
                  </div>
                  <div>
                    <h3>Artisan Background</h3>
                    <p>{product.artisan_background}</p>
                  </div>
                  <div>
                    <h3>Cultural Significance</h3>
                    <p>{product.cultural_significance}</p>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer-btns">
              {activeTab === "product" ? (
                <button className="modal-add-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              ) : (
                <button
                  className="modal-back-btn"
                  onClick={() => setActiveTab("product")}
                >
                  Back to Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

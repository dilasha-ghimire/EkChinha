import React, { useState } from "react";
import "./ProductModal.css";

const BASE_URL = "http://localhost:5000";

function ProductModal({ product, onClose }) {
  const [giftBoxName, setGiftBoxName] = useState("");
  const [activeTab, setActiveTab] = useState("product");

  if (!product) return null;

  const stockLabel = product.stock <= 10 ? "Limited Stock" : "In Stock";

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
                src={`${BASE_URL}/assets/${product.image}`}
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
                        onChange={(e) => setGiftBoxName(e.target.value)}
                      />
                    </h3>
                    <p className="dropdown-placeholder">
                      Choose from existing Gift Boxes{" "}
                      <span className="arrow">▼</span>
                    </p>
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

            {/* Bottom Buttons */}
            <div className="modal-footer-btns">
              {activeTab === "product" ? (
                <button className="modal-add-btn">Add to Cart</button>
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

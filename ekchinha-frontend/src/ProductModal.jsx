import React, { useState } from "react";
import "./ProductModal.css";

const BASE_URL = "http://localhost:5000";

function ProductModal({ product, onClose }) {
  const [giftBoxName, setGiftBoxName] = useState("");

  if (!product) return null;

  const stockLabel = product.stock <= 10 ? "Limited Stock" : "In Stock";

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          <img src="/purple-close.png" alt="Close" />
        </button>
        <div className="modal-content">
          <img
            src={`${BASE_URL}/assets/${product.image}`}
            alt={product.name}
            className="modal-img"
          />

          <div className="modal-info">
            <div className="modal-tabs">
              <span className="tab active">Product Description</span>
              <span className="tab">Artisan Description</span>
            </div>

            <p className="stock">{stockLabel}</p>

            <h2>
              <span className="product-label">Name of Product:</span> <br />
              {product.name}
            </h2>

            <div className="details-section">
              <h3>Details</h3>
              <p>{product.details || "No description available."}</p>

              <h3>Price</h3>
              <p>Rs. {product.price}</p>

              <h3>Name Your Gift Box</h3>
              <input
                type="text"
                placeholder="Enter a name"
                value={giftBoxName}
                onChange={(e) => setGiftBoxName(e.target.value)}
              />
              <p className="dropdown-placeholder">
                Choose from existing Gift Boxes ▼
              </p>
            </div>

            <button className="modal-add-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

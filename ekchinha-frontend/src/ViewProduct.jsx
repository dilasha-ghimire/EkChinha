import React, { useState } from "react";
import "./ViewProduct.css";

const BASE_URL = "http://localhost:5000";

function ViewProduct({ product, onClose, onArchive, onEdit }) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleArchiveClick = async () => {
    try {
      await onArchive(product._id);
      setMessage("Product archived successfully.");
      setIsError(false);
      setShowArchiveConfirm(false);
    } catch (err) {
      console.error("Failed to archive product:", err.message);
      setMessage("Failed to archive product.");
      setIsError(true);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  if (!product) return null;

  return (
    <div className="viewproduct-modal-overlay">
      <div className="viewproduct-modal">
        <button className="viewproduct-close-btn" onClick={onClose}>
          <img src="/close.png" alt="Close" />
        </button>

        <h2 className="viewproduct-title">Product Name: {product.name}</h2>

        <div className="viewproduct-content">
          <div className="viewproduct-left">
            <img
              src={`${BASE_URL}/assets/${product.image}`}
              alt={product.name}
              className="viewproduct-image"
            />
            <p>
              <strong>Price:</strong> Rs. {product.price}
            </p>
            <p>
              <strong>Stock: {product.stock}</strong>
            </p>
          </div>

          <div className="viewproduct-right">
            <div>
              <h3>Detail</h3>
              <p>{product.details}</p>
            </div>
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
          </div>
        </div>

        <div className="viewproduct-actions">
          <button
            className="viewproduct-archive-btn"
            onClick={() => setShowArchiveConfirm(true)}
          >
            Archive
          </button>
          <button
            className="viewproduct-edit-btn"
            onClick={onEdit} // ✅ Opens EditProduct
          >
            Edit
          </button>
        </div>
      </div>

      {/* Archive confirmation */}
      {showArchiveConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <button
              className="close-btn"
              onClick={() => setShowArchiveConfirm(false)}
            >
              <img src="/close.png" alt="Close" className="close-icon" />
            </button>
            <img src="/alert.png" alt="Warning" className="logout-icon" />
            <h2>Are you sure?</h2>
            <p>Do you want to archive this product?</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowArchiveConfirm(false)}
              >
                NO
              </button>
              <button className="yes-btn" onClick={handleArchiveClick}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup feedback */}
      {message && (
        <div
          className={`popup-message ${
            isError ? "popup-error" : "popup-success"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ViewProduct;

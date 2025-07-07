import React, { useState, useRef } from "react";
import axios from "axios";
import "./ViewProduct.css"; // Reuse same styles

const BASE_URL = "http://localhost:5000";

function EditProduct({ product, onCancel, onSave }) {
  const [formData, setFormData] = useState({ ...product });
  const [newImage, setNewImage] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      stock: Math.max(0, parseInt(prev.stock || 0) + delta),
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      for (const key in formData) {
        if (key !== "image") form.append(key, formData[key]);
      }
      if (newImage) form.append("image", newImage);

      await axios.put(`${BASE_URL}/api/products/${product._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Product updated successfully.");
      setIsError(false);

      setTimeout(() => {
        setMessage("");
        onSave(); // ✅ notify parent
      }, 1000);
    } catch (err) {
      console.error("Edit failed:", err.message);
      setMessage("Failed to update product.");
      setIsError(true);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClose = () => setShowCancelConfirm(true);
  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onCancel(); // ✅ reopen ViewProduct
  };

  return (
    <div className="viewproduct-modal-overlay">
      <div className="viewproduct-modal">
        <button className="viewproduct-close-btn" onClick={handleClose}>
          <img src="/close.png" alt="Close" />
        </button>

        <h2 className="viewproduct-title">Edit Product</h2>

        <div className="viewproduct-content">
          {/* LEFT COLUMN */}
          <div className="viewproduct-left">
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : `${BASE_URL}/assets/${product.image}`
              }
              alt="Product"
              className="viewproduct-image"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
            <p
              onClick={handleImageClick}
              style={{
                color: "#3d3d3d",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Change image
            </p>

            {/* Gap between image and stock */}
            <div style={{ height: "18px" }}></div>

            <div className="stock-wrapper">
              <div className="stock-row">
                <label>
                  <strong>Stock</strong>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>
              <div className="stock-controls">
                <button onClick={() => handleStockChange(1)}>+</button>
                <button onClick={() => handleStockChange(-1)}>-</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="viewproduct-right">
            <label>
              <strong>Name</strong>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <label>
              <strong>Detail</strong>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows={3}
            />

            <label>
              <strong>Price</strong>
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span>Rs.</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                style={{ width: "100px" }}
              />
            </div>

            {[
              "product_significance",
              "artisan_background",
              "cultural_significance",
            ].map((field) => (
              <div key={field}>
                <label>
                  <strong>
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </strong>
                </label>
                <textarea
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="viewproduct-actions">
          <button className="viewproduct-archive-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="viewproduct-edit-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* Confirm Cancel */}
      {showCancelConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <button
              className="close-btn"
              onClick={() => setShowCancelConfirm(false)}
            >
              <img src="/close.png" alt="Close" className="close-icon" />
            </button>
            <img src="/alert.png" alt="Warning" className="logout-icon" />
            <h2>Discard changes?</h2>
            <p>All unsaved edits will be lost.</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowCancelConfirm(false)}
              >
                NO
              </button>
              <button className="yes-btn" onClick={confirmCancel}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save popup */}
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

export default EditProduct;

import React, { useState } from "react";
import axios from "axios";
import "./ViewProduct.css";

const BASE_URL = "http://localhost:5000";

function ViewProduct({ product, onClose, onArchive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formData, setFormData] = useState({ ...product });
  const [newImage, setNewImage] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      onClose(); // Close modal after save
    } catch (error) {
      console.error("Failed to update product:", error.message);
      setMessage("Failed to update product.");
      setIsError(true);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const cancelEdit = () => {
    setFormData({ ...product });
    setNewImage(null);
    setIsEditing(false);
    setShowCancelConfirm(false);
  };

  if (!product) return null;

  return (
    <div className="viewproduct-modal-overlay">
      <div className="viewproduct-modal">
        <button className="viewproduct-close-btn" onClick={onClose}>
          <img src="/close.png" alt="Close" />
        </button>

        <h2 className="viewproduct-title">
          {isEditing ? "Edit Product" : `Product Name: ${product.name}`}
        </h2>

        <div className="viewproduct-content">
          <div className="viewproduct-left">
            {isEditing ? (
              <>
                <img
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : `${BASE_URL}/assets/${product.image}`
                  }
                  alt="preview"
                  className="viewproduct-image"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginTop: "10px" }}
                />
              </>
            ) : (
              <img
                src={`${BASE_URL}/assets/${product.image}`}
                alt={product.name}
                className="viewproduct-image"
              />
            )}

            <p>
              <strong>Price:</strong>{" "}
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              ) : (
                `Rs. ${product.price}`
              )}
            </p>
            <p>
              <strong>Stock:</strong>{" "}
              {isEditing ? (
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              ) : (
                product.stock
              )}
            </p>
          </div>

          <div className="viewproduct-right">
            {[
              "details",
              "product_significance",
              "artisan_background",
              "cultural_significance",
            ].map((field) => (
              <div key={field}>
                <h3>
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </h3>
                {isEditing ? (
                  <textarea
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <p>{product[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="viewproduct-actions">
          {isEditing ? (
            <>
              <button
                className="viewproduct-archive-btn"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel
              </button>
              <button className="viewproduct-edit-btn" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <button
                className="viewproduct-archive-btn"
                onClick={() => setShowArchiveConfirm(true)}
              >
                Archive
              </button>
              <button
                className="viewproduct-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
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

      {/* Cancel edit confirmation */}
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
            <p>All unsaved changes will be lost.</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowCancelConfirm(false)}
              >
                NO
              </button>
              <button className="yes-btn" onClick={cancelEdit}>
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

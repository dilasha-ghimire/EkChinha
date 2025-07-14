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
  const [popupMessage, setPopupMessage] = useState({ type: "", text: "" });
  const [isSaved, setIsSaved] = useState(false);

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

  useEffect(() => {
    const checkIfSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token || !product?._id) return;

      try {
        const res = await axios.get(`${BASE_URL}/saved-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const alreadySaved = res.data.some(
          (item) =>
            item.item_type === "product" && item.item_id._id === product._id
        );

        setIsSaved(alreadySaved);
      } catch (err) {
        console.error("Error checking saved items:", err);
      }
    };

    checkIfSaved();
  }, [product]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelectBox = (id) => {
    setSelectedBoxId(id);
    setGiftBoxName("");
    setShowDropdown(false);
  };

  const showPopup = (type, text) => {
    setPopupMessage({ type, text });

    setTimeout(() => {
      setPopupMessage({ type: "", text: "" });
    }, 1500);
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

      showPopup("success", "Product added to gift box successfully!");
      setError("");

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || "Failed to add to gift box. Try again.";

      console.error("Error adding to cart:", backendMessage);
      showPopup("error", backendMessage);
      setError(backendMessage);
    }
  };

  const handleToggleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.post(
        `${BASE_URL}/saved-items`,
        {
          item_type: "product",
          item_id: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isUnsave = res.data.message === "Item unsaved";
      setIsSaved(!isUnsave);
      showPopup("success", res.data.message);
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong.";
      showPopup("error", msg);
      console.error("Toggle save error:", msg);
    }
  };

  return (
    <div className="modal-backdrop">
      {popupMessage.text && (
        <div
          className={`popup-message ${
            popupMessage.type === "success" ? "popup-success" : "popup-error"
          }`}
        >
          {popupMessage.text}
        </div>
      )}

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
              <img
                src={isSaved ? "/fill-heart.png" : "/heart.png"}
                alt="Wishlist"
                className="wishlist-icon"
                onClick={handleToggleSave}
                style={{ cursor: "pointer" }}
              />
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
                        Choose from existing Gift Boxes
                        {selectedBoxId && (
                          <span className="product-selected-box-label">
                            (
                            {existingBoxes.find(
                              (box) => box._id === selectedBoxId
                            )?.name || ""}
                            )
                            <button
                              className="product-cancel-selection"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBoxId("");
                              }}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        <img
                          src="/down-arrow.png"
                          alt="Arrow"
                          className="product-arrow-icon"
                        />
                      </p>

                      {showDropdown && (
                        <div className="product-dropdown-list">
                          {existingBoxes.length === 0 ? (
                            <div className="product-dropdown-item no-boxes">
                              No available gift boxes
                            </div>
                          ) : (
                            existingBoxes.map((box) => (
                              <div
                                key={box._id}
                                className={`product-dropdown-item ${
                                  selectedBoxId === box._id ? "selected" : ""
                                }`}
                                onClick={() => handleSelectBox(box._id)}
                              >
                                {box.name}
                              </div>
                            ))
                          )}
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

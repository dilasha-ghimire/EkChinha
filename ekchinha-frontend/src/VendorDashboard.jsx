import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./VendorDashboard.css";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

function VendorDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "vendor") {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/products/vendor/${user.referenceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.filter((p) => p.archived !== "true"));
      } catch (error) {
        console.error("Failed to fetch vendor products:", error.message);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleArchive = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/products/${selectedProductId}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prev) =>
        prev.filter((product) => product._id !== selectedProductId)
      );
      setShowArchiveConfirm(false);
      setSelectedProductId(null);
      setMessage("Product archived successfully.");
      setIsError(false);
    } catch (error) {
      console.error("Failed to archive product:", error.message);
      setMessage("Failed to archive product.");
      setIsError(true);
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="vendor-dashboard-container">
        <Sidebar />
        <div className="vendor-dashboard-content">
          <div className="vendor-header-bar">
            <div className="vendor-header-left">
              <h2 className="vendor-product-title">Products</h2>
              <div className="vendor-search-box">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="vendor-search-input"
                />
                <img
                  src="/black-search.png"
                  alt="search"
                  className="search-icon"
                />
              </div>
            </div>

            <div className="vendor-header-right">
              <button className="add-btn">+ Add new Product</button>
              <button className="view-archived-btn">
                View Archived
                <img src="/arrow.png" alt="arrow" className="arrow-icon" />
              </button>
            </div>
          </div>

          <div className="vendor-product-list">
            {filteredProducts.length === 0 ? (
              <p className="no-products-message">No products to show.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="vendor-product-item">
                  <img
                    src={`${BASE_URL}/assets/${product.image}`}
                    alt={product.name}
                    className="vendor-product-image"
                  />
                  <div className="vendor-product-details">
                    <p className="vendor-product-name">
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p className="vendor-product-stock">
                      <strong>Stock:</strong> {product.stock}
                    </p>
                  </div>
                  <div className="vendor-product-actions">
                    <button
                      className="archive-btn"
                      onClick={() => {
                        setSelectedProductId(product._id);
                        setShowArchiveConfirm(true);
                      }}
                    >
                      Archive ➔
                    </button>
                    <button className="viewproduct-btn">View ➔</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
              <button className="yes-btn" onClick={handleArchive}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`popup-message ${
            isError ? "popup-error" : "popup-success"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}

export default VendorDashboard;

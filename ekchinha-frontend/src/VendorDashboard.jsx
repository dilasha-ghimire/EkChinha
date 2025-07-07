import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./VendorDashboard.css";
import ViewProduct from "./ViewProduct";
import EditProduct from "./EditProduct";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

function VendorDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedUnarchiveId, setSelectedUnarchiveId] = useState(null);
  const [showUnarchiveConfirm, setShowUnarchiveConfirm] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "vendor") {
      navigate("/login");
      return;
    }

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

    setTimeout(() => setMessage(""), 3000);
  };

  const handleArchiveFromView = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/api/products/${productId}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchProducts();
      setSelectedViewProduct(null);
      setMessage("Product archived successfully.");
      setIsError(false);
    } catch (error) {
      console.error("Archive from view failed:", error.message);
      setMessage("Failed to archive product.");
      setIsError(true);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const fetchArchivedProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${BASE_URL}/api/products/vendor/${user.referenceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const archived = response.data.filter((p) => p.archived === "true");
      setArchivedProducts(archived);
      setShowArchivedModal(true);
    } catch (err) {
      setMessage("Failed to fetch archived products.");
      setIsError(true);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleUnarchive = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/products/${selectedUnarchiveId}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchProducts();

      setArchivedProducts((prev) =>
        prev.filter((product) => product._id !== selectedUnarchiveId)
      );

      setShowUnarchiveConfirm(false);
      setSelectedUnarchiveId(null);
      setMessage("Product unarchived successfully.");
      setIsError(false);
    } catch (error) {
      setMessage("Failed to unarchive product.");
      setIsError(true);
    }

    setTimeout(() => setMessage(""), 3000);
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
              <button
                className="add-btn"
                onClick={() => setShowCreateModal(true)}
              >
                + Add new Product
              </button>
              <button
                className="view-archived-btn"
                onClick={fetchArchivedProducts}
              >
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
                    <button
                      className="viewproduct-btn"
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        try {
                          const res = await axios.get(
                            `${BASE_URL}/api/products/${product._id}`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          setSelectedViewProduct(res.data);
                        } catch (err) {
                          console.error(
                            "Failed to fetch product:",
                            err.message
                          );
                          setMessage("Failed to load product.");
                          setIsError(true);
                          setTimeout(() => setMessage(""), 3000);
                        }
                      }}
                    >
                      View ➔
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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
              <button className="yes-btn" onClick={handleArchive}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archived products modal */}
      {showArchivedModal && (
        <div className="vendor-profile-modal-overlay">
          <div className="vendor-profile-modal wide">
            <img
              src="/close.png"
              alt="Close"
              className="vendor-profile-modal-close"
              onClick={() => setShowArchivedModal(false)}
            />
            <h2>Archived Products</h2>

            {archivedProducts.length === 0 ? (
              <p>No archived products found.</p>
            ) : (
              archivedProducts.map((product) => (
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
                  <button
                    className="archive-btn"
                    style={{
                      backgroundColor: "#b0bdad",
                      marginLeft: "auto",
                      marginRight: "10px",
                      marginTop: "40px",
                    }}
                    onClick={() => {
                      setSelectedUnarchiveId(product._id);
                      setShowUnarchiveConfirm(true);
                    }}
                  >
                    Unarchive
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Unarchive confirmation */}
      {showUnarchiveConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <button
              className="close-btn"
              onClick={() => setShowUnarchiveConfirm(false)}
            >
              <img src="/close.png" alt="Close" className="close-icon" />
            </button>
            <img src="/alert.png" alt="Warning" className="logout-icon" />
            <h2>Are you sure?</h2>
            <p>Do you want to unarchive this product?</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowUnarchiveConfirm(false)}
              >
                NO
              </button>
              <button className="yes-btn" onClick={handleUnarchive}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View product modal */}
      {selectedViewProduct && !showEditProduct && (
        <ViewProduct
          product={selectedViewProduct}
          onClose={() => setSelectedViewProduct(null)}
          onArchive={handleArchiveFromView}
          onEdit={() => setShowEditProduct(true)} // ✅ open EditProduct
        />
      )}

      {selectedViewProduct && showEditProduct && (
        <EditProduct
          product={selectedViewProduct}
          onCancel={() => setShowEditProduct(false)} // ✅ return to view
          onSave={async () => {
            setShowEditProduct(false); // close edit
            setSelectedViewProduct(null); // close all modals
            await fetchProducts(); // refresh list
            setMessage("Product updated successfully.");
            setIsError(false);
            setTimeout(() => setMessage(""), 3000);
          }}
        />
      )}

      {showCreateModal && (
        <EditProduct
          product={{
            name: "",
            image: "",
            details: "",
            price: 0,
            stock: 0,
            product_significance: "",
            artisan_background: "",
            cultural_significance: "",
          }}
          onCancel={() => setShowCreateModal(false)}
          onSave={async () => {
            setShowCreateModal(false);
            await fetchProducts();
            setMessage("Product added successfully.");
            setIsError(false);
            setTimeout(() => setMessage(""), 3000);
          }}
          isNew={true}
        />
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
    </>
  );
}

export default VendorDashboard;

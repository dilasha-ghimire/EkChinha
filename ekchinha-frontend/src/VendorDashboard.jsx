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
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch vendor products:", error.message);
      }
    };

    fetchProducts();
  }, [navigate]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
                  <button className="archive-btn">Archive ➔</button>
                  <button className="viewproduct-btn">View ➔</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;

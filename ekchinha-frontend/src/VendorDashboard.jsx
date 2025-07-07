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
        <h2 className="vendor-profile-title">Products</h2>

        <div className="vendor-header-bar">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="vendor-search-input"
          />
          <div>
            <button className="add-btn">+ Add new Product</button>
            <button className="view-archived-btn">View Archived ➔</button>
          </div>
        </div>

        <div className="vendor-product-list">
          {filteredProducts.map((product) => (
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
                <button className="view-btn">View ➔</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
